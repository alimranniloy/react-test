import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import AppTable from "@/components/AppTable";
import SelectAllCheckbox from "@/components/SelectAllCheckbox";
import TableBulkBar from "@/components/TableBulkBar";
import PaginationFooter from "@/components/PaginationFooter";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  headClassName?: string;
  cellClassName?: string;
};

export type DataTableAction<T> = {
  label: string;
  onClick: (rows: T[]) => void | Promise<void>;
  tone?: "default" | "success" | "warning" | "danger";
  disabled?: boolean;
};

type CursorAdapter = {
  mode: "cursor";
  count: number;
  total?: number;
  hasNext?: boolean;
  onLoadMore?: () => void;
  loading?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (value: number) => void;
  nextLabel?: string;
  from?: number;
  to?: number;
};

type OffsetAdapter = {
  mode: "offset";
  count: number;
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (value: number) => void;
  from?: number;
  to?: number;
};

export type DataTablePaginationAdapter = CursorAdapter | OffsetAdapter;
type RowId = string | number;

type DataTableProps<T> = {
  rows: T[];
  getRowId: (row: T) => RowId;
  columns: DataTableColumn<T>[];
  selection?: {
    selectedIds: RowId[];
    onToggleAll: (checked: boolean) => void;
    onToggleOne: (id: RowId, checked: boolean) => void;
    allSelected: boolean;
    indeterminate: boolean;
    onClear: () => void;
    actions?: DataTableAction<T>[];
  };
  loading?: boolean;
  emptyLabel?: string;
  pagination?: DataTablePaginationAdapter;
  className?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string | undefined;
  showSerial?: boolean;
  serialHeader?: ReactNode;
};

export default function DataTable<T>({
  rows,
  getRowId,
  columns,
  selection,
  loading = false,
  emptyLabel = "No records found.",
  pagination,
  className,
  onRowClick,
  rowClassName,
  showSerial = true,
  serialHeader = "SL"
}: DataTableProps<T>) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<RowId[]>([]);
  const externalSelectionEnabled = Boolean(selection);
  const selectedIds = externalSelectionEnabled ? selection!.selectedIds : internalSelectedIds;

  const internalAllSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(getRowId(row)));
  const internalIndeterminate = selectedIds.length > 0 && !internalAllSelected;

  const onToggleAll = (checked: boolean) => {
    if (externalSelectionEnabled) {
      selection!.onToggleAll(checked);
      return;
    }
    if (!checked) {
      setInternalSelectedIds([]);
      return;
    }
    setInternalSelectedIds(rows.map((row) => getRowId(row)));
  };

  const onToggleOne = (id: RowId, checked: boolean) => {
    if (externalSelectionEnabled) {
      selection!.onToggleOne(id, checked);
      return;
    }
    setInternalSelectedIds((prev) => (checked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((item) => item !== id)));
  };

  const onClear = () => {
    if (externalSelectionEnabled) {
      selection!.onClear();
      return;
    }
    setInternalSelectedIds([]);
  };

  const selectedRows = useMemo(() => {
    const idSet = new Set(selectedIds);
    return rows.filter((row) => idSet.has(getRowId(row)));
  }, [rows, selectedIds, getRowId]);

  const serialStart = pagination?.from && pagination.from > 0 ? pagination.from : 1;
  const allSelected = externalSelectionEnabled ? selection!.allSelected : internalAllSelected;
  const indeterminate = externalSelectionEnabled ? selection!.indeterminate : internalIndeterminate;
  const bulkActions = externalSelectionEnabled ? (selection!.actions ?? []) : [];
  const footerFrom = pagination?.from ?? (rows.length > 0 ? 1 : 0);
  const footerTo = pagination?.to ?? rows.length;

  return (
    <div className={`table-source-wrap overflow-hidden rounded-2xl border border-slate-200 bg-white ${className ?? ""}`.trim()}>
      {selectedRows.length > 0 ? (
        <TableBulkBar
          selectedCount={selectedRows.length}
          onClear={onClear}
          actions={bulkActions.map((item) => ({
            label: item.label,
            onClick: () => item.onClick(selectedRows),
            tone: item.tone,
            disabled: item.disabled
          }))}
        />
      ) : null}
      <AppTable className="data-table min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-slate-50/90 backdrop-blur-sm">
          <TableRow>
            {showSerial ? <TableHead className="w-16 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{serialHeader}</TableHead> : null}
            <TableHead className="w-14 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              <SelectAllCheckbox
                checked={allSelected}
                indeterminate={indeterminate}
                disabled={rows.length === 0}
                onChange={onToggleAll}
                ariaLabel="Select all rows"
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead key={column.id} className={column.headClassName ?? "px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, index) => {
            const id = getRowId(row);
            const isSelected = selectedIds.includes(id);
            return (
              <TableRow
                key={id}
                className={`${isSelected ? "bg-indigo-50/60" : "hover:bg-slate-50/70"} ${rowClassName?.(row) ?? ""}`.trim()}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {showSerial ? <TableCell className="whitespace-nowrap bg-slate-50 px-4 py-2 text-center text-sm font-medium text-slate-500">{serialStart + index}</TableCell> : null}
                <TableCell
                  className="px-3 py-2"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <SelectAllCheckbox
                    checked={isSelected}
                    onChange={(checked) => onToggleOne(id, checked)}
                    ariaLabel={`Select row ${id}`}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={`${id}-${column.id}`} className={column.cellClassName ?? "px-3 py-2 text-sm text-gray-700"}>
                    {column.cell(row, index)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </AppTable>
      {!loading && rows.length === 0 ? (
        <div className="border-t border-gray-200 bg-white px-4 py-4 text-center text-sm text-gray-700">{emptyLabel}</div>
      ) : null}
      <div className="px-4 pb-4">
        {pagination ? (
          pagination.mode === "offset" ? (
            <PaginationFooter
              count={pagination.count}
              total={pagination.total}
              page={pagination.page}
              pageCount={pagination.pageCount}
              onPageChange={pagination.onPageChange}
              loading={pagination.loading}
              pageSize={pagination.pageSize}
              pageSizeOptions={pagination.pageSizeOptions}
              onPageSizeChange={pagination.onPageSizeChange}
              from={pagination.from}
              to={pagination.to}
            />
          ) : (
            <PaginationFooter
              count={pagination.count}
              total={pagination.total}
              hasNext={pagination.hasNext}
              onLoadMore={pagination.onLoadMore}
              loading={pagination.loading}
              pageSize={pagination.pageSize}
              pageSizeOptions={pagination.pageSizeOptions}
              onPageSizeChange={pagination.onPageSizeChange}
              nextLabel={pagination.nextLabel}
              from={pagination.from}
              to={pagination.to}
            />
          )
        ) : (
          <PaginationFooter
            count={rows.length}
            total={rows.length}
            hasNext={false}
            loading={loading}
            from={footerFrom}
            to={footerTo}
            nextLabel="No more"
          />
        )}
      </div>
    </div>
  );
}
