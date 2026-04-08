import { ChatBubbleIcon, DotsHorizontalIcon, Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { useEditor } from '@app/editor';
import {
  duplicateTemplateLayer,
  getTemplateLayerState,
  moveTemplateLayer,
  moveTemplateLayerToEdge,
  removeTemplateLayer,
} from '@app/editor/templateLayerActions';
import { EditorMode } from '@app/editor/Editor';
import { cn } from '@app/utils';

import { CachedAnimationFrameCallback } from './CachedAnimationFrame';
import { InsertComponentBrowser } from './InsertComponentBrowser';

import { IconButton } from '../button';
import { Tooltip } from '../tooltip';

type SelectionBorderProps = {
  dom: HTMLElement;
  template: t.Template;
  targetTemplate: t.Template;
  type: 'hovered' | 'selected';
};

type RectBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

type MeasurementGuide = {
  id: string;
  kind: 'distance' | 'alignment';
  orientation: 'horizontal' | 'vertical';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
};

type MeasurementGuideContext = {
  rects: RectBounds[];
  viewport: { width: number; height: number };
};

type ContextMenuState = {
  x: number;
  y: number;
} | null;

const MIN_RESIZE_SIZE = 24;
const MIN_FONT_SIZE = 8;
const MOVE_START_THRESHOLD = 0;
const HORIZONTAL_CENTER_SNAP_THRESHOLD = 24;
const FULL_WIDTH_EDGE_SNAP_THRESHOLD = 12;
const TEXT_LIKE_TAGS = new Set([
  'p',
  'span',
  'a',
  'button',
  'label',
  'strong',
  'em',
  'small',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);

const INSERTABLE_SECTION_TAGS = new Set([
  'div',
  'section',
  'header',
  'footer',
  'main',
  'article',
  'aside',
  'nav',
]);

const safeGetParentTemplate = (
  editor: ReturnType<typeof useEditor>,
  template: t.Template
) => {
  try {
    return editor.reka.getParentNode(template, t.Template);
  } catch {
    return null;
  }
};

const readLiteralString = (value: unknown) => {
  if (value instanceof t.Literal) {
    return String(value.value ?? '');
  }

  if (value && typeof value === 'object') {
    const candidate = value as { type?: string; value?: unknown };

    if (candidate.type === 'Literal') {
      return String(candidate.value ?? '');
    }
  }

  return '';
};

const ensureStyleExpression = (template: t.Template) => {
  if (!(template instanceof t.TagTemplate)) {
    return null;
  }

  const currentStyle = template.props.style;

  if (currentStyle instanceof t.ObjectExpression) {
    return currentStyle;
  }

  const nextStyle = t.objectExpression({
    properties: {},
  });

  template.props.style = nextStyle;

  return nextStyle;
};

const readStylePx = (template: t.Template, key: string) => {
  if (!(template instanceof t.TagTemplate)) {
    return null;
  }

  const style = template.props.style;

  if (!(style instanceof t.ObjectExpression)) {
    return null;
  }

  const rawValue = style.properties[key];
  const value = readLiteralString(rawValue);
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const readResolvedStylePx = (
  template: t.Template,
  key: string,
  relativeSize?: number
) => {
  if (!(template instanceof t.TagTemplate)) {
    return null;
  }

  const style = template.props.style;

  if (!(style instanceof t.ObjectExpression)) {
    return null;
  }

  const rawValue = readLiteralString(style.properties[key]).trim();

  if (!rawValue) {
    return null;
  }

  const centeredCalcMatch = rawValue.match(
    /^calc\(\s*50%\s*-\s*(-?\d+(?:\.\d+)?)px\s*\)$/i
  );

  if (centeredCalcMatch) {
    const halfWidth = Number.parseFloat(centeredCalcMatch[1] ?? '');

    if (
      Number.isFinite(halfWidth) &&
      relativeSize &&
      Number.isFinite(relativeSize) &&
      relativeSize > 0
    ) {
      return relativeSize / 2 - halfWidth;
    }

    return null;
  }

  if (rawValue.endsWith('%')) {
    const parsed = Number.parseFloat(rawValue);

    if (
      !Number.isFinite(parsed) ||
      !relativeSize ||
      !Number.isFinite(relativeSize) ||
      relativeSize <= 0
    ) {
      return null;
    }

    return (parsed / 100) * relativeSize;
  }

  const parsed = Number.parseFloat(rawValue);

  return Number.isFinite(parsed) ? parsed : null;
};

const getFreeBlockHorizontalLiterals = (
  left: number,
  width: number | null | undefined,
  parentWidth: number | null | undefined
) => {
  const normalizedWidth =
    typeof width === 'number' && Number.isFinite(width)
      ? Math.max(MIN_RESIZE_SIZE, Math.round(width))
      : `${MIN_RESIZE_SIZE}`;

  if (
    typeof width === 'number' &&
    Number.isFinite(width) &&
    parentWidth &&
    Number.isFinite(parentWidth) &&
    parentWidth > 0
  ) {
    const rightGap = parentWidth - (left + width);

    if (
      Math.abs(left) <= FULL_WIDTH_EDGE_SNAP_THRESHOLD &&
      Math.abs(rightGap) <= FULL_WIDTH_EDGE_SNAP_THRESHOLD
    ) {
      return {
        left: '0px',
        width: '100%',
      };
    }

    const centerDelta = Math.abs(left + width / 2 - parentWidth / 2);

    if (centerDelta <= HORIZONTAL_CENTER_SNAP_THRESHOLD) {
      return {
        left: `calc(50% - ${Math.round(width / 2)}px)`,
        width: `${normalizedWidth}px`,
      };
    }
  }

  return {
    left: `${Math.round(left)}px`,
    width: `${normalizedWidth}px`,
  };
};

const readClassName = (template: t.Template) => {
  if (!(template instanceof t.TagTemplate)) {
    return '';
  }

  return readLiteralString(template.props.className);
};

const setStyleLiteral = (template: t.Template, key: string, value: string) => {
  const style = ensureStyleExpression(template);

  if (!style) {
    return;
  }

  style.properties[key] = t.literal({ value });
};

const removeStyleLiteral = (template: t.Template, key: string) => {
  const style = ensureStyleExpression(template);

  if (!style) {
    return;
  }

  delete style.properties[key];
};

const readTransformString = (template: t.Template) => {
  if (!(template instanceof t.TagTemplate)) {
    return '';
  }

  return readLiteralString(
    template.props.style instanceof t.ObjectExpression
      ? template.props.style.properties.transform
      : null
  );
};

const stripTransformPart = (transform: string, pattern: RegExp) =>
  transform.replace(pattern, '').replace(/\s+/g, ' ').trim();

const readTranslateValues = (template: t.Template) => {
  const transform = readTransformString(template);
  const directMatch = transform.match(/translate\(\s*([^,]+),\s*([^)]+)\)/);

  if (directMatch) {
    const x = Number.parseFloat(directMatch[1] ?? '0');
    const y = Number.parseFloat(directMatch[2] ?? '0');

    return {
      x: Number.isFinite(x) ? x : 0,
      y: Number.isFinite(y) ? y : 0,
    };
  }

  const translateXMatch = transform.match(/translateX\(([^)]+)\)/);
  const translateYMatch = transform.match(/translateY\(([^)]+)\)/);
  const x = Number.parseFloat(translateXMatch?.[1] ?? '0');
  const y = Number.parseFloat(translateYMatch?.[1] ?? '0');

  return {
    x: Number.isFinite(x) ? x : 0,
    y: Number.isFinite(y) ? y : 0,
  };
};

const mergeTranslateTransform = (
  template: t.Template,
  translateX: number,
  translateY: number
) => {
  if (!(template instanceof t.TagTemplate)) {
    return;
  }

  const current = readTransformString(template);
  const withoutTranslate = stripTransformPart(
    current,
    /translate(?:X|Y)?\([^)]+\)|translate\(\s*[^,]+,\s*[^)]+\)/g
  );
  const next = [withoutTranslate, `translate(${translateX}px, ${translateY}px)`]
    .filter(Boolean)
    .join(' ')
    .trim();

  if (!next) {
    removeStyleLiteral(template, 'transform');
    return;
  }

  setStyleLiteral(template, 'transform', next);
};

const mergeScaleTransform = (
  template: t.Template,
  scaleX: number,
  scaleY: number,
  origin = 'top left'
) => {
  if (!(template instanceof t.TagTemplate)) {
    return;
  }

  const current = readTransformString(template);
  const withoutScale = current.replace(/scale\([^)]+\)/g, '').replace(/\s+/g, ' ').trim();
  const next = [withoutScale, `scale(${scaleX}, ${scaleY})`]
    .filter(Boolean)
    .join(' ')
    .trim();

  setStyleLiteral(template, 'transformOrigin', origin);
  setStyleLiteral(template, 'transform', next);
};

const removeScaleTransform = (template: t.Template) => {
  if (!(template instanceof t.TagTemplate)) {
    return;
  }

  const current = readTransformString(template);
  const next = current.replace(/scale\([^)]+\)/g, '').replace(/\s+/g, ' ').trim();

  if (!next) {
    removeStyleLiteral(template, 'transform');
    return;
  }

  setStyleLiteral(template, 'transform', next);
};

const isTextLikeTemplate = (template: t.Template) => {
  return template instanceof t.TagTemplate && TEXT_LIKE_TAGS.has(template.tag);
};

