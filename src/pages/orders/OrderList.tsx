import AppTable from "@/components/AppTable";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { STORE_ORDERS } from "@/graphql/queries/order";
import { SELF_STORE_ORDERS_EVENT_CREATE } from "@/graphql/mutations/order";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { useNotificationsStore } from "@/stores/notifications";
import PaginationFooter from "@/components/PaginationFooter";
import SelectAllCheckbox from "@/components/SelectAllCheckbox";
import TableBulkBar from "@/components/TableBulkBar";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const statusLabels: Record<number, string> = {
  0: "Processing",
  1: "Placed",
  2: "Confirmed",
  3: "Packaging",
  4: "Packaged",
  5: "Shipping",
  6: "Review",
  7: "Rejected",
  8: "Return",
  9: "Canceled",
  10: "Delivered",
  11: "Query",
  12: "Payment",
  13: "Notification",
  14: "Hold",
  15: "Not Responding",
  16: "Partial Delivered"
};

const orderTypes = [
  { id: 1, title: "Fresh" },
  { id: 2, title: "Duplicate" }
];

const customerTypes = [
  { id: 1, title: "New" },
  { id: 2, title: "Repeat" },
  { id: 3, title: "VIP" },
  { id: 4, title: "Wholesale" }
];

type OrderListProps = {
  title?: string;
  defaultSourceId?: number | null;
};

