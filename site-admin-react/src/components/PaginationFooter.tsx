import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

type PaginationFooterProps = {
  count: number;
  total?: number;
  hasNext?: boolean;
  onLoadMore?: () => void;
  label?: string;
  loading?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (value: number) => void;
  nextLabel?: string;
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  from?: number;
  to?: number;
};

export default function PaginationFooter({
  count,
  total,
  hasNext,
  onLoadMore,
  label = "items",
  loading,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  nextLabel = "Load more",
  page,
  pageCount,
  onPageChange,
  from,
  to
}: PaginationFooterProps) {
  const safeTotal = total ?? count;
  const pageMode = typeof page === "number" && typeof pageCount === "number" && typeof onPageChange === "function";
  const rangeFrom = from ?? (count > 0 ? 1 : 0);
  const rangeTo = to ?? count;
  const showingText = total != null ? `Showing ${rangeFrom}-${rangeTo} of ${safeTotal}` : `Showing ${count} ${label}`;
  const canPrev = pageMode ? page > 1 : false;
  const canNext = pageMode ? page < pageCount : Boolean(hasNext);

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-600">
      <span className="font-medium">{showingText}</span>
      <div className="flex flex-wrap items-center gap-2">
        {pageSizeOptions?.length && pageSize && onPageSizeChange ? (
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700">
            <span>Per page</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              {pageSizeOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            {pageMode ? (
              <>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(page - 1)}
                    disabled={!canPrev || loading}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>
                    {loading ? "Loading..." : `Page ${page} / ${pageCount}`}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(page + 1)}
                    disabled={!canNext || loading}
                  />
                </PaginationItem>
              </>
            ) : (
              <PaginationItem>
                <PaginationLink
                  onClick={onLoadMore}
                  disabled={!canNext || loading}
                >
                  {canNext ? (loading ? "Loading..." : nextLabel) : "No more"}
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
