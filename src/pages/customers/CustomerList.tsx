import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { STORE_CUSTOMERS } from "@/graphql/queries/customer";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

dayjs.extend(relativeTime);
dayjs.extend(duration);

type TabName =
  | "All"
  | "Active"
  | "Inactive"
  | "Customer"
  | "Reseller"
  | "Affiliate"
  | "Wholesaler"
  | "Abandoned"
  | "New"
  | "Regular"
  | "VIP"
  | "Fraud";

type SortDirection = "asc" | "desc" | null;

const tabs: { name: TabName }[] = [
  { name: "All" },
  { name: "Active" },
  { name: "Inactive" },
  { name: "Customer" },
  { name: "Reseller" },
  { name: "Affiliate" },
  { name: "Wholesaler" },
  { name: "Abandoned" },
  { name: "New" },
  { name: "Regular" },
  { name: "VIP" },
  { name: "Fraud" }
];

const customerTypes = [
  { id: 1, title: "Customer" },
  { id: 2, title: "Reseller" },
  { id: 3, title: "Wholesaler" },
  { id: 4, title: "Affiliate" }
];

const customerNatureTypes = [
  { id: 1, title: "New" },
  { id: 2, title: "Regular" },
  { id: 3, title: "VIP" },
  { id: 4, title: "Fraud" }
];

const pageSizeOptions = [15, 30, 100, 200, 500, 1000];

const formatMoney = (value: number | null | undefined, currency?: string | null) => {
  if (value == null || Number.isNaN(value)) return "—";
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "BDT",
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `${currency || "BDT"} ${value}`;
  }
};

const getQueryType = (name: TabName) => {
  const list = [
    { code: "abandoned_cart", name: "Abandoned" },
    { code: "highest_orders", name: "Highest orders" },
    { code: "highest_profit", name: "Highest profit" },
    { code: "highest_purchase", name: "Highest purchase" },
    { code: "top_purchase", name: "Top purchase" },
    { code: "top_orders", name: "Top orders" },
    { code: "lowest_orders", name: "Lowest orders" },
    { code: "lowest_profit", name: "Lowest profit" },
    { code: "lowest_purchase", name: "Lowest purchase" },
    { code: "least_purchase", name: "Least purchase" },
    { code: "least_orders", name: "Least orders" }
  ];

  return list.find((item) => item.name === name) ?? null;
};