const readComputedPx = (dom: HTMLElement, key: 'fontSize' | 'lineHeight') => {
  const value = window.getComputedStyle(dom)[key];
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const getPositionContext = (
  editor: ReturnType<typeof useEditor>,
  template: t.Template,
  dom: HTMLElement
) => {
  const activeFrame = editor.activeComponentEditor?.activeFrame;
  let current = safeGetParentTemplate(editor, template);

  while (current) {
    if (current instanceof t.TagTemplate) {
      const doms = activeFrame?.tplElements.get(current) ?? [];

      for (const candidate of doms) {
        if (candidate !== dom && candidate.contains(dom)) {
          return { template: current, dom: candidate };
        }
      }

      const fallbackDom = [...doms][0];

      if (fallbackDom) {
        return { template: current, dom: fallbackDom };
      }
    }

    current = safeGetParentTemplate(editor, current);
  }

  return null;
};

const getAnchoredTemplateRect = (
  editor: ReturnType<typeof useEditor>,
  template: t.Template,
  dom: HTMLElement,
  iframe: HTMLIFrameElement | null
) => {
  const domRect = dom.getBoundingClientRect();
  const positionContext = getPositionContext(editor, template, dom);

  if (positionContext) {
    const parentRect = positionContext.dom.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(positionContext.dom);
    const borderLeft = Number.parseFloat(computedStyle.borderLeftWidth);
    const borderTop = Number.parseFloat(computedStyle.borderTopWidth);

    return {
      left:
        domRect.left -
        parentRect.left -
        (Number.isFinite(borderLeft) ? borderLeft : 0) +
        positionContext.dom.scrollLeft,
      top:
        domRect.top -
        parentRect.top -
        (Number.isFinite(borderTop) ? borderTop : 0) +
        positionContext.dom.scrollTop,
      width: domRect.width,
      height: domRect.height,
    };
  }

  if (iframe) {
    const iframeRect = iframe.getBoundingClientRect();
    const scrollX = iframe.contentWindow?.scrollX ?? 0;
    const scrollY = iframe.contentWindow?.scrollY ?? 0;

    return {
      left: domRect.left - iframeRect.left + scrollX,
      top: domRect.top - iframeRect.top + scrollY,
      width: domRect.width,
      height: domRect.height,
    };
  }

  return {
    left: dom.offsetLeft,
    top: dom.offsetTop,
    width: domRect.width,
    height: domRect.height,
  };
};

const getFrameScale = (iframe: HTMLIFrameElement | null) => {
  if (!iframe) {
    return { x: 1, y: 1 };
  }

  const rect = iframe.getBoundingClientRect();

  return {
    x:
      iframe.clientWidth > 0 && Number.isFinite(rect.width / iframe.clientWidth)
        ? rect.width / iframe.clientWidth
        : 1,
    y:
      iframe.clientHeight > 0 && Number.isFinite(rect.height / iframe.clientHeight)
        ? rect.height / iframe.clientHeight
        : 1,
  };
};

type TemplateRectUpdate = {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  minHeight?: number;
  fontSize?: number;
  lineHeight?: number;
  scaleX?: number;
  scaleY?: number;
  scaleOrigin?: string;
  skipHeight?: boolean;
};

const isMovableTemplate = (template: t.Template) => {
  if (!(template instanceof t.TagTemplate)) {
    return false;
  }

  const className = readClassName(template);

  if (className.split(/\s+/).includes('studio-free-block')) {
    return true;
  }

  const style = template.props.style;

  if (!(style instanceof t.ObjectExpression)) {
    return false;
  }

  return readLiteralString(style.properties.position) === 'absolute';
};

const isInsertableSectionTemplate = (
  template: t.Template | null
): template is t.TagTemplate & t.SlottableTemplate => {
  return (
    template instanceof t.TagTemplate &&
    template instanceof t.SlottableTemplate &&
    INSERTABLE_SECTION_TAGS.has(template.tag)
  );
};

const isFreeBlockTemplate = (template: t.Template) => {
  if (!(template instanceof t.TagTemplate)) {
    return false;
  }

  return readClassName(template).split(/\s+/).includes('studio-free-block');
};

const getFreeBlockPrimaryTag = (template: t.Template): t.TagTemplate | null => {
  if (!(template instanceof t.TagTemplate) || !isFreeBlockTemplate(template)) {
    return null;
  }

  const queue = [...template.children];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    if (current instanceof t.TagTemplate && current.tag !== 'text') {
      return current;
    }

    if (current instanceof t.TagTemplate) {
      queue.push(...current.children);
    }
  }

  return null;
};

const getTemplatePrimaryDom = (
  activeFrame:
    | NonNullable<
        NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>['activeFrame']
      >
    | null
    | undefined,
  template: t.Template | null
) => {
  if (!activeFrame || !template) {
    return null;
  }

  return [...(activeFrame.tplElements.get(template) ?? [])][0] ?? null;
};

const getInteractiveTemplate = (
  editor: ReturnType<typeof useEditor>,
  template: t.Template
) => {
  let current: t.Template | null = template;
  let nearestTagTemplate: t.TagTemplate | null = null;

  while (current) {
    if (
      !nearestTagTemplate &&
      current instanceof t.TagTemplate &&
      current.tag !== 'text'
    ) {
      nearestTagTemplate = current;
    }

    if (isMovableTemplate(current)) {
      return current;
    }

    current = safeGetParentTemplate(editor, current);
  }

  return nearestTagTemplate ?? template;
};

const getInsertTargetTemplate = (
  editor: ReturnType<typeof useEditor>,
  template: t.Template
) => {
  const insertableAncestors: Array<t.TagTemplate & t.SlottableTemplate> = [];
  let current: t.Template | null = template;

  while (current) {
    if (isInsertableSectionTemplate(current)) {
      insertableAncestors.push(current);
    }

    current = safeGetParentTemplate(editor, current);
  }

  if (!insertableAncestors.length) {
    return null;
  }

  const semanticAncestor = insertableAncestors.find((entry) => entry.tag !== 'div');

  if (semanticAncestor) {
    return semanticAncestor;
  }

  const outermostAncestor = insertableAncestors[insertableAncestors.length - 1] ?? null;
  const outermostParent = outermostAncestor
    ? safeGetParentTemplate(editor, outermostAncestor)
    : null;

  if (!outermostAncestor) {
    return null;
  }

  if (insertableAncestors.length > 1 && !outermostParent) {
    return insertableAncestors[insertableAncestors.length - 2] ?? outermostAncestor;
  }

  return outermostAncestor;
};

const findRegisteredTemplateForNode = (
  activeFrame:
    | NonNullable<
        NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>['activeFrame']
      >
    | null
    | undefined,
  node: Node | null
) => {
  if (!activeFrame || !node) {
    return null;
  }

  let bestMatch: { template: t.Template; dom: HTMLElement } | null = null;

  for (const [template, doms] of activeFrame.tplElements) {
    for (const dom of doms) {
      if (dom !== node && !dom.contains(node)) {
        continue;
      }

      if (!bestMatch || bestMatch.dom.contains(dom)) {
        bestMatch = { template, dom };
      }
    }
  }

  return bestMatch?.template ?? null;
};

const findEditableTextTemplate = (template: t.Template | null): t.TagTemplate | null => {
  if (!template) {
    return null;
  }

  if (template instanceof t.TagTemplate) {
    if (template.tag === 'text') {
      return template;
    }

    for (const child of template.children) {
      const match = findEditableTextTemplate(child);

      if (match) {
        return match;
      }
    }
  }

  return null;
};

const HANDLE_POSITIONS = [
  { key: 'nw', className: 'cursor-nwse-resize' },
  { key: 'n', className: 'cursor-ns-resize' },
  { key: 'ne', className: 'cursor-nesw-resize' },
  { key: 'e', className: 'cursor-ew-resize' },
  { key: 'sw', className: 'cursor-nesw-resize' },
  { key: 's', className: 'cursor-ns-resize' },
  { key: 'se', className: 'cursor-nwse-resize' },
  { key: 'w', className: 'cursor-ew-resize' },
] as const;

const createInteractionPane = (
  doc: Document,
  onMove: (event: PointerEvent) => void,
  onUp: (event: PointerEvent) => void,
  cursor: string
) => {
  const pane = doc.createElement('div');
  pane.style.position = 'fixed';
  pane.style.inset = '0';
  pane.style.zIndex = '999999';
  pane.style.background = 'transparent';
  pane.style.cursor = cursor;
  pane.style.touchAction = 'none';
  doc.body.appendChild(pane);

  pane.addEventListener('pointermove', onMove);
  pane.addEventListener('pointerup', onUp);
  pane.addEventListener('pointercancel', onUp);

  const iframeWindow = doc.defaultView;
  const topWindow = window;
  const releaseListener = onUp as unknown as EventListener;

  iframeWindow?.addEventListener('pointerup', releaseListener, true);
  iframeWindow?.addEventListener('pointercancel', releaseListener, true);
  iframeWindow?.addEventListener('mouseup', releaseListener, true);
  iframeWindow?.addEventListener('blur', releaseListener, true);

  if (topWindow !== iframeWindow) {
    topWindow.addEventListener('pointerup', releaseListener, true);
    topWindow.addEventListener('pointercancel', releaseListener, true);
    topWindow.addEventListener('mouseup', releaseListener, true);
    topWindow.addEventListener('blur', releaseListener, true);
  }

  return () => {
    pane.removeEventListener('pointermove', onMove);
    pane.removeEventListener('pointerup', onUp);
    pane.removeEventListener('pointercancel', onUp);
    iframeWindow?.removeEventListener('pointerup', releaseListener, true);
    iframeWindow?.removeEventListener('pointercancel', releaseListener, true);
    iframeWindow?.removeEventListener('mouseup', releaseListener, true);
    iframeWindow?.removeEventListener('blur', releaseListener, true);

    if (topWindow !== iframeWindow) {
      topWindow.removeEventListener('pointerup', releaseListener, true);
      topWindow.removeEventListener('pointercancel', releaseListener, true);
      topWindow.removeEventListener('mouseup', releaseListener, true);
      topWindow.removeEventListener('blur', releaseListener, true);
    }

    pane.remove();
  };
};

const overlapX = (a: RectBounds, b: RectBounds) =>
  Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0;

const overlapY = (a: RectBounds, b: RectBounds) =>
  Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0;

const getRectBounds = (dom: HTMLElement): RectBounds => {
  const rect = dom.getBoundingClientRect();

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.right,
    bottom: rect.bottom,
  };
};

const areRectBoundsEqual = (
  current: RectBounds | null,
  next: RectBounds | null
) => {
  if (!current || !next) {
    return current === next;
  }

  return (
    Math.round(current.left) === Math.round(next.left) &&
    Math.round(current.top) === Math.round(next.top) &&
    Math.round(current.width) === Math.round(next.width) &&
    Math.round(current.height) === Math.round(next.height) &&
    Math.round(current.right) === Math.round(next.right) &&
    Math.round(current.bottom) === Math.round(next.bottom)
  );
};

const areMeasurementGuidesEqual = (
  current: MeasurementGuide[],
  next: MeasurementGuide[]
) => {
  if (current.length !== next.length) {
    return false;
  }

  return current.every((guide, index) => {
    const candidate = next[index];

    return (
      candidate &&
      guide.id === candidate.id &&
      guide.kind === candidate.kind &&
      guide.orientation === candidate.orientation &&
      Math.round(guide.x1) === Math.round(candidate.x1) &&
      Math.round(guide.y1) === Math.round(candidate.y1) &&
      Math.round(guide.x2) === Math.round(candidate.x2) &&
      Math.round(guide.y2) === Math.round(candidate.y2) &&
      guide.label === candidate.label
    );
  });
};

