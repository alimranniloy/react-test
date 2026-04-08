import { observer } from '@rekajs/react';
import * as t from '@rekajs/types';
import { toJS } from 'mobx';
import * as React from 'react';

import {
  omitStudioAnimationProps,
  playStudioAnimation,
  readStudioAnimationConfig,
} from '@app/animations/studioAnimations';
import { useEditorActiveComponent, useMaybeEditor } from '@app/editor';
import { EditorMode } from '@app/editor/Editor';
import { cn } from '@app/utils';
import {
  buildStudioPagePath,
  omitStudioClickActionProps,
  readStudioClickActionConfig,
} from '@app/utils/studioClickAction';
import { renderStudioInteractiveBlock } from './studioInteractiveBlocks';

type ComponentContextType = {
  component: t.Component;
  root: t.Component;
  parentComponent?: t.Component;
};

const ComponentContext = React.createContext<ComponentContextType | null>(null);

type SlotContextType = {
  parentComponent?: t.Component;
};

const SlotContext = React.createContext<SlotContextType | null>(null);

type SelectorContextType = {
  onConnect: (dom: HTMLElement, view: t.View) => (() => void) | undefined;
};

const SelectorContext = React.createContext<SelectorContextType | null>(null);

type FreeBlockResponsiveContextType = {
  active: boolean;
  scale: number;
  mobileKind: StudioMobileKind;
};

type LayoutRenderContextType = {
  viewportWidth: number;
  viewportHeight: number;
  hostWidth: number;
  responsiveScale: number;
  isRoot: boolean;
  lockResponsiveMetrics: boolean;
};

const FreeBlockResponsiveContext =
  React.createContext<FreeBlockResponsiveContextType>({
    active: false,
    scale: 1,
    mobileKind: 'generic',
  });

const LayoutRenderContext = React.createContext<LayoutRenderContextType>({
  viewportWidth: 1280,
  viewportHeight: 900,
  hostWidth: 1280,
  responsiveScale: 1,
  isRoot: true,
  lockResponsiveMetrics: false,
});

