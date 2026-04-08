import { cn } from '@app/utils';

type SegmentedControlItem = {
  value: string;
  label: string;
};

type SegmentedControlProps = {
  value: string;
  items: SegmentedControlItem[];
  onChange: (value: string) => void;
};

export const SegmentedControl = (props: SegmentedControlProps) => {
  return (
    <div
      className="grid gap-2 rounded-[16px] border border-slate-200 bg-white p-1.5"
      style={{
        gridTemplateColumns: `repeat(${props.items.length}, minmax(0, 1fr))`,
      }}
    >
      {props.items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => props.onChange(item.value)}
          className={cn(
            'rounded-[12px] px-3 py-2 text-[11px] font-semibold transition',
            item.value === props.value
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:text-slate-800'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
