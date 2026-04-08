import { DragHandleDots2Icon, LayersIcon } from '@radix-ui/react-icons';
import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useEditor } from '@app/editor';
import { cn } from '@app/utils';
import RenderView from '@/siteAdmin/editor/render/RenderView';

type DropPosition = 'before' | 'after';

type DragState = {
  draggedTemplateId: string | null;
  overTemplateId: string | null;
  position: DropPosition | null;
};

const PREVIEW_TARGET_WIDTH = 96;
const PREVIEW_MIN_HEIGHT = 48;
const PREVIEW_MAX_HEIGHT = 64;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const collectTemplateTokens = (
  template: t.Template,
  tokens: string[] = []
) => {
  if (template instanceof t.ComponentTemplate) {
    tokens.push(template.component.name);
  } else if (template instanceof t.TagTemplate) {
    if (template.tag !== 'div' && template.tag !== 'text') {
      tokens.push(template.tag);
    }
  }

  if ('children' in template && Array.isArray(template.children)) {
    template.children.forEach((child) => {
      collectTemplateTokens(child, tokens);
    });
  }

  return tokens;
};

const getTemplateTitle = (template: t.Template) => {
  if (template instanceof t.ComponentTemplate) {
    return template.component.name;
  }

  if (template instanceof t.TagTemplate) {
    return template.tag;
  }

  if (template instanceof t.FragmentTemplate) {
    return 'Fragment';
  }

  if (template instanceof t.SlotTemplate) {
    return 'Slot';
  }

  return template.type;
};

const getTemplateSubtitle = (template: t.Template) => {
  if (template instanceof t.ComponentTemplate) {
    return 'Reusable component';
  }

  if (template instanceof t.TagTemplate) {
    const className =
      template.props.className instanceof t.Literal
        ? String(template.props.className.value ?? '').trim()
        : '';

    if (!className) {
      return 'HTML block';
    }

    return className
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 5)
      .join(' ');
  }

  if (template instanceof t.FragmentTemplate) {
    return 'Grouped block';
  }

  if (template instanceof t.SlotTemplate) {
    return 'Slot content';
  }

  return template.type;
};

const getViewChildren = (view: t.View) => {
  const nextChildren: t.View[] = [];

  if ('children' in view && Array.isArray(view.children)) {
    nextChildren.push(...view.children);
  }

  if (view instanceof t.RekaComponentView && Array.isArray(view.render)) {
    nextChildren.push(...view.render);
  }

  return nextChildren;
};

const findViewByTemplateId = (
  view: t.View | null | undefined,
  templateId: string
): t.View | null => {
  if (!view) {
    return null;
  }

  if (view.template?.id === templateId) {
    return view;
  }

  for (const child of getViewChildren(view)) {
    const match = findViewByTemplateId(child, templateId);

    if (match) {
      return match;
    }
  }

  return null;
};

const getTemplatePreviewDom = (
  activeFrame:
    | NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>['activeFrame']
    | null,
  template: t.Template
) => {
  return [...(activeFrame?.tplElements.get(template) ?? [])][0] ?? null;
};