const TEXT_LIKE_TAGS = new Set([
  'p',
  'span',
  'a',
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

const CONTAINER_LIKE_TAGS = new Set([
  'div',
  'section',
  'article',
  'aside',
  'nav',
  'main',
  'header',
  'footer',
  'form',
]);

type StudioMobileKind = 'text' | 'media' | 'button' | 'container' | 'generic';
const DESIGN_VIEWPORT_WIDTH = 1280;
const MOBILE_BREAKPOINT = 767;

const STUDIO_FREE_BLOCK_BASE_CLASSNAME =
  'studio-free-block box-border max-w-full origin-top-left [container-type:inline-size] [&>*]:max-w-full [&_img]:max-w-full [&_img]:h-auto [&_video]:max-w-full [&_video]:h-auto [&_canvas]:max-w-full [&_canvas]:h-auto [&_svg]:max-w-full [&_svg]:h-auto [&_p]:break-words [&_span]:break-words [&_a]:break-words [&_button]:break-words [&_label]:break-words [&_strong]:break-words [&_em]:break-words [&_small]:break-words [&_h1]:break-words [&_h2]:break-words [&_h3]:break-words [&_h4]:break-words [&_h5]:break-words [&_h6]:break-words [&_blockquote]:break-words';

const STUDIO_FREE_BLOCK_KIND_CLASSNAMES: Record<StudioMobileKind, string> = {
  text: 'max-md:[&_h1]:[font-size:clamp(1.75rem,10cqi,2.5rem)] max-md:[&_h1]:leading-[1.08] max-md:[&_h2]:[font-size:clamp(1.75rem,10cqi,2.5rem)] max-md:[&_h2]:leading-[1.08] max-md:[&_h3]:[font-size:clamp(1.125rem,6.4cqi,1.5rem)] max-md:[&_h3]:leading-[1.18] max-md:[&_h4]:[font-size:clamp(1.125rem,6.4cqi,1.5rem)] max-md:[&_h4]:leading-[1.18] max-md:[&_h5]:[font-size:clamp(1.125rem,6.4cqi,1.5rem)] max-md:[&_h5]:leading-[1.18] max-md:[&_h6]:[font-size:clamp(1.125rem,6.4cqi,1.5rem)] max-md:[&_h6]:leading-[1.18] max-md:[&_p]:[font-size:clamp(0.875rem,4.2cqi,1rem)] max-md:[&_p]:leading-[1.55] max-md:[&_span]:[font-size:clamp(0.875rem,4.2cqi,1rem)] max-md:[&_span]:leading-[1.55] max-md:[&_blockquote]:[font-size:clamp(0.875rem,4.2cqi,1rem)] max-md:[&_blockquote]:leading-[1.55] max-md:[&_a]:[font-size:clamp(0.875rem,4.2cqi,1rem)] max-md:[&_a]:leading-[1.55] max-md:[&_label]:[font-size:clamp(0.875rem,4.2cqi,1rem)] max-md:[&_label]:leading-[1.55] max-md:[&_strong]:[font-size:clamp(0.875rem,4.2cqi,1rem)] max-md:[&_strong]:leading-[1.55] max-md:[&_em]:[font-size:clamp(0.875rem,4.2cqi,1rem)] max-md:[&_em]:leading-[1.55] max-md:[&_small]:[font-size:clamp(0.875rem,4.2cqi,1rem)] max-md:[&_small]:leading-[1.55]',
  media: 'max-md:[&>*]:w-full max-md:[&>*]:h-full max-md:[&>*]:object-cover',
  button: 'max-md:[&_button]:[font-size:clamp(0.875rem,4cqi,1rem)] max-md:[&_button]:leading-[1.25] max-md:[&_a]:[font-size:clamp(0.875rem,4cqi,1rem)] max-md:[&_a]:leading-[1.25]',
  container: '',
  generic: '',
};

type RenderErrorViewProps = {
  view: t.ErrorSystemView;
};

const RenderErrorView = observer((props: RenderErrorViewProps) => {
  return (
    <div>
      <h4>Error: {props.view.error}</h4>
    </div>
  );
});

const resolveStyleValue = (value: unknown): unknown => {
  if (value instanceof t.Literal) {
    return value.value;
  }

  if (value instanceof t.ObjectExpression) {
    return Object.fromEntries(
      Object.entries(value.properties).map(([key, propertyValue]) => [
        key,
        resolveStyleValue(propertyValue),
      ])
    );
  }

  if (value instanceof t.ArrayExpression) {
    return value.elements.map((item) => resolveStyleValue(item));
  }

  if (value && typeof value === 'object') {
    const candidate = value as {
      type?: string;
      value?: unknown;
      properties?: Record<string, unknown>;
      elements?: unknown[];
    };

    if (candidate.type === 'Literal') {
      return candidate.value;
    }

    if (candidate.type === 'ObjectExpression' && candidate.properties) {
      return Object.fromEntries(
        Object.entries(candidate.properties).map(([key, propertyValue]) => [
          key,
          resolveStyleValue(propertyValue),
        ])
      );
    }

    if (candidate.type === 'ArrayExpression' && Array.isArray(candidate.elements)) {
      return candidate.elements.map((item) => resolveStyleValue(item));
    }
  }

  return value;
};

const hasStudioFreeBlockClass = (className: unknown) => {
  if (typeof className !== 'string') {
    return false;
  }

  return className.split(/\s+/).includes('studio-free-block');
};

const readPxValue = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)px$/i);

  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
};

const SCALEABLE_STYLE_KEYS = new Set([
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'gap',
  'rowGap',
  'columnGap',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'top',
  'right',
  'bottom',
  'left',
]);

const HORIZONTAL_CENTER_SNAP_THRESHOLD = 24;
const FULL_WIDTH_CANVAS_THRESHOLD = 24;
const DESKTOP_CANVAS_WIDTH = DESIGN_VIEWPORT_WIDTH;

const scalePxValue = (value: unknown, scale: number) => {
  if (scale >= 0.999) {
    return value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(value * scale * 1000) / 1000;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)px$/i);

  if (!match) {
    return value;
  }

  const parsed = Number.parseFloat(match[1] ?? '');

  if (!Number.isFinite(parsed)) {
    return value;
  }

  return `${Math.round(parsed * scale * 1000) / 1000}px`;
};

const resolveRelativePxValue = (value: unknown, relativeSize: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  const pxMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)px$/i);

  if (pxMatch) {
    const parsed = Number.parseFloat(pxMatch[1] ?? '');
    return Number.isFinite(parsed) ? parsed : null;
  }

  const percentMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)%$/i);

  if (percentMatch && Number.isFinite(relativeSize) && relativeSize > 0) {
    const parsed = Number.parseFloat(percentMatch[1] ?? '');
    return Number.isFinite(parsed) ? (parsed / 100) * relativeSize : null;
  }

  const centeredCalcMatch = trimmed.match(
    /^calc\(\s*50%\s*-\s*(-?\d+(?:\.\d+)?)px\s*\)$/i
  );

  if (centeredCalcMatch && Number.isFinite(relativeSize) && relativeSize > 0) {
    const parsed = Number.parseFloat(centeredCalcMatch[1] ?? '');
    return Number.isFinite(parsed) ? relativeSize / 2 - parsed : null;
  }

  return null;
};

