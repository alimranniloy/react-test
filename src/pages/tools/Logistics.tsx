import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LOGISTICS_MERCHANTS } from "@/graphql/queries/tools";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import LogisticsAction from "@/pages/tools/LogisticsAction";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

dayjs.extend(relativeTime);

const tabs = [
  { id: null, name: "All" },
  { id: 0, name: "Active" },
  { id: 1, name: "Inactive" }
];

const chargeBaseLabel = (value?: number | null) => {
  const base = [
    { id: 1, title: "Fixed" },
    { id: 2, title: "Location" },
    { id: 3, title: "Weight" },
    { id: 5, title: "Stoppage" },
    { id: 6, title: "Conditions" },
    { id: 7, title: "Area" }
  ];
  return base.find((item) => item.id === value)?.title ?? "Fixed";
};

const formatMoney = (value: number | null | undefined, currency = "BDT") => {
  const amount = typeof value === "number" ? value : 0;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount}`;
  }
};

export default function Logistics() {
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const userId = user?.id ?? null;
  const currency = site?.currency ?? "BDT";

  const [selectedTab, setSelectedTab] = useState("All");
  const [logisticsIndex, setLogisticsIndex] = useState<number | null>(null);
  const [logisticsId, setLogisticsId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);

  const variables = useMemo(
    () => ({
      userId: userId ?? null,
      first: DEFAULT_PAGE_SIZE,
      isActive: selectedTab === "All" ? null : selectedTab === "Active",
      after: null
    }),
    [userId, selectedTab]
  );

  const { data, loading, refetch, fetchMore } = useQuery(LOGISTICS_MERCHANTS, {
    variables,
    skip: !userId
  });

  const rows = data?.logisticsMerchants?.edges ?? [];
  const pageInfo = data?.logisticsMerchants?.pageInfo;
  const totalAvailable = data?.logisticsMerchants?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;

  const selectLogistics = (id: number, company: number, index: number) => {
    setLogisticsId(id);
    setCompanyId(company);
    setLogisticsIndex(index);
  };

  const closeAction = (refresh?: boolean) => {
    setLogisticsIndex(null);
    setLogisticsId(null);
    setCompanyId(null);
    if (refresh) {
      refetch();
    }
  };

  return (
    <div className="space-y-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto relative">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            Logistics
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
            >
              ↻
            </button>
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage Shipping and Delivery Processes to Ensure Timely and Efficient Logistics
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setLogisticsIndex(-1);
              setLogisticsId(null);
              setCompanyId(null);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add New
          </button>
        </div>
      </div>

      <div className="mx-auto mt-4 w-full">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => setSelectedTab(tab.name)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.name
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-4 lg:-mx-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-5 lg:px-5">
            <div className="table-source-wrap">
              <AppTable className="data-table min-w-full divide-y divide-gray-300">
                <TableHeader className="bg-gray-50">
                  <TableRow className="text-center text-sm font-semibold text-gray-900">
                    <TableHead scope="col" className="relative w-6 px-4">SL</TableHead>
                    <TableHead scope="col" className="py-3.5 px-3 text-left">Title</TableHead>
                    <TableHead scope="col" className="px-3 py-3.5">Status</TableHead>
                    <TableHead scope="col" className="px-3 py-3.5">Charge Base</TableHead>
                    <TableHead scope="col" className="px-3 py-3.5">Range (Min - Max)</TableHead>
                    <TableHead scope="col" className="px-3 py-3.5">Delivery Charge</TableHead>
                    <TableHead scope="col" className="px-3 py-3.5">Update</TableHead>
                    <TableHead scope="col" className="px-4 py-3.5 text-right sm:pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 bg-white">
                  {logisticsIndex === -1 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="relative p-4 w-full bg-white text-left">
                        <LogisticsAction
                          onClose={(refresh) => closeAction(refresh)}
                          onSaved={() => {
                            refetch();
                            closeAction();
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {rows.map((edge: any, index: number) => {
                    const logistics = edge.node;
                    const expanded = index === logisticsIndex;
                    return (
                      <TableRow key={logistics.id} className="cursor-pointer active:cursor-wait text-center">
                        {expanded ? (
                          <TableCell colSpan={8} className="relative p-4 w-full bg-white text-left">
                            <LogisticsAction
                              id={logistics.id}
                              companyId={logistics.companyId}
                              onClose={(refresh) => closeAction(refresh)}
                              onSaved={() => {
                                refetch();
                                closeAction();
                              }}
                            />
                          </TableCell>
                        ) : (
                          <>
                            <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">{index + 1}</TableCell>
                            <TableCell
                              onClick={() => selectLogistics(logistics.id, logistics.companyId, index)}
                              className="whitespace-nowrap py-2 px-3 text-sm text-left"
                            >
                              <div>
                                <div className="font-medium text-gray-900">
                                  {logistics.title} - ({logistics.logisticsTitle})
                                </div>
                                <div className="text-gray-500 text-xs">start at {formatMoney(logistics.chargeMerchantDefined, currency)}</div>
                              </div>
                            </TableCell>
                            <TableCell
                              onClick={() => selectLogistics(logistics.id, logistics.companyId, index)}
                              className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                            >
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  logistics.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {logistics.isActive ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell className="px-2 py-2 text-sm text-gray-500">
                              <div className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-green-100 text-green-800 justify-center">
                                {chargeBaseLabel(logistics.chargeBase)}
                              </div>
                            </TableCell>
                            <TableCell className="px-2 py-2 text-sm text-gray-500">
                              <div className="text-gray-900">
                                {formatMoney(logistics.chargeMinimum, currency)} - {formatMoney(logistics.chargeMaximum, currency)}
                              </div>
                            </TableCell>
                            <TableCell className="px-2 py-2 text-sm text-gray-500">
                              <div className="text-gray-900">{formatMoney(logistics.chargeMerchantDefined, currency)}</div>
                            </TableCell>
                            <TableCell
                              onClick={() => selectLogistics(logistics.id, logistics.companyId, index)}
                              className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                            >
                              <div className="text-gray-900">{logistics.updatedAt ? dayjs(logistics.updatedAt).fromNow() : "—"}</div>
                              <div className="text-gray-500 text-xs">
                                {logistics.updatedAt ? dayjs(logistics.updatedAt).format("h:mm A MMM D") : "—"}
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right sm:pr-4">
                              <button
                                type="button"
                                onClick={() => selectLogistics(logistics.id, logistics.companyId, index)}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </AppTable>
              {!loading && rows.length === 0 ? (
                <div className="text-center border-t border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">No record :-(</div>
              ) : null}
              {rows.length > 0 && !pageInfo?.hasNextPage ? (
                <div className="text-center border-t border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">No more record :-(</div>
              ) : null}
              <PaginationFooter
                count={rows.length}
                total={totalAvailable}
                hasNext={hasMore}
                onLoadMore={() => {
                  fetchMore({
                    variables: nextPageVariables({
                      baseVariables: {
                        userId: userId ?? null,
                        isActive: selectedTab === "All" ? null : selectedTab === "Active"
                      },
                      pageInfo,
                      currentCount: rows.length,
                      pageSize: DEFAULT_PAGE_SIZE
                    })
                  });
                }}
                label="logistics"
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