const getDropPosition = (
  event: React.DragEvent<HTMLDivElement>
): DropPosition => {
  const rect = event.currentTarget.getBoundingClientRect();

  return event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
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

const readClassName = (template: t.TagTemplate) =>
  readLiteralString(template.props.className);

const isFreeBlockTemplate = (template: t.Template) => {
  if (!(template instanceof t.TagTemplate)) {
    return false;
  }

  return readClassName(template).split(/\s+/).includes('studio-free-block');
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

const setStyleLiteral = (template: t.Template, key: string, value: string) => {
  const style = ensureStyleExpression(template);

  if (!style) {
    return;
  }

  style.properties[key] = t.literal({ value });
};

type FreeBlockLayoutSnapshot = {
  baseTop: number;
  gap: number;
  metricsByTemplateId: Map<
    string,
    {
      height: number;
    }
  >;
};

const createFreeBlockLayoutSnapshot = (
  rootTemplate: t.SlottableTemplate,
  activeFrame:
    | NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>['activeFrame']
    | null
) => {
  if (
    rootTemplate.children.length < 2 ||
    rootTemplate.children.some((child) => !isFreeBlockTemplate(child))
  ) {
    return null;
  }

  const rootDom = getTemplatePreviewDom(activeFrame, rootTemplate);

  if (!rootDom) {
    return null;
  }

  const rootRect = rootDom.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(rootDom);
  const borderTop = Number.parseFloat(computedStyle.borderTopWidth ?? '0');
  const metrics = rootTemplate.children
    .map((child) => {
      const dom = getTemplatePreviewDom(activeFrame, child);

      if (!dom) {
        return null;
      }

      const rect = dom.getBoundingClientRect();

      return {
        id: child.id,
        top:
          rect.top -
          rootRect.top -
          (Number.isFinite(borderTop) ? borderTop : 0) +
          rootDom.scrollTop,
        height: rect.height,
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    top: number;
    height: number;
  }>;

  if (metrics.length !== rootTemplate.children.length) {
    return null;
  }

  const orderedMetrics = [...metrics].sort((a, b) => a.top - b.top);
  const gaps = orderedMetrics
    .slice(1)
    .map((metric, index) => {
      const previous = orderedMetrics[index];
      return metric.top - (previous.top + previous.height);
    })
    .filter((gap) => Number.isFinite(gap) && gap >= 0 && gap <= 160);

  const averageGap =
    gaps.length > 0
      ? gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length
      : 28;

  return {
    baseTop: orderedMetrics[0]?.top ?? 0,
    gap: clamp(averageGap, 16, 40),
    metricsByTemplateId: new Map(
      metrics.map((metric) => [
        metric.id,
        {
          height: metric.height,
        },
      ])
    ),
  };
};

const applyFreeBlockVerticalLayout = (
  rootTemplate: t.SlottableTemplate,
  snapshot: FreeBlockLayoutSnapshot | null
) => {
  if (!snapshot) {
    return;
  }

  let nextTop = snapshot.baseTop;

  rootTemplate.children.forEach((child) => {
    const metrics = snapshot.metricsByTemplateId.get(child.id);

    if (!metrics) {
      return;
    }

    setStyleLiteral(child, 'position', 'absolute');
    setStyleLiteral(child, 'top', `${Math.round(nextTop)}px`);
    nextTop += metrics.height + snapshot.gap;
  });
};

const moveRootTemplateRelative = (
  rootTemplate: t.SlottableTemplate,
  templateId: string,
  targetTemplateId: string,
  position: DropPosition
) => {
  const sourceIndex = rootTemplate.children.findIndex(
    (child) => child.id === templateId
  );
  const targetIndex = rootTemplate.children.findIndex(
    (child) => child.id === targetTemplateId
  );

  if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
    return null;
  }

  const draggedTemplate = rootTemplate.children[sourceIndex];

  if (!draggedTemplate) {
    return null;
  }

  rootTemplate.children.splice(sourceIndex, 1);

  let insertionIndex = position === 'before' ? targetIndex : targetIndex + 1;

  if (sourceIndex < targetIndex) {
    insertionIndex -= 1;
  }

  rootTemplate.children.splice(
    Math.max(0, Math.min(insertionIndex, rootTemplate.children.length)),
    0,
    draggedTemplate
  );

  return draggedTemplate;
};

const copyComputedStyles = (source: Element, clone: Element) => {
  const sourceStyle = window.getComputedStyle(source);
  const cloneStyle = (clone as HTMLElement).style;

  for (const property of Array.from(sourceStyle)) {
    cloneStyle.setProperty(
      property,
      sourceStyle.getPropertyValue(property),
      sourceStyle.getPropertyPriority(property)
    );
  }

  clone.removeAttribute('id');

  const sourceChildren = Array.from(source.children);
  const cloneChildren = Array.from(clone.children);

  sourceChildren.forEach((sourceChild, index) => {
    const cloneChild = cloneChildren[index];

    if (!cloneChild) {
      return;
    }

    copyComputedStyles(sourceChild, cloneChild);
  });
};

const sanitizeClonedTree = (root: HTMLElement) => {
  root.querySelectorAll('*').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    node.removeAttribute('id');
    node.removeAttribute('contenteditable');
    node.style.pointerEvents = 'none';
    node.style.userSelect = 'none';
    node.style.caretColor = 'transparent';
    node.style.animation = 'none';
    node.style.transition = 'none';
  });
};

type StaticTemplatePreviewProps = {
  sourceDom: HTMLElement | null;
  fallbackView: t.View | null;
};

const StaticTemplatePreview = ({ sourceDom, fallbackView }: StaticTemplatePreviewProps) => {
  const previewDomRef = React.useRef<HTMLDivElement | null>(null);
  const [previewMetrics, setPreviewMetrics] = React.useState<{
    scale: number;
    width: number;
    height: number;
  } | null>(null);

  const sourceSignature = sourceDom?.outerHTML ?? null;

  React.useLayoutEffect(() => {
    const host = previewDomRef.current;

    if (!host) {
      return;
    }

    host.innerHTML = '';
    setPreviewMetrics(null);

    if (!sourceDom || typeof window === 'undefined') {
      return;
    }

    const rect = sourceDom.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const clonedDom = sourceDom.cloneNode(true) as HTMLElement;
    copyComputedStyles(sourceDom, clonedDom);
    sanitizeClonedTree(clonedDom);
    clonedDom.style.margin = '0';
    clonedDom.style.pointerEvents = 'none';
    clonedDom.style.userSelect = 'none';

    const scale = Math.min(1, PREVIEW_TARGET_WIDTH / Math.max(rect.width, 1));

    setPreviewMetrics({
      scale,
      width: rect.width,
      height: clamp(rect.height * scale, PREVIEW_MIN_HEIGHT, PREVIEW_MAX_HEIGHT),
    });

    host.appendChild(clonedDom);

    return () => {
      host.innerHTML = '';
    };
  }, [sourceDom, sourceSignature]);

  if (!sourceDom || !previewMetrics) {
    if (!fallbackView) {
      return (
        <div className="flex h-full items-center justify-center px-4 text-center text-[11px] text-slate-400">
          Preview unavailable
        </div>
      );
    }

    return (
      <div className="h-full overflow-hidden">
        <div
          className="pointer-events-none origin-top-left"
          style={{
            transform: `scale(${0.18})`,
            width: `${100 / 0.18}%`,
            minHeight: `${PREVIEW_MIN_HEIGHT / 0.18}px`,
          }}
        >
          <RenderView view={fallbackView} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-hidden"
      style={{ height: previewMetrics.height }}
    >
      <div
        ref={previewDomRef}
        className="origin-top-left"
        style={{
          transform: `scale(${previewMetrics.scale})`,
          width: previewMetrics.width,
          transformOrigin: 'top left',
        }}
      />
    </div>
  );
};

type ComponentOrderRowProps = {
  index: number;
  template: t.Template;
  previewDom: HTMLElement | null;
  previewView: t.View | null;
  tokens: string[];
  isSelected: boolean;
  dragState: DragState;
  onDragStateChange: (state: DragState) => void;
  onDragStateReset: () => void;
  onDropTemplate: (targetTemplateId: string, position: DropPosition) => void;
  onSelect: (template: t.Template) => void;
};

const ComponentOrderRow = observer((props: ComponentOrderRowProps) => {
  const rowRef = React.useRef<HTMLDivElement | null>(null);
  const dragGhostRef = React.useRef<HTMLDivElement | null>(null);
  const isDragged = props.dragState.draggedTemplateId === props.template.id;
  const isDropTarget =
    props.dragState.draggedTemplateId !== props.template.id &&
    props.dragState.overTemplateId === props.template.id;

  const cleanupDragGhost = React.useCallback(() => {
    dragGhostRef.current?.remove();
    dragGhostRef.current = null;
  }, []);

  React.useEffect(() => {
    return () => {
      cleanupDragGhost();
    };
  }, [cleanupDragGhost]);

  return (
    <div className="relative">
      {isDropTarget && props.dragState.position === 'before' ? (
        <div className="absolute -top-2 left-3 right-3 z-20 flex items-center gap-2">
          <div className="h-[3px] flex-1 rounded-full bg-primary" />
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            Drop Here
          </span>
          <div className="h-[3px] flex-1 rounded-full bg-primary" />
        </div>
      ) : null}
      {isDropTarget && props.dragState.position === 'after' ? (
        <div className="absolute -bottom-2 left-3 right-3 z-20 flex items-center gap-2">
          <div className="h-[3px] flex-1 rounded-full bg-primary" />
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            Drop Here
          </span>
          <div className="h-[3px] flex-1 rounded-full bg-primary" />
        </div>
      ) : null}

      <div
        ref={rowRef}
        className={cn(
          'group relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm transition-all',
          {
            'border-primary ring-2 ring-primary/15': props.isSelected,
            'opacity-60': isDragged,
          }
        )}
        draggable
        onClick={() => {
          props.onSelect(props.template);
        }}
        onDragStart={(event) => {
          const currentRow = rowRef.current;

          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('text/plain', props.template.id);
          props.onDragStateChange({
            draggedTemplateId: props.template.id,
            overTemplateId: null,
            position: null,
          });

          cleanupDragGhost();

          if (!currentRow || typeof window === 'undefined') {
            return;
          }

          const rect = currentRow.getBoundingClientRect();
          const dragGhost = currentRow.cloneNode(true) as HTMLDivElement;

          dragGhost.style.width = `${rect.width}px`;
          dragGhost.style.height = `${rect.height}px`;
          dragGhost.style.boxSizing = 'border-box';
          dragGhost.style.position = 'fixed';
          dragGhost.style.top = '0';
          dragGhost.style.left = '0';
          dragGhost.style.transform = 'translate(-200vw, -200vh)';
          dragGhost.style.pointerEvents = 'none';
          dragGhost.style.margin = '0';
          dragGhost.style.opacity = '1';
          dragGhost.style.zIndex = '9999';

          document.body.appendChild(dragGhost);
          dragGhostRef.current = dragGhost;

          event.dataTransfer.setDragImage(
            dragGhost,
            event.clientX - rect.left,
            event.clientY - rect.top
          );
        }}
        onDragEnd={() => {
          cleanupDragGhost();
          props.onDragStateReset();
        }}
        onDragOver={(event) => {
          if (props.dragState.draggedTemplateId === props.template.id) {
            return;
          }

          event.preventDefault();
          props.onDragStateChange({
            draggedTemplateId: props.dragState.draggedTemplateId,
            overTemplateId: props.template.id,
            position: getDropPosition(event),
          });
        }}
        onDrop={(event) => {
          if (props.dragState.draggedTemplateId === props.template.id) {
            return;
          }

          event.preventDefault();
          props.onDropTemplate(props.template.id, getDropPosition(event));
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative h-[64px] w-[96px] flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner">
            <StaticTemplatePreview
              sourceDom={props.previewDom}
              fallbackView={props.previewView}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Section {props.index + 1}
                </div>
                <div className="mt-0.5 truncate text-xs font-semibold text-slate-900">
                  {getTemplateTitle(props.template)}
                </div>
                <div className="mt-0.5 max-h-8 overflow-hidden text-[11px] leading-4 text-slate-500">
                  {getTemplateSubtitle(props.template)}
                </div>

                {props.tokens.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {props.tokens.slice(0, 4).map((token, index) => (
                      <span
                        key={`${token}-${index}`}
                        className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {token}
                      </span>
                    ))}
                    {props.tokens.length > 4 ? (
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        +{props.tokens.length - 4}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                <DragHandleDots2Icon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const ComponentOrderTool = observer(() => {
  const editor = useEditor();
  const [dragState, setDragState] = React.useState<DragState>({
    draggedTemplateId: null,
    overTemplateId: null,
    position: null,
  });

  const componentEditor = editor.activeComponentEditor;

  if (
    !componentEditor ||
    !(componentEditor.component instanceof t.RekaComponent) ||
    !(componentEditor.component.template instanceof t.SlottableTemplate)
  ) {
    return (
      <div className="px-5 py-5 text-sm text-slate-500">
        This tool is available for editable components with child sections.
      </div>
    );
  }

  const rootTemplate = componentEditor.component.template;
  const templates = rootTemplate.children;
  const frameView = componentEditor.activeFrame?.state.view ?? null;

  const resetDragState = () => {
    setDragState({
      draggedTemplateId: null,
      overTemplateId: null,
      position: null,
    });
  };

  const handleDropTemplate = (
    targetTemplateId: string,
    position: DropPosition
  ) => {
    if (!dragState.draggedTemplateId) {
      resetDragState();
      return;
    }

    let movedTemplate: t.Template | null = null;
    const freeBlockLayoutSnapshot = createFreeBlockLayoutSnapshot(
      rootTemplate,
      componentEditor.activeFrame ?? null
    );

    editor.reka.change(() => {
      movedTemplate = moveRootTemplateRelative(
        rootTemplate,
        dragState.draggedTemplateId as string,
        targetTemplateId,
        position
      );

      applyFreeBlockVerticalLayout(rootTemplate, freeBlockLayoutSnapshot);
    });

    resetDragState();

    if (!movedTemplate) {
      return;
    }

    componentEditor.setTplEvent('selected', movedTemplate);
    componentEditor.setTplEvent('hovered', null);
    componentEditor.activeFrame?.state.compute(true);
  };

  if (templates.length === 0) {
    return (
      <div className="px-5 py-5 text-sm text-slate-500">
        No top-level sections found in this component yet.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-2 pt-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <LayersIcon />
          <span>Component Order</span>
        </div>
        <p className="mt-1 text-[11px] leading-4 text-slate-500">
          Compact ordering list with preview and component labels.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-auto px-5 pb-5">
        {templates.map((template, index) => (
          <ComponentOrderRow
            key={template.id}
            index={index}
            template={template}
            previewDom={getTemplatePreviewDom(
              componentEditor.activeFrame ?? null,
              template
            )}
            previewView={findViewByTemplateId(frameView, template.id)}
            tokens={Array.from(new Set(collectTemplateTokens(template))).slice(0, 8)}
            isSelected={componentEditor.tplEvent.selected?.id === template.id}
            dragState={dragState}
            onDragStateChange={setDragState}
            onDragStateReset={resetDragState}
            onDropTemplate={handleDropTemplate}
            onSelect={(nextTemplate) => {
              componentEditor.setTplEvent('selected', nextTemplate);
              componentEditor.setTplEvent('hovered', null);
            }}
          />
        ))}
      </div>
    </div>
  );
});
