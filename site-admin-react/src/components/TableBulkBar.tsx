import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type BulkAction = {
  label: string;
  onClick: () => void;
  tone?: "default" | "success" | "warning" | "danger";
  disabled?: boolean;
};

type TableBulkBarProps = {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
};

const toneClass: Record<NonNullable<BulkAction["tone"]>, string> = {
  default: "text-gray-700 hover:bg-gray-50",
  success: "text-emerald-700 hover:bg-emerald-50",
  warning: "text-amber-700 hover:bg-amber-50",
  danger: "text-rose-700 hover:bg-rose-50"
};

export default function TableBulkBar({ selectedCount, actions, onClear }: TableBulkBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2">
      <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
        <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
        {selectedCount} selected
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100"
              >
                Actions
                <span className="ml-1">▾</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bulk actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action.label}
                  disabled={action.disabled}
                  onClick={action.onClick}
                  className={toneClass[action.tone ?? "default"]}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-100"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