const scaleResponsiveChildStyle = (
  style: Record<string, unknown>,
  scale: number
) => {
  if (scale >= 0.999) {
    return style;
  }

  return Object.fromEntries(
    Object.entries(style).map(([key, value]) => [
      key,
      SCALEABLE_STYLE_KEYS.has(key) ? scalePxValue(value, scale) : value,
    ])
  );
};

const normalizeDesktopFreeBlockStyle = (
  style: Record<string, unknown>,
  hostWidth: number,
  mobileKind: StudioMobileKind
) => {
  const widthPx = resolveRelativePxValue(style.width, hostWidth);
  const leftPx = resolveRelativePxValue(style.left, hostWidth);

  if (
    typeof widthPx !== 'number' ||
    !Number.isFinite(widthPx) ||
    typeof leftPx !== 'number' ||
    !Number.isFinite(leftPx) ||
    !Number.isFinite(hostWidth) ||
    hostWidth <= 0
  ) {
    return style;
  }

  const centerDelta = Math.abs(leftPx + widthPx / 2 - hostWidth / 2);
  const rightGap = hostWidth - (leftPx + widthPx);
  const shouldFillViewport =
    (Math.abs(leftPx) <= HORIZONTAL_CENTER_SNAP_THRESHOLD &&
      Math.abs(rightGap) <= HORIZONTAL_CENTER_SNAP_THRESHOLD) ||
    (mobileKind === 'container' &&
      centerDelta <= HORIZONTAL_CENTER_SNAP_THRESHOLD &&
      Math.abs(widthPx - DESKTOP_CANVAS_WIDTH) <= FULL_WIDTH_CANVAS_THRESHOLD);

  if (shouldFillViewport) {
    return {
      ...style,
      left: '0px',
      width: '100%',
      right: 'auto',
    };
  }

  if (centerDelta > HORIZONTAL_CENTER_SNAP_THRESHOLD) {
    return style;
  }

  return {
    ...style,
    left: `calc(50% - ${Math.round(widthPx / 2)}px)`,
    right: 'auto',
  };
};

const getResponsiveFreeBlockStyle = (
  style: Record<string, unknown>,
  viewportWidth: number,
  hostWidth: number,
  mobileKind: StudioMobileKind
) => {
  if (viewportWidth > MOBILE_BREAKPOINT) {
    return {
      scale: 1,
      style: normalizeDesktopFreeBlockStyle(style, hostWidth, mobileKind),
    };
  }

  const gutter = viewportWidth <= 520 ? 12 : 16;
  const layoutWidth = Math.max(1, Math.min(viewportWidth, hostWidth));
  const availableWidth = Math.max(160, layoutWidth - gutter * 2);
  const widthPx = readPxValue(style.width);
  const heightPx = readPxValue(style.height);
  const hasExplicitWidth = typeof widthPx === 'number';
  const derivedWidth = widthPx ?? availableWidth;
  const scale = Math.min(1, availableWidth / Math.max(derivedWidth, 1));
  const mobileWidth = Math.max(140, Math.round(Math.min(availableWidth, derivedWidth)));
  const mobileHeight =
    typeof heightPx === 'number' && Number.isFinite(heightPx)
      ? Math.max(48, Math.round(heightPx * scale))
      : null;

  const baseStyle: Record<string, unknown> = {
    ...style,
    position: 'relative',
    left: 'auto',
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    minWidth: '0px',
    margin: `${gutter}px auto 0`,
    transform: 'none',
  };

  if (mobileKind === 'media') {
    return {
      scale,
      style: {
        ...baseStyle,
        display: 'block',
        width: `${mobileWidth}px`,
        maxWidth: `${availableWidth}px`,
        ...(mobileHeight
          ? {
              height: `${mobileHeight}px`,
              minHeight: `${mobileHeight}px`,
            }
          : {
              height: 'auto',
              minHeight: '0px',
            }),
      },
    };
  }

  if (!hasExplicitWidth) {
    return {
      scale: 1,
      style: {
        ...baseStyle,
        display: mobileKind === 'container' ? 'block' : 'inline-block',
        width: mobileKind === 'container' ? '100%' : 'fit-content',
        maxWidth: `${availableWidth}px`,
        height: 'auto',
        minHeight: '0px',
      },
    };
  }

  return {
    scale,
    style: {
      ...baseStyle,
      display: 'block',
      width: `${mobileWidth}px`,
      maxWidth: `${availableWidth}px`,
      height: 'auto',
      minHeight: '0px',
    },
  };
};

