import { TextField } from '@app/components/text-field';

import { ControlField } from './ControlField';

type LengthStyleFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  badge?: string;
  onCommit: (value: string) => void;
};

export const LengthStyleField = (props: LengthStyleFieldProps) => {
  return (
    <ControlField label={props.label} hint={props.badge}>
      <TextField
        value={props.value}
        placeholder={props.placeholder ?? 'auto'}
        className="h-[42px] rounded-[14px] border-slate-200 bg-white"
        inputClassName="text-[11px] font-medium"
        onCommit={(value) => props.onCommit(String(value ?? ''))}
      />
    </ControlField>
  );
};
