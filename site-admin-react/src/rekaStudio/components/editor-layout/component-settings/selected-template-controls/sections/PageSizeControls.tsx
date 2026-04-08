import * as t from '@rekajs/types';

import { TextField } from '@app/components/text-field';
import { useEditor } from '@app/editor';

import { ControlCard } from '../controls/ControlCard';
import { ControlField } from '../controls/ControlField';
import { ensureStyleExpression, readStyleLiteral } from '../style-utils';

type PageSizeControlsProps = {
  template: (t.TagTemplate & t.SlottableTemplate) | null;
};

const normalizeLengthValue = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (/%|px|rem|em|vh|vw$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = Number.parseFloat(trimmed);

  if (!Number.isFinite(parsed)) {
    return '';
  }

  return `${parsed}px`;
};

export const PageSizeControls = (props: PageSizeControlsProps) => {
  const editor = useEditor();

  if (!props.template) {
    return null;
  }

  const currentValue =
    readStyleLiteral(props.template, 'minHeight') ||
    readStyleLiteral(props.template, 'height');

  return (
    <ControlCard
      eyebrow="Page"
      title="Page size"
      description="Only the full page block gets this control. Increase the bottom space from here instead of dragging on canvas."
    >
      <ControlField label="Size" hint="height">
        <TextField
          value={currentValue}
          placeholder="1200px"
          className="h-[42px] rounded-[14px] border-slate-200 bg-white"
          inputClassName="text-[11px] font-medium"
          onCommit={(value) => {
            const normalized = normalizeLengthValue(String(value ?? ''));

            editor.reka.change(() => {
              const style = ensureStyleExpression(props.template as t.TagTemplate);

              if (!style) {
                return;
              }

              delete style.properties.height;

              if (!normalized) {
                delete style.properties.minHeight;
                delete style.properties.overflow;
                return;
              }

              style.properties.minHeight = t.literal({ value: normalized });
              style.properties.overflow = t.literal({ value: 'visible' });
            });
          }}
        />
      </ControlField>
    </ControlCard>
  );
};