const getStudioFreeBlockMobileKind = (view: t.TagView): StudioMobileKind => {
  const primaryChild = view.children.find(
    (child): child is t.TagView => child instanceof t.TagView
  );

  if (!primaryChild) {
    return 'generic';
  }

  if (primaryChild.tag === 'img' || primaryChild.tag === 'video') {
    return 'media';
  }

  if (primaryChild.tag === 'button') {
    return 'button';
  }

  if (TEXT_LIKE_TAGS.has(primaryChild.tag)) {
    return 'text';
  }

  if (CONTAINER_LIKE_TAGS.has(primaryChild.tag)) {
    return 'container';
  }

  return 'generic';
};

const parsePercentValue = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)%$/i);

  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[1] ?? '');
  return Number.isFinite(parsed) ? parsed : null;
};

const hasDirectFreeBlockChildren = (view: t.TagView) => {
  return view.children.some((child) => {
    if (!(child instanceof t.TagView)) {
      return false;
    }

    return hasStudioFreeBlockClass(toJS(child.props).className);
  });
};

const estimateFreeBlockOffset = (value: unknown, viewportHeight: number) => {
  const pxValue = readPxValue(value);

  if (typeof pxValue === 'number') {
    return pxValue;
  }

  const percentValue = parsePercentValue(value);

  if (typeof percentValue === 'number') {
    return (viewportHeight * percentValue) / 100;
  }

  return 0;
};

const estimateFreeBlockSize = (
  style: Record<string, unknown>,
  viewportHeight: number
) => {
  const heightPx = readPxValue(style.height) ?? readPxValue(style.minHeight);

  if (typeof heightPx === 'number') {
    return heightPx;
  }

  const heightPercent =
    parsePercentValue(style.height) ?? parsePercentValue(style.minHeight);

  if (typeof heightPercent === 'number') {
    return (viewportHeight * heightPercent) / 100;
  }

  return 0;
};

const computeDesktopCanvasHeight = (
  children: t.View[],
  viewportHeight: number
) => {
  let maxBottom = viewportHeight;

  children.forEach((child) => {
    if (!(child instanceof t.TagView)) {
      return;
    }

    const props = toJS(child.props) as Record<string, unknown>;
    const style = (resolveStyleValue(props.style) ?? {}) as Record<string, unknown>;
    const top = estimateFreeBlockOffset(style.top, viewportHeight);
    const height = estimateFreeBlockSize(style, viewportHeight);
    maxBottom = Math.max(maxBottom, top + height + 24);
  });

  return Math.max(viewportHeight, Math.ceil(maxBottom));
};

type RenderTagViewProps = {
  view: t.TagView;
};

const RenderTextTagView = observer((props: RenderTagViewProps) => {
  const selectorContext = React.useContext(SelectorContext);
  const onConnect = React.useMemo(
    () => selectorContext?.onConnect ?? (() => undefined),
    [selectorContext]
  );
  const domRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    const { current: dom } = domRef;

    if (!dom) {
      return;
    }

    return onConnect(dom, props.view);
  }, [onConnect, props.view]);

  return <span ref={domRef}>{String(toJS(props.view.props).value ?? '')}</span>;
});

