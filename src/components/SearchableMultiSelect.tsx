import { useMemo, useState } from "react";

type Option = {
  id: number;
  title: string;
};

type SearchableMultiSelectProps = {
  label: string;
  options: Option[];
  selected: number[];
  onChange: (next: number[]) => void;
  placeholder?: string;
  multiple?: boolean;
  helperText?: string;
};

export default function SearchableMultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Search...",
  multiple = true,
  helperText
}: SearchableMultiSelectProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const text = query.toLowerCase();
    return options.filter((option) => option.title.toLowerCase().includes(text));
  }, [options, query]);

  const toggle = (id: number) => {
    if (!multiple) {
      onChange([id]);
      return;
    }
    if (selected.includes(id)) {
      onChange(selected.filter((value) => value !== id));
      return;
    }
    onChange([...selected, id]);
  };

  const remove = (id: number) => {
    onChange(selected.filter((value) => value !== id));
  };

  const selectedOptions = useMemo(
    () => selected.map((id) => options.find((option) => option.id === id)).filter(Boolean) as Option[],
    [selected, options]
  );

  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-700">{label}</p>
          {helperText ? <p className="text-[11px] text-slate-400">{helperText}</p> : null}
        </div>
        {selected.length ? (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="mt-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-transparent bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-200"
        />
      </div>
      {selectedOptions.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-600"
            >
              {option.title}
              <button
                type="button"
                onClick={() => remove(option.id)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {filtered.length ? (
          filtered.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs ${
                selected.includes(option.id)
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-slate-200/60 bg-white text-slate-600"
              }`}
            >
              <span className="truncate">{option.title}</span>
              <span className="text-[10px]">{selected.includes(option.id) ? "Selected" : "Pick"}</span>
            </button>
          ))
        ) : (
          <p className="text-xs text-slate-400">No matches found.</p>
        )}
      </div>
    </div>
  );
}
