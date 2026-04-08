import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_PRODUCTS } from "@/graphql/queries/product";
import { SELF_STORE_PRODUCT_ADD_FLASH, SELF_STORE_PRODUCT_REMOVE_FLASH } from "@/graphql/mutations/productMarketing";
import { SELF_SITE_UPDATE } from "@/graphql/mutations/site";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

const tabs = ["Products", "All Products"] as const;

const formatDateInput = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toFlashIso = (date: string) => {
  if (!date) return null;
  return `${date}T18:00:00+00:00`;
};

export default function FlashMarketing() {
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>("Products");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setEndDate(formatDateInput(site?.lastEvent));
  }, [site?.lastEvent]);

  const variables = useMemo(
    () => ({
      siteId: siteId ? [siteId] : [],
      isFlash: selectedTab === "Products" ? true : null,
      first: 15
    }),
    [siteId, selectedTab]
  );

  const { data, loading, refetch } = useQuery(STORE_PRODUCTS, {
    variables,
    skip: !siteId
  });
  const [addFlash] = useMutation(SELF_STORE_PRODUCT_ADD_FLASH);
  const [removeFlash] = useMutation(SELF_STORE_PRODUCT_REMOVE_FLASH);
  const [updateSite, { loading: updating }] = useMutation(SELF_SITE_UPDATE);

  const products = data?.storeProducts?.edges?.map((edge: any) => edge.node) ?? [];

  const toggle = async (productId: number, isFlash: boolean) => {
    if (!user?.id) return;
    if (isFlash) {
      await removeFlash({ variables: { userId: user.id, productId } });
    } else {
      await addFlash({ variables: { userId: user.id, productId } });
    }
    await refetch();
  };

  const updateFlashEndDate = async () => {
    if (!user?.id || !siteId) return;
    const lastEvent = toFlashIso(endDate);
    if (!lastEvent) return;
    await updateSite({ variables: { userId: user.id, siteId, lastEvent } });
  };

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (product) => product.title
      },
      {
        id: "price",
        header: "Price",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (product) => product.price
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm",
        cell: (product) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
              product.isFlash ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
            }`}
          >
            {product.isFlash ? "Flash" : "Normal"}
          </span>
        )
      },
      {
        id: "action",
        header: "Action",
        headClassName: "px-4 py-3.5 text-right text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-right text-sm",
        cell: (product) => (
          <button
            type="button"
            onClick={() => toggle(product.id, product.isFlash)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            {product.isFlash ? "Remove" : "Add"}
          </button>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Flash
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Promote Limited-time Offers and Flash Sales to Create Urgency and Drive Conversions
        </p>
        <div className="mt-5 grid grid-cols-1 items-center gap-4 rounded-xl border bg-white p-4 md:grid-cols-2">
          <div>
            <h2 className="font-semibold text-gray-800">Flash Sale End Date</h2>
            <p className="text-sm text-gray-500">Set when the flash sale will end</p>
          </div>
          <div className="flex gap-4">
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              disabled={!endDate || updating}
              onClick={updateFlashEndDate}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab ? "border-purple-500 text-purple-600" : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <DataTable
        rows={products}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
      />
    </div>
  );
}
