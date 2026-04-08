import {
  DotsHorizontalIcon,
  DoubleArrowRightIcon,
  LayersIcon,
} from '@radix-ui/react-icons';
import { useApolloClient } from '@apollo/client';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import * as t from '@rekajs/types';
import * as React from 'react';
import { useDragLayer, useDrop } from 'react-dnd';
import useIsomorphicLayoutEffect from 'react-use/lib/useIsomorphicLayoutEffect';

import { RENDER_FRAME_CONTAINER_CLASSNAME } from '@app/constants/css';
import { useEditor } from '@app/editor';
import { EditorMode } from '@app/editor/Editor';
import { readUserFrames } from '@app/editor/userFrames';
import { cn, CREATE_BEZIER_TRANSITION } from '@app/utils';

import { AddFrameModal } from './AddFrameModal';
import { EditPreviewSize } from './EditPreviewSize';
import { TextQuickActions } from './TextQuickActions';

import { Button, IconButton } from '../button';
import { Dropdown } from '../dropdown';
import { RenderFrame } from '../frame/RenderFrame';
import { Info } from '../info';
import { MobileFallback } from '../mobile-fallback';
import { Popover } from '../popover';
import { Select } from '../select';
import { Switch } from '../switch';
import { Tooltip } from '../tooltip';
import { Tree } from '../tree';
import { StudioPageToolbar } from '@/siteAdmin/studio/StudioPageToolbar';
import { SITE_COMPONENT } from '@/graphql/queries/siteComponents';
import { createComponentFromSchemaJson } from '@/siteAdmin/editor/rekaBlocks';
import { useToastStore } from '@/siteAdmin/store/useToastStore';
import {
  createImageTemplateFromSource,
  createTemplateFromStudioBlock,
  STUDIO_BLOCK_ITEM_TYPE,
  type StudioDragItem,
  type StudioBlockKey,
} from './component-settings/blockPresets';

