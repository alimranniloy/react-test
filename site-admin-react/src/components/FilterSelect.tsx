import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowPathIcon,
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Fuse from "fuse.js";

export type FilterSelectOption = { id: number; title: string };

type FilterSelectProps = {
  label: string;
  items: FilterSelectOption[];
  value: number | number[] | null;
  onChange: (next: number | number[] | null) => void;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
  onSearch?: (term: string | null) => void;
  radiusClassName?: string;
  buttonClassName?: string;
};

export default function FilterSelect({
  label,
  items,
  value,
  onChange,
  multiple = false,
  disabled,
  loading,
  onSearch,
  radiusClassName = "rounded-2xl",
  buttonClassName = "",
}: FilterSelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const selectedItems = useMemo(() => {
    if (!multiple) return [];
    const ids = Array.isArray(value) ? value : [];
    return items.filter((item) => ids.includes(item.id));
  }, [items, multiple, value]);

  const selectedItem = useMemo(
    () => (multiple ? null : items.find((item) => item.id === value) ?? null),
    [items, multiple, value],
  );

  const filteredItems = useMemo(() => {
    const data = items ? [...items] : [];
    const term = query.trim();
    if (term.length === 0) return data;
    const fuse = new Fuse(data, {
      keys: ["title"],
      threshold: 0.25,
      ignoreLocation: true,
    });
    return fuse.search(term).map((result) => result.item);
  }, [items, query]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 3000);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!onSearch) return;
    if (debouncedQuery.length === 0) {
      onSearch(null);
    } else if (debouncedQuery.length > 2) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const summaryText = multiple
    ? selectedItems.length > 0
      ? `${selectedItems.length} selected`
      : `Select ${label.toLowerCase()}...`
    : selectedItem?.title || `Select ${label.toLowerCase()}...`;

  return (
    <div ref={rootRef} className={`relative w-full ${isOpen ? "z-20" : ""}`}>
      <label
        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-slate-700 z-10"
        htmlFor={`${label}-filter`}
      >
        {label}
      </label>
      <button
        type="button"
        id={`${label}-filter`}
        className={`flex min-h-[40px] w-full items-center justify-between border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60 ${radiusClassName} ${buttonClassName}`}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
      >
        <span className="truncate">{summaryText}</span>
        <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 z-50 mt-2">
          <div
            className={`border border-slate-200 bg-white shadow-xl ${radiusClassName}`}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <button
                type="button"
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition ${
                  multiple
                    ? selectedItems.length === 0
                    : !selectedItem
                    ? "cursor-not-allowed text-slate-300"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
                disabled={multiple ? selectedItems.length === 0 : !selectedItem}
                onClick={(event) => {
                  event.stopPropagation();
                  onChange(multiple ? [] : null);
                }}
              >
                <XMarkIcon className="h-3.5 w-3.5" />
                Clear
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                onClick={(event) => {
                  event.stopPropagation();
                  setQuery("");
                }}
              >
                <ArrowPathIcon
                  className={`h-3.5 w-3.5 ${
                    loading ? "animate-spin text-indigo-500" : ""
                  }`}
                />
                Refresh
              </button>
            </div>

            <div className="px-3 pb-2 pt-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                autoComplete="off"
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="max-h-60 overflow-y-auto px-1 pb-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isSelected = multiple
                    ? selectedItems.some((entry) => entry.id === item.id)
                    : selectedItem?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                        isSelected
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (multiple) {
                          const current = Array.isArray(value) ? value : [];
                          const exists = current.includes(item.id);
                          const next = exists
                            ? current.filter((id) => id !== item.id)
                            : [...current, item.id];
                          onChange(next);
                        } else {
                          onChange(item.id);
                          setIsOpen(false);
                        }
                      }}
                    >
                      <span className="truncate">{item.title}</span>
                      {isSelected ? (
                        <CheckIcon className="h-4 w-4 text-indigo-600" />
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-6 text-center text-xs text-slate-400">
                  No {label.toLowerCase()} found.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
