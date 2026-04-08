import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { STORE_GATEWAYS } from "@/graphql/queries/tools";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import GatewayAction from "@/pages/tools/GatewayAction";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const tabs = [
  { id: null, name: "All" },
  { id: 0, name: "Active" },
  { id: 1, name: "Inactive" }
];

export default function Gateway() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [selectedTab, setSelectedTab] = useState("All");
  const [gatewayIndex, setGatewayIndex] = useState<number | null>(null);
  const [gatewayId, setGatewayId] = useState<number | null>(null);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      first: DEFAULT_PAGE_SIZE,
      isActive: selectedTab === "All" ? null : selectedTab === "Active"
    }),
    [siteId, selectedTab]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_GATEWAYS, {
    variables,
    skip: !siteId
  });

  const gateways = data?.storeGateways?.edges ?? [];
  const pageInfo = data?.storeGateways?.pageInfo;
  const totalAvailable = data?.storeGateways?.total ?? gateways.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || gateways.length < totalAvailable;

  const selectGateway = (id: number, index: number) => {
    setGatewayId(id);
    setGatewayIndex(index);
  };

  const closeAction = () => {
    setGatewayIndex(null);
    setGatewayId(null);
  };

  return (
    <div className="space-y-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto relative">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            Gateway
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
            >
              ↻
            </button>
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage Payment Gateways and Transactions for Secure and Seamless Payments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setGatewayId(null);
              setGatewayIndex(-1);
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
                  <TableRow>
                    <TableHead scope="col" className="relative w-6 px-4 sm:w-6 sm:px-4">
                      SL
                    </TableHead>
                    <TableHead scope="col" className="min-w-[6rem] w-full py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Status
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Fee
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Update
                    </TableHead>
                    <TableHead scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6 w-20">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 bg-white">
                  {gatewayIndex === -1 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="relative p-4 w-full bg-white">
                        <GatewayAction
                          onClose={closeAction}
                          onSaved={async () => {
                            await refetch();
                            closeAction();
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {gateways.map((edge: any, index: number) => {
                    const gateway = edge.node;
                    const expanded = index === gatewayIndex;
                    return (
                      <TableRow key={gateway.id} className="cursor-pointer active:cursor-wait">
                        {expanded ? (
                          <TableCell colSpan={6} className="relative p-4 w-full bg-white">
                            <GatewayAction
                              id={gateway.id}
                              onClose={closeAction}
                              onSaved={async () => {
                                await refetch();
                                closeAction();
                              }}
                            />
                          </TableCell>
                        ) : (
                          <>
                            <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">{index + 1}</TableCell>
                            <TableCell onClick={() => selectGateway(gateway.id, index)} className="whitespace-nowrap py-2 pl-3 pr-3 text-sm">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {gateway.logo ? (
                                    <img className="h-10 w-10 rounded-full" src={gateway.logo} alt="" />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-100" />
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{gateway.title}</div>
                                  <div className="text-gray-500 text-xs">{gateway.note}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell onClick={() => selectGateway(gateway.id, index)} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  gateway.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {gateway.isActive ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell onClick={() => selectGateway(gateway.id, index)} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              {gateway.fee}
                            </TableCell>
                            <TableCell onClick={() => selectGateway(gateway.id, index)} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              {gateway.updatedAt}
                            </TableCell>
                            <TableCell className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-500 sm:pr-6">
                              <button
                                type="button"
                                onClick={() => selectGateway(gateway.id, index)}
                                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
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
              {!loading && gateways.length === 0 ? (
                <div className="text-center border-t border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">No record :-(</div>
              ) : null}
              <PaginationFooter
                count={gateways.length}
                total={totalAvailable}
                hasNext={hasMore}
                onLoadMore={() => {
                  fetchMore({
                    variables: nextPageVariables({
                      baseVariables: {
                        siteId: siteId ?? 0,
                        isActive: selectedTab === "All" ? null : selectedTab === "Active"
                      },
                      pageInfo,
                      currentCount: gateways.length,
                      pageSize: DEFAULT_PAGE_SIZE
                    })
                  });
                }}
                label="gateways"
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