const NoFrameSelectedMessage = () => {
  return (
    <div className="flex items-center justify-center text-center h-full w-full">
      <span className="text-gray-500 text-sm leading-6">
        No frame selected.
        <br />
        Click &quot;Add Frame&quot; to create one.
      </span>
    </div>
  );
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

const ensureObjectStyle = (template: t.Template) => {
  if (!('props' in template)) {
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

const removeStyleLiteral = (template: t.Template, key: string) => {
  const style = ensureObjectStyle(template);

  if (!style) {
    return;
  }

  delete style.properties[key];
};

const setStyleLiteral = (template: t.Template, key: string, value: string) => {
  const style = ensureObjectStyle(template);

  if (!style) {
    return;
  }

  style.properties[key] = t.literal({ value });
};

const CONTAINER_TAGS = new Set([
  'div',
  'section',
  'main',
  'header',
  'footer',
  'article',
  'aside',
  'nav',
  'form',
]);

const STABLE_HOST_TAGS = new Set([
  'header',
  'section',
  'main',
  'footer',
  'article',
  'aside',
  'nav',
]);

const hasLayoutAnchorClasses = (template: t.TagTemplate) => {
  const className =
    template.props.className instanceof t.Literal
      ? String(template.props.className.value ?? '')
      : '';

  return (
    /\bcontainer\b/.test(className) ||
    /\b(?:mx-auto|m-auto)\b/.test(className) ||
    /\bmax-w-[^\s]+\b/.test(className)
  );
};

const isContainerTemplate = (
  template: t.Template
): template is t.TagTemplate & t.SlottableTemplate => {
  return (
    template instanceof t.TagTemplate &&
    template instanceof t.SlottableTemplate &&
    CONTAINER_TAGS.has(template.tag)
  );
};

const getComponentRootTemplate = (
  componentEditor: NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>
) => {
  if (!(componentEditor.component instanceof t.RekaComponent)) {
    return null;
  }

  return componentEditor.component.template;
};

const findPlacementHostTemplate = (
  editor: ReturnType<typeof useEditor>,
  componentEditor: NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>,
  initialTemplate: t.Template | null
) => {
  let current = initialTemplate;
  const componentRootTemplate = getComponentRootTemplate(componentEditor);
  let nearestContainer: (t.TagTemplate & t.SlottableTemplate) | null = null;
  let nearestLayoutAnchor: (t.TagTemplate & t.SlottableTemplate) | null = null;
  let nearestStableHost: (t.TagTemplate & t.SlottableTemplate) | null = null;

  while (current) {
    if (isContainerTemplate(current)) {
      nearestContainer ??= current;

      if (!nearestLayoutAnchor && hasLayoutAnchorClasses(current)) {
        nearestLayoutAnchor = current;
      }

      if (
        !nearestStableHost &&
        (STABLE_HOST_TAGS.has(current.tag) ||
          (componentRootTemplate ? current.id === componentRootTemplate.id : false)
        )
      ) {
        nearestStableHost = current;
      }
    }

    current = safeGetParentTemplate(editor, current);
  }

  if (nearestLayoutAnchor) return nearestLayoutAnchor;
  if (nearestStableHost) return nearestStableHost;
  if (nearestContainer) return nearestContainer;

  if (componentRootTemplate instanceof t.SlottableTemplate) {
    return componentRootTemplate;
  }

  return null;
};

const findContainerTemplateAtClientPoint = (
  componentEditor: NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>,
  point: { x: number; y: number } | null
) => {
  if (!point) {
    return null;
  }

  const iframe = componentEditor.editor.iframe;

  if (!iframe) {
    return null;
  }

  const iframeRect = iframe.getBoundingClientRect();
  const frameScale = getIframeScale(iframe);
  const localPoint = {
    x: (point.x - iframeRect.left) / Math.max(frameScale.x, 0.0001),
    y: (point.y - iframeRect.top) / Math.max(frameScale.y, 0.0001),
  };
  const frameViewportWidth = iframe.contentWindow?.innerWidth ?? iframe.clientWidth;
  const frameViewportHeight = iframe.contentWindow?.innerHeight ?? iframe.clientHeight;

  if (
    localPoint.x >= 0 &&
    localPoint.y >= 0 &&
    localPoint.x <= frameViewportWidth &&
    localPoint.y <= frameViewportHeight
  ) {
    let current = iframe.contentDocument?.elementFromPoint(
      localPoint.x,
      localPoint.y
    ) as HTMLElement | null;

    while (current) {
      for (const [template, doms] of componentEditor.activeFrame?.tplElements ?? []) {
        if (!isContainerTemplate(template)) {
          continue;
        }

        for (const dom of doms) {
          if (dom !== current) {
            continue;
          }

          return {
            template,
            dom,
            rect: toPreviewRect(dom, iframeRect),
            area: Math.max(1, dom.getBoundingClientRect().width * dom.getBoundingClientRect().height),
          };
        }
      }

      current = current.parentElement;
    }
  }

  let bestMatch:
    | {
        template: t.TagTemplate & t.SlottableTemplate;
        dom: HTMLElement;
        rect: ReturnType<typeof toPreviewRect>;
        area: number;
      }
    | null = null;

  for (const [template, doms] of componentEditor.activeFrame?.tplElements ?? []) {
    if (!isContainerTemplate(template)) {
      continue;
    }

    for (const dom of doms) {
      const rect = toPreviewRect(dom, iframeRect);
      const contains =
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom;

      if (!contains) {
        continue;
      }

      const area = Math.max(1, rect.width * rect.height);

      if (!bestMatch || area < bestMatch.area) {
        bestMatch = {
          template,
          dom,
          rect,
          area,
        };
      }
    }
  }

  return bestMatch;
};

const insertTemplateAtTarget = (
  editor: ReturnType<typeof useEditor>,
  target: t.Template,
  template: t.Template,
  position: 'before' | 'after' | 'child'
) => {
  editor.reka.change(() => {
    if (position === 'child') {
      if (!(target instanceof t.SlottableTemplate)) {
        return;
      }

      target.children.push(template);
      return;
    }

    const parent = safeGetParentTemplate(editor, target);

    if (!parent || !(parent instanceof t.SlottableTemplate)) {
      return;
    }

    const indexInParent = parent.children.indexOf(target);

    if (indexInParent === -1) {
      return;
    }

    parent.children.splice(position === 'after' ? indexInParent + 1 : indexInParent, 0, template);
  });
};

const findTemplateForElement = (
  componentEditor: NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>,
  element: HTMLElement | null
) => {
  let current = element;

  while (current) {
    for (const [template, doms] of componentEditor.activeFrame?.tplElements ?? []) {
      for (const dom of doms) {
        if (dom === current) {
          return { template, dom };
        }
      }
    }

    current = current.parentElement;
  }

  return null;
};

type PreviewTemplateMatch = {
  template: t.Template;
  dom: HTMLElement;
  rect: {
    left: number;
    top: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
  };
  distance: number;
};

const toPreviewRect = (dom: HTMLElement, iframeRect: DOMRect) => {
  const rect = dom.getBoundingClientRect();

  return {
    left: iframeRect.left + rect.left,
    top: iframeRect.top + rect.top,
    width: rect.width,
    height: rect.height,
    right: iframeRect.left + rect.right,
    bottom: iframeRect.top + rect.bottom,
  };
};

const getIframeScale = (iframe: HTMLIFrameElement | null) => {
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

const getPointDistanceToRect = (
  point: { x: number; y: number },
  rect: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }
) => {
  const dx = point.x < rect.left ? rect.left - point.x : point.x > rect.right ? point.x - rect.right : 0;
  const dy = point.y < rect.top ? rect.top - point.y : point.y > rect.bottom ? point.y - rect.bottom : 0;

  return Math.hypot(dx, dy);
};

const findTemplateAtClientPoint = (
  componentEditor: NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>,
  point: { x: number; y: number } | null
) => {
  if (!point) {
    return null;
  }

  const iframe = componentEditor.editor.iframe;

  if (!iframe) {
    return null;
  }

  const iframeRect = iframe.getBoundingClientRect();
  const frameScale = getIframeScale(iframe);
  const localPoint = {
    x: (point.x - iframeRect.left) / Math.max(frameScale.x, 0.0001),
    y: (point.y - iframeRect.top) / Math.max(frameScale.y, 0.0001),
  };
  const frameViewportWidth = iframe.contentWindow?.innerWidth ?? iframe.clientWidth;
  const frameViewportHeight = iframe.contentWindow?.innerHeight ?? iframe.clientHeight;

  if (
    localPoint.x >= 0 &&
    localPoint.y >= 0 &&
    localPoint.x <= frameViewportWidth &&
    localPoint.y <= frameViewportHeight
  ) {
    const pointedElement = iframe.contentDocument?.elementFromPoint(
      localPoint.x,
      localPoint.y
    ) as HTMLElement | null;

    const directMatch = findTemplateForElement(componentEditor, pointedElement);

    if (directMatch) {
      return {
        template: directMatch.template,
        dom: directMatch.dom,
        rect: toPreviewRect(directMatch.dom, iframeRect),
        distance: 0,
      };
    }
  }

  let containingMatch: PreviewTemplateMatch | null = null;
  let nearestMatch: PreviewTemplateMatch | null = null;

  for (const [template, doms] of componentEditor.activeFrame?.tplElements ?? []) {
    for (const dom of doms) {
      const rect = toPreviewRect(dom, iframeRect);
      const contains =
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom;

      if (contains) {
        const area = Math.max(1, rect.width * rect.height);

        if (
          !containingMatch ||
          area < containingMatch.rect.width * containingMatch.rect.height
        ) {
          containingMatch = {
            template,
            dom,
            rect,
            distance: 0,
          };
        }
      } else {
        const distance = getPointDistanceToRect(point, rect);

        if (!nearestMatch || distance < nearestMatch.distance) {
          nearestMatch = {
            template,
            dom,
            rect,
            distance,
          };
        }
      }
    }
  }

  return containingMatch ?? nearestMatch;
};

const placeTemplateFreely = (
  editor: ReturnType<typeof useEditor>,
  componentEditor: NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>,
  template: t.Template,
  point: { x: number; y: number } | null,
  match: PreviewTemplateMatch | null
) => {
  if (!point) {
    return false;
  }

  const directContainerMatch = findContainerTemplateAtClientPoint(
    componentEditor,
    point
  );
  const componentRootTemplate = getComponentRootTemplate(componentEditor);
  const rootHostTemplate =
    componentRootTemplate instanceof t.SlottableTemplate
      ? componentRootTemplate
      : null;
  const hostTemplate =
    findPlacementHostTemplate(
      editor,
      componentEditor,
      directContainerMatch?.template ?? match?.template ?? null
    ) ??
    rootHostTemplate;

  if (!hostTemplate || !(hostTemplate instanceof t.SlottableTemplate)) {
    return false;
  }

  const iframe = editor.iframe;

  if (!iframe) {
    return false;
  }
  const iframeRect = iframe.getBoundingClientRect();
  const frameScale = getIframeScale(iframe);
  const scrollX = iframe.contentWindow?.scrollX ?? 0;
  const scrollY = iframe.contentWindow?.scrollY ?? 0;
  const hostDom =
    rootHostTemplate?.id === hostTemplate.id
      ? (([...(componentEditor.activeFrame?.tplElements.get(hostTemplate) ?? [])][0] ??
          null) as HTMLElement | null)
      : directContainerMatch?.template?.id === hostTemplate.id
        ? directContainerMatch.dom
        : (([...(componentEditor.activeFrame?.tplElements.get(hostTemplate) ?? [])][0] ??
            null) as HTMLElement | null);
  const hostRect = hostDom?.getBoundingClientRect() ?? null;
  const hostScrollLeft = hostDom?.scrollLeft ?? 0;
  const hostScrollTop = hostDom?.scrollTop ?? 0;
  const hostComputedStyle = hostDom ? window.getComputedStyle(hostDom) : null;
  const hostBorderLeft = Number.parseFloat(hostComputedStyle?.borderLeftWidth ?? '0');
  const hostBorderTop = Number.parseFloat(hostComputedStyle?.borderTopWidth ?? '0');
  const pointInFrameX =
    (point.x - iframeRect.left) / Math.max(frameScale.x, 0.0001);
  const pointInFrameY =
    (point.y - iframeRect.top) / Math.max(frameScale.y, 0.0001);
  const left = Math.max(
    0,
    hostRect
      ? (point.x - hostRect.left) / Math.max(frameScale.x, 0.0001) -
          (Number.isFinite(hostBorderLeft) ? hostBorderLeft : 0) +
          hostScrollLeft
      : pointInFrameX + scrollX
  );
  const top = Math.max(
    0,
    hostRect
      ? (point.y - hostRect.top) / Math.max(frameScale.y, 0.0001) -
          (Number.isFinite(hostBorderTop) ? hostBorderTop : 0) +
          hostScrollTop
      : pointInFrameY + scrollY
  );
  const wrapper = t.tagTemplate({
    tag: 'div',
    props: {
      className: t.literal({
        value: 'studio-free-block',
      }),
    },
    children: [template],
  });

  editor.reka.change(() => {
    hostTemplate.children.push(wrapper);

    if (hostTemplate instanceof t.TagTemplate) {
      const currentPosition =
        hostTemplate.props.style instanceof t.ObjectExpression &&
        hostTemplate.props.style.properties.position instanceof t.Literal
          ? String(hostTemplate.props.style.properties.position.value)
          : '';

      if (!currentPosition || currentPosition === 'static') {
        setStyleLiteral(hostTemplate, 'position', 'relative');
      }

      setStyleLiteral(hostTemplate, 'overflow', 'visible');
    }

    setStyleLiteral(wrapper, 'position', 'absolute');
    setStyleLiteral(wrapper, 'left', `${Math.round(left)}px`);
    setStyleLiteral(wrapper, 'top', `${Math.round(top)}px`);
    setStyleLiteral(wrapper, 'zIndex', '20');
    setStyleLiteral(wrapper, 'display', 'inline-block');
    setStyleLiteral(wrapper, 'minWidth', '24px');
    setStyleLiteral(wrapper, 'minHeight', '24px');
    setStyleLiteral(wrapper, 'maxWidth', '100%');
    setStyleLiteral(wrapper, 'boxSizing', 'border-box');
    setStyleLiteral(wrapper, 'overflowWrap', 'break-word');

    if (template instanceof t.TagTemplate && template.tag === 'img') {
      setStyleLiteral(wrapper, 'width', '320px');
      setStyleLiteral(wrapper, 'height', '200px');
      setStyleLiteral(wrapper, 'display', 'block');
      setStyleLiteral(template, 'display', 'block');
      setStyleLiteral(template, 'width', '100%');
      setStyleLiteral(template, 'height', '100%');
      setStyleLiteral(template, 'objectFit', 'cover');
      setStyleLiteral(template, 'maxWidth', '100%');
      removeStyleLiteral(template, 'aspectRatio');
    }

    if (template instanceof t.TagTemplate && template.tag === 'video') {
      setStyleLiteral(wrapper, 'width', '420px');
      setStyleLiteral(wrapper, 'height', '236px');
      setStyleLiteral(wrapper, 'display', 'block');
      setStyleLiteral(template, 'display', 'block');
      setStyleLiteral(template, 'width', '100%');
      setStyleLiteral(template, 'height', '100%');
      setStyleLiteral(template, 'objectFit', 'cover');
      setStyleLiteral(template, 'maxWidth', '100%');
      removeStyleLiteral(template, 'aspectRatio');
    }
  });

  componentEditor.setTplEvent('selected', wrapper);

  return true;
};

export const ComponentEditorView = observer(() => {
  const editor = useEditor();
  const apollo = useApolloClient();
  const addToast = useToastStore((state) => state.addToast);

  const [showViewTree, setShowViewTree] = React.useState(false);
  const [showAddFrameModal, setShowAddFrameModal] = React.useState(false);
  const [isEditingFrame, setIsEditingFrame] = React.useState(false);

  const componentEditor = editor.activeComponentEditor;

  const containerDOMRef = React.useRef<HTMLDivElement | null>(null);
  const frameContainerDOMRef = React.useRef<HTMLDivElement | null>(null);
  const toolbarDOMRef = React.useRef<HTMLDivElement | null>(null);
  const bottomToolbarDOMRef = React.useRef<HTMLDivElement | null>(null);

  const [TOOLBAR_HEIGHT, setToolbarHeight] = React.useState(0);
  const [BOTTOM_TOOLBAR_HEIGHT, setBottomToolbarHeight] = React.useState(0);
  const dragLayer = useDragLayer((monitor) => ({
    isDraggingBlock: monitor.isDragging() && monitor.getItemType() === STUDIO_BLOCK_ITEM_TYPE,
    clientOffset: monitor.getClientOffset(),
    item: monitor.getItem() as StudioDragItem | null,
  }));

  const hoveredPreviewMatch = React.useMemo(() => {
    if (!dragLayer.isDraggingBlock || !componentEditor?.activeFrame) {
      return null;
    }

    return findTemplateAtClientPoint(componentEditor, dragLayer.clientOffset);
  }, [componentEditor, dragLayer.clientOffset, dragLayer.isDraggingBlock]);

  const hoveredPreviewHighlight = React.useMemo(() => {
    if (!hoveredPreviewMatch || !frameContainerDOMRef.current) {
      return null;
    }

    const containerRect = frameContainerDOMRef.current.getBoundingClientRect();

    return {
      left: hoveredPreviewMatch.rect.left - containerRect.left,
      top: hoveredPreviewMatch.rect.top - containerRect.top,
      width: hoveredPreviewMatch.rect.width,
      height: hoveredPreviewMatch.rect.height,
    };
  }, [hoveredPreviewMatch]);

  const insertReadyComponent = React.useCallback(
    async (
      item: Extract<StudioDragItem, { kind: 'component' }>,
      clientOffset: { x: number; y: number } | null
    ) => {
      if (!componentEditor?.activeFrame) {
        return;
      }

      try {
        const result = await apollo.query({
          query: SITE_COMPONENT,
          variables: { id: Number(item.componentId) },
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
            title: 'Quick Blocks',
            subTitle: 'Component schema not found.',
          });
          return;
        }

        let createdTemplate: t.Template | null = null;

        editor.reka.change(() => {
          const program = editor.reka.state?.program?.components as any[] | undefined;

          if (!Array.isArray(program)) {
            return;
          }

          program.push(component);
          createdTemplate = t.clone(component.template, {
            replaceExistingId: true,
          }) as t.Template;
        });

        if (!createdTemplate) {
          addToast({
            kind: 'error',
            title: 'Quick Blocks',
            subTitle: 'The component could not be prepared for insertion.',
          });
          return;
        }

        const match = findTemplateAtClientPoint(componentEditor, clientOffset);
        const inserted = placeTemplateFreely(
          editor,
          componentEditor,
          createdTemplate,
          clientOffset,
          match
        );

        const componentRootTemplate = getComponentRootTemplate(componentEditor);

        if (!inserted && componentRootTemplate instanceof t.SlottableTemplate) {
          insertTemplateAtTarget(
            editor,
            componentRootTemplate,
            createdTemplate,
            'child'
          );
        }

        componentEditor.setTplEvent('selected', createdTemplate);
      } catch (error) {
        addToast({
          kind: 'error',
          title: 'Quick Blocks',
          subTitle: (error as Error).message,
        });
      }
    },
    [addToast, apollo, componentEditor, editor]
  );

  const [, dropToPreview] = useDrop(
    () => ({
      accept: STUDIO_BLOCK_ITEM_TYPE,
      drop: (item: StudioDragItem, monitor) => {
        if (!componentEditor?.activeFrame) {
          return;
        }

        const clientOffset = monitor.getClientOffset();

        if (item.kind === 'component') {
          void insertReadyComponent(item, clientOffset);
          return;
        }

        const createdTemplate =
          item.kind === 'image'
            ? createImageTemplateFromSource(item.imageSrc, item.imageAlt)
            : createTemplateFromStudioBlock(item.blockKey as StudioBlockKey);

        const match = findTemplateAtClientPoint(componentEditor, clientOffset);

        const inserted = placeTemplateFreely(
          editor,
          componentEditor,
          createdTemplate,
          clientOffset,
          match
        );

        const componentRootTemplate = getComponentRootTemplate(componentEditor);

        if (!inserted && componentRootTemplate instanceof t.SlottableTemplate) {
          insertTemplateAtTarget(editor, componentRootTemplate, createdTemplate, 'child');
          componentEditor.setTplEvent('selected', createdTemplate);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [componentEditor, editor, insertReadyComponent]
  );

  useIsomorphicLayoutEffect(() => {
    const { current: toolbarDOM } = toolbarDOMRef;
    const { current: bottomToolbarDOM } = bottomToolbarDOMRef;

    if (toolbarDOM) {
      setToolbarHeight(toolbarDOM.getBoundingClientRect().height);
    }

    if (bottomToolbarDOM) {
      setBottomToolbarHeight(bottomToolbarDOM.getBoundingClientRect().height);
    }
  }, [setToolbarHeight, setBottomToolbarHeight]);

  React.useEffect(() => {
    if (editor.mode !== EditorMode.Preview) {
      return;
    }

    setShowViewTree(false);
  }, [editor.mode, setShowViewTree]);

  const frames = componentEditor
    ? readUserFrames(editor.reka).filter(
        (frame) => frame.name === componentEditor.component.name
      )
    : [];
  const supportsComponentOrderTool =
    componentEditor?.component instanceof t.RekaComponent &&
    componentEditor.component.template instanceof t.SlottableTemplate;

  const setEditFrame = React.useCallback(
    (bool = true) => {
      setShowAddFrameModal(bool);
      setIsEditingFrame(bool);
    },
    [setShowAddFrameModal, setIsEditingFrame]
  );

  const removeFrame = React.useCallback(() => {
    if (!componentEditor) {
      return;
    }

    editor.reka.change(() => {
      const userFrame = componentEditor.activeFrame?.user;

      if (!userFrame) {
        return;
      }

      const userFrames = readUserFrames(editor.reka);

      userFrames.splice(userFrames.indexOf(userFrame), 1);

      const nextActiveFrame = userFrames.find(
        (frame) => frame.name === componentEditor.component.name
      );

      if (!nextActiveFrame) {
        return;
      }

      componentEditor.setActiveFrame(nextActiveFrame.id);
    });
  }, [editor, componentEditor]);

  if (!componentEditor) {
    return (
      <div className="h-full text-center flex items-center justify-center">
        <span className="text-neutral-900">No component selected</span>
      </div>
    );
  }
  return (
    <div className="relative flex flex-col h-full" ref={containerDOMRef}>
      <motion.div
        className={`flex items-center px-4 py-2.5 border-b border-solid border-outline w-full relative z-40 bg-white h-[${TOOLBAR_HEIGHT}px]`}
        initial={false}
        animate={editor.mode === EditorMode.Preview ? 'exit' : 'enter'}
        variants={{
          enter: {
            marginTop: 0,
            opacity: 1,
          },
          exit: {
            marginTop: `-${TOOLBAR_HEIGHT}px`,
            opacity: 0,
          },
        }}
        ref={toolbarDOMRef}
        transition={CREATE_BEZIER_TRANSITION()}
      >
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden -translate-x-1/2 items-center xl:flex">
          <TextQuickActions />
        </div>
        <div className="flex gap-2 flex-1 items-center">
          {(editor.compactSidebar || editor.mode === EditorMode.Code) && (
            <Tooltip content="Toggle sidebar">
              <IconButton
                className="mr-1.5"
                variant={'outline'}
                onClick={(e) => {
                  e.stopPropagation();

                  editor.showCompactSidebar(!editor.compactSidebarVisible);
                }}
              >
                <DoubleArrowRightIcon
                  style={{
                    transition: '0.2s ease-in',
                    transform: `rotate(${
                      editor.compactSidebarVisible ? 180 : 0
                    }deg)`,
                  }}
                />
              </IconButton>
            </Tooltip>
          )}

          <span className="text-slate-700">
            {componentEditor.component.name}
          </span>
          {frames.length > 0 && (
            <Select
              className="ml-2"
              placeholder="Select a frame"
              value={componentEditor.activeFrame?.state.id}
              onChange={(value) => {
                componentEditor.setActiveFrame(value);
              }}
              items={frames.map((frame) => ({
                value: frame.id,
                title: frame.id,
              }))}
            />
          )}

          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="subtle"
              onClick={() => {
                setShowAddFrameModal(true);
              }}
            >
              Add Frame
            </Button>
            {supportsComponentOrderTool && (
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  editor.setLeftSidebarScreen('component-order');

                  if (editor.compactSidebar) {
                    editor.showCompactSidebar(true);
                  }
                }}
              >
                <LayersIcon className="mr-1" />
                Layer
              </Button>
            )}
            <Info
              className="text-gray-500"
              info="A Frame is an instance of a Reka Component"
            />
            <StudioPageToolbar />
          </div>
        </div>
        <div className="flex items-center">
          <MobileFallback
            fallback={
              <Popover
                trigger={
                  <IconButton variant="outline">
                    <DotsHorizontalIcon />
                  </IconButton>
                }
              >
                <div className="flex flex-col gap-3">
                  <EditPreviewSize frames={frames} />
                </div>
              </Popover>
            }
            render={<EditPreviewSize frames={frames} />}
          />
        </div>
      </motion.div>

      <div className="relative flex flex-1 h-full min-h-0">
        {!componentEditor.activeFrame ? (
          <NoFrameSelectedMessage />
        ) : (
          <React.Fragment>
            <div
              className={cn(
                RENDER_FRAME_CONTAINER_CLASSNAME,
                `relative w-full h-full overflow-hidden flex flex-1 items-center bg-canvas transition-all ease-all duration-800`,
                {
                  grayscale: !componentEditor.activeFrame.state.sync,
                }
              )}
              ref={frameContainerDOMRef}
            >
              <RenderFrame
                width={componentEditor.activeFrame.user.width}
                height={componentEditor.activeFrame.user.height}
                frame={componentEditor.activeFrame}
              />
              <div
                ref={dropToPreview}
                className={cn('absolute inset-0 z-[60]', {
                  'pointer-events-none opacity-0': !dragLayer.isDraggingBlock,
                  'pointer-events-auto opacity-100': dragLayer.isDraggingBlock,
                })}
              >
                <div className="absolute inset-0 bg-blue-500/6" />
                <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
                  <div className="rounded-full border border-blue-300 bg-white px-4 py-2 text-xs font-medium text-blue-700 shadow-sm">
                    {hoveredPreviewMatch
                      ? `Drop on ${hoveredPreviewMatch.template.type}`
                      : 'Drop block here'}
                  </div>
                </div>
                {hoveredPreviewHighlight ? (
                  <div
                    className="pointer-events-none absolute rounded-md border-2 border-blue-500 bg-blue-500/10"
                    style={{
                      left: hoveredPreviewHighlight.left,
                      top: hoveredPreviewHighlight.top,
                      width: hoveredPreviewHighlight.width,
                      height: hoveredPreviewHighlight.height,
                    }}
                  />
                ) : null}
              </div>
            </div>

            {componentEditor.activeFrame.state.view && showViewTree && (
              <div className="flex flex-col relative bg-white w-[350px] border-l border-solid border-outline">
                <header className="px-5 py-2 border-b border-solid border-outline">
                  <h3 className="text-gray-800 text-sm font-medium flex items-center">
                    <span>View</span>
                    <Info info="The View is the render tree of a component" />
                  </h3>
                </header>
                <Tree
                  className="flex-1 overflow-auto pt-2 px w-full text-xs"
                  root={componentEditor.activeFrame.state.view}
                  renderAs={(node, key) => {
                    if (key !== 'owner') {
                      return null;
                    }

                    return (
                      <span>
                        <span className="text-primary">{`${node.type}<`}</span>
                        {node.id}
                        <span className="text-primary">{`>`}</span>
                      </span>
                    );
                  }}
                  shouldCollapseOnInitial={(_, key) => {
                    if (
                      key === 'template' ||
                      key === 'component' ||
                      key === 'owner'
                    ) {
                      return true;
                    }

                    return false;
                  }}
                />
              </div>
            )}
          </React.Fragment>
        )}
      </div>
      {componentEditor.activeFrame && (
        <motion.div
          className={`flex items-center border-t border-solid border-outline px-4 py-1.5 relative z-20 bg-white h-[${BOTTOM_TOOLBAR_HEIGHT}]px`}
          initial={false}
          animate={editor.mode === EditorMode.Preview ? 'exit' : 'enter'}
          variants={{
            exit: {
              marginBottom: `-${BOTTOM_TOOLBAR_HEIGHT}px`,
              opacity: 0,
            },
            enter: {
              marginBottom: 0,
              opacity: 1,
            },
          }}
          ref={bottomToolbarDOMRef}
          transition={CREATE_BEZIER_TRANSITION()}
        >
          <div className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <Switch
                onChange={() => {
                  if (componentEditor.activeFrame?.state.sync) {
                    componentEditor.activeFrame?.state.disableSync();
                    return;
                  }

                  componentEditor.activeFrame?.state.enableSync();
                }}
                checked={componentEditor.activeFrame.state.sync}
              />

              <span className="text-xs flex text-slate-700 items-center">
                {componentEditor.activeFrame?.state.sync
                  ? 'Syncing'
                  : 'Not syncing'}
                <Info
                  className="text-gray-500"
                  info={
                    componentEditor.activeFrame.state.sync
                      ? "The Frame's View tree will be updated when there's a change made to State"
                      : 'Frame will not recompute its View tree'
                  }
                />
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center self-end justify-self-end">
            <MobileFallback
              size={1200}
              fallback={
                <Dropdown
                  items={[
                    {
                      title: 'Edit frame props',
                      onSelect: () => {
                        setEditFrame(true);
                      },
                    },
                    {
                      title: 'Remove frame',
                      onSelect: () => {
                        removeFrame();
                      },
                    },
                    {
                      title: 'Toggle View',
                      onSelect: () => {
                        setShowViewTree(!showViewTree);
                      },
                    },
                  ]}
                >
                  <IconButton variant="outline">
                    <DotsHorizontalIcon />
                  </IconButton>
                </Dropdown>
              }
              render={
                <React.Fragment>
                  <Button
                    size="xs"
                    className="hover:bg-red-100 hover:text-red-600"
                    onClick={() => {
                      removeFrame();
                    }}
                  >
                    Remove Frame
                  </Button>
                  <Button
                    size="xs"
                    variant={'subtle'}
                    onClick={() => {
                      setEditFrame(true);
                    }}
                  >
                    Edit Frame Props
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setShowViewTree(!showViewTree)}
                  >
                    Toggle View
                  </Button>
                </React.Fragment>
              }
            />
          </div>
        </motion.div>
      )}

      {showAddFrameModal ? (
        <AddFrameModal
          key={`${componentEditor.component.id}${
            isEditingFrame ? `-${componentEditor.activeFrame?.user.id}` : ''
          }`}
          component={componentEditor.component}
          isOpen={showAddFrameModal}
          frameId={
            isEditingFrame ? componentEditor.activeFrame?.user.id : undefined
          }
          onClose={() => {
            setEditFrame(false);
          }}
        />
      ) : null}
    </div>
  );
});