const createMeasurementGuideContext = (
  activeFrame:
    | NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>['activeFrame']
    | null
    | undefined,
  targetDom: HTMLElement,
  viewport: { width: number; height: number }
): MeasurementGuideContext => {
  const rects: RectBounds[] = [];

  for (const doms of activeFrame?.tplElements.values() ?? []) {
    for (const dom of doms) {
      if (dom === targetDom || targetDom.contains(dom) || dom.contains(targetDom)) {
        continue;
      }

      rects.push(getRectBounds(dom));
    }
  }

  return { rects, viewport };
};

const computeMeasurementGuides = (
  selectedRect: RectBounds,
  context: MeasurementGuideContext | null
) => {
  if (!context) {
    return [];
  }

  const guides: MeasurementGuide[] = [];
  const { rects, viewport } = context;
  const alignmentThreshold = 6;

  const topNeighbor = rects
    .filter((rect) => overlapX(rect, selectedRect) && rect.bottom <= selectedRect.top)
    .sort((a, b) => b.bottom - a.bottom)[0];

  const bottomNeighbor = rects
    .filter((rect) => overlapX(rect, selectedRect) && rect.top >= selectedRect.bottom)
    .sort((a, b) => a.top - b.top)[0];

  const leftNeighbor = rects
    .filter((rect) => overlapY(rect, selectedRect) && rect.right <= selectedRect.left)
    .sort((a, b) => b.right - a.right)[0];

  const rightNeighbor = rects
    .filter((rect) => overlapY(rect, selectedRect) && rect.left >= selectedRect.right)
    .sort((a, b) => a.left - b.left)[0];

  const topStart = topNeighbor?.bottom ?? 0;
  const topDistance = Math.round(selectedRect.top - topStart);
  if (topDistance > 0) {
    guides.push({
      id: 'top',
      kind: 'distance',
      orientation: 'vertical',
      x1: Math.max(12, selectedRect.left - 18),
      y1: topStart,
      x2: Math.max(12, selectedRect.left - 18),
      y2: selectedRect.top,
      label: `${topDistance}px`,
    });
  }

  const leftStart = leftNeighbor?.right ?? 0;
  const leftDistance = Math.round(selectedRect.left - leftStart);
  if (leftDistance > 0) {
    guides.push({
      id: 'left',
      kind: 'distance',
      orientation: 'horizontal',
      x1: leftStart,
      y1: Math.max(12, selectedRect.top - 18),
      x2: selectedRect.left,
      y2: Math.max(12, selectedRect.top - 18),
      label: `${leftDistance}px`,
    });
  }

  const rightEnd = rightNeighbor?.left ?? viewport.width;
  const rightDistance = Math.round(rightEnd - selectedRect.right);
  if (rightDistance > 0) {
    guides.push({
      id: 'right',
      kind: 'distance',
      orientation: 'horizontal',
      x1: selectedRect.right,
      y1: Math.min(viewport.height - 12, selectedRect.bottom + 18),
      x2: rightEnd,
      y2: Math.min(viewport.height - 12, selectedRect.bottom + 18),
      label: `${rightDistance}px`,
    });
  }

  const bottomEnd = bottomNeighbor?.top ?? viewport.height;
  const bottomDistance = Math.round(bottomEnd - selectedRect.bottom);
  if (bottomDistance > 0) {
    guides.push({
      id: 'bottom',
      kind: 'distance',
      orientation: 'vertical',
      x1: Math.min(viewport.width - 12, selectedRect.right + 18),
      y1: selectedRect.bottom,
      x2: Math.min(viewport.width - 12, selectedRect.right + 18),
      y2: bottomEnd,
      label: `${bottomDistance}px`,
    });
  }

  const selectedCenterX = selectedRect.left + selectedRect.width / 2;
  const selectedCenterY = selectedRect.top + selectedRect.height / 2;
  const viewportCenterX = viewport.width / 2;
  const viewportCenterY = viewport.height / 2;

  if (Math.abs(selectedCenterX - viewportCenterX) <= alignmentThreshold) {
    guides.push({
      id: 'align-center-x',
      kind: 'alignment',
      orientation: 'vertical',
      x1: viewportCenterX,
      y1: 0,
      x2: viewportCenterX,
      y2: viewport.height,
      label: 'center',
    });
  }

  if (Math.abs(selectedCenterY - viewportCenterY) <= alignmentThreshold) {
    guides.push({
      id: 'align-center-y',
      kind: 'alignment',
      orientation: 'horizontal',
      x1: 0,
      y1: viewportCenterY,
      x2: viewport.width,
      y2: viewportCenterY,
      label: 'center',
    });
  }

  const nearestRectCenterX = rects
    .map((rect) => ({
      rect,
      centerX: rect.left + rect.width / 2,
      delta: Math.abs(rect.left + rect.width / 2 - selectedCenterX),
    }))
    .sort((a, b) => a.delta - b.delta)[0];

  if (nearestRectCenterX && nearestRectCenterX.delta <= alignmentThreshold) {
    guides.push({
      id: 'align-nearest-x',
      kind: 'alignment',
      orientation: 'vertical',
      x1: nearestRectCenterX.centerX,
      y1: Math.max(0, Math.min(nearestRectCenterX.rect.top, selectedRect.top) - 24),
      x2: nearestRectCenterX.centerX,
      y2: Math.min(
        viewport.height,
        Math.max(nearestRectCenterX.rect.bottom, selectedRect.bottom) + 24
      ),
      label: 'align',
    });
  }

  const nearestRectCenterY = rects
    .map((rect) => ({
      rect,
      centerY: rect.top + rect.height / 2,
      delta: Math.abs(rect.top + rect.height / 2 - selectedCenterY),
    }))
    .sort((a, b) => a.delta - b.delta)[0];

  if (nearestRectCenterY && nearestRectCenterY.delta <= alignmentThreshold) {
    guides.push({
      id: 'align-nearest-y',
      kind: 'alignment',
      orientation: 'horizontal',
      x1: Math.max(0, Math.min(nearestRectCenterY.rect.left, selectedRect.left) - 24),
      y1: nearestRectCenterY.centerY,
      x2: Math.min(
        viewport.width,
        Math.max(nearestRectCenterY.rect.right, selectedRect.right) + 24
      ),
      y2: nearestRectCenterY.centerY,
      label: 'align',
    });
  }

  return guides;
};

const MeasurementGuidesView = ({
  guides,
  activeRect,
}: {
  guides: MeasurementGuide[];
  activeRect: RectBounds | null;
}) => {
  return (
    <>
      {guides.map((guide) => {
        const isVertical = guide.orientation === 'vertical';
        const left = Math.min(guide.x1, guide.x2);
        const top = Math.min(guide.y1, guide.y2);
        const width = Math.max(1, Math.abs(guide.x2 - guide.x1));
        const height = Math.max(1, Math.abs(guide.y2 - guide.y1));
        const labelLeft = isVertical ? guide.x1 + 6 : left + width / 2;
        const labelTop = isVertical ? top + height / 2 : guide.y1 - 18;
        const lineColor =
          guide.kind === 'alignment' ? 'rgba(217,70,239,0.85)' : 'rgb(217 70 239)';
        const lineStyle =
          guide.kind === 'alignment' ? 'dashed' : 'solid';

        return (
          <React.Fragment key={guide.id}>
            <div
              className="pointer-events-none fixed z-[10020]"
              style={{
                left,
                top,
                width: isVertical ? 1 : width,
                height: isVertical ? height : 1,
                background: lineColor,
                borderStyle: lineStyle,
              }}
            />
            <div
              className="pointer-events-none fixed z-[10020]"
              style={{
                left: guide.x1 - (isVertical ? 4 : 0),
                top: guide.y1 - (isVertical ? 0 : 4),
                width: isVertical ? 9 : 1,
                height: isVertical ? 1 : 9,
                background: lineColor,
              }}
            />
            <div
              className="pointer-events-none fixed z-[10020]"
              style={{
                left: guide.x2 - (isVertical ? 4 : 0),
                top: guide.y2 - (isVertical ? 0 : 4),
                width: isVertical ? 9 : 1,
                height: isVertical ? 1 : 9,
                background: lineColor,
              }}
            />
            <div
              className="pointer-events-none fixed z-[10021] rounded-full border border-white/40 bg-fuchsia-600/95 px-2 py-0.5 text-[10px] font-semibold text-white shadow-lg backdrop-blur"
              style={{
                left: labelLeft,
                top: labelTop,
                transform: isVertical
                  ? 'translateY(-50%)'
                  : 'translateX(-50%)',
              }}
            >
              {guide.label}
            </div>
          </React.Fragment>
        );
      })}
      {activeRect ? (
        <>
          <div
            className="pointer-events-none fixed z-[10022] rounded-full border border-fuchsia-200/70 bg-fuchsia-600/95 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg backdrop-blur"
            style={{
              left: activeRect.left,
              top: Math.max(8, activeRect.top - 34),
            }}
          >
            x {Math.round(activeRect.left)}  y {Math.round(activeRect.top)}
          </div>
          <div
            className="pointer-events-none fixed z-[10022] rounded-full border border-fuchsia-200/70 bg-slate-900/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg backdrop-blur"
            style={{
              left: activeRect.left + activeRect.width / 2,
              top: activeRect.bottom + 12,
              transform: 'translateX(-50%)',
            }}
          >
            {Math.round(activeRect.width)} × {Math.round(activeRect.height)}
          </div>
        </>
      ) : null}
    </>
  );
};