const RenderTagView = observer((props: RenderTagViewProps) => {
  const editor = useMaybeEditor();
  const selectorContext = React.useContext(SelectorContext);
  const freeBlockResponsiveContext = React.useContext(FreeBlockResponsiveContext);
  const layoutContext = React.useContext(LayoutRenderContext);
  const onConnect = React.useMemo(
    () => selectorContext?.onConnect ?? (() => undefined),
    [selectorContext]
  );

  const domRef = React.useRef<HTMLElement | null>(null);
  const activeAnimationRef = React.useRef<Animation | null>(null);
  const rawProps = toJS(props.view.props);
  const isStudioFreeBlock = hasStudioFreeBlockClass(rawProps.className);
  const freeBlockMobileKind = isStudioFreeBlock
    ? getStudioFreeBlockMobileKind(props.view)
    : null;
  const [responsiveMetrics, setResponsiveMetrics] = React.useState(() => ({
    viewportWidth: layoutContext.viewportWidth,
    hostWidth: layoutContext.hostWidth,
  }));
  const animationConfig = readStudioAnimationConfig(rawProps as Record<string, unknown>);
  const clickActionConfig = readStudioClickActionConfig(
    rawProps as Record<string, unknown>
  );
  const animationSignature = animationConfig
    ? [
        animationConfig.preset,
        animationConfig.trigger,
        animationConfig.durationMs,
        animationConfig.delayMs,
        animationConfig.iteration,
      ].join('|')
    : '';

  React.useEffect(() => {
    const { current: dom } = domRef;

    if (!dom) {
      return;
    }

    return onConnect(dom, props.view);
  }, [onConnect, props.view]);

  const cancelAnimation = React.useCallback(() => {
    activeAnimationRef.current?.cancel();
    activeAnimationRef.current = null;
  }, []);

  React.useEffect(() => {
    return () => {
      cancelAnimation();
    };
  }, [cancelAnimation]);

  React.useEffect(() => {
    const { current: dom } = domRef;

    if (!isStudioFreeBlock) {
      return undefined;
    }

    if (layoutContext.lockResponsiveMetrics) {
      return undefined;
    }

    if (!dom) {
      return undefined;
    }

    const ownerWindow =
      dom.ownerDocument.defaultView ?? (typeof window !== 'undefined' ? window : null);
    const hostElement = dom.parentElement;

    if (!ownerWindow) {
      return undefined;
    }

    let scheduledAnimationFrame: number | null = null;

    const syncResponsiveMetrics = () => {
      const nextViewportWidth = ownerWindow.innerWidth || 1440;
      const nextHostWidth = hostElement?.clientWidth || nextViewportWidth;

      setResponsiveMetrics((current) => {
        if (
          current.viewportWidth === nextViewportWidth &&
          current.hostWidth === nextHostWidth
        ) {
          return current;
        }

        return {
          viewportWidth: nextViewportWidth,
          hostWidth: nextHostWidth,
        };
      });
    };

    const queueResponsiveSync = () => {
      if (scheduledAnimationFrame !== null) {
        ownerWindow.cancelAnimationFrame(scheduledAnimationFrame);
      }

      scheduledAnimationFrame = ownerWindow.requestAnimationFrame(() => {
        scheduledAnimationFrame = null;
        syncResponsiveMetrics();
      });
    };

    syncResponsiveMetrics();
    ownerWindow.addEventListener('resize', syncResponsiveMetrics);

    const resizeObserver =
      hostElement && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            queueResponsiveSync();
          })
        : null;

    if (hostElement && resizeObserver) {
      resizeObserver.observe(hostElement);
    }

    return () => {
      ownerWindow.removeEventListener('resize', syncResponsiveMetrics);
      resizeObserver?.disconnect();

      if (scheduledAnimationFrame !== null) {
        ownerWindow.cancelAnimationFrame(scheduledAnimationFrame);
      }
    };
  }, [
    isStudioFreeBlock,
    layoutContext.hostWidth,
    layoutContext.lockResponsiveMetrics,
    layoutContext.viewportWidth,
  ]);

  const effectiveResponsiveMetrics = layoutContext.lockResponsiveMetrics
    ? {
        viewportWidth: layoutContext.viewportWidth,
        hostWidth: layoutContext.hostWidth,
      }
    : responsiveMetrics;

  const playConfiguredAnimation = React.useCallback(() => {
    const { current: dom } = domRef;

    if (!dom || !animationConfig) {
      return;
    }

    cancelAnimation();
    activeAnimationRef.current = playStudioAnimation(dom, animationConfig);
  }, [animationConfig, cancelAnimation]);

  React.useEffect(() => {
    if (animationConfig?.trigger !== 'load') {
      return undefined;
    }

    playConfiguredAnimation();

    return () => {
      cancelAnimation();
    };
  }, [animationConfig?.trigger, animationSignature, cancelAnimation, playConfiguredAnimation]);

  const resolvedStyle = (rawProps.style
    ? resolveStyleValue(rawProps.style)
    : {}) as Record<string, unknown>;
  const freeBlockResponsiveResult = isStudioFreeBlock
    ? getResponsiveFreeBlockStyle(
        resolvedStyle,
        effectiveResponsiveMetrics.viewportWidth,
        effectiveResponsiveMetrics.hostWidth,
        freeBlockMobileKind ?? 'generic'
      )
    : null;
  const style = isStudioFreeBlock
    ? freeBlockResponsiveResult?.style ?? resolvedStyle
    : freeBlockResponsiveContext.active
      ? scaleResponsiveChildStyle(
          resolvedStyle,
          freeBlockResponsiveContext.scale
        )
      : resolvedStyle;

  if (animationConfig) {
    style.willChange = style.willChange
      ? `${style.willChange}, transform, opacity, filter`
      : 'transform, opacity, filter';
  }

  const sanitizedProps = omitStudioClickActionProps(
    omitStudioAnimationProps(rawProps as Record<string, unknown>)
  );
  const renderedClassName = isStudioFreeBlock
    ? cn(
        sanitizedProps.className as string | undefined,
        STUDIO_FREE_BLOCK_BASE_CLASSNAME,
        STUDIO_FREE_BLOCK_KIND_CLASSNAMES[freeBlockMobileKind ?? 'generic']
      )
    : (sanitizedProps.className as string | undefined);
  const hasRootFreeBlocks = layoutContext.isRoot && hasDirectFreeBlockChildren(props.view);
  const shouldUseDesktopCanvas =
    hasRootFreeBlocks &&
    Math.max(1, Math.min(layoutContext.viewportWidth, layoutContext.hostWidth)) >
      MOBILE_BREAKPOINT;
  const runClickAction = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (clickActionConfig.type === 'none') {
        return;
      }

      event.preventDefault();

      if (editor && editor.mode !== EditorMode.Preview) {
        return;
      }

      if (clickActionConfig.type === 'page') {
        const path = buildStudioPagePath(clickActionConfig.pageSlug);

        if (editor) {
          window.parent?.postMessage(
            {
              type: 'site-admin-react:studio-click-action',
              action: 'page',
              path,
              slug: clickActionConfig.pageSlug,
            },
            '*'
          );
          return;
        }

        window.location.assign(path);
        return;
      }

      if (clickActionConfig.type === 'link' && clickActionConfig.url) {
        if (editor) {
          window.parent?.postMessage(
            {
              type: 'site-admin-react:studio-click-action',
              action: 'link',
              url: clickActionConfig.url,
            },
            '*'
          );
          return;
        }

        window.location.assign(clickActionConfig.url);
      }
    },
    [clickActionConfig.pageSlug, clickActionConfig.type, clickActionConfig.url, editor]
  );

  if (props.view.tag === 'img') {
    const originalOnClick =
      typeof sanitizedProps.onClick === 'function' ? sanitizedProps.onClick : null;
    const originalOnMouseEnter =
      typeof sanitizedProps.onMouseEnter === 'function'
        ? sanitizedProps.onMouseEnter
        : null;
    const originalOnMouseLeave =
      typeof sanitizedProps.onMouseLeave === 'function'
        ? sanitizedProps.onMouseLeave
        : null;

    return (
        <img
        {...sanitizedProps}
        className={renderedClassName}
        ref={(dom) => {
          domRef.current = dom;
        }}
        style={style}
        src={String(sanitizedProps.src ?? '')}
        alt={String(sanitizedProps.alt ?? '')}
        onMouseEnter={(event) => {
          originalOnMouseEnter?.(event);

          if (animationConfig?.trigger === 'hover') {
            playConfiguredAnimation();
          }
        }}
        onMouseLeave={(event) => {
          originalOnMouseLeave?.(event);

          if (animationConfig?.trigger === 'hover') {
            cancelAnimation();
          }
        }}
        onClick={(event) => {
          originalOnClick?.(event);

          if (animationConfig?.trigger === 'click') {
            playConfiguredAnimation();
          }

          runClickAction(event);
        }}
      />
    );
  }

  let elProps = { ...sanitizedProps };

  /**
   * The renderer is responsible for implementing any and all relevant prop bindings associated with a HTML element
   *
   * Craft.js should implement all necessary prop bindings for HTML elements,
   * but for this demo in Reka, we will only implement the "value" prop binding for the input tag
   */
  Object.entries(props.view.bindings).forEach(([name, updater]) => {
    if (name === 'value' && props.view.tag === 'input') {
      elProps = {
        ...elProps,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          updater(e.target.value);
        },
      };
    }
  });

  const originalOnClick =
    typeof elProps.onClick === 'function' ? elProps.onClick : null;
  const originalOnMouseEnter =
    typeof elProps.onMouseEnter === 'function' ? elProps.onMouseEnter : null;
  const originalOnMouseLeave =
    typeof elProps.onMouseLeave === 'function' ? elProps.onMouseLeave : null;
  const baseElementProps = {
    ...elProps,
    ...(isStudioFreeBlock && freeBlockMobileKind
      ? { 'data-studio-mobile-kind': freeBlockMobileKind }
      : {}),
    className: renderedClassName,
    style,
    ref: domRef,
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      originalOnMouseEnter?.(event);

      if (animationConfig?.trigger === 'hover') {
        playConfiguredAnimation();
      }
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      originalOnMouseLeave?.(event);

      if (animationConfig?.trigger === 'hover') {
        cancelAnimation();
      }
    },
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      originalOnClick?.(event);

      if (animationConfig?.trigger === 'click') {
        playConfiguredAnimation();
      }

      runClickAction(event);
    },
  };

  if (shouldUseDesktopCanvas) {
    const freeBlockChildren: t.View[] = [];
    const regularChildren: t.View[] = [];

    props.view.children.forEach((child) => {
      if (child instanceof t.TagView) {
        const childProps = toJS(child.props) as Record<string, unknown>;

        if (hasStudioFreeBlockClass(childProps.className)) {
          freeBlockChildren.push(child);
          return;
        }
      }

      regularChildren.push(child);
    });

    const viewportWidth = Math.max(
      1,
      Math.min(layoutContext.viewportWidth, layoutContext.hostWidth)
    );
    const canvasScale = Math.min(1, viewportWidth / DESIGN_VIEWPORT_WIDTH);
    const canvasHeight = computeDesktopCanvasHeight(
      freeBlockChildren,
      layoutContext.viewportHeight
    );
    const regularChildrenContext: LayoutRenderContextType = {
      ...layoutContext,
      isRoot: false,
      responsiveScale: 1,
      lockResponsiveMetrics: false,
      hostWidth: viewportWidth,
    };
    const canvasChildrenContext: LayoutRenderContextType = {
      viewportWidth: DESIGN_VIEWPORT_WIDTH,
      viewportHeight: canvasHeight,
      hostWidth: DESIGN_VIEWPORT_WIDTH,
      responsiveScale: 1,
      isRoot: false,
      lockResponsiveMetrics: true,
    };

    return React.createElement(
      props.view.tag,
      baseElementProps,
      <>
        <LayoutRenderContext.Provider value={regularChildrenContext}>
          {regularChildren.map((child) => (
            <InternalRenderer key={child.id} view={child} />
          ))}
        </LayoutRenderContext.Provider>
        <div
          className="studio-design-canvas-host"
          style={{
            position: 'relative',
            width: '100%',
            height: `${Math.max(1, Math.round(canvasHeight * canvasScale))}px`,
            overflow: 'visible',
          }}
        >
          <div
            className="studio-design-canvas"
            style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              width: `${DESIGN_VIEWPORT_WIDTH}px`,
              minHeight: `${canvasHeight}px`,
              transform: `translateX(-50%) scale(${canvasScale})`,
              transformOrigin: 'top center',
              overflow: 'visible',
            }}
          >
            <LayoutRenderContext.Provider value={canvasChildrenContext}>
              {freeBlockChildren.map((child) => (
                <InternalRenderer key={child.id} view={child} />
              ))}
            </LayoutRenderContext.Provider>
          </div>
        </div>
      </>
    );
  }

  const interactiveElement = renderStudioInteractiveBlock({
    tag: props.view.tag,
    rawProps: sanitizedProps as Record<string, unknown>,
    baseElementProps,
    view: props.view,
    editorMode: editor?.mode,
    renderView: (view) => <InternalRenderer view={view} key={view.id} />,
  });

  if (interactiveElement) {
    if (isStudioFreeBlock && freeBlockResponsiveResult) {
      return (
        <FreeBlockResponsiveContext.Provider
          value={{
            active: true,
            scale: freeBlockResponsiveResult.scale,
            mobileKind: freeBlockMobileKind ?? 'generic',
          }}
        >
          {interactiveElement}
        </FreeBlockResponsiveContext.Provider>
      );
    }

    return interactiveElement;
  }

  const renderedElement = React.createElement(
    props.view.tag,
    baseElementProps,
    props.view.children.length > 0
      ? (
          <LayoutRenderContext.Provider
            value={{
              ...layoutContext,
              isRoot: false,
              responsiveScale: 1,
              lockResponsiveMetrics: false,
            }}
          >
            {props.view.children.map((child) => (
              <InternalRenderer view={child} key={child.key} />
            ))}
          </LayoutRenderContext.Provider>
        )
      : undefined
  );

  if (isStudioFreeBlock && freeBlockResponsiveResult) {
    return (
      <FreeBlockResponsiveContext.Provider
        value={{
          active: true,
          scale: freeBlockResponsiveResult.scale,
          mobileKind: freeBlockMobileKind ?? 'generic',
        }}
      >
        {renderedElement}
      </FreeBlockResponsiveContext.Provider>
    );
  }

  return renderedElement;
});

