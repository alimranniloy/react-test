import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useSiteStore } from "@/store/useSiteStore";
import {
  ORDER_RESELLER_ATTRIBUTION,
  ORDER_RESELLER_ATTRIBUTIONS
} from "@/graphql/queries/reseller";
import { RESELLER_ATTRIBUTION_UPSERT } from "@/graphql/mutations/reseller";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function OrderAttribution() {
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);

  const [orderId, setOrderId] = useState("");
  const [resellerId, setResellerId] = useState("");
  const [attributionType, setAttributionType] = useState("");
  const [offset, setOffset] = useState(0);
  const [pageSize] = useState(15);

  const lookupVariables = useMemo(
    () => ({
      data: {
        siteId: siteUuid ?? "",
        orderId: orderId.trim()
      }
    }),
    [siteUuid, orderId]
  );

  const listVariables = useMemo(
    () => ({
      data: {
        siteId: siteUuid ?? "",
        resellerId: resellerId.trim() || null,
        attributionType: attributionType.trim() || null,
        limit: pageSize + 1,
        offset
      }
    }),
    [siteUuid, resellerId, attributionType, offset, pageSize]
  );

  const { data: lookupData, refetch: refetchLookup } = useQuery(ORDER_RESELLER_ATTRIBUTION, {
    variables: lookupVariables,
    skip: !siteUuid || !orderId.trim()
  });

  const { data: listData, loading, refetch } = useQuery(ORDER_RESELLER_ATTRIBUTIONS, {
    variables: listVariables,
    skip: !siteUuid
  });

  const [upsert] = useMutation(RESELLER_ATTRIBUTION_UPSERT);

  const lookup = lookupData?.orderResellerAttribution ?? null;
  const list = listData?.orderResellerAttributions ?? [];
  const hasNext = list.length > pageSize;
  const rows = list.slice(0, pageSize);
  const page = Math.floor(offset / pageSize) + 1;
  const pageCount = hasNext ? page + 1 : page;
  const approxTotal = hasNext ? offset + pageSize + 1 : offset + rows.length;

  const handleUpsert = async () => {
    if (!siteUuid || !orderId.trim() || !resellerId.trim()) return;
    await upsert({
      variables: {
        data: {
          siteId: siteUuid,
          orderId: orderId.trim(),
          resellerId: resellerId.trim(),
          attributionType: attributionType.trim() || null,
          resellerCode: null
        }
      }
    });
    await refetch();
    await refetchLookup();
  };

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "order",
        header: "Order",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => row.orderId
      },
      {
        id: "reseller",
        header: "Reseller",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.resellerId
      },
      {
        id: "type",
        header: "Type",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.attributionType
      },
      {
        id: "updated",
        header: "Updated",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => (row.updatedAt ? dayjs(row.updatedAt).format("D MMM YYYY") : "—")
      }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              Order Attribution
              <button
                type="button"
                onClick={() => {
                  refetch();
                  refetchLookup();
                }}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Link orders to resellers.</p>
          </div>
          <button
            type="button"
            onClick={handleUpsert}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Upsert Attribution
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          placeholder="Order id"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
        <input
          value={resellerId}
          onChange={(event) => {
            setResellerId(event.target.value);
            setOffset(0);
          }}
          placeholder="Reseller id"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
        <input
          value={attributionType}
          onChange={(event) => {
            setAttributionType(event.target.value);
            setOffset(0);
          }}
          placeholder="Attribution type"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
      </div>

      {lookup ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">Lookup Result</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <div>Reseller: {lookup.resellerId}</div>
            <div>Type: {lookup.attributionType}</div>
            <div>Updated: {lookup.updatedAt ? dayjs(lookup.updatedAt).format("D MMM YYYY") : "—"}</div>
          </div>
        </div>
      ) : null}

      <DataTable
        rows={rows}
        getRowId={(row) => `${row.orderId}-${row.resellerId}`}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "offset",
          count: rows.length,
          total: approxTotal,
          page,
          pageCount,
          onPageChange: (nextPage) => setOffset(Math.max(0, (nextPage - 1) * pageSize)),
          loading,
          from: rows.length ? offset + 1 : 0,
          to: offset + rows.length,
          pageSize,
          pageSizeOptions: [15]
        }}
      />
    </div>
  );
}
