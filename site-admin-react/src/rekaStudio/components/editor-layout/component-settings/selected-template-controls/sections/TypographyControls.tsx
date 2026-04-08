import * as t from '@rekajs/types';

import { useEditor } from '@app/editor';
import { Select } from '@app/components/select';

import { ControlCard } from '../controls/ControlCard';
import { LengthStyleField } from '../controls/LengthStyleField';
import { SegmentedControl } from '../controls/SegmentedControl';
import { GOOGLE_FONT_OPTIONS } from '../font-options';
import {
  isTextLikeTemplate,
  readStyleLiteral,
  setPixelStyle,
  setStyleLiteral,
} from '../style-utils';

const FONT_WEIGHT_ITEMS = [
  { value: '__default__', title: 'Default' },
  { value: '400', title: 'Regular' },
  { value: '500', title: 'Medium' },
  { value: '600', title: 'Semibold' },
  { value: '700', title: 'Bold' },
  { value: '800', title: 'Extra Bold' },
];

type TypographyControlsProps = {
  template: t.TagTemplate;
};

export const TypographyControls = (props: TypographyControlsProps) => {
  const editor = useEditor();

  if (!isTextLikeTemplate(props.template)) {
    return null;
  }

  const fontStyle = readStyleLiteral(props.template, 'fontStyle');
  const textDecoration = readStyleLiteral(props.template, 'textDecoration');
  const textTransform = readStyleLiteral(props.template, 'textTransform');

  return (
    <ControlCard
      eyebrow="Typography"
      title="Text scale and tone"
      description="Control font sizing, weight, alignment and emphasis for text-heavy blocks."
    >
      <div>
        <div className="mb-1.5 text-[11px] font-medium text-slate-700">
          Font Family
        </div>
        <Select
          className="min-h-[42px] w-full rounded-[14px] border-slate-200 bg-white text-[11px]"
          items={[
            { value: '__default__', title: 'Default theme font' },
            ...GOOGLE_FONT_OPTIONS,
          ]}
          value={readStyleLiteral(props.template, 'fontFamily') || '__default__'}
          onChange={(value) =>
            setStyleLiteral(
              editor,
              props.template,
              'fontFamily',
              value === '__default__' ? '' : value
            )
          }
          placeholder="Pick Google font"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LengthStyleField
          label="Font Size"
          value={readStyleLiteral(props.template, 'fontSize')}
          placeholder="16px"
          badge="size"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'fontSize', value)
          }
        />
        <LengthStyleField
          label="Line Height"
          value={readStyleLiteral(props.template, 'lineHeight')}
          placeholder="24px"
          badge="line"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'lineHeight', value)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LengthStyleField
          label="Letter Spacing"
          value={readStyleLiteral(props.template, 'letterSpacing')}
          placeholder="0px"
          badge="tracking"
          onCommit={(value) =>
            setPixelStyle(editor, props.template, 'letterSpacing', value)
          }
        />
        <div>
          <div className="mb-1.5 text-[11px] font-medium text-slate-700">
            Font Weight
          </div>
          <Select
            className="min-h-[42px] w-full rounded-[14px] border-slate-200 bg-white text-[11px]"
            items={FONT_WEIGHT_ITEMS}
            value={
              readStyleLiteral(props.template, 'fontWeight') || '__default__'
            }
            onChange={(value) =>
              setStyleLiteral(
                editor,
                props.template,
                'fontWeight',
                value === '__default__' ? '' : value
              )
            }
            placeholder="Pick weight"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <div className="mb-1.5 text-[11px] font-medium text-slate-700">
            Text Align
          </div>
          <SegmentedControl
            value={readStyleLiteral(props.template, 'textAlign') || 'left'}
            items={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
              { value: 'justify', label: 'Justify' },
            ]}
            onChange={(value) =>
              setStyleLiteral(editor, props.template, 'textAlign', value)
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            className={`rounded-[14px] px-3 py-2 text-[11px] font-semibold ${
              fontStyle === 'italic'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
            onClick={() =>
              setStyleLiteral(
                editor,
                props.template,
                'fontStyle',
                fontStyle === 'italic' ? '' : 'italic'
              )
            }
          >
            Italic
          </button>
          <button
            type="button"
            className={`rounded-[14px] px-3 py-2 text-[11px] font-semibold ${
              textDecoration === 'underline'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
            onClick={() =>
              setStyleLiteral(
                editor,
                props.template,
                'textDecoration',
                textDecoration === 'underline' ? '' : 'underline'
              )
            }
          >
            Underline
          </button>
          <button
            type="button"
            className={`rounded-[14px] px-3 py-2 text-[11px] font-semibold ${
              textTransform === 'uppercase'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
            onClick={() =>
              setStyleLiteral(
                editor,
                props.template,
                'textTransform',
                textTransform === 'uppercase' ? '' : 'uppercase'
              )
            }
          >
            Uppercase
          </button>
        </div>
      </div>
    </ControlCard>
  );
};