type RenderSlotViewProps = {
  view: t.SlotView;
};

export const RenderSlotView = observer((props: RenderSlotViewProps) => {
  const componentContext = React.useContext(ComponentContext);
  const parentComponent = componentContext?.parentComponent;

  const activeComponentEditor = useEditorActiveComponent();

  return (
    <SlotContext.Provider value={{ parentComponent }}>
      <SelectorContext.Provider
        value={{
          onConnect: (dom, view) => {
            if (!parentComponent) {
              if (props.view.children.indexOf(view) > -1) {
                return activeComponentEditor.connectTplDOM(
                  dom,
                  props.view.template,
                  true
                );
              }

              return;
            }

            return activeComponentEditor.connectTplDOM(
              dom,
              view.template,
              true
            );
          },
        }}
      >
        {props.view.children.map((v) => (
          <InternalRenderer key={v.id} view={v} />
        ))}
      </SelectorContext.Provider>
    </SlotContext.Provider>
  );
});

type RenderExternalComponentViewProps = {
  view: t.ExternalComponentView;
};

const RenderExternalComponentView = observer(
  (props: RenderExternalComponentViewProps) => {
    const selectorContext = React.useContext(SelectorContext);
    const onConnect = React.useMemo(
      () => selectorContext?.onConnect ?? (() => undefined),
      [selectorContext]
    );

    const domRef = React.useRef<HTMLElement | null>(null);
    const rawProps = toJS(props.view.props);

    React.useEffect(() => {
      const { current: dom } = domRef;

      if (!dom) {
        return;
      }

      return onConnect(dom, props.view);
    }, [onConnect, props.view]);

    return React.cloneElement(
      props.view.component.render({
        ...rawProps,
        children: props.view.children.map((child) => (
          <InternalRenderer key={child.id} view={child} />
        )),
      }),
      {
        ref: domRef,
      }
    );
  }
);

