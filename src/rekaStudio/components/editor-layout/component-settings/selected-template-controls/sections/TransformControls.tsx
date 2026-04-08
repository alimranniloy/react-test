import * as t from '@rekajs/types';

import { useEditor } from '@app/editor';
import { Select } from '@app/components/select';

import { ControlCard } from '../controls/ControlCard';
import { LengthStyleField } from '../controls/LengthStyleField';
import {
  readRotateValue,
  readStyleLiteral,
  setPixelStyle,
  setRotateValue,
  setStyleLiteral,
} from '../style-utils';

type TransformControlsProps = {
  template: t.TagTemplate;
};

export const TransformControls = (props: TransformControlsProps) => {
  const editor = useEditor();

  return (
    <ControlCard
      eyebrow="Transform"
      title="Rotate and effects"
      description="Useful for shapes, stickers and decorative blocks placed freely on the canvas."
    >
      <div className="grid grid-cols-2 gap-3">
        <LengthStyleField
          label="Rotate"
          value={readRotateValue(props.template)}
          placeholder="0deg"
          badge="angle"
          onCommit={(value) => setRotateValue(editor, props.template, value)}
        />
        <LengthStyleField
          label="Blur"
          value={readStyleLiteral(props.template, 'filter').replace('blur(', '').replace(')', '')}
          placeholder="0px"
          badge="fx"
          onCommit={(value) => {
            const trimmed = String(value ?? '').trim();
            setStyleLiteral(
              editor,
              props.template,
              'filter',
              trimmed ? `blur(${/px$/.test(trimmed) ? trimmed : `${trimmed}px`})` : ''
            );
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LengthStyleField
          label="Outline Offset"
          value={readStyleLiteral(props.template, 'outlineOffset')}
          placeholder="0px"
          badge="edge"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'outlineOffset', value)
          }
        />
        <div>
          <div className="mb-1.5 text-[11px] font-medium text-slate-700">
            Border Style
          </div>
          <Select
            className="min-h-[42px] w-full rounded-[14px] border-slate-200 bg-white text-[11px]"
            items={[
              { value: '__default__', title: 'Default' },
              { value: 'solid', title: 'Solid' },
              { value: 'dashed', title: 'Dashed' },
              { value: 'dotted', title: 'Dotted' },
            ]}
            value={readStyleLiteral(props.template, 'borderStyle') || '__default__'}
            onChange={(value) =>
              setStyleLiteral(
                editor,
                props.template,
                'borderStyle',
                value === '__default__' ? '' : value
              )
            }
            placeholder="Choose style"
          />
        </div>
      </div>
    </ControlCard>
  );
};
