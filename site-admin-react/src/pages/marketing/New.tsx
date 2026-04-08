import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_PRODUCTS } from "@/graphql/queries/product";
import { SELF_STORE_PRODUCT_ADD_NEW, SELF_STORE_PRODUCT_REMOVE_NEW } from "@/graphql/mutations/productMarketing";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

const tabs = ["Products", "All Products"] as const;

export default function NewMarketing() {
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>("Products");

  const variables = useMemo(
    () => ({
      siteId: siteId ? [siteId] : [],
      isNew: selectedTab === "Products" ? true : null,
      first: 15
    }),
    [siteId, selectedTab]
  );

  const { data, loading, refetch } = useQuery(STORE_PRODUCTS, {
    variables,
    skip: !siteId
  });
  const [addNew] = useMutation(SELF_STORE_PRODUCT_ADD_NEW);
  const [removeNew] = useMutation(SELF_STORE_PRODUCT_REMOVE_NEW);

  const products = data?.storeProducts?.edges?.map((edge: any) => edge.node) ?? [];

  const toggle = async (productId: number, isNew: boolean) => {
    if (!user?.id) return;
    if (isNew) {
      await removeNew({ variables: { userId: user.id, productId } });
    } else {
      await addNew({ variables: { userId: user.id, productId } });
    }
    await refetch();
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
              product.isNew ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
            }`}
          >
            {product.isNew ? "New" : "Normal"}
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
            onClick={() => toggle(product.id, product.isNew)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            {product.isNew ? "Remove" : "Add"}
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
          New
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Use First-Look Access to New Arrivals to Build Anticipation and Encourage Purchases
        </p>
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
