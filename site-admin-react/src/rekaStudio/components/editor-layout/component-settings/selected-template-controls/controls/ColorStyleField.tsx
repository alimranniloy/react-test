import { TextField } from '@app/components/text-field';

import { ControlField } from './ControlField';

type ColorStyleFieldProps = {
  label: string;
  value: string;
  fallback?: string;
  onChange: (value: string) => void;
};

const getColorInputValue = (value: string, fallback: string) => {
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())) {
    return value.trim();
  }

  return fallback;
};

export const ColorStyleField = (props: ColorStyleFieldProps) => {
  const fallback = props.fallback ?? '#0f172a';

  return (
    <ControlField label={props.label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={getColorInputValue(props.value, fallback)}
          onChange={(event) => props.onChange(event.target.value)}
          className="h-[42px] w-12 cursor-pointer rounded-[14px] border border-slate-200 bg-white p-1"
        />
        <TextField
          value={props.value}
          placeholder={fallback}
          className="h-[42px] rounded-[14px] border-slate-200 bg-white"
          inputClassName="text-[11px] font-medium tracking-[0.08em] uppercase"
          onCommit={(value) => props.onChange(String(value ?? ''))}
        />
      </div>
    </ControlField>
  );
};
