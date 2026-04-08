import * as t from '@rekajs/types';

import { useEditor } from '@app/editor';

import { ControlCard } from '../controls/ControlCard';
import { LengthStyleField } from '../controls/LengthStyleField';
import { readStyleLiteral, setPixelStyle } from '../style-utils';

type LayoutControlsProps = {
  template: t.TagTemplate;
};

export const LayoutControls = (props: LayoutControlsProps) => {
  const editor = useEditor();

  return (
    <ControlCard
      eyebrow="Layout"
      title="Space, size, placement"
      description="Fine-tune width, height, padding, margin and layout rhythm for any block."
    >
      <div className="grid grid-cols-2 gap-3">
        <LengthStyleField
          label="Width"
          value={readStyleLiteral(props.template, 'width')}
          placeholder="auto"
          badge="w"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'width', value)
          }
        />
        <LengthStyleField
          label="Height"
          value={readStyleLiteral(props.template, 'height')}
          placeholder="auto"
          badge="h"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'height', value)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LengthStyleField
          label="Padding"
          value={readStyleLiteral(props.template, 'padding')}
          placeholder="24px"
          badge="inner"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'padding', value)
          }
        />
        <LengthStyleField
          label="Margin"
          value={readStyleLiteral(props.template, 'margin')}
          placeholder="0px"
          badge="outer"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'margin', value)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LengthStyleField
          label="Gap"
          value={readStyleLiteral(props.template, 'gap')}
          placeholder="12px"
          badge="stack"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'gap', value)
          }
        />
        <LengthStyleField
          label="Min Height"
          value={readStyleLiteral(props.template, 'minHeight')}
          placeholder="0px"
          badge="min"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'minHeight', value)
          }
        />
      </div>
    </ControlCard>
  );
};