const SelectionBorder = observer((props: SelectionBorderProps) => {
  const editor = useEditor();

  const activeComponentEditor = editor.activeComponentEditor;

  const containerDomRef = React.useRef<HTMLDivElement | null>(null);
  const toolbarDomRef = React.useRef<HTMLDivElement | null>(null);
  const insertActionDomRef = React.useRef<HTMLDivElement | null>(null);
  const handleDomRefs = React.useRef<
    Partial<Record<(typeof HANDLE_POSITIONS)[number]['key'], HTMLDivElement | null>>
  >({});
  const iframe = editor.iframe;
  const portalTarget = iframe?.contentDocument?.body ?? null;
  const [measurementGuides, setMeasurementGuides] = React.useState<MeasurementGuide[]>([]);
  const [activeRect, setActiveRect] = React.useState<RectBounds | null>(null);
  const [isInlineEditing, setIsInlineEditing] = React.useState(false);
  const [isInsertBrowserOpen, setIsInsertBrowserOpen] = React.useState(false);
  const isCancellingInlineEditRef = React.useRef(false);
  const [contextMenu, setContextMenu] = React.useState<ContextMenuState>(null);
  const contextMenuRef = React.useRef<HTMLDivElement | null>(null);
  const syncInteractionVisualState = React.useCallback(
    (nextRect: RectBounds | null, nextGuides: MeasurementGuide[]) => {
      setActiveRect((current) =>
        areRectBoundsEqual(current, nextRect) ? current : nextRect
      );
      setMeasurementGuides((current) =>
        areMeasurementGuidesEqual(current, nextGuides) ? current : nextGuides
      );
    },
    []
  );
  const clearInteractionVisualState = React.useCallback(() => {
    syncInteractionVisualState(null, []);
  }, [syncInteractionVisualState]);
  const canTransform =
    props.type === 'selected' && props.targetTemplate instanceof t.TagTemplate;
  const insertTargetTemplate = React.useMemo(
    () =>
      props.type === 'selected'
        ? getInsertTargetTemplate(editor, props.template)
        : null,
    [editor, props.template, props.type]
  );
  const insertTargetDom = React.useMemo(
    () => getTemplatePrimaryDom(activeComponentEditor?.activeFrame, insertTargetTemplate),
    [activeComponentEditor?.activeFrame, insertTargetTemplate]
  );
  const canUsePageHeightHandles = React.useMemo(() => {
    if (
      !canTransform ||
      !(props.targetTemplate instanceof t.TagTemplate) ||
      !(props.targetTemplate instanceof t.SlottableTemplate) ||
      isFreeBlockTemplate(props.targetTemplate) ||
      !iframe
    ) {
      return false;
    }

    const domRect = props.dom.getBoundingClientRect();
    const frameWidth = iframe.contentWindow?.innerWidth ?? iframe.clientWidth;

    return domRect.height >= 320 && domRect.width >= frameWidth * 0.72;
  }, [canTransform, iframe, props.dom, props.targetTemplate]);
  const canInsertBelow =
    props.type === 'selected' &&
    insertTargetTemplate instanceof t.TagTemplate &&
    insertTargetTemplate instanceof t.SlottableTemplate;
  const layerState = React.useMemo(
    () => getTemplateLayerState(editor, props.template),
    [editor, props.template]
  );
  const editableTextTemplate = React.useMemo(
    () =>
      findEditableTextTemplate(props.template) ??
      (props.targetTemplate !== props.template
        ? findEditableTextTemplate(props.targetTemplate)
        : null),
    [props.targetTemplate, props.template]
  );
  const canInlineEdit =
    props.type === 'selected' &&
    editableTextTemplate instanceof t.TagTemplate &&
    editableTextTemplate.tag === 'text';

  React.useEffect(() => {
    if (!canInsertBelow) {
      setIsInsertBrowserOpen(false);
    }
  }, [canInsertBelow]);

  React.useEffect(() => {
    if (!isInlineEditing || !editableTextTemplate || !activeComponentEditor) {
      return;
    }

    const editingDom = [
      ...(activeComponentEditor.activeFrame?.tplElements.get(editableTextTemplate) ?? []),
    ][0];

    if (!editingDom) {
      setIsInlineEditing(false);
      return;
    }

    const initialValue = readLiteralString(editableTextTemplate.props.value);
    const previousContentEditable = editingDom.getAttribute('contenteditable');
    const previousSpellcheck = editingDom.getAttribute('spellcheck');

    editingDom.setAttribute('contenteditable', 'true');
    editingDom.setAttribute('spellcheck', 'false');
    editingDom.textContent = initialValue;
    editingDom.focus();

    const selection = editingDom.ownerDocument.defaultView?.getSelection();
    const range = editingDom.ownerDocument.createRange();
    range.selectNodeContents(editingDom);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);

    const handleInput = () => {
    };

    const insertPlainTextAtCursor = (text: string) => {
      const selection = editingDom.ownerDocument.defaultView?.getSelection();

      if (!selection || selection.rangeCount === 0) {
        editingDom.appendChild(editingDom.ownerDocument.createTextNode(text));
        return;
      }

      const range = selection.getRangeAt(0);
      range.deleteContents();
      const node = editingDom.ownerDocument.createTextNode(text);
      range.insertNode(node);
      range.setStartAfter(node);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    const handleBlur = () => {
      if (isCancellingInlineEditRef.current) {
        isCancellingInlineEditRef.current = false;
        editingDom.textContent = initialValue;
        setIsInlineEditing(false);
        return;
      }

      editor.reka.change(() => {
        editableTextTemplate.props.value = t.literal({
          value: editingDom.textContent ?? '',
        });
      });
      setIsInlineEditing(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        isCancellingInlineEditRef.current = true;
        editingDom.blur();
        return;
      }

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        editingDom.blur();
      }
    };

    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault();
      const text = event.clipboardData?.getData('text/plain') ?? '';
      insertPlainTextAtCursor(text);
    };

    editingDom.addEventListener('input', handleInput);
    editingDom.addEventListener('blur', handleBlur);
    editingDom.addEventListener('keydown', handleKeyDown);
    editingDom.addEventListener('paste', handlePaste);

    return () => {
      editingDom.removeEventListener('input', handleInput);
      editingDom.removeEventListener('blur', handleBlur);
      editingDom.removeEventListener('keydown', handleKeyDown);
      editingDom.removeEventListener('paste', handlePaste);

      if (previousContentEditable == null) {
        editingDom.removeAttribute('contenteditable');
      } else {
        editingDom.setAttribute('contenteditable', previousContentEditable);
      }

      if (previousSpellcheck == null) {
        editingDom.removeAttribute('spellcheck');
      } else {
        editingDom.setAttribute('spellcheck', previousSpellcheck);
      }
    };
  }, [activeComponentEditor, editableTextTemplate, editor.reka, isInlineEditing]);

  React.useEffect(() => {
    if (!contextMenu || !portalTarget) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (contextMenuRef.current?.contains(event.target as Node)) {
        return;
      }

      setContextMenu(null);
    };

    const handleScroll = () => {
      setContextMenu(null);
    };

    portalTarget.addEventListener('mousedown', handlePointerDown, true);
    portalTarget.ownerDocument.addEventListener('scroll', handleScroll, true);

    return () => {
      portalTarget.removeEventListener('mousedown', handlePointerDown, true);
      portalTarget.ownerDocument.removeEventListener('scroll', handleScroll, true);
    };
  }, [contextMenu, portalTarget]);

  React.useEffect(() => {
    if (props.type !== 'selected' || isInlineEditing) {
      return;
    }

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
      });
      activeComponentEditor?.setTplEvent('selected', props.template);
    };

    props.dom.addEventListener('contextmenu', handleContextMenu, true);

    return () => {
      props.dom.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [activeComponentEditor, isInlineEditing, props.dom, props.template, props.type]);

  React.useEffect(() => {
    if (props.type !== 'selected' || !canInlineEdit || isInlineEditing) {
      return;
    }

    const handleDoubleClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsInlineEditing(true);
    };

    props.dom.addEventListener('dblclick', handleDoubleClick, true);

    return () => {
      props.dom.removeEventListener('dblclick', handleDoubleClick, true);
    };
  }, [canInlineEdit, isInlineEditing, props.dom, props.type]);

  const updateTemplateRect = React.useCallback(
    (next: TemplateRectUpdate) => {
      if (!(props.targetTemplate instanceof t.TagTemplate)) {
        return;
      }

      editor.reka.change(() => {
        const parentContext = getPositionContext(
          editor,
          props.targetTemplate,
          props.dom
        );
        const parentTemplate =
          parentContext?.template ??
          safeGetParentTemplate(editor, props.targetTemplate);
        const isFreeBlock = isFreeBlockTemplate(props.targetTemplate);
        const freeBlockPrimaryTag = isFreeBlock
          ? getFreeBlockPrimaryTag(props.targetTemplate)
          : null;
        const textStyleTarget =
          freeBlockPrimaryTag && isTextLikeTemplate(freeBlockPrimaryTag)
            ? freeBlockPrimaryTag
            : props.targetTemplate;
        const shouldUseTransformMove =
          !isFreeBlock && !isMovableTemplate(props.targetTemplate);
        const shouldPreserveScaleTransform =
          shouldUseTransformMove &&
          typeof next.scaleX !== 'number' &&
          typeof next.scaleY !== 'number' &&
          typeof next.width !== 'number' &&
          typeof next.height !== 'number' &&
          typeof next.minHeight !== 'number';
        const parentWidth = parentContext?.dom.clientWidth;
        const currentLeft =
          typeof next.left === 'number'
            ? next.left
            : readResolvedStylePx(props.targetTemplate, 'left', parentWidth) ?? 0;
        const currentWidth =
          typeof next.width === 'number'
            ? next.width
            : readResolvedStylePx(
                props.targetTemplate,
                'width',
                parentWidth
              ) ?? props.dom.offsetWidth;
        const nextHorizontal =
          isFreeBlock && !shouldUseTransformMove
            ? getFreeBlockHorizontalLiterals(currentLeft, currentWidth, parentWidth)
            : null;

        if (parentTemplate instanceof t.TagTemplate && !shouldUseTransformMove) {
          const parentPosition = readLiteralString(
            parentTemplate.props.style instanceof t.ObjectExpression
              ? parentTemplate.props.style.properties.position
              : null
          );

          if (!parentPosition || parentPosition === 'static') {
            setStyleLiteral(parentTemplate, 'position', 'relative');
          }

          setStyleLiteral(parentTemplate, 'overflow', 'visible');
        }

        if (typeof next.left === 'number') {
          if (shouldUseTransformMove) {
            mergeTranslateTransform(
              props.targetTemplate,
              next.left,
              typeof next.top === 'number' ? next.top : readTranslateValues(props.targetTemplate).y
            );
          } else {
            setStyleLiteral(props.targetTemplate, 'position', 'absolute');

            setStyleLiteral(
              props.targetTemplate,
              'left',
              nextHorizontal?.left ?? `${Math.round(next.left)}px`
            );
          }
        }

        if (typeof next.top === 'number') {
          if (!shouldUseTransformMove) {
            setStyleLiteral(props.targetTemplate, 'top', `${Math.round(next.top)}px`);
          }
        }

        if (typeof next.width === 'number') {
          setStyleLiteral(
            props.targetTemplate,
            'width',
            nextHorizontal?.width ?? `${Math.round(Math.max(MIN_RESIZE_SIZE, next.width))}px`
          );
        }

        if (typeof next.minHeight === 'number') {
          removeStyleLiteral(props.targetTemplate, 'height');
          setStyleLiteral(
            props.targetTemplate,
            'minHeight',
            `${Math.round(Math.max(MIN_RESIZE_SIZE, next.minHeight))}px`
          );
          setStyleLiteral(props.targetTemplate, 'overflow', 'visible');
        } else if (next.skipHeight) {
          removeStyleLiteral(props.targetTemplate, 'height');
        } else if (typeof next.height === 'number') {
          removeStyleLiteral(props.targetTemplate, 'minHeight');
          setStyleLiteral(
            props.targetTemplate,
            'height',
            `${Math.round(Math.max(MIN_RESIZE_SIZE, next.height))}px`
          );
        }

        if (typeof next.fontSize === 'number') {
          setStyleLiteral(
            textStyleTarget,
            'fontSize',
            `${Math.round(Math.max(MIN_FONT_SIZE, next.fontSize))}px`
          );
        }

        if (typeof next.lineHeight === 'number') {
          setStyleLiteral(
            textStyleTarget,
            'lineHeight',
            `${Math.max(MIN_FONT_SIZE, Math.round(next.lineHeight))}px`
          );
        }

        if (
          typeof next.scaleX === 'number' ||
          typeof next.scaleY === 'number'
        ) {
          const scaleX = Math.max(0.1, next.scaleX ?? 1);
          const scaleY = Math.max(0.1, next.scaleY ?? scaleX);
          mergeScaleTransform(
            props.targetTemplate,
            scaleX,
            scaleY,
            next.scaleOrigin ?? 'top left'
          );
        } else if (
          !shouldPreserveScaleTransform &&
          (typeof next.width === 'number' ||
            typeof next.height === 'number' ||
            typeof next.minHeight === 'number')
        ) {
          removeScaleTransform(props.targetTemplate);
        }

        const existingZIndex = readStylePx(props.targetTemplate, 'zIndex') ?? 0;
        if (existingZIndex < 40) {
          setStyleLiteral(props.targetTemplate, 'zIndex', '40');
        }

        if (isFreeBlock) {
          setStyleLiteral(props.targetTemplate, 'maxWidth', '100%');
          setStyleLiteral(props.targetTemplate, 'boxSizing', 'border-box');
          setStyleLiteral(props.targetTemplate, 'overflowWrap', 'break-word');

          if (freeBlockPrimaryTag) {
            setStyleLiteral(freeBlockPrimaryTag, 'maxWidth', '100%');
            setStyleLiteral(freeBlockPrimaryTag, 'boxSizing', 'border-box');

            if (isTextLikeTemplate(freeBlockPrimaryTag)) {
              if (freeBlockPrimaryTag.tag !== 'button') {
                setStyleLiteral(freeBlockPrimaryTag, 'display', 'block');
              }
              setStyleLiteral(freeBlockPrimaryTag, 'width', '100%');
              if (freeBlockPrimaryTag.tag === 'button') {
                setStyleLiteral(freeBlockPrimaryTag, 'height', '100%');
                setStyleLiteral(freeBlockPrimaryTag, 'minHeight', '100%');
              }
            } else {
              setStyleLiteral(freeBlockPrimaryTag, 'width', '100%');
              setStyleLiteral(freeBlockPrimaryTag, 'height', '100%');
              setStyleLiteral(freeBlockPrimaryTag, 'minHeight', '100%');
            }

            if (
              freeBlockPrimaryTag.tag === 'img' ||
              freeBlockPrimaryTag.tag === 'video'
            ) {
              setStyleLiteral(freeBlockPrimaryTag, 'display', 'block');
              setStyleLiteral(freeBlockPrimaryTag, 'objectFit', 'cover');
            }
          }
        }
      });
    },
    [editor, props.dom, props.targetTemplate]
  );

  const beginMoveInteraction = React.useCallback(
    (startClientX: number, startClientY: number) => {
      if (!canTransform || !iframe) {
        return;
      }

      const anchoredRect = getAnchoredTemplateRect(
        editor,
        props.targetTemplate,
        props.dom,
        iframe
      );
      const frameScale = getFrameScale(iframe);
      const parentContext = getPositionContext(editor, props.targetTemplate, props.dom);
      const shouldUseTransformMove = !isMovableTemplate(props.targetTemplate);
      const startTranslate = readTranslateValues(props.targetTemplate);
      const baseTransformWithoutPositioning = stripTransformPart(
        readTransformString(props.targetTemplate),
        /translate(?:X|Y)?\([^)]+\)|translate\(\s*[^,]+,\s*[^)]+\)/g
      );

      const startRect = {
        left:
          shouldUseTransformMove
            ? startTranslate.x
            : readResolvedStylePx(
                props.targetTemplate,
                'left',
                parentContext?.dom.clientWidth
              ) ?? anchoredRect.left,
        top:
          shouldUseTransformMove
            ? startTranslate.y
            : readResolvedStylePx(
                props.targetTemplate,
                'top',
                parentContext?.dom.clientHeight
              ) ?? anchoredRect.top,
        width: readStylePx(props.targetTemplate, 'width') ?? anchoredRect.width,
        height: readStylePx(props.targetTemplate, 'height') ?? anchoredRect.height,
      };
      const startVisualRect = getRectBounds(props.dom);
      const frameDocument = iframe.contentDocument;

      if (!frameDocument) {
        return;
      }

      const frameWindow = frameDocument.defaultView ?? window;
      const guideContext = createMeasurementGuideContext(
        activeComponentEditor?.activeFrame,
        props.dom,
        {
          width: iframe.contentWindow?.innerWidth ?? iframe.clientWidth,
          height: iframe.contentWindow?.innerHeight ?? iframe.clientHeight,
        }
      );

      let cleanupPointerSession = () => {};
      let pendingLeft = startRect.left;
      let pendingTop = startRect.top;
      let pendingVisualRect: RectBounds | null = null;
      let lastPointerDx = 0;
      let lastPointerDy = 0;
      let didMove = false;
      let didCleanup = false;
      let previewFrameId: number | null = null;
      const baseMoveUpdate: TemplateRectUpdate = {};
      const applyMovePreview = (nextLeft: number, nextTop: number) => {
        if (shouldUseTransformMove) {
          const translateTransform =
            Math.abs(nextLeft) > 0.01 || Math.abs(nextTop) > 0.01
              ? `translate(${nextLeft}px, ${nextTop}px)`
              : '';
          const nextTransform = [baseTransformWithoutPositioning, translateTransform]
            .filter(Boolean)
            .join(' ')
            .trim();

          props.dom.style.removeProperty('transformOrigin');

          if (nextTransform) {
            props.dom.style.transform = nextTransform;
          } else {
            props.dom.style.removeProperty('transform');
          }

          return;
        }

        props.dom.style.left = `${Math.round(nextLeft)}px`;
        props.dom.style.top = `${Math.round(nextTop)}px`;
      };

      const flushMovePreview = () => {
        if (previewFrameId != null) {
          frameWindow.cancelAnimationFrame(previewFrameId);
          previewFrameId = null;
        }

        if (!pendingVisualRect) {
          return;
        }

        syncInteractionVisualState(
          pendingVisualRect,
          computeMeasurementGuides(pendingVisualRect, guideContext)
        );
        applyMovePreview(pendingLeft, pendingTop);
      };

      const trackedPointerMove = (moveEvent: PointerEvent) => {
        const rawDx = moveEvent.clientX - startClientX;
        const rawDy = moveEvent.clientY - startClientY;
        const dx = rawDx / Math.max(frameScale.x, 0.0001);
        const dy = rawDy / Math.max(frameScale.y, 0.0001);
        const moveDistance = Math.hypot(rawDx, rawDy);

        lastPointerDx = dx;
        lastPointerDy = dy;

        if (!didMove && moveDistance < MOVE_START_THRESHOLD) {
          return;
        }

        if (!didMove) {
          didMove = true;
          frameDocument.body.style.userSelect = 'none';
          frameDocument.body.style.cursor = 'move';
        }

        pendingLeft = startRect.left + dx;
        pendingTop = startRect.top + dy;
        pendingVisualRect = {
          left: startVisualRect.left + rawDx,
          top: startVisualRect.top + rawDy,
          width: startVisualRect.width,
          height: startVisualRect.height,
          right: startVisualRect.right + rawDx,
          bottom: startVisualRect.bottom + rawDy,
        };

        if (previewFrameId == null) {
          previewFrameId = frameWindow.requestAnimationFrame(() => {
            previewFrameId = null;
            flushMovePreview();
          });
        }
      };

      const onPointerUp = () => {
        if (didCleanup) {
          return;
        }

        didCleanup = true;
        const dx = lastPointerDx;
        const dy = lastPointerDy;

        flushMovePreview();
        cleanupPointerSession();
        frameDocument.body.style.userSelect = '';
        frameDocument.body.style.cursor = '';
        clearInteractionVisualState();

        if (!didMove) {
          return;
        }

        updateTemplateRect({
          ...baseMoveUpdate,
          left: startRect.left + dx,
          top: startRect.top + dy,
        });
      };

      cleanupPointerSession = createInteractionPane(
        frameDocument,
        trackedPointerMove,
        onPointerUp,
        'move'
      );
    },
    [
      activeComponentEditor?.activeFrame,
      canTransform,
      clearInteractionVisualState,
      editor,
      iframe,
      props.dom,
      props.targetTemplate,
      syncInteractionVisualState,
      updateTemplateRect,
    ]
  );

  const startMoveInteraction = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      beginMoveInteraction(event.clientX, event.clientY);
    },
    [beginMoveInteraction]
  );

  React.useEffect(() => {
    if (
      props.type !== 'selected' ||
      !canTransform ||
      canUsePageHeightHandles ||
      isInlineEditing ||
      !activeComponentEditor?.activeFrame
    ) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      if (event.detail > 1) {
        return;
      }

      const targetNode = event.target as Node | null;

      if (!targetNode || !props.dom.contains(targetNode)) {
        return;
      }

      if (canInlineEdit) {
        return;
      }

      if (
        targetNode instanceof Element &&
        targetNode.closest(
          '[contenteditable="true"], input, textarea, select, button, a, [role="button"]'
        )
      ) {
        const interactiveNode = targetNode.closest(
          '[contenteditable="true"], input, textarea, select, button, a, [role="button"]'
        );
        const interactiveTemplate = findRegisteredTemplateForNode(
          activeComponentEditor.activeFrame,
          interactiveNode
        );
        const resolvedInteractiveTemplate = interactiveTemplate
          ? getInteractiveTemplate(editor, interactiveTemplate)
          : null;

        if (
          !resolvedInteractiveTemplate ||
          resolvedInteractiveTemplate.id !== props.targetTemplate.id
        ) {
          return;
        }
      }

      const hitTemplate = findRegisteredTemplateForNode(
        activeComponentEditor.activeFrame,
        targetNode
      );
      const interactiveHitTemplate = hitTemplate
        ? getInteractiveTemplate(editor, hitTemplate)
        : null;

      if (
        interactiveHitTemplate &&
        interactiveHitTemplate.id !== props.targetTemplate.id
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      beginMoveInteraction(event.clientX, event.clientY);
    };

    props.dom.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      props.dom.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [
    activeComponentEditor?.activeFrame,
    beginMoveInteraction,
    canTransform,
    canUsePageHeightHandles,
    canInlineEdit,
    editor,
    isInlineEditing,
    props.dom,
    props.targetTemplate,
    props.type,
  ]);

  const startResizeInteraction = React.useCallback(
    (
      handle: (typeof HANDLE_POSITIONS)[number]['key'],
      event: React.PointerEvent<HTMLDivElement>
    ) => {
      if (!canTransform || !iframe || canUsePageHeightHandles) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const anchoredRect = getAnchoredTemplateRect(
        editor,
        props.targetTemplate,
        props.dom,
        iframe
      );
      const frameScale = getFrameScale(iframe);
      const parentContext = getPositionContext(editor, props.targetTemplate, props.dom);
      const startTranslate = readTranslateValues(props.targetTemplate);
      const freeBlockPrimaryTag = isFreeBlockTemplate(props.targetTemplate)
        ? getFreeBlockPrimaryTag(props.targetTemplate)
        : null;
      const freeBlockPrimaryDom =
        getTemplatePrimaryDom(activeComponentEditor?.activeFrame, freeBlockPrimaryTag) ?? null;
      const resizeAffectsWidth = handle.includes('w') || handle.includes('e');
      const resizeAffectsHeight = handle.includes('n') || handle.includes('s');
      const isTargetMovable = isMovableTemplate(props.targetTemplate);
      const shouldUseTranslateResize = false;
      const textResizeTarget =
        freeBlockPrimaryTag && isTextLikeTemplate(freeBlockPrimaryTag)
          ? freeBlockPrimaryTag
          : isTextLikeTemplate(props.targetTemplate)
            ? props.targetTemplate
            : null;
      const isTextLike = Boolean(textResizeTarget);
      const isButtonResizeTarget =
        textResizeTarget instanceof t.TagTemplate && textResizeTarget.tag === 'button';
      const shouldTreatAsTextBlock = isTextLike && !isButtonResizeTarget;
      const shouldUseTextWrapResize =
        shouldTreatAsTextBlock &&
        resizeAffectsWidth &&
        !resizeAffectsHeight;
      const shouldUseTextMinHeight =
        shouldTreatAsTextBlock && resizeAffectsHeight && !resizeAffectsWidth;
      const shouldUseTransformResize =
        !isTargetMovable && !shouldTreatAsTextBlock;
      const textResizeDom =
        getTemplatePrimaryDom(activeComponentEditor?.activeFrame, textResizeTarget) ?? props.dom;
      const start = {
        left:
          shouldUseTransformResize || shouldUseTranslateResize
            ? startTranslate.x
            : readResolvedStylePx(
                props.targetTemplate,
                'left',
                parentContext?.dom.clientWidth
              ) ?? anchoredRect.left,
        top:
          shouldUseTransformResize || shouldUseTranslateResize
            ? startTranslate.y
            : readResolvedStylePx(
                props.targetTemplate,
                'top',
                parentContext?.dom.clientHeight
              ) ?? anchoredRect.top,
        width:
          readResolvedStylePx(
            props.targetTemplate,
            'width',
            parentContext?.dom.clientWidth
          ) ?? props.dom.offsetWidth,
        height:
          readResolvedStylePx(
            props.targetTemplate,
            'height',
            parentContext?.dom.clientHeight
          ) ?? props.dom.offsetHeight,
      };
      const shouldResizeTypography =
        shouldTreatAsTextBlock &&
        !shouldUseTextWrapResize &&
        !shouldUseTextMinHeight;
      const startFontSize =
        (textResizeTarget ? readStylePx(textResizeTarget, 'fontSize') : null) ??
        readComputedPx(textResizeDom, 'fontSize') ??
        16;
      const startLineHeight =
        (textResizeTarget ? readStylePx(textResizeTarget, 'lineHeight') : null) ??
        readComputedPx(textResizeDom, 'lineHeight') ??
        Math.round(startFontSize * 1.4);
      const scaleOrigin =
        handle === 'nw'
          ? 'bottom right'
          : handle === 'ne'
            ? 'bottom left'
            : handle === 'n'
              ? 'bottom center'
              : handle === 'e'
                ? 'center left'
            : handle === 'sw'
              ? 'top right'
              : handle === 's'
                ? 'top center'
                : handle === 'w'
                  ? 'center right'
              : 'top left';
      const startClientX = event.clientX;
      const startClientY = event.clientY;
      const frameDocument = iframe.contentDocument;

      if (!frameDocument) {
        return;
      }

      const frameWindow = frameDocument.defaultView ?? window;
      const guideContext = createMeasurementGuideContext(
        activeComponentEditor?.activeFrame,
        props.dom,
        {
          width: iframe.contentWindow?.innerWidth ?? iframe.clientWidth,
          height: iframe.contentWindow?.innerHeight ?? iframe.clientHeight,
        }
      );

      let cleanupPointerSession = () => {};
      let didCleanup = false;
      let previewFrameId: number | null = null;
      const startVisualRect = getRectBounds(props.dom);
      const baseUnscaledWidth = Math.max(props.dom.offsetWidth, 1);
      const baseUnscaledHeight = Math.max(props.dom.offsetHeight, 1);
      const baseTransformWithoutScale = stripTransformPart(
        readTransformString(props.targetTemplate),
        /scale\([^)]+\)/g
      );
      const baseTransformWithoutPositioning = stripTransformPart(
        baseTransformWithoutScale,
        /translate(?:X|Y)?\([^)]+\)|translate\(\s*[^,]+,\s*[^)]+\)/g
      );
      let pendingRect: TemplateRectUpdate = {
        left: start.left,
        top: start.top,
        width: start.width,
        height: shouldUseTextMinHeight ? undefined : start.height,
        minHeight: shouldUseTextMinHeight ? start.height : undefined,
        fontSize: shouldResizeTypography ? startFontSize : undefined,
        lineHeight: shouldResizeTypography ? startLineHeight : undefined,
        skipHeight: shouldTreatAsTextBlock && !resizeAffectsHeight,
      };
      let pendingPreview:
        | {
            nextRect: TemplateRectUpdate;
            nextVisualRect: RectBounds;
          }
        | null = null;

      const applyPreviewRect = (nextRect: TemplateRectUpdate) => {
        if (shouldUseTransformResize) {
          const scaleX = Math.max(0.1, nextRect.scaleX ?? 1);
          const scaleY = Math.max(0.1, nextRect.scaleY ?? scaleX);
          const nextTransform = [baseTransformWithoutScale, `scale(${scaleX}, ${scaleY})`]
            .filter(Boolean)
            .join(' ')
            .trim();

          props.dom.style.transformOrigin = nextRect.scaleOrigin ?? 'top left';
          props.dom.style.transform = nextTransform;
          return;
        }

        if (shouldUseTranslateResize) {
          const translateX =
            typeof nextRect.left === 'number' ? nextRect.left : startTranslate.x;
          const translateY =
            typeof nextRect.top === 'number' ? nextRect.top : startTranslate.y;
          const translateTransform =
            Math.abs(translateX) > 0.01 || Math.abs(translateY) > 0.01
              ? `translate(${translateX}px, ${translateY}px)`
              : '';
          const nextTransform = [baseTransformWithoutPositioning, translateTransform]
            .filter(Boolean)
            .join(' ')
            .trim();

          props.dom.style.removeProperty('transformOrigin');

          if (nextTransform) {
            props.dom.style.transform = nextTransform;
          } else {
            props.dom.style.removeProperty('transform');
          }
        } else if (typeof nextRect.left === 'number') {
          props.dom.style.left = `${Math.round(nextRect.left)}px`;
        }

        if (!shouldUseTranslateResize && typeof nextRect.top === 'number') {
          props.dom.style.top = `${Math.round(nextRect.top)}px`;
        }

        if (typeof nextRect.width === 'number') {
          props.dom.style.width = `${Math.round(Math.max(MIN_RESIZE_SIZE, nextRect.width))}px`;
        }

        if (typeof nextRect.minHeight === 'number') {
          props.dom.style.removeProperty('height');
          props.dom.style.minHeight = `${Math.round(
            Math.max(MIN_RESIZE_SIZE, nextRect.minHeight)
          )}px`;
        } else if (nextRect.skipHeight) {
          props.dom.style.removeProperty('height');
        } else if (typeof nextRect.height === 'number') {
          props.dom.style.removeProperty('minHeight');
          props.dom.style.height = `${Math.round(Math.max(MIN_RESIZE_SIZE, nextRect.height))}px`;
        }

        if (isTextLike) {
          if (typeof nextRect.fontSize === 'number') {
            textResizeDom.style.fontSize = `${Math.round(
              Math.max(MIN_FONT_SIZE, nextRect.fontSize)
            )}px`;
          }

          if (typeof nextRect.lineHeight === 'number') {
            textResizeDom.style.lineHeight = `${Math.round(
              Math.max(MIN_FONT_SIZE, nextRect.lineHeight)
            )}px`;
          }
        }

        if (freeBlockPrimaryDom) {
          freeBlockPrimaryDom.style.maxWidth = '100%';
          freeBlockPrimaryDom.style.boxSizing = 'border-box';

          if (freeBlockPrimaryTag && isTextLikeTemplate(freeBlockPrimaryTag)) {
            if (freeBlockPrimaryTag.tag !== 'button') {
              freeBlockPrimaryDom.style.display = 'block';
            }
            freeBlockPrimaryDom.style.width = '100%';
            if (freeBlockPrimaryTag.tag === 'button') {
              freeBlockPrimaryDom.style.height = '100%';
              freeBlockPrimaryDom.style.minHeight = '100%';
            }
          } else {
            freeBlockPrimaryDom.style.width = '100%';
            freeBlockPrimaryDom.style.height = '100%';
            freeBlockPrimaryDom.style.minHeight = '100%';
          }
        }
      };

      const computeResizePreview = (clientX: number, clientY: number) => {
        const rawDx = clientX - startClientX;
        const rawDy = clientY - startClientY;
        const dx = rawDx / Math.max(frameScale.x, 0.0001);
        const dy = rawDy / Math.max(frameScale.y, 0.0001);

        let nextLeft = start.left;
        let nextTop = start.top;
        let nextWidth = start.width;
        let nextHeight = start.height;

        if (handle.includes('w')) {
          nextWidth = Math.max(MIN_RESIZE_SIZE, start.width - dx);
          nextLeft = start.left + (start.width - nextWidth);
        } else if (handle.includes('e')) {
          nextWidth = Math.max(MIN_RESIZE_SIZE, start.width + dx);
        }

        if (handle.includes('n')) {
          nextHeight = Math.max(MIN_RESIZE_SIZE, start.height - dy);
          nextTop = start.top + (start.height - nextHeight);
        } else if (handle.includes('s')) {
          nextHeight = Math.max(MIN_RESIZE_SIZE, start.height + dy);
        }

        if (shouldUseTransformResize) {
          const visualWidth = Math.max(
            MIN_RESIZE_SIZE,
            resizeAffectsWidth
              ? startVisualRect.width + (handle.includes('w') ? -rawDx : rawDx)
              : startVisualRect.width
          );
          const visualHeight = Math.max(
            MIN_RESIZE_SIZE,
            resizeAffectsHeight
              ? startVisualRect.height + (handle.includes('n') ? -rawDy : rawDy)
              : startVisualRect.height
          );
          const uniformScale = Math.max(
            visualWidth / Math.max(baseUnscaledWidth, 1),
            visualHeight / Math.max(baseUnscaledHeight, 1)
          );

          pendingRect = {
            scaleX: isTextLike
              ? uniformScale
              : visualWidth / Math.max(baseUnscaledWidth, 1),
            scaleY: isTextLike
              ? uniformScale
              : visualHeight / Math.max(baseUnscaledHeight, 1),
            scaleOrigin,
            skipHeight: shouldTreatAsTextBlock,
          };

          const nextVisualLeft = handle.includes('w')
            ? startVisualRect.right - visualWidth
            : startVisualRect.left;
          const nextVisualTop = handle.includes('n')
            ? startVisualRect.bottom - visualHeight
            : startVisualRect.top;

          return {
            nextRect: pendingRect,
            nextVisualRect: {
              left: nextVisualLeft,
              top: nextVisualTop,
              width: visualWidth,
              height: visualHeight,
              right: nextVisualLeft + visualWidth,
              bottom: nextVisualTop + visualHeight,
            },
          };
        }

        pendingRect = {
          left: nextLeft,
          top: nextTop,
          width: nextWidth,
          height: shouldUseTextMinHeight ? undefined : nextHeight,
          minHeight: shouldUseTextMinHeight ? nextHeight : undefined,
          fontSize: shouldResizeTypography
            ? Math.max(
                MIN_FONT_SIZE,
                startFontSize *
                  Math.max(
                    nextWidth / Math.max(start.width, 1),
                    nextHeight / Math.max(start.height, 1)
                  )
              )
            : undefined,
          lineHeight: shouldResizeTypography
            ? Math.max(
                MIN_FONT_SIZE,
                startLineHeight *
                  Math.max(
                    nextWidth / Math.max(start.width, 1),
                    nextHeight / Math.max(start.height, 1)
                  )
              )
            : undefined,
          skipHeight: shouldTreatAsTextBlock && !resizeAffectsHeight,
        };

        return {
          nextRect: pendingRect,
          nextVisualRect: {
            left: startVisualRect.left + (nextLeft - start.left) * frameScale.x,
            top: startVisualRect.top + (nextTop - start.top) * frameScale.y,
            width: nextWidth * frameScale.x,
            height: nextHeight * frameScale.y,
            right:
              startVisualRect.left +
              (nextLeft - start.left) * frameScale.x +
              nextWidth * frameScale.x,
            bottom:
              startVisualRect.top +
              (nextTop - start.top) * frameScale.y +
              nextHeight * frameScale.y,
          },
        };
      };

      let lastRect: TemplateRectUpdate = {
        left: start.left,
        top: start.top,
        width: start.width,
        height: shouldUseTextMinHeight ? undefined : start.height,
        minHeight: shouldUseTextMinHeight ? start.height : undefined,
        fontSize: shouldResizeTypography ? startFontSize : undefined,
        lineHeight: shouldResizeTypography ? startLineHeight : undefined,
        skipHeight: shouldTreatAsTextBlock && !resizeAffectsHeight,
      };

      const flushResizePreview = () => {
        if (previewFrameId != null) {
          frameWindow.cancelAnimationFrame(previewFrameId);
          previewFrameId = null;
        }

        if (!pendingPreview) {
          return;
        }

        lastRect = pendingPreview.nextRect;
        applyPreviewRect(pendingPreview.nextRect);
        syncInteractionVisualState(
          pendingPreview.nextVisualRect,
          computeMeasurementGuides(pendingPreview.nextVisualRect, guideContext)
        );
      };

      const trackedPointerMove = (moveEvent: PointerEvent) => {
        pendingPreview = computeResizePreview(moveEvent.clientX, moveEvent.clientY);

        if (previewFrameId == null) {
          previewFrameId = frameWindow.requestAnimationFrame(() => {
            previewFrameId = null;
            flushResizePreview();
          });
        }
      };

      const onPointerUp = () => {
        if (didCleanup) {
          return;
        }

        didCleanup = true;
        flushResizePreview();

        cleanupPointerSession();
        frameDocument.body.style.userSelect = '';
        frameDocument.body.style.cursor = '';
        clearInteractionVisualState();

        updateTemplateRect(lastRect);
      };

      frameDocument.body.style.userSelect = 'none';
      frameDocument.body.style.cursor = 'nwse-resize';
      cleanupPointerSession = createInteractionPane(
        frameDocument,
        trackedPointerMove,
        onPointerUp,
        handle === 'ne' || handle === 'sw'
          ? 'nesw-resize'
          : handle === 'n' || handle === 's'
            ? 'ns-resize'
            : handle === 'e' || handle === 'w'
              ? 'ew-resize'
              : 'nwse-resize'
      );
    },
    [
      activeComponentEditor?.activeFrame,
      canTransform,
      canUsePageHeightHandles,
      clearInteractionVisualState,
      editor,
      iframe,
      props.dom,
      props.targetTemplate,
      syncInteractionVisualState,
      updateTemplateRect,
    ]
  );

  React.useEffect(() => {
    if (!iframe) {
      return;
    }

    const { current: containerDom } = containerDomRef;

    if (!containerDom) {
      return;
    }

    const setPos = () => {
      const domRect = props.dom.getBoundingClientRect();

      containerDom.style.opacity = '1';
      containerDom.style.position = 'fixed';
      containerDom.style.left = `${domRect.left}px`;
      containerDom.style.top = `${domRect.top}px`;
      containerDom.style.height = domRect.height + 'px';
      containerDom.style.width = domRect.width + 'px';

      if (toolbarDomRef.current) {
        toolbarDomRef.current.style.left = `${domRect.left - 1}px`;
        toolbarDomRef.current.style.top = `${Math.max(8, domRect.top - 32)}px`;
      }

      if (insertActionDomRef.current) {
        const insertRect = (insertTargetDom ?? props.dom).getBoundingClientRect();
        insertActionDomRef.current.style.left = `${insertRect.left + insertRect.width / 2}px`;
        insertActionDomRef.current.style.top = `${insertRect.bottom + 10}px`;
      }

      const handleOffsets = {
        nw: { left: domRect.left - 8, top: domRect.top - 8 },
        n: { left: domRect.left + domRect.width / 2 - 8, top: domRect.top - 8 },
        ne: { left: domRect.right - 8, top: domRect.top - 8 },
        e: { left: domRect.right - 8, top: domRect.top + domRect.height / 2 - 8 },
        sw: { left: domRect.left - 8, top: domRect.bottom - 8 },
        s: { left: domRect.left + domRect.width / 2 - 8, top: domRect.bottom - 8 },
        se: { left: domRect.right - 8, top: domRect.bottom - 8 },
        w: { left: domRect.left - 8, top: domRect.top + domRect.height / 2 - 8 },
      } as const;

      HANDLE_POSITIONS.forEach((handle) => {
        const handleDom = handleDomRefs.current[handle.key];

        if (!handleDom) {
          return;
        }

        handleDom.style.left = `${handleOffsets[handle.key].left}px`;
        handleDom.style.top = `${handleOffsets[handle.key].top}px`;
      });

    };

    const animation = CachedAnimationFrameCallback.requestAnimationFrame(
      iframe,
      props.dom,
      setPos
    );

    return () => {
      animation.dispose();
    };
  }, [iframe, insertTargetDom, props.dom, props.template]);

  const templateName = React.useMemo(() => {
    if (props.template instanceof t.TagTemplate) {
      return props.template.tag;
    }

    if (props.template instanceof t.ComponentTemplate) {
      return props.template.component.name;
    }

    if (props.template instanceof t.SlotTemplate) {
      return '<slot>';
    }

    return 'Template';
  }, [props.template]);

  const templateType = React.useMemo(() => {
    if (props.template instanceof t.TagTemplate) {
      return 'tag';
    }

    if (props.template instanceof t.ComponentTemplate) {
      return 'component';
    }

    if (props.template instanceof t.SlotTemplate) {
      return 'slot';
    }

    return 'Unknown';
  }, [props.template]);

  const insertTargetLabel = React.useMemo(() => {
    if (insertTargetTemplate instanceof t.TagTemplate) {
      if (insertTargetTemplate.tag === 'section') {
        return 'Section';
      }

      if (insertTargetTemplate.tag === 'div') {
        return 'Block Section';
      }

      return `${insertTargetTemplate.tag.charAt(0).toUpperCase()}${insertTargetTemplate.tag.slice(1)} Section`;
    }

    return `${templateName} Section`;
  }, [insertTargetTemplate, templateName]);

  if (!activeComponentEditor) {
    return null;
  }

  return portalTarget
    ? createPortal(
      <>
        <div
          data-studio-selection-overlay="true"
          className="pointer-events-none absolute z-[9999] border border-solid border-primary"
          ref={containerDomRef}
        />

        {props.type === 'selected' && (
          <div
            data-studio-selection-overlay="true"
            ref={toolbarDomRef}
            className={cn(
              'fixed z-[10005] inline-flex items-center gap-2 rounded-t-md bg-primary pl-2 pr-2.5 text-white shadow-sm pointer-events-auto'
            )}
            onPointerDown={
              canTransform && !isInlineEditing && !canUsePageHeightHandles
                ? startMoveInteraction
                : undefined
            }
          >
            {canTransform && !isInlineEditing && !canUsePageHeightHandles ? (
              <div className="flex h-8 w-7 items-center justify-center border-r border-white/20 text-white/85 cursor-move">
                <DotsHorizontalIcon />
              </div>
            ) : null}
            <div className="flex h-8 items-center">
              <div className="flex-1 flex items-center">
                <span className="text-sm ">{templateName}</span>
                <span className="ml-1 opacity-70 text-xs">
                  {'<'}
                  {templateType}
                  {'>'}
                </span>
              </div>

              <div className="pl-3 flex items-center">
                {props.template instanceof t.ComponentTemplate && (
                  <Tooltip
                    content={
                      props.template.component.external
                        ? 'This is an external React component, it cannot be edited.'
                        : 'Edit component'
                    }
                  >
                    <IconButton
                      disabled={props.template.component.external}
                      className="text-white/80 hover:bg-black/10 hover:text-white"
                      onClick={() => {
                        const template = props.template;

                        if (!(template instanceof t.ComponentTemplate)) {
                          return;
                        }

                        if (template.component.external) {
                          return;
                        }

                        const component = editor.reka.components.program.find(
                          (component) =>
                            component.name === template.component.name
                        );

                        if (!component) {
                          return;
                        }

                        editor.router.push(
                          `${editor.router.pathname}?component=${encodeURIComponent(
                            component.name
                          )}`
                        );
                      }}
                    >
                      <Pencil1Icon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip content="View comments">
                  <IconButton
                    className="text-white/80 hover:bg-black/10 hover:text-white items-center flex"
                    onClick={() => {
                      activeComponentEditor.showComments(props.template);
                    }}
                  >
                    <ChatBubbleIcon />
                    {activeComponentEditor.getCommentCount(props.template) >
                      0 && (
                      <div className="ml-3 [fontSize:0.6rem]">
                        {editor.activeComponentEditor?.getCommentCount(
                          props.template
                        )}
                      </div>
                    )}
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {canInsertBelow ? (
          <div
            data-studio-selection-overlay="true"
            ref={insertActionDomRef}
            className="fixed z-[10005] pointer-events-auto"
            style={{ transform: 'translateX(-50%)' }}
          >
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsInsertBrowserOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.38)] transition hover:border-slate-300 hover:bg-slate-50"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                <PlusIcon />
              </span>
              <span className="text-left">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {insertTargetLabel}
                </span>
                <span className="block text-[12px] font-semibold text-slate-900">
                  Browse Components
                </span>
              </span>
            </button>
          </div>
        ) : null}

        {canTransform && !isInlineEditing && !canUsePageHeightHandles
          ? HANDLE_POSITIONS.map((handle) => (
              <div
                key={handle.key}
                ref={(dom) => {
                  handleDomRefs.current[handle.key] = dom;
                }}
                className={cn(
                  'fixed z-[10006] h-4 w-4 rounded-full border-2 border-primary bg-white shadow-sm touch-none pointer-events-auto',
                  handle.className
                )}
                onPointerDown={(event) => startResizeInteraction(handle.key, event)}
              />
            ))
          : null}
        {contextMenu ? (
          <div
            ref={contextMenuRef}
            className="fixed z-[10040] min-w-[210px] overflow-hidden rounded-[14px] border border-slate-200 bg-white p-1.5 shadow-[0_18px_44px_-24px_rgba(15,23,42,0.45)]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <div className="rounded-[10px] bg-slate-50 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Layer Actions
              </div>
              <div className="mt-1 truncate text-[12px] font-semibold text-slate-800">
                {templateName}
              </div>
            </div>
            <button
              type="button"
              disabled={!layerState.canMoveUp}
              onClick={() => {
                moveTemplateLayer(editor, props.template, 'up');
                setContextMenu(null);
              }}
              className="flex h-9 w-full items-center rounded-[10px] px-3 text-left text-[12px] font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Move Up
            </button>
            <button
              type="button"
              disabled={!layerState.canMoveDown}
              onClick={() => {
                moveTemplateLayer(editor, props.template, 'down');
                setContextMenu(null);
              }}
              className="flex h-9 w-full items-center rounded-[10px] px-3 text-left text-[12px] font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Move Down
            </button>
            <button
              type="button"
              disabled={!layerState.hasParent || !layerState.canMoveDown}
              onClick={() => {
                moveTemplateLayerToEdge(editor, props.template, 'front');
                setContextMenu(null);
              }}
              className="flex h-9 w-full items-center rounded-[10px] px-3 text-left text-[12px] font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Bring Front
            </button>
            <button
              type="button"
              disabled={!layerState.hasParent || !layerState.canMoveUp}
              onClick={() => {
                moveTemplateLayerToEdge(editor, props.template, 'back');
                setContextMenu(null);
              }}
              className="flex h-9 w-full items-center rounded-[10px] px-3 text-left text-[12px] font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send Back
            </button>
            <div className="my-1 h-px bg-slate-200" />
            <button
              type="button"
              disabled={!layerState.hasParent}
              onClick={() => {
                duplicateTemplateLayer(editor, props.template);
                setContextMenu(null);
              }}
              className="flex h-9 w-full items-center rounded-[10px] px-3 text-left text-[12px] font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Duplicate Layer
            </button>
            <button
              type="button"
              disabled={!layerState.hasParent}
              onClick={() => {
                removeTemplateLayer(editor, props.template);
                setContextMenu(null);
              }}
              className="flex h-9 w-full items-center rounded-[10px] px-3 text-left text-[12px] font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete Layer
            </button>
          </div>
        ) : null}

        {measurementGuides.length > 0 || activeRect ? (
          <MeasurementGuidesView
            guides={measurementGuides}
            activeRect={activeRect}
          />
        ) : null}

        {canInsertBelow ? (
          <InsertComponentBrowser
            isOpen={isInsertBrowserOpen}
            onClose={() => setIsInsertBrowserOpen(false)}
            targetTemplate={insertTargetTemplate}
            targetLabel={insertTargetLabel}
          />
        ) : null}
      </>,
      portalTarget
    )
    : null;
});

