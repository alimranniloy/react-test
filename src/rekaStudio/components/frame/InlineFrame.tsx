import * as React from 'react';
import { createPortal } from 'react-dom';

type InlineFrameProps = {
  title?: string;
  style?: React.CSSProperties;
  className?: string;
  initialContent?: string;
  mountTarget?: string;
  children?: React.ReactNode;
};

export const InlineFrame = React.forwardRef<HTMLIFrameElement, InlineFrameProps>(
  ({ title, style, className, initialContent, mountTarget = 'body', children }, ref) => {
    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
    const [mountNode, setMountNode] = React.useState<Element | null>(null);

    React.useImperativeHandle(ref, () => iframeRef.current as HTMLIFrameElement, []);

    React.useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) {
        return;
      }

      const syncMountNode = () => {
        const doc = iframe.contentDocument;
        if (!doc) {
          setMountNode(null);
          return;
        }

        setMountNode(doc.querySelector(mountTarget) ?? doc.body);
      };

      syncMountNode();
      iframe.addEventListener('load', syncMountNode);

      return () => {
        iframe.removeEventListener('load', syncMountNode);
      };
    }, [initialContent, mountTarget]);

    return (
      <iframe
        ref={iframeRef}
        title={title}
        style={style}
        className={className}
        srcDoc={initialContent}
      >
        {mountNode ? createPortal(children, mountNode) : null}
      </iframe>
    );
  }
);

InlineFrame.displayName = 'InlineFrame';

