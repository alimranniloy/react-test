type SelectionOption = {
  id: number;
  title: string;
};

type SelectionPanelProps = {
  title: string;
  description?: string;
  options: SelectionOption[];
  selected: number[];
  onChange: (next: number[]) => void;
  emptyLabel?: string;
};

export default function SelectionPanel({
  title,
  description,
  options,
  selected,
  onChange,
  emptyLabel = "No options available"
}: SelectionPanelProps) {
  const toggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((value) => value !== id));
      return;
    }
    onChange([...selected, id]);
  };

  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-slate-700">{title}</p>
          {description ? <p className="text-[11px] text-slate-400">{description}</p> : null}
        </div>
        {options.length ? (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.length ? (
          options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-xs text-slate-600"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => toggle(option.id)}
                className="h-3 w-3 accent-indigo-500"
              />
              <span className="truncate">{option.title}</span>
            </label>
          ))
        ) : (
          <p className="text-xs text-slate-400">{emptyLabel}</p>
        )}
      </div>
    </div>
  );
}