type SelectionBordersProps = {
  template: t.Template;
  targetTemplate: t.Template;
  type: 'hovered' | 'selected';
};

const SelectionBorders = observer((props: SelectionBordersProps) => {
  const editor = useEditor();

  const doms =
    editor.activeComponentEditor?.activeFrame?.tplElements.get(
      props.targetTemplate
    ) ?? [];

  return (
    <React.Fragment>
      {[...doms].map((dom, i) => (
        <SelectionBorder
          dom={dom}
          key={i}
          template={props.template}
          targetTemplate={props.targetTemplate}
          type={props.type}
        />
      ))}
    </React.Fragment>
  );
});

export const RenderSelectionBorders = observer(() => {
  const editor = useEditor();

  const activeComponentEditor = editor.activeComponentEditor;
  const activeFrame = activeComponentEditor?.activeFrame ?? null;

  React.useEffect(() => {
    if (editor.mode === EditorMode.Preview || !activeComponentEditor || !activeFrame) {
      return;
    }

    const iframe = editor.iframe;
    const doc = iframe?.contentDocument;

    if (!doc) {
      return;
    }

    const isInsideRegisteredTemplate = (node: Node | null) => {
      if (!node) {
        return false;
      }

      for (const doms of activeFrame.tplElements.values()) {
        for (const dom of doms) {
          if (dom === node || dom.contains(node)) {
            return true;
          }
        }
      }

      return false;
    };

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (
        target instanceof Element &&
        target.closest('[data-studio-selection-overlay="true"]')
      ) {
        return;
      }

      if (!isInsideRegisteredTemplate(target)) {
        activeComponentEditor.setTplEvent('selected', null);
        activeComponentEditor.setTplEvent('hovered', null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      activeComponentEditor.setTplEvent('selected', null);
      activeComponentEditor.setTplEvent('hovered', null);
    };

    doc.addEventListener('mousedown', handleMouseDown, true);
    doc.addEventListener('keydown', handleKeyDown, true);

    return () => {
      doc.removeEventListener('mousedown', handleMouseDown, true);
      doc.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [activeComponentEditor, activeFrame, editor.iframe, editor.mode]);

  if (editor.mode === EditorMode.Preview) {
    return null;
  }

  if (!activeComponentEditor || !activeFrame) {
    return null;
  }

  return (
    <React.Fragment>
      {activeComponentEditor.tplEvent.selected && (
        <SelectionBorders
          template={activeComponentEditor.tplEvent.selected}
          targetTemplate={getInteractiveTemplate(
            editor,
            activeComponentEditor.tplEvent.selected
          )}
          type="selected"
        />
      )}
      {activeComponentEditor.tplEvent.hovered &&
        activeComponentEditor.tplEvent.hovered.id !==
          activeComponentEditor.tplEvent.selected?.id && (
          <SelectionBorders
            template={activeComponentEditor.tplEvent.hovered}
            targetTemplate={getInteractiveTemplate(
              editor,
              activeComponentEditor.tplEvent.hovered
            )}
            type="hovered"
          />
        )}
    </React.Fragment>
  );
});
