import { useApolloClient, useQuery } from '@apollo/client';
import { CheckIcon, Cross2Icon, MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@app/components/button';
import { useEditor } from '@app/editor';
import { cn } from '@app/utils';
import { getPageSizeTarget } from '@app/components/frame/pageSizeTarget';
import { SITE_COMPONENT, SITE_COMPONENTS } from '@/graphql/queries/siteComponents';
import { createComponentFromSchemaJson } from '@/siteAdmin/editor/rekaBlocks';
import { useToastStore } from '@/siteAdmin/store/useToastStore';

type InsertComponentBrowserProps = {
  isOpen: boolean;
  onClose: () => void;
  targetTemplate: t.Template;
  targetLabel: string;
};

type ReadyComponentItem = {
  id: number;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  image?: string | null;
  priority?: number | null;
};

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

const removeStyleLiteral = (template: t.Template, key: string) => {
  const style = ensureStyleExpression(template);

  if (!style) {
    return;
  }

  delete style.properties[key];
};

const readResolvedStylePx = (template: t.Template, key: string) => {
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

  const pxMatch = rawValue.match(/^(-?\d+(?:\.\d+)?)px$/i);

  if (pxMatch) {
    const parsed = Number.parseFloat(pxMatch[1]);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const parsed = Number.parseFloat(rawValue);
  return Number.isFinite(parsed) ? parsed : null;
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

const findNearestFreeBlockTemplate = (
  editor: ReturnType<typeof useEditor>,
  template: t.Template
) => {
  let current: t.Template | null = template;

  while (current) {
    if (
      current instanceof t.TagTemplate &&
      current instanceof t.SlottableTemplate &&
      isFreeBlockTemplate(current)
    ) {
      return current;
    }

    current = safeGetParentTemplate(editor, current);
  }

  return null;
};

const schedulePageExtension = (
  editor: ReturnType<typeof useEditor>,
  insertedTemplate: t.Template,
  minBottomGap = 56
) => {
  const extend = () => {
    const activeFrame = editor.activeComponentEditor?.activeFrame;
    const iframe = editor.iframe;
    const rootTemplate =
      editor.activeComponentEditor?.component instanceof t.RekaComponent
        ? editor.activeComponentEditor.component.template
        : null;

    if (!activeFrame || !iframe) {
      return;
    }

    const pageTarget = getPageSizeTarget(
      activeFrame,
      iframe,
      rootTemplate
    );
    const insertedDom = getTemplatePrimaryDom(activeFrame, insertedTemplate);

    if (!pageTarget || !insertedDom) {
      return;
    }

    const overflowAmount =
      insertedDom.getBoundingClientRect().bottom -
      pageTarget.dom.getBoundingClientRect().bottom +
      minBottomGap;

    if (overflowAmount <= 0) {
      return;
    }

    const currentHeight =
      readResolvedStylePx(pageTarget.template, 'minHeight') ??
      readResolvedStylePx(pageTarget.template, 'height') ??
      pageTarget.dom.offsetHeight;

    editor.reka.change(() => {
      removeStyleLiteral(pageTarget.template, 'height');
      setStyleLiteral(
        pageTarget.template,
        'minHeight',
        `${Math.round(currentHeight + overflowAmount)}px`
      );
      setStyleLiteral(pageTarget.template, 'overflow', 'visible');
    });
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(extend);
  });
};

const insertTemplateBelowFreeBlock = (
  editor: ReturnType<typeof useEditor>,
  targetTemplate: t.Template,
  templateToInsert: t.Template
) => {
  const activeFrame = editor.activeComponentEditor?.activeFrame;
  const iframe = editor.iframe;
  const rootTemplate =
    editor.activeComponentEditor?.component instanceof t.RekaComponent
      ? editor.activeComponentEditor.component.template
      : null;
  const freeBlockTarget = findNearestFreeBlockTemplate(editor, targetTemplate);

  if (!activeFrame || !iframe || !freeBlockTarget) {
    return null;
  }

  const freeBlockParent = safeGetParentTemplate(editor, freeBlockTarget);

  if (!(freeBlockParent instanceof t.SlottableTemplate)) {
    return null;
  }

  const anchorDom = getTemplatePrimaryDom(activeFrame, freeBlockTarget);
  const hostDom = getTemplatePrimaryDom(activeFrame, freeBlockParent);

  if (!anchorDom || !hostDom) {
    return null;
  }

  const hostRect = hostDom.getBoundingClientRect();
  const anchorRect = anchorDom.getBoundingClientRect();
  const hostComputedStyle = window.getComputedStyle(hostDom);
  const hostBorderLeft = Number.parseFloat(hostComputedStyle.borderLeftWidth ?? '0');
  const hostBorderTop = Number.parseFloat(hostComputedStyle.borderTopWidth ?? '0');
  const left = Math.max(
    0,
    anchorRect.left -
      hostRect.left -
      (Number.isFinite(hostBorderLeft) ? hostBorderLeft : 0) +
      hostDom.scrollLeft
  );
  const top = Math.max(
    0,
    anchorRect.bottom -
      hostRect.top -
      (Number.isFinite(hostBorderTop) ? hostBorderTop : 0) +
      hostDom.scrollTop +
      28
  );
  const availableWidth = Math.max(280, hostDom.clientWidth - left - 24);
  const wrapperWidth = Math.max(
    320,
    Math.min(Math.round(anchorRect.width), availableWidth)
  );
  const wrapper = t.tagTemplate({
    tag: 'div',
    props: {
      className: t.literal({
        value: 'studio-free-block',
      }),
    },
    children: [templateToInsert],
  });

  let didInsert = false;

  editor.reka.change(() => {
    const targetIndex = freeBlockParent.children.indexOf(freeBlockTarget);

    if (targetIndex === -1) {
      return;
    }

    freeBlockParent.children.splice(targetIndex + 1, 0, wrapper);
    didInsert = true;

    if (freeBlockParent instanceof t.TagTemplate) {
      const currentPosition =
        freeBlockParent.props.style instanceof t.ObjectExpression &&
        freeBlockParent.props.style.properties.position instanceof t.Literal
          ? String(freeBlockParent.props.style.properties.position.value ?? '')
          : '';

      if (!currentPosition || currentPosition === 'static') {
        setStyleLiteral(freeBlockParent, 'position', 'relative');
      }

      setStyleLiteral(freeBlockParent, 'overflow', 'visible');
    }

    setStyleLiteral(wrapper, 'position', 'absolute');
    setStyleLiteral(wrapper, 'left', `${Math.round(left)}px`);
    setStyleLiteral(wrapper, 'top', `${Math.round(top)}px`);
    setStyleLiteral(wrapper, 'width', `${Math.round(wrapperWidth)}px`);
    setStyleLiteral(wrapper, 'display', 'block');
    setStyleLiteral(wrapper, 'zIndex', '20');
    setStyleLiteral(wrapper, 'maxWidth', '100%');
    setStyleLiteral(wrapper, 'boxSizing', 'border-box');
    setStyleLiteral(wrapper, 'overflowWrap', 'break-word');

    if (templateToInsert instanceof t.TagTemplate) {
      setStyleLiteral(templateToInsert, 'maxWidth', '100%');
      setStyleLiteral(templateToInsert, 'boxSizing', 'border-box');
    }

    const pageTarget = getPageSizeTarget(
      activeFrame,
      iframe,
      rootTemplate
    );
    const estimatedBottom = top + Math.max(anchorRect.height, 320) + 64;

    if (pageTarget && estimatedBottom > pageTarget.dom.offsetHeight) {
      const currentHeight =
        readResolvedStylePx(pageTarget.template, 'minHeight') ??
        readResolvedStylePx(pageTarget.template, 'height') ??
        pageTarget.dom.offsetHeight;

      removeStyleLiteral(pageTarget.template, 'height');
      setStyleLiteral(
        pageTarget.template,
        'minHeight',
        `${Math.round(Math.max(currentHeight, estimatedBottom))}px`
      );
      setStyleLiteral(pageTarget.template, 'overflow', 'visible');
    }
  });

  if (!didInsert) {
    return null;
  }

  schedulePageExtension(editor, wrapper);

  return wrapper;
};

const ComponentPreviewCard = ({
  component,
  selected,
  onSelect,
}: {
  component: ReadyComponentItem;
  selected: boolean;
  onSelect: () => void;
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);
  const imageSrc = typeof component?.image === 'string' ? component.image.trim() : '';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group overflow-hidden rounded-[18px] border bg-white text-left transition',
        selected
          ? 'border-slate-900 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.45)]'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-slate-200 bg-slate-100">
        {imageSrc && !imageFailed ? (
          <img
            src={imageSrc}
            alt={component.title || 'Component preview'}
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-between bg-[linear-gradient(140deg,#111827_0%,#1f2937_45%,#334155_100%)] p-4 text-white">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/10">
              <PlusIcon />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                Component Preview
              </div>
              <div className="mt-2 text-[15px] font-semibold leading-5">
                {component.title || component.slug || `Component #${component.id}`}
              </div>
            </div>
          </div>
        )}
        {selected ? (
          <div className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
            <CheckIcon />
          </div>
        ) : null}
      </div>
      <div className="space-y-2 px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[13px] font-semibold text-slate-900">
              {component.title || component.slug || `Component #${component.id}`}
            </div>
            <div className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">
              {component.description || 'Ready-made component block that can be inserted below the selected section.'}
            </div>
          </div>
        </div>
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Ready Component
        </div>
      </div>
    </button>
  );
};

export const InsertComponentBrowser = observer(
  ({ isOpen, onClose, targetTemplate, targetLabel }: InsertComponentBrowserProps) => {
    const editor = useEditor();
    const apollo = useApolloClient();
    const addToast = useToastStore((state) => state.addToast);
    const [search, setSearch] = React.useState('');
    const [selectedComponentId, setSelectedComponentId] = React.useState('');
    const [isInserting, setIsInserting] = React.useState(false);

    const portalTarget = typeof document !== 'undefined' ? document.body : null;

    const componentsQuery = useQuery(SITE_COMPONENTS, {
      variables: { first: 100, after: null },
      skip: !isOpen,
      fetchPolicy: 'network-only',
    });

    React.useEffect(() => {
      if (!isOpen) {
        setSearch('');
        setSelectedComponentId('');
      }
    }, [isOpen]);

    const readyComponents = React.useMemo(() => {
      const edges = componentsQuery.data?.siteComponents?.edges ?? [];
      const list = edges
        .map((edge: { node?: ReadyComponentItem | null }) => edge?.node)
        .filter(Boolean)
        .sort(
          (a: ReadyComponentItem, b: ReadyComponentItem) =>
            (a.priority ?? 0) - (b.priority ?? 0)
        );

      if (!search.trim()) {
        return list;
      }

      const normalizedSearch = search.trim().toLowerCase();

      return list.filter((item: ReadyComponentItem) => {
        const haystack = [
          item?.title,
          item?.slug,
          item?.description,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedSearch);
      });
    }, [componentsQuery.data, search]);

    const handleInsert = React.useCallback(async () => {
      if (!selectedComponentId) {
        return;
      }

      try {
        setIsInserting(true);

        const result = await apollo.query({
          query: SITE_COMPONENT,
          variables: { id: Number(selectedComponentId) },
          fetchPolicy: 'network-only',
        });

        const siteComponent = result.data?.siteComponent;
        const component =
          createComponentFromSchemaJson(siteComponent?.componentData, editor.reka) ??
          createComponentFromSchemaJson(siteComponent?.component, editor.reka) ??
          createComponentFromSchemaJson(siteComponent, editor.reka);

        if (!component) {
          addToast({
            kind: 'error',
            title: 'Browse Components',
            subTitle: 'Component schema not found.',
          });
          return;
        }

        let node: t.ComponentTemplate | null = null;
        let insertedTemplate: t.Template | null = null;

        editor.reka.change(() => {
          const program = editor.reka.state?.program?.components;

          if (!Array.isArray(program)) {
            return;
          }

          program.push(component);

          insertedTemplate =
            component.template instanceof t.Template
              ? (t.clone(component.template, {
                  replaceExistingId: true,
                }) as t.Template)
              : null;

          node = t.componentTemplate({
            component: t.identifier({
              name: component.name,
              external: false,
            }),
            props: {},
            children: [],
          });
        });

        const templateToInsert = insertedTemplate ?? node;

        if (!templateToInsert) {
          addToast({
            kind: 'error',
            title: 'Browse Components',
            subTitle: 'The component could not be inserted below the current section.',
          });
          return;
        }

        const positionedTemplate =
          insertTemplateBelowFreeBlock(editor, targetTemplate, templateToInsert) ??
          null;

        let selectedTemplate: t.Template | null = positionedTemplate;
        let didInsert = positionedTemplate !== null;

        if (!didInsert) {
          editor.reka.change(() => {
            const parent = safeGetParentTemplate(editor, targetTemplate);

            if (parent instanceof t.SlottableTemplate) {
              const targetIndex = parent.children.indexOf(targetTemplate);

              if (targetIndex !== -1) {
                parent.children.splice(targetIndex + 1, 0, templateToInsert);
                didInsert = true;
                selectedTemplate = templateToInsert;
                return;
              }
            }

            if (targetTemplate instanceof t.SlottableTemplate) {
              targetTemplate.children.push(templateToInsert);
              didInsert = true;
              selectedTemplate = templateToInsert;
            }
          });
        }

        if (!didInsert || !selectedTemplate) {
          addToast({
            kind: 'error',
            title: 'Browse Components',
            subTitle: 'The component could not be inserted below the current section.',
          });
          return;
        }

        editor.activeComponentEditor?.setTplEvent('selected', selectedTemplate);

        addToast({
          kind: 'success',
          title: 'Component Added',
          subTitle: 'The selected component was inserted below the current section.',
        });

        onClose();
      } catch (error) {
        addToast({
          kind: 'error',
          title: 'Browse Components',
          subTitle: (error as Error).message,
        });
      } finally {
        setIsInserting(false);
      }
    }, [addToast, apollo, editor, onClose, selectedComponentId, targetTemplate]);

    if (!isOpen || !portalTarget) {
      return null;
    }

    return createPortal(
      <div className="fixed inset-0 z-[10060]">
        <div
          className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div className="absolute left-1/2 top-1/2 h-[min(84vh,780px)] w-[min(1120px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_40px_120px_-48px_rgba(15,23,42,0.55)]">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Insert Below Selection
              </div>
              <div className="mt-1 text-[26px] font-semibold tracking-tight text-slate-900">
                {targetLabel}
              </div>
              <div className="mt-1 text-[13px] text-slate-500">
                Browse components, choose one, then place it directly below the selected section.
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              <Cross2Icon />
            </button>
          </div>

          <div className="grid h-[calc(100%-89px)] grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-h-0 border-r border-slate-200">
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-3 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3">
                  <MagnifyingGlassIcon className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search component by title or description"
                    className="w-full bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="h-[calc(100%-81px)] overflow-y-auto px-6 py-5">
                {componentsQuery.loading ? (
                  <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-[18px] border border-slate-200 bg-white"
                      >
                        <div className="aspect-[16/9] animate-pulse bg-slate-100" />
                        <div className="space-y-2 px-4 py-3.5">
                          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                          <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : readyComponents.length ? (
                  <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                    {readyComponents.map((component: ReadyComponentItem) => (
                      <ComponentPreviewCard
                        key={component.id}
                        component={component}
                        selected={selectedComponentId === String(component.id)}
                        onSelect={() => setSelectedComponentId(String(component.id))}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-slate-50 text-center">
                    <div className="max-w-[320px]">
                      <div className="text-[16px] font-semibold text-slate-900">
                        No components found
                      </div>
                      <div className="mt-2 text-[13px] leading-6 text-slate-500">
                        Try a different search term or check the ready components list.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex min-h-0 flex-col bg-slate-50/70">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Section Action
                </div>
                <div className="mt-2 text-[18px] font-semibold text-slate-900">
                  Browse components
                </div>
                <div className="mt-1 text-[12px] leading-5 text-slate-500">
                  Click `Done` to insert the chosen component directly below the selected section.
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="rounded-[18px] border border-slate-200 bg-white p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Selected Target
                  </div>
                  <div className="mt-2 text-[18px] font-semibold text-slate-900">
                    {targetLabel}
                  </div>
                  <div className="mt-2 text-[12px] leading-5 text-slate-500">
                    The new component will be inserted immediately below this block.
                  </div>
                </div>

                <div className="mt-4 rounded-[18px] border border-slate-200 bg-white p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Chosen Component
                  </div>
                  <div className="mt-2 text-[16px] font-semibold text-slate-900">
                    {readyComponents.find(
                      (item: ReadyComponentItem) => String(item.id) === selectedComponentId
                    )?.title || 'No component selected'}
                  </div>
                  <div className="mt-2 text-[12px] leading-5 text-slate-500">
                    {readyComponents.find(
                      (item: ReadyComponentItem) => String(item.id) === selectedComponentId
                    )?.description || 'Pick any ready component preview from the left side.'}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white px-5 py-4">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="h-9 min-w-[112px] flex-1 justify-center px-3"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="xs"
                    className="h-9 min-w-[112px] flex-1 justify-center px-3"
                    disabled={!selectedComponentId || isInserting}
                    onClick={handleInsert}
                  >
                    {isInserting ? 'Adding...' : 'Done'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      portalTarget
    );
  }
);
