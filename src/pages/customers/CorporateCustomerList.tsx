import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { SITE_QUOTE_REQUESTS } from "@/graphql/queries/corporate";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const pageSizeOptions = [15, 30, 50, 100];

export default function CorporateCustomerList() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

  const offset = (page - 1) * pageSize;

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      search: search.trim() || null,
      startDate: fromDate ? new Date(fromDate).toISOString() : null,
      endDate: toDate ? new Date(toDate).toISOString() : null,
      first: pageSize,
      offset
    }),
    [siteId, search, fromDate, toDate, pageSize, offset]
  );

  const { data, loading, refetch } = useQuery(SITE_QUOTE_REQUESTS, {
    variables,
    skip: !siteId,
    fetchPolicy: "cache-and-network"
  });

  const customers = data?.siteQuoteRequests?.edges?.map((edge: any) => edge.node) ?? [];
  const total = data?.siteQuoteRequests?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const onSearch = () => {
    setSearch(localSearch);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Corporate Customers</h2>
            <p className="text-sm text-slate-500">
              Manage customer relationships and orders for enhanced service and support.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
            >
              ↻
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
              <span>From</span>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none"
              />
              <span className="text-slate-300">|</span>
              <span>To</span>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSearch();
              }}
              placeholder="Search by customer, phone or status"
              className="w-64 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="button"
            onClick={onSearch}
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:border-indigo-200 hover:text-indigo-600"
          >
            Search
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="table-source-wrap">
            <AppTable className="data-table min-w-full divide-y divide-gray-300">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead scope="col" className="relative w-6 px-4 sm:w-6 sm:px-4">
                    SL
                  </TableHead>
                  <TableHead scope="col" className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </TableHead>
                  <TableHead scope="col" className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    Organization Name
                  </TableHead>
                  <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Phone
                  </TableHead>
                  <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    File
                  </TableHead>
                  <TableHead scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 bg-white">
                {customers.map((customer: any, index: number) => (
                  <TableRow key={customer.id} className="cursor-pointer active:cursor-wait">
                    <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">
                      {index + 1 + offset}
                    </TableCell>
                    <TableCell className="whitespace-nowrap bg-white text-sm text-gray-500 py-3.5 pl-4 pr-3">
                      {customer.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap bg-white text-sm text-gray-500 py-3.5 pl-4 pr-3">
                      {customer.organizationName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap bg-white text-sm text-gray-500 py-3.5 pl-4 pr-3">
                      {customer.phone}
                    </TableCell>
                    <TableCell className="whitespace-nowrap hover:text-blue-600 hover:underline bg-white text-sm text-gray-500">
                      {customer.fileUrl ? (
                        <a href={customer.fileUrl} target="_blank" rel="noreferrer">
                          Download
                        </a>
                      ) : (
                        <span>No file</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right">
                      <button
                        type="button"
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
                      >
                        ⚙
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </AppTable>

            {!loading && customers.length === 0 ? (
              <nav className="text-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6" aria-label="Pagination">
                <div className="sm:block">
                  <p className="text-sm text-gray-700">No record :-(</p>
                </div>
              </nav>
            ) : (
              <PaginationFooter
                count={customers.length}
                total={total}
                page={page}
                pageCount={totalPages}
                from={customers.length > 0 ? offset + 1 : 0}
                to={offset + customers.length}
                onPageChange={(nextPage) => setPage(Math.max(1, Math.min(totalPages, nextPage)))}
                pageSize={pageSize}
                pageSizeOptions={pageSizeOptions}
                onPageSizeChange={(value) => {
                  setPageSize(value);
                  setPage(1);
                }}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
