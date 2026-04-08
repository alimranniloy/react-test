import * as t from '@rekajs/types';

import { useEditor } from '@app/editor';
import { Select } from '@app/components/select';

import { ColorStyleField } from '../controls/ColorStyleField';
import { ControlCard } from '../controls/ControlCard';
import { LengthStyleField } from '../controls/LengthStyleField';
import {
  readStyleLiteral,
  setStyleLiteral,
  setPixelStyle,
} from '../style-utils';

const SHADOW_PRESETS = [
  { value: '__none__', title: 'None' },
  {
    value: '0 18px 45px -28px rgba(15, 23, 42, 0.38)',
    title: 'Soft Glow',
  },
  {
    value: '0 18px 36px -18px rgba(14, 165, 233, 0.35)',
    title: 'Blue Float',
  },
  {
    value: '0 12px 30px -12px rgba(15, 23, 42, 0.3)',
    title: 'Card Lift',
  },
];

type SurfaceControlsProps = {
  template: t.TagTemplate;
};

export const SurfaceControls = (props: SurfaceControlsProps) => {
  const editor = useEditor();

  return (
    <ControlCard
      eyebrow="Surface"
      title="Color, radius, shadow"
      description="Use inline styles for fast visual control without touching class strings."
    >
      <div className="grid grid-cols-1 gap-3">
        <ColorStyleField
          label="Background"
          value={readStyleLiteral(props.template, 'backgroundColor')}
          fallback="#ffffff"
          onChange={(value) =>
            setStyleLiteral(editor, props.template, 'backgroundColor', value)
          }
        />
        <ColorStyleField
          label="Text"
          value={readStyleLiteral(props.template, 'color')}
          fallback="#0f172a"
          onChange={(value) =>
            setStyleLiteral(editor, props.template, 'color', value)
          }
        />
        <ColorStyleField
          label="Border"
          value={readStyleLiteral(props.template, 'borderColor')}
          fallback="#cbd5e1"
          onChange={(value) =>
            setStyleLiteral(editor, props.template, 'borderColor', value)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LengthStyleField
          label="Radius"
          value={readStyleLiteral(props.template, 'borderRadius')}
          placeholder="18px"
          badge="round"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'borderRadius', value)
          }
        />
        <LengthStyleField
          label="Border Width"
          value={readStyleLiteral(props.template, 'borderWidth')}
          placeholder="1px"
          badge="stroke"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'borderWidth', value)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LengthStyleField
          label="Opacity"
          value={readStyleLiteral(props.template, 'opacity')}
          placeholder="1"
          badge="0-1"
          onCommit={(value) =>
            setStyleLiteral(editor, props.template, 'opacity', value)
          }
        />
        <div>
          <div className="mb-1.5 text-[11px] font-medium text-slate-700">
            Shadow
          </div>
          <Select
            className="min-h-[42px] w-full rounded-[14px] border-slate-200 bg-white text-[11px]"
            items={SHADOW_PRESETS}
            value={readStyleLiteral(props.template, 'boxShadow') || '__none__'}
            onChange={(value) =>
              setStyleLiteral(
                editor,
                props.template,
                'boxShadow',
                value === '__none__' ? '' : value
              )
            }
            placeholder="Select shadow"
          />
        </div>
      </div>
    </ControlCard>
  );
};
