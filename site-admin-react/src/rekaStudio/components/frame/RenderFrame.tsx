import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import appCssHref from '@/index.css?url';

import { useEditor, useEditorActiveComponent } from '@app/editor';
import type { ActiveFrame } from '@app/editor/ComponentEditor';
import { cn } from '@app/utils';

import { FrameContext } from './FrameContext';
import { InlineFrame } from './InlineFrame';
import { RenderSelectionBorders } from './RenderSelectionBorders';
import { Renderer } from './Renderer';

import { TemplateComments } from '../editor-layout/TemplateComments';

const isNotFullWidth = (
  width: number | string | undefined,
  height: number | string | undefined
) => {
  const isFullWidth = width === '100%' && height === '100%';
  const isUnset = !width && !height;

  const isNotFullWidth = !isFullWidth && !isUnset;

  return isNotFullWidth;
};

const parsePixelDimension = (value: number | string | undefined) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)px$/i);

  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[1] ?? '');
  return Number.isFinite(parsed) ? parsed : null;
};

type RenderFrameViewProps = {
  view?: t.View;
  width?: string;
  height?: string;
};

const DESKTOP_WIDTH = 1280;
const DEFAULT_FRAME_DOCUMENT = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${appCssHref}" />
    <link href="/frame.css" rel="stylesheet" />
    <style>
      body {
        margin: 0;
      }
    </style>
    <script async src="/frame.js"></script>
  </head>
  <body>
    <div id="preloader"></div>
    <div id="root" style="display: none;"></div>
  </body>
</html>`;

const RenderFrameView = observer((props: RenderFrameViewProps) => {
  const editor = useEditor();
  const activeComponentEditor = useEditorActiveComponent();

  const containerDomRef = React.useRef<HTMLDivElement | null>(null);
  const frameDomRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const { current: containerDom } = containerDomRef;
    const { current: frameDom } = frameDomRef;

    if (!frameDom || !containerDom) {
      return;
    }

    const shouldUseDesktopViewport = !isNotFullWidth(props.width, props.height);
    const requestedWidth = parsePixelDimension(props.width);
    const requestedHeight = parsePixelDimension(props.height);
    const targetViewportWidth =
      requestedWidth ?? (shouldUseDesktopViewport ? DESKTOP_WIDTH : null);
    const targetViewportHeight = requestedHeight;

    const scale = () => {
      if (!targetViewportWidth) {
        frameDom.removeAttribute('style');
        return;
      }

      const availableWidth = Math.max(containerDom.clientWidth, 1);
      const availableHeight = Math.max(containerDom.clientHeight, 1);
      const widthScale = availableWidth / targetViewportWidth;
      const heightScale = targetViewportHeight
        ? availableHeight / targetViewportHeight
        : Number.POSITIVE_INFINITY;
      const nextScale = Math.min(1, widthScale, heightScale);

      frameDom.style.transform = `scale(${nextScale})`;
      frameDom.style.width = `${targetViewportWidth}px`;
      frameDom.style.minWidth = `${targetViewportWidth}px`;
      frameDom.style.maxWidth = `${targetViewportWidth}px`;
      frameDom.style.margin = '0 auto';

      if (targetViewportHeight) {
        frameDom.style.height = `${targetViewportHeight}px`;
        frameDom.style.minHeight = `${targetViewportHeight}px`;
        frameDom.style.maxHeight = `${targetViewportHeight}px`;
        return;
      }

      frameDom.style.removeProperty('height');
      frameDom.style.removeProperty('maxHeight');
      frameDom.style.minHeight = `${Math.max(
        containerDom.clientHeight,
        availableHeight / Math.max(nextScale, 0.0001)
      )}px`;
    };

    scale();

    let scheduledAnimationFrame: number | null = null;

    const queueScale = () => {
      if (scheduledAnimationFrame !== null) {
        window.cancelAnimationFrame(scheduledAnimationFrame);
      }

      scheduledAnimationFrame = window.requestAnimationFrame(() => {
        scheduledAnimationFrame = null;
        scale();
      });
    };

    const observer = new ResizeObserver(() => {
      queueScale();
    });

    observer.observe(containerDom);

    return () => {
      observer.unobserve(containerDom);

      if (scheduledAnimationFrame !== null) {
        window.cancelAnimationFrame(scheduledAnimationFrame);
      }
    };
  }, [props.height, props.width]);

  return (
    <div className="w-full h-full render-frame-root" ref={containerDomRef}>
      <div
        className={cn(
          'w-full h-full relative flex flex-col justify-center min-h-full max-h-full origin-[0px_0px]',
          {
            'p-4': !isNotFullWidth,
          }
        )}
        ref={frameDomRef}
      >
        <InlineFrame
          title="Rendered User Content"
          style={{
            maxWidth: props.width,
            maxHeight: props.height,
          }}
          className={cn(
            'block m-auto w-full h-full shadow-none rounded-none bg-white',
            {
              'border-outline rounded-xs': !isNotFullWidth,
            }
          )}
          initialContent={editor.previewDocument || DEFAULT_FRAME_DOCUMENT}
          mountTarget="#root"
          ref={(dom) => {
            if (dom) {
              editor.registerIframe(dom);
            }
          }}
        >
          {props.view ? (
            <Renderer view={props.view} />
          ) : (
            <div className="frame-content text-sm text-slate-500">
              Preview not ready.
            </div>
          )}
        </InlineFrame>
        <RenderSelectionBorders />

        {activeComponentEditor.activeFrame?.templateToShowComments && (
          <TemplateComments activeFrame={activeComponentEditor.activeFrame} />
        )}
      </div>
    </div>
  );
});

type RenderFrameProps = {
  frame: ActiveFrame;
  width?: string;
  height?: string;
};

export const RenderFrame = observer((props: RenderFrameProps) => {
  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      props.frame.state.enableSync();
    });

    return () => {
      window.cancelAnimationFrame(id);
    };
  }, [props.frame]);

  return (
    <FrameContext.Provider value={props.frame.state}>
      <RenderFrameView
        width={props.width}
        height={props.height}
        view={props.frame.state.view}
      />
    </FrameContext.Provider>
  );
});
