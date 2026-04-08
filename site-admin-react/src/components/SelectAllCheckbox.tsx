import type { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";

type SelectAllCheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onChange: (checked: boolean) => void;
  className?: string;
};

export default function SelectAllCheckbox({
  checked,
  indeterminate = false,
  disabled = false,
  ariaLabel = "Select rows",
  onChange,
  className
}: SelectAllCheckboxProps) {
  const value: CheckedState = indeterminate ? "indeterminate" : checked;

  return (
    <Checkbox
      checked={value}
      disabled={disabled}
      aria-label={ariaLabel}
      onCheckedChange={(state) => onChange(state === true)}
      className={
        className ??
        "h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      }
    />
  );
}