export default function OrderList({ title, defaultSourceId = null }: OrderListProps) {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const user = useAuthStore((state) => state.user);
  const { addNotification } = useNotificationsStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [status, setStatus] = useState<number | "">("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showMultipleSearch, setShowMultipleSearch] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<number | "">(defaultSourceId ?? "");
  const [customerTypeFilter, setCustomerTypeFilter] = useState<number | "">("");
  const [staffFilter, setStaffFilter] = useState<number | "">("");
  const [logisticsFilter, setLogisticsFilter] = useState<number | "">("");
  const [createdFrom, setCreatedFrom] = useState<string>("");
  const [createdTo, setCreatedTo] = useState<string>("");
  const [updatedFrom, setUpdatedFrom] = useState<string>("");
  const [updatedTo, setUpdatedTo] = useState<string>("");

  const tabs = [
    { id: null, name: "All" },
    { id: 0, name: "Processing" },
    { id: 1, name: "Placed" },
    { id: 2, name: "Confirmed" },
    { id: 3, name: "Packaging" },
    { id: 4, name: "Packaged" },
    { id: 5, name: "Shipping" },
    { id: 6, name: "Review" },
    { id: 7, name: "Rejected" },
    { id: 8, name: "Return" },
    { id: 9, name: "Canceled" },
    { id: 10, name: "Delivered" },
    { id: 14, name: "Hold" },
    { id: 15, name: "Not Responding" }
  ];

  const tabStatus = tabs.find((tab) => tab.name === selectedTab)?.id ?? null;
  const statusFilter = status === "" ? tabStatus : status;

  const variables = useMemo(
    () => {
      const hasUpdateRange = Boolean(updatedFrom || updatedTo);
      const fromValue = hasUpdateRange ? updatedFrom : createdFrom;
      const toValue = hasUpdateRange ? updatedTo : createdTo;

      return {
        siteId: siteId ?? 0,
        search: search.trim() || null,
        status: statusFilter ?? null,
        sourceId: sourceFilter === "" ? null : [sourceFilter],
        staffId: staffFilter === "" ? null : staffFilter,
        logisticsId: logisticsFilter === "" ? null : logisticsFilter,
        customerType: customerTypeFilter === "" ? null : customerTypeFilter,
        from: fromValue ? new Date(fromValue).toISOString() : null,
        to: toValue ? new Date(toValue).toISOString() : null,
        filterAt: hasUpdateRange ? "updatedAt" : null,
        first: 15
      };
    },
    [
      siteId,
      search,
      statusFilter,
      sourceFilter,
      staffFilter,
      logisticsFilter,
      customerTypeFilter,
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo
    ]
  );

  const { data, loading, fetchMore, refetch } = useQuery(STORE_ORDERS, {
    variables,
    skip: !siteId
  });
  const [bulkUpdate] = useMutation(SELF_STORE_ORDERS_EVENT_CREATE);

  const orders = data?.storeOrders?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeOrders?.pageInfo;
  const totalOrders = data?.storeOrders?.total ?? 0;
  const sources = [
    { id: 18, title: "Pre Order" },
    { id: 19, title: "Campaign" },
    { id: 20, title: "Partner" },
    { id: 21, title: "Reseller" },
    { id: 22, title: "Supplier" }
  ];

  const allSelected = selectedIds.length > 0 && selectedIds.length === orders.length;
  const indeterminate = selectedIds.length > 0 && selectedIds.length < orders.length;

  useEffect(() => {
    const idSet = new Set(orders.map((order: any) => order.id));
    setSelectedIds((prev) => prev.filter((id) => idSet.has(id)));
  }, [orders]);

  const toggleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(orders.map((order: any) => order.id));
  };

  const toggleSelected = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((item) => item !== id);
    });
  };

  const runBulkStatusWith = async (nextStatus: number, note: string, titleText: string, message: string) => {
    if (!siteId || !user?.id || selectedIds.length === 0) return;
    const confirmed = window.confirm(`${titleText}\n${message}`);
    if (!confirmed) return;
    await bulkUpdate({
      variables: {
        userId: user.id,
        siteId,
        orderIds: selectedIds,
        eventType: nextStatus,
        note,
        status: nextStatus
      }
    });
    setSelectedIds([]);
  };

  const totalAvailable = data?.storeOrders?.total ?? orders.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || orders.length < totalAvailable;

  const handleLoadMore = async () => {
    if (!hasMore) return;
    await fetchMore({
      variables: nextPageVariables({
        baseVariables: variables,
        pageInfo,
        currentCount: orders.length,
        pageSize: DEFAULT_PAGE_SIZE
      })
    });
  };

  const selectedOrderCount = selectedIds.length;
  const isOwner = Boolean(user?.id && (site as any)?.createdById && (site as any).createdById === user.id);
  const orderBulkActions = [
    { label: "Pick list", onClick: () => navigate("/order/pick-list/"), tone: "default" as const },
    { label: "Pick list (all)", onClick: () => navigate("/order/pick-list-all/"), tone: "default" as const },
    { label: "Check list", onClick: () => navigate("/order/check-list/"), tone: "default" as const },
    { label: "Order list", onClick: () => navigate("/order/order-list/"), tone: "default" as const },
    { label: "Purchase Orders", onClick: () => navigate("/order/purchase-order/"), tone: "success" as const },
    { label: "Product Requisition", onClick: () => navigate("/order/product-requisition/"), tone: "success" as const },
    { label: "Commercial Invoice", onClick: () => navigate("/order/commercial-invoice/"), tone: "success" as const },
    { label: "Print invoice", onClick: () => navigate("/order/invoice/"), tone: "default" as const },
    { label: "Print sticker", onClick: () => navigate("/order/sticker/"), tone: "default" as const },
    { label: "Print mini sticker", onClick: () => navigate("/order/sticker/"), tone: "default" as const },
    { label: "Print POS", onClick: () => navigate("/order/pos/"), tone: "default" as const },
    {
      label: "Transfer to Logistics",
      onClick: () =>
        runBulkStatusWith(
          99,
          "Transfer to Logistics",
          "Transfer to Logistics",
          "Confirm moving the selected orders to the logistics pipeline."
        ),
      tone: "warning" as const
    },
    {
      label: "Sync to Logistics",
      onClick: () =>
        runBulkStatusWith(
          98,
          "Sync to Logistics",
          "Sync to Logistics",
          "Sync the selected orders with partnered logistics systems."
        ),
      tone: "warning" as const
    },
    {
      label: "Send SMS",
      onClick: () =>
        addNotification(
          {
            title: "SMS",
            subTitle: "SMS sending for selected orders is coming soon."
          },
          "info"
        ),
      tone: "default" as const
    },
    {
      label: "Mark Processing",
      onClick: () =>
        runBulkStatusWith(
          2,
          "Processing",
          "Mark as processing",
          "Confirm that these orders have moved into processing."
        ),
      tone: "default" as const
    },
    {
      label: "Mark Packaging",
      onClick: () =>
        runBulkStatusWith(
          3,
          "Packaging",
          "Mark as packaging",
          "Confirm that these orders are currently in packaging."
        ),
      tone: "default" as const
    },
    {
      label: "Mark Shipment",
      onClick: () =>
        runBulkStatusWith(
          4,
          "Shipment",
          "Mark as shipment",
          "Confirm that these orders are now prepared for shipment."
        ),
      tone: "default" as const
    },
    {
      label: "Mark Shipping",
      onClick: () =>
        runBulkStatusWith(
          5,
          "Shipping",
          "Mark as shipping",
          "Confirm that these orders are on the way to customers."
        ),
      tone: "default" as const
    },
    {
      label: "Mark Under review",
      onClick: () =>
        runBulkStatusWith(
          6,
          "Under review",
          "Mark as under review",
          "Flag the selected orders for manual review."
        ),
      tone: "warning" as const
    },
    {
      label: "Mark Return",
      onClick: () =>
        runBulkStatusWith(
          8,
          "Return",
          "Mark as return",
          "Move the selected orders into the return workflow."
        ),
      tone: "warning" as const
    },
    {
      label: "Mark Cancel",
      onClick: () =>
        runBulkStatusWith(
          9,
          "Cancel",
          "Mark as cancel",
          "Confirm cancelling these orders."
        ),
      tone: "danger" as const
    },
    {
      label: "Mark Delivered",
      onClick: () =>
        runBulkStatusWith(
          10,
          "Delivered",
          "Mark as delivered",
          "Confirm that these orders were delivered successfully."
        ),
      tone: "success" as const
    }
  ];

  const resolvedTitle = title ?? (selectedTab === "All" ? "Order" : selectedTab);

  return (
    <div className="order-page flex flex-col gap-4">
      {loading ? (
        <div className="sticky top-0 z-30 h-1 w-full overflow-hidden rounded-full bg-indigo-100">
          <div className="order-loader-bar h-full"></div>
        </div>
      ) : null}
      <main>
        <div className="flex flex-col gap-4 rounded-2xl bg-white/90 p-5 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-900">{resolvedTitle}</h2>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <span className="text-xs">⚡</span>
                </button>
              </div>
              <p className="text-sm text-slate-500">
                View, manage, and track customer orders for every sales channel in one calming workspace.
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowMultipleSearch(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                🔍 Order filter by product
              </button>
              <button
                type="button"
                onClick={() => setShowMultipleSearch((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                🔎 {showMultipleSearch ? "Hide Order Search" : "Search Multiple Orders"}
              </button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => setSelectedTab(tab.name)}
                className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  selectedTab === tab.name
                    ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <span>{tab.name}</span>
                {selectedTab === tab.name ? (
                  <span className="ml-2 inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-indigo-600">
                    {totalOrders}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Update date range</span>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={updatedFrom}
                    onChange={(event) => setUpdatedFrom(event.target.value)}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={updatedTo}
                    onChange={(event) => setUpdatedTo(event.target.value)}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Created date range</span>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={createdFrom}
                    onChange={(event) => setCreatedFrom(event.target.value)}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={createdTo}
                    onChange={(event) => setCreatedTo(event.target.value)}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
                Source
                <select
                  value={sourceFilter}
                  onChange={(event) =>
                    setSourceFilter(event.target.value ? Number(event.target.value) : "")
                  }
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
                >
                  <option value="">All sources</option>
                  {sources.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
                Customer Type
                <select
                  value={customerTypeFilter}
                  onChange={(event) =>
                    setCustomerTypeFilter(event.target.value ? Number(event.target.value) : "")
                  }
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
                >
                  <option value="">All customers</option>
                  {customerTypes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
                Staff
                <select
                  value={staffFilter}
                  onChange={(event) => setStaffFilter(event.target.value ? Number(event.target.value) : "")}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
                >
                  <option value="">All staff</option>
                  <option value="0">Admin</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
                Logisticses
                <select
                  value={logisticsFilter}
                  onChange={(event) =>
                    setLogisticsFilter(event.target.value ? Number(event.target.value) : "")
                  }
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
                >
                  <option value="">All logistics</option>
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2">
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by invoice, customer, phone or status"
                className="w-72 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value ? Number(event.target.value) : "")}
              className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600"
            >
              <option value="">All statuses</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {showMultipleSearch ? (
            <div className="rounded-2xl bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
              Enter multiple order IDs (comma separated). Matching will apply to the current search.
            </div>
          ) : null}
        </div>

        <div className="relative mt-4 rounded-2xl bg-white">
          <div className="overflow-x-auto">
            <div className="relative md:rounded-lg">
              <TableBulkBar
                selectedCount={selectedOrderCount}
                onClear={() => setSelectedIds([])}
                actions={orderBulkActions}
              />

              <AppTable className="data-table w-full min-w-[1150px] divide-y divide-gray-300">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead scope="col" className="relative w-6 px-4 sm:w-6 sm:px-3">
                      SL
                    </TableHead>
                    <TableHead scope="col" className="relative px-5 sm:w-5 sm:px-5">
                      <SelectAllCheckbox
                        checked={allSelected}
                        indeterminate={indeterminate}
                        disabled={orders.length === 0}
                        onChange={toggleSelectAll}
                        ariaLabel="Select all orders"
                        className="absolute left-3 top-1/2 -mt-2 h-4 w-4 -translate-y-1/2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      />
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"></TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Status
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Update
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Pogress
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Name
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Address
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Logistics
                    </TableHead>
                    {isOwner ? (
                      <TableHead scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        Profit
                      </TableHead>
                    ) : null}
                    <TableHead scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 bg-white">
                  {orders.map((order: any, index: number) => {
                    const source = sources.find((item) => item.id === order.sourceId)?.title ?? "Website";
                    const orderTypeTitle =
                      orderTypes.find((item) => item.id === order.orderType)?.title ?? "Fresh";
                    const customerTypeTitle =
                      customerTypes.find((item) => item.id === order.customerType)?.title ?? "New";
                    const progressDuration = dayjs.duration(
                      dayjs(order.updatedAt).diff(dayjs(order.createdAt))
                    );
                    const progressHours = progressDuration.asHours();
                    const progressLabel =
                      order.status === 0 ? "Need action" : progressHours > 48 ? "Slow" : "Normal";
                    const progressTime = `${Math.floor(progressDuration.asDays())}d ${progressDuration.hours()}h ${progressDuration.minutes()}m`;

                    return (
                      <TableRow
                        key={order.id}
                        className={`cursor-pointer active:cursor-wait ${
                          selectedIds.includes(order.id) ? "bg-gray-50" : ""
                        }`}
                      >
                        <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="relative w-5 px-4 sm:w-5 sm:px-5">
                          {selectedIds.includes(order.id) ? (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"></div>
                          ) : null}
                          <SelectAllCheckbox
                            checked={selectedIds.includes(order.id)}
                            onChange={(checked) => toggleSelected(order.id, checked)}
                            ariaLabel={`Select order ${order.orderId ?? order.id}`}
                            className="absolute left-3 top-1/2 -mt-2 h-4 w-4 -translate-y-1/2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                          />
                        </TableCell>
                        <TableCell className="whitespace-nowrap py-2 pl-3 sm:pl-0 pr-3 text-sm group flex items-center relative">
                          <div className="flex items-center">
                            <div className="ml-0">
                              <div
                                className={`whitespace-nowrap text-sm font-medium ${
                                  selectedIds.includes(order.id)
                                    ? "text-indigo-600"
                                    : "font-medium text-gray-900"
                                }`}
                              >
                                ID: {order.orderId}
                                <div className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-4 text-green-800">
                                  {source}
                                </div>
                              </div>
                              <div className="text-gray-500 text-xs">
                                At {dayjs(order.createdAt).format("h:mm A MMM D")}
                              </div>
                              <div className="text-orange-500 text-sm font-semibold flex items-center gap-2">
                                {order.total ?? order.netAmount ?? "—"}
                                <div
                                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 border ${
                                    orderTypeTitle === "Duplicate"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {orderTypeTitle}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2 text-sm text-gray-500 max-w-[150px]">
                          <div className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-4 text-green-800">
                            {statusLabels[order.status] ?? "Processing"}
                          </div>
                          <div className="text-gray-800 my-1 px-2 line-clamp-2 leading-snug text-xs w-40">
                            {(order.customerNote || "").split("-")[0] || ""}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <div className="text-gray-900">{dayjs(order.updatedAt).fromNow()}</div>
                          <div className="text-gray-500 text-xs">by admin</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <div
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
                              order.status === 0 || progressHours > 48
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {progressLabel}
                          </div>
                          <div className="text-gray-500 text-xs">{progressTime}</div>
                        </TableCell>
                        <TableCell className="px-2 py-2 text-sm text-gray-500 max-w-[150px]">
                          <div className="text-gray-900 line-clamp-2 group flex items-center truncate gap-2">
                            <div className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-4 text-green-800 border">
                              {customerTypeTitle}
                            </div>
                            {order.customerName ?? "—"}
                          </div>
                          <div className="text-gray-500 text-xs group flex items-center">
                            {order.customerPhone ?? "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2 text-sm text-gray-500 max-w-[150px] group flex items-center relative">
                          <div className="text-gray-900 line-clamp-3 leading-2 text-xs w-full">
                            {order.customerAddress ?? "—"}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap py-2 max-w-[100px] text-sm text-gray-500 truncate relative">
                          <div className="text-gray-900 items-center truncate">
                            {order.logisticsText ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.logisticsCharge ? `Charge: ${order.logisticsCharge}` : ""}
                          </div>
                        </TableCell>
                        {isOwner ? (
                          <TableCell className="px-3 py-2 text-right text-sm text-gray-500">
                            {order.profit ?? "—"}
                          </TableCell>
                        ) : null}
                        <TableCell className="px-4 py-2 text-right text-sm text-gray-500">
                          <Link to={`/order/${order.id}`} className="text-xs font-medium text-indigo-600 hover:underline">
                            View
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {!loading && orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="px-5 py-10 text-center text-sm text-slate-500">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={11} className="px-5 py-6 text-sm text-slate-400">
                        Loading orders...
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </AppTable>
            </div>
          </div>
        </div>

        <PaginationFooter
          count={orders.length}
          total={totalAvailable}
          from={orders.length ? 1 : 0}
          to={orders.length}
          hasNext={hasMore}
          onLoadMore={handleLoadMore}
          label="orders"
          loading={loading}
        />
      </main>
    </div>
  );
}