type RenderComponentViewProps = {
  view: t.ComponentView;
};

const RenderComponentView = observer((props: RenderComponentViewProps) => {
  const componentContext = React.useContext(ComponentContext);
  const slotContext = React.useContext(SlotContext);

  const activeComponentEditor = useEditorActiveComponent();

  return (
    <SelectorContext.Provider
      value={{
        onConnect: (dom, view) => {
          if (!componentContext) {
            return activeComponentEditor.connectTplDOM(
              dom,
              view.template,
              true
            );
          }

          if (
            slotContext?.parentComponent !== componentContext.root &&
            componentContext.component !== componentContext.root
          ) {
            return;
          }

          if (
            props.view instanceof t.ExternalComponentView &&
            slotContext &&
            componentContext.parentComponent !== slotContext.parentComponent
          ) {
            return;
          }

          return activeComponentEditor.connectTplDOM(
            dom,
            view.template,
            true
          );
        },
      }}
    >
      <ComponentContext.Provider
        value={{
          root: componentContext?.root ?? props.view.component,
          parentComponent: componentContext?.component,
          component: props.view.component,
        }}
      >
        {props.view instanceof t.ExternalComponentView ? (
          <RenderExternalComponentView view={props.view} />
        ) : props.view instanceof t.RekaComponentView ? (
          props.view.render.map((r) => <InternalRenderer view={r} key={r.id} />)
        ) : null}
      </ComponentContext.Provider>
    </SelectorContext.Provider>
  );
});

