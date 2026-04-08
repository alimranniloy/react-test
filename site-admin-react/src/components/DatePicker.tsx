import { Fragment, useEffect, useMemo, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export type DatePickerShortcut = {
  label: string;
  atClick: () => [Date, Date];
};

type DatePickerValue = string | [string, string] | null;

type DatePickerProps = {
  title?: string;
  range?: boolean;
  disabled?: boolean;
  inline?: boolean;
  value?: DatePickerValue;
  minDate?: Date | null;
  maxDate?: Date | null;
  shortcuts?: DatePickerShortcut[];
  onChange?: (value: DatePickerValue) => void;
};

const formatLabel = (value: DatePickerValue, title: string, range: boolean) => {
  const formatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
  if (!value) return title;
  if (range) {
    const [start, end] = Array.isArray(value) ? value : ["", ""];
    if (!start) return title;
    const startDate = new Date(start);
    if (Number.isNaN(startDate.getTime())) return title;
    if (!end) return formatter.format(startDate);
    const endDate = new Date(end);
    if (Number.isNaN(endDate.getTime())) return formatter.format(startDate);
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
  }
  if (typeof value === "string" && value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return title;
    return formatter.format(date);
  }
  return title;
};

const toInputDate = (value?: Date | null) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

export default function DatePicker({
  title = "Filter by Date",
  range = false,
  disabled = false,
  inline = false,
  value = null,
  minDate = null,
  maxDate = null,
  shortcuts = [],
  onChange,
}: DatePickerProps) {
  const [singleValue, setSingleValue] = useState<string>("");
  const [rangeValue, setRangeValue] = useState<[string, string]>(["", ""]);

  useEffect(() => {
    if (range) {
      if (Array.isArray(value)) {
        setRangeValue([value[0] ?? "", value[1] ?? ""]);
      } else {
        setRangeValue(["", ""]);
      }
    } else {
      setSingleValue(typeof value === "string" ? value : "");
    }
  }, [range, value]);

  const label = useMemo(() => formatLabel(value, title, range), [value, title, range]);
  const min = toInputDate(minDate);
  const max = toInputDate(maxDate);

  const handleSingleChange = (next: string) => {
    setSingleValue(next);
    onChange?.(next || null);
  };

  const handleRangeChange = (start: string, end: string) => {
    setRangeValue([start, end]);
    if (start && end) {
      onChange?.([start, end]);
    } else if (!start && !end) {
      onChange?.(null);
    } else {
      onChange?.([start || "", end || ""]);
    }
  };

  const applyShortcut = (shortcut: DatePickerShortcut) => {
    const [start, end] = shortcut.atClick();
    const startValue = toInputDate(start);
    const endValue = toInputDate(end);
    if (startValue && endValue) {
      setRangeValue([startValue, endValue]);
      onChange?.([startValue, endValue]);
    }
  };

  if (inline) {
    return (
      <div className="space-y-2">
        {range ? (
          <>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {title} (start)
              </label>
              <input
                type="date"
                value={rangeValue[0]}
                min={min}
                max={max}
                disabled={disabled}
                onChange={(event) =>
                  handleRangeChange(event.target.value, rangeValue[1])
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {title} (end)
              </label>
              <input
                type="date"
                value={rangeValue[1]}
                min={min}
                max={max}
                disabled={disabled}
                onChange={(event) =>
                  handleRangeChange(rangeValue[0], event.target.value)
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              {title}
            </label>
            <input
              type="date"
              value={singleValue}
              min={min}
              max={max}
              disabled={disabled}
              onChange={(event) => handleSingleChange(event.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            disabled={disabled}
            className={`relative flex h-12 w-full items-center justify-start rounded-md border border-slate-200 bg-white px-3 text-left text-sm font-normal text-slate-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60 ${
              !value ? "text-slate-400" : ""
            }`}
          >
            <label className="absolute -top-2 left-3 z-10 bg-white px-1 text-xs font-medium text-gray-500">
              {title}
            </label>
            <CalendarDaysIcon className="mr-2 h-4 w-4" />
            <span className="truncate">{label}</span>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-20 mt-2 w-full min-w-[280px] rounded-md border border-slate-200 bg-white p-3 shadow-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                {range && shortcuts.length > 0 ? (
                  <div className="w-full border-b border-slate-100 pb-2 sm:w-40 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-2">
                    <div className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Quick Filters
                    </div>
                    <div className="space-y-1">
                      {shortcuts.map((shortcut) => (
                        <button
                          key={shortcut.label}
                          type="button"
                          className="w-full rounded-md px-2 py-1 text-left text-xs text-slate-600 hover:bg-slate-100"
                          onClick={() => applyShortcut(shortcut)}
                        >
                          {shortcut.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex-1 space-y-2">
                  {range ? (
                    <>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Start date
                        </label>
                        <input
                          type="date"
                          value={rangeValue[0]}
                          min={min}
                          max={max}
                          onChange={(event) =>
                            handleRangeChange(event.target.value, rangeValue[1])
                          }
                          className="block w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          End date
                        </label>
                        <input
                          type="date"
                          value={rangeValue[1]}
                          min={min}
                          max={max}
                          onChange={(event) =>
                            handleRangeChange(rangeValue[0], event.target.value)
                          }
                          className="block w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Select date
                      </label>
                      <input
                        type="date"
                        value={singleValue}
                        min={min}
                        max={max}
                        onChange={(event) => handleSingleChange(event.target.value)}
                        className="block w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
