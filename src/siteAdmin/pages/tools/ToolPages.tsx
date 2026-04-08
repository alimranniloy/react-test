import { Fragment, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, BoltIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useNavigate } from "react-router-dom";
import { SITE_PAGES } from "@/graphql/queries/tools";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";

dayjs.extend(relativeTime);

export default function ToolPages() {
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const siteId = useSiteAdminStore((s) => s.siteId);

  const [first, setFirst] = useState(15);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, loading, error, refetch, fetchMore } = useQuery(SITE_PAGES, {
    variables: { siteId: siteId ?? 0, first, after: null, search: null },
    fetchPolicy: "network-only",
    skip: !siteId,
  });

  const edges: any[] = data?.sitePages?.edges ?? [];
  const pageInfo = data?.sitePages?.pageInfo;

  useEffect(() => {
    setSelectedIds([]);
  }, [siteId]);

  const indeterminate = useMemo(() => {
    return selectedIds.length > 0 && selectedIds.length < edges.length;
  }, [edges.length, selectedIds.length]);

  const loadMore = async () => {
    const endCursor = pageInfo?.endCursor;
    if (!endCursor || !siteId) return;
    await fetchMore({
      variables: { siteId, first, after: endCursor, search: null },
      updateQuery: (prev, { fetchMoreResult }) => {
        const prevEdges = prev?.sitePages?.edges ?? [];
        const nextEdges = fetchMoreResult?.sitePages?.edges ?? [];
        const nextPageInfo = fetchMoreResult?.sitePages?.pageInfo ?? prev?.sitePages?.pageInfo;
        return {
          ...prev,
          sitePages: { ...prev.sitePages, edges: [...prevEdges, ...nextEdges], pageInfo: nextPageInfo },
        };
      },
    });
  };

  const handleCopyUrl = async (slug: string) => {
    const url = `/${String(slug || "").replace(/^\/+/, "")}/`;
    addToast({ kind: "success", title: "Page", subTitle: `Copied: ${url}` });
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
  };

  if (!siteId) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">Select site first</h2>
        <p className="mt-2 text-sm text-slate-500">
          Go to <Link to="/site/" className="text-brand-600 underline">Site</Link> and select a site.
        </p>
      </div>
    );
  }

  return (
    <main className="pb-16 pt-0">
      <div className="sm:flex sm:items-center px-4">
        <div className="sm:flex-auto relative">
          <h1 className="text-xl font-semibold text-slate-900 flex items-center">
            Page
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
            Tool pages for the selected site.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/tool/page/create/"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add New
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mx-4 mt-4 rounded-md border bg-white p-4 text-sm text-rose-600">
          {String(error.message)}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col px-4">
        <div className="overflow-x-auto">
          <div className="relative overflow-hidden shadow ring-1 ring-black/5 md:rounded-lg bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-16 px-4 py-3 text-left text-xs font-semibold text-slate-700">SL</th>
                  <th className="w-12 px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                      checked={indeterminate || selectedIds.length === edges.length}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? edges.map((p: any) => p.node.id) : [])
                      }
                    />
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-slate-700">Title</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-slate-700 w-24">Status</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-slate-700">Url</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-slate-700 w-24">Update</th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-slate-700 w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {edges.map((row: any, index: number) => {
                  const page = row.node;
                  const selected = selectedIds.includes(page.id);
                  return (
                    <tr key={page.id} className={selected ? "bg-slate-50" : "hover:bg-slate-50"}>
                      <td className="px-4 py-2 text-sm text-slate-600 bg-amber-50 text-center">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                          checked={selected}
                          onChange={(e) =>
                            setSelectedIds((prev) =>
                              e.target.checked ? [...prev, page.id] : prev.filter((id) => id !== page.id)
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-900">{page.title}</td>
                      <td className="px-3 py-2 text-sm">
                        <span
                          className={[
                            "inline-flex rounded-full px-2 text-xs font-semibold leading-5",
                            page.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700",
                          ].join(" ")}
                        >
                          {page.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-600">
                        <button
                          type="button"
                          className="text-brand-600 hover:underline"
                          onClick={() => handleCopyUrl(page.slug)}
                        >
                          {`/${page.slug}/`}
                        </button>
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-600">
                        <div className="text-slate-900">{page.updatedAt ? dayjs(page.updatedAt).fromNow() : ""}</div>
                        <div className="text-xs text-slate-500">
                          {page.updatedAt ? dayjs(page.updatedAt).format("h:mm A MMM D") : ""}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/tool/page/update/?id=${page.id}`)}
                          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Cog6ToothIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : null}
                {!loading && edges.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
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
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
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
                                    active ? "bg-slate-100 text-slate-900" : "text-slate-700",
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