type RendererProps = {
  view: t.View;
};

const InternalRenderer = observer((props: RendererProps) => {
  const view = props.view;

  if (view instanceof t.TagView) {
    if (view.tag === 'text') {
      return <RenderTextTagView key={`text:${view.id}`} view={view} />;
    }

    return <RenderTagView key={`tag:${view.id}:${view.tag}`} view={view} />;
  }

  if (view instanceof t.ComponentView) {
    return <RenderComponentView view={view} />;
  }

  if (view instanceof t.ErrorSystemView) {
    return <RenderErrorView view={view} />;
  }

  if (view instanceof t.SlotView) {
    return <RenderSlotView view={view} />;
  }

  if (view instanceof t.FragmentView || view instanceof t.FrameView) {
    return (
      <React.Fragment>
        {view.children.map((child) => (
          <InternalRenderer key={child.id} view={child} />
        ))}
      </React.Fragment>
    );
  }

  return null;
});

export const Renderer = observer((props: RendererProps) => {
  const view = props.view;
  const [viewportMetrics, setViewportMetrics] = React.useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : DESIGN_VIEWPORT_WIDTH,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  }));

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncViewportMetrics = () => {
      setViewportMetrics((current) => {
        const next = {
          width: window.innerWidth || DESIGN_VIEWPORT_WIDTH,
          height: window.innerHeight || 900,
        };

        if (current.width === next.width && current.height === next.height) {
          return current;
        }

        return next;
      });
    };

    syncViewportMetrics();
    window.addEventListener('resize', syncViewportMetrics);

    return () => {
      window.removeEventListener('resize', syncViewportMetrics);
    };
  }, []);

  return (
    <LayoutRenderContext.Provider
      value={{
        viewportWidth: viewportMetrics.width,
        viewportHeight: viewportMetrics.height,
        hostWidth: viewportMetrics.width,
        responsiveScale: 1,
        isRoot: true,
        lockResponsiveMetrics: false,
      }}
    >
      <InternalRenderer view={view} />
    </LayoutRenderContext.Provider>
  );
});
