import { Fragment, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Menu, Transition } from "@headlessui/react";
import {
  BoltIcon,
  ChevronDownIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useNavigate } from "react-router-dom";
import { STORE_PRODUCTS } from "@/graphql/queries/product";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";

dayjs.extend(relativeTime);

type TabName = "All" | "Active" | "Inactive";

export default function ProductList() {
  const navigate = useNavigate();
  const siteId = useSiteAdminStore((s) => s.siteId);
  const addToast = useToastStore((s) => s.addToast);

  const [first, setFirst] = useState(15);
  const [tab, setTab] = useState<TabName>("All");
  const [search, setSearch] = useState("");

  const isActiveFilter = useMemo(() => {
    if (tab === "All") return null;
    return tab === "Active";
  }, [tab]);

  const { data, loading, error, refetch, fetchMore } = useQuery(STORE_PRODUCTS, {
    variables: {
      siteId: [siteId ?? 0],
      search: search || null,
      isActive: isActiveFilter,
      isLanding: true,
      first,
      after: null
    },
    fetchPolicy: "network-only",
    skip: !siteId
  });

  const edges: any[] = data?.storeProducts?.edges ?? [];
  const pageInfo = data?.storeProducts?.pageInfo;

  useEffect(() => {
    // When pagination size changes, refresh from the beginning.
    if (!siteId) return;
    refetch({
      siteId: [siteId],
      search: search || null,
      isActive: isActiveFilter,
      isLanding: true,
      first,
      after: null
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [first]);

  const loadMore = async () => {
    const endCursor = pageInfo?.endCursor;
    if (!endCursor || !siteId) return;
    await fetchMore({
      variables: {
        siteId: [siteId],
        search: search || null,
        isActive: isActiveFilter,
        isLanding: true,
        first,
        after: endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const prevEdges = prev?.storeProducts?.edges ?? [];
        const nextEdges = fetchMoreResult?.storeProducts?.edges ?? [];
        const nextPageInfo =
          fetchMoreResult?.storeProducts?.pageInfo ??
          prev?.storeProducts?.pageInfo;
        return {
          ...prev,
          storeProducts: {
            ...prev.storeProducts,
            edges: [...prevEdges, ...nextEdges],
            pageInfo: nextPageInfo
          }
        };
      }
    });
  };

  if (!siteId) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">Select site first</h2>
        <p className="mt-2 text-sm text-slate-500">
          Go to{" "}
          <Link to="/site/" className="text-brand-600 underline">
            Site
          </Link>{" "}
          and select a site.
        </p>
      </div>
    );
  }

  return (
    <main className="pb-16 pt-0">
      <div className="sm:flex sm:items-center px-4">
        <div className="sm:flex-auto relative">
          <h1 className="text-xl font-semibold text-slate-900 flex items-center">
            Product
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-2 inline-flex items-center rounded p-1 hover:bg-slate-100"
              title="Refresh"
            >
              <BoltIcon className="h-4 w-4" />
            </button>
          </h1>
          <p className="mt-2 text-sm text-slate-700">
            A list of all products for the selected site.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mx-4 mt-4 rounded-md border bg-white p-4 text-sm text-rose-600">
          {String(error.message)}
        </div>
      ) : null}

      <div className="mx-4 mt-6 rounded-lg border bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {(["All", "Active", "Inactive"] as TabName[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  refetch({
                    siteId: [siteId],
                    search: search || null,
                    isActive: t === "All" ? null : t === "Active",
                    isLanding: true,
                    first,
                    after: null
                  }).catch(() => {});
                }}
                className={[
                  "rounded-md px-3 py-1.5 text-sm font-medium border",
                  tab === t
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                refetch({
                  siteId: [siteId],
                  search: search || null,
                  isActive: isActiveFilter,
                  isLanding: true,
                  first,
                  after: null
                }).catch(() => {});
              }}
              placeholder="Search..."
              className="w-full sm:w-72 rounded-md border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                refetch({
                  siteId: [siteId],
                  search: search || null,
                  isActive: isActiveFilter,
                  isLanding: true,
                  first,
                  after: null
                }).catch((err) => {
                  addToast({
                    kind: "error",
                    title: "Product",
                    subTitle: (err as Error).message
                  });
                });
              }}
              className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col px-4">
        <div className="overflow-x-auto">
          <div className="relative overflow-hidden shadow ring-1 ring-black/5 md:rounded-lg bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-16 px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    SL
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-slate-700">
                    Title
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-slate-700 w-24">
                    Status
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-slate-700">
                    Slug
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-slate-700 w-28">
                    Update
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-slate-700 w-24">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {edges.map((row: any, index: number) => {
                  const p = row.node;
                  const thumb = p.thumbnail || p.image || null;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => navigate(`/product/update/?id=${p.id}`)}
                    >
                      <td className="px-4 py-2 text-sm text-slate-600 bg-amber-50 text-center">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full border bg-slate-100">
                            {thumb ? (
                              <img
                                src={String(thumb)}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                alt=""
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {String(p.title ?? "")}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              #{String(p.hid ?? p.id)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <span
                          className={[
                            "inline-flex rounded-full px-2 text-xs font-semibold leading-5",
                            p.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          ].join(" ")}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-600">
                        <span className="font-mono text-xs">
                          {String(p.slug ?? "")}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-600">
                        <div className="text-slate-900">
                          {p.updatedAt ? dayjs(p.updatedAt).fromNow() : ""}
                        </div>
                        <div className="text-xs text-slate-500">
                          {p.updatedAt
                            ? dayjs(p.updatedAt).format("h:mm A MMM D")
                            : ""}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/update/?id=${p.id}`);
                          }}
                          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          title="Update"
                        >
                          <Cog6ToothIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : null}
                {!loading && edges.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                      No record :-(
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>

            <nav className="flex items-center justify-between border-t bg-white px-4 py-3">
              <div className="hidden sm:block text-sm text-slate-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{edges.length}</span>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={loadMore}
                    className="relative inline-flex items-center rounded-l-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Next
                  </button>
                  <Menu as="div" className="relative -ml-px block">
                    <Menu.Button className="relative inline-flex items-center rounded-r-md border border-slate-300 bg-white px-2 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50">
                      <span className="sr-only">Open options</span>
                      {first}
                      <ChevronDownIcon className="h-5 w-5" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 bottom-12 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="py-1">
                          {[15, 30, 100, 200].map((v) => (
                            <Menu.Item key={v}>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => setFirst(v)}
                                  className={[
                                    "block w-full text-left px-4 py-2 text-sm",
                                    active
                                      ? "bg-slate-100 text-slate-900"
                                      : "text-slate-700"
                                  ].join(" ")}
                                >
                                  {v}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </main>
  );
}