export default function CustomerList() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [selectedTab, setSelectedTab] = useState<TabName>("All");
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showActions, setShowActions] = useState(false);

  const statusFilter = selectedTab === "Active" ? true : selectedTab === "Inactive" ? false : null;
  const customerNatureFilter = ["New", "Regular", "VIP", "Fraud"].includes(selectedTab)
    ? selectedTab === "New"
      ? 1
      : selectedTab === "Regular"
      ? 2
      : selectedTab === "VIP"
      ? 3
      : 4
    : null;
  const customerTypesFilter = ["Customer", "Reseller", "Affiliate", "Wholesaler"].includes(selectedTab)
    ? selectedTab === "Customer"
      ? 1
      : selectedTab === "Reseller"
      ? 2
      : selectedTab === "Affiliate"
      ? 4
      : 3
    : null;
  const queryTypeFilter = selectedTab === "Abandoned" ? "abandoned_cart" : getQueryType(selectedTab)?.code ?? null;

  const offset = (page - 1) * pageSize;

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      customerType: customerNatureFilter,
      customerTypes: customerTypesFilter,
      queryType: queryTypeFilter,
      isActive: statusFilter,
      search: search.trim() || null,
      from: fromDate ? new Date(fromDate).toISOString() : null,
      to: toDate ? new Date(toDate).toISOString() : null,
      first: pageSize,
      offset,
      after: null
    }),
    [
      siteId,
      customerNatureFilter,
      customerTypesFilter,
      queryTypeFilter,
      statusFilter,
      search,
      fromDate,
      toDate,
      pageSize,
      offset
    ]
  );

  const { data, loading, refetch } = useQuery(STORE_CUSTOMERS, {
    variables,
    skip: !siteId,
    fetchPolicy: "cache-and-network"
  });

  const customers = data?.storeCustomers?.edges?.map((edge: any) => edge.node) ?? [];
  const total = data?.storeCustomers?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const allSelected = selectedIds.length > 0 && selectedIds.length === customers.length;
  const indeterminate = selectedIds.length > 0 && selectedIds.length < customers.length;

  const sortedCustomers = useMemo(() => {
    if (!sortDirection) return customers;
    return [...customers].sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
    });
  }, [customers, sortDirection]);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customers.map((customer: any) => customer.id));
    }
  };

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSort = () => {
    setSortDirection((prev) => {
      if (prev === null) return "desc";
      if (prev === "desc") return "asc";
      return null;
    });
  };

  const onSearch = () => {
    setSearch(localSearch);
    setPage(1);
  };

  const copyToClipboard = async (value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // ignore
    }
  };

  const getActiveStatus = (customer: any) => {
    const currentType = customerTypesFilter ?? 1;
    if (currentType === 1) return Boolean(customer.isActive);
    if (currentType === 2) return Boolean(customer.isReseller);
    if (currentType === 3) return Boolean(customer.isWholesale);
    if (currentType === 4) return Boolean(customer.isAffiliate);
    return Boolean(customer.isActive);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Customers</h2>
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
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => {
                setSelectedTab(tab.name);
                setPage(1);
              }}
              className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                selectedTab === tab.name
                  ? "border-indigo-100 bg-indigo-50 text-indigo-700 shadow-sm"
                  : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-700"
              }`}
            >
              {tab.name}
            </button>
          ))}
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
            {selectedIds.length > 0 ? (
              <div className="absolute top-0 left-12 pl-6 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
                <div className="flex flex-row items-center gap-2 mt-2 flex-nowrap overflow-visible ms-3 md:ms-0">
                  <div className="inline-flex items-center rounded-full border border-indigo-100 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 shadow-sm">
                    <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                    {selectedIds.length} selected
                  </div>
                  <div className="relative block">
                    <button
                      type="button"
                      onClick={() => setShowActions((prev) => !prev)}
                      className="inline-flex items-center rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:border-indigo-200 focus:ring-offset-2"
                    >
                      <span className="sr-only">Open options</span>
                      Action
                      <span className="ml-1 h-3 w-5 text-[10px]" aria-hidden="true">
                        {showActions ? "⌄" : "⌃"}
                      </span>
                    </button>
                    {showActions ? (
                      <div className="absolute left-0 top-[40px] z-50 w-[min(95vw,480px)] origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 mt-2">
                        <div className="p-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowActions(false);
                            }}
                            className="block w-full rounded-md border border-gray-200 px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-100"
                          >
                            Send SMS
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <AppTable className="data-table min-w-full divide-y divide-gray-300">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead scope="col" className="relative w-6 px-4 sm:w-6 sm:px-4">
                    SL
                  </TableHead>
                  <TableHead scope="col" className="relative w-5 px-5 sm:w-5 sm:px-5">
                    <input
                      type="checkbox"
                      className="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = indeterminate;
                        }
                      }}
                      onChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Name
                  </TableHead>
                  <TableHead scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Phone
                  </TableHead>
                  <TableHead scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                    Joined
                    <button type="button" className="ms-2" onClick={toggleSort}>
                      {sortDirection === null ? "↓↑" : sortDirection === "desc" ? "↓" : "↑"}
                    </button>
                  </TableHead>
                  <TableHead scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 w-16">
                    Status
                  </TableHead>
                  <TableHead scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                    Orders
                  </TableHead>
                  <TableHead scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                    Abandoned
                  </TableHead>
                  <TableHead scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                    Purchase
                  </TableHead>
                  <TableHead scope="col" className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">
                    Profit
                  </TableHead>
                  <TableHead scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 bg-white">
                {sortedCustomers.map((customer: any, index: number) => (
                  <TableRow
                    key={customer.id}
                    className={`cursor-pointer active:cursor-wait ${selectedIds.includes(customer.id) ? "bg-gray-50" : ""}`}
                  >
                    <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">
                      {index + 1 + offset}
                    </TableCell>
                    <TableCell className="relative w-5 px-5 sm:w-5 sm:px-5">
                      {selectedIds.includes(customer.id) ? (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"></div>
                      ) : null}
                      <input
                        type="checkbox"
                        className="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                        checked={selectedIds.includes(customer.id)}
                        onChange={() => toggleSelected(customer.id)}
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                          {customer.avatar ? (
                            <img src={customer.avatar} alt={customer.title} className="h-10 w-10 object-cover" />
                          ) : null}
                        </div>
                        <div>
                          <div className="text-gray-900 font-medium">{customer.title}</div>
                          <div className="text-xs text-gray-500">#{customer.nid || "—"} {customer.address ? `- ${customer.address}` : ""}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <div className="text-gray-900 text-right group flex items-center">
                        {customer.phone}
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            copyToClipboard(customer.phone);
                          }}
                          className="opacity-0 group-hover:opacity-50 hover:!opacity-100 ms-2"
                        >
                          ⧉
                        </button>
                      </div>
                      <div
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
                          (customerNatureTypes.find((item) => item.id === customer.customerType)?.title ?? "") === "Fraud"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {customerNatureTypes.find((item) => item.id === customer.customerType)?.title ?? ""}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <div className="text-gray-900">{dayjs(customer.createdAt).fromNow()}</div>
                      <div className="text-gray-500 text-xs">{dayjs(customer.createdAt).format("h:mm A MMM D")}</div>
                    </TableCell>
                    <TableCell className="whitespace-wrap px-2 py-2 text-sm text-gray-500">
                      <div className="gap-1 flex flex-wrap">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
                            getActiveStatus(customer) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getActiveStatus(customer) ? "Active" : "Inactive"}
                        </span>
                        {(customer.customerTypes ?? []).map((item: number) => (
                          <span
                            key={`${customer.id}-${item}`}
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
                              item === 1
                                ? "bg-green-100 text-green-800"
                                : item === 2 && customer.isReseller
                                ? "bg-green-100 text-green-800"
                                : item === 3 && customer.isWholesale
                                ? "bg-green-100 text-green-800"
                                : item === 4 && customer.isAffiliate
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {customerTypes.find((type) => type.id === item)?.title ?? ""}
                          </span>
                        ))}
                      </div>
                      <div className="text-gray-800 my-1 px-2 line-clamp-2 leading-snug text-[10px] w-30">
                        {customer.tags}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-green-500 text-right font-semibold">
                      {customer.ordersTotal}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-red-500 text-right font-semibold">
                      {customer.cartCount}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-orange-500 text-right font-semibold">
                      {formatMoney(customer.totalPurchase, customer.currency)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-blue-500 text-right font-semibold">
                      {formatMoney(customer.totalProfit, customer.currency)}
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
