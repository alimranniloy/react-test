import { Fragment, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, BoltIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SITE_PAGES } from "@/graphql/queries/tools";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteAdminStore, type SiteSummary } from "@/siteAdmin/store/useSiteAdminStore";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);

type PageNode = {
  id: number;
  slug?: string | null;
  title?: string | null;
  updatedAt?: string | null;
  isActive?: boolean | null;
};

export default function Pages() {
  const user = useAuthStore((s) => s.user);
  const siteId = useSiteAdminStore((s) => s.siteId);
  const setSiteId = useSiteAdminStore((s) => s.setSiteId);
  const sites = useSiteAdminStore((s) => s.sites);
  const loadSites = useSiteAdminStore((s) => s.loadSites);

  const [search] = useState<string>("");
  const [first] = useState<number>(15);

  const createdById = useMemo(() => {
    if (!user?.id) return null;
    return user.isStaff ? null : user.id;
  }, [user?.id, user?.isStaff]);

  useEffect(() => {
    if (!user?.id) return;
    if (sites.length) return;
    loadSites(createdById, "site");
  }, [createdById, loadSites, sites.length, user?.id]);

  useEffect(() => {
    if (siteId) return;
    const firstSite = sites[0];
    if (firstSite?.id) setSiteId(firstSite.id);
  }, [setSiteId, siteId, sites]);

  const selectedSite: SiteSummary | null = useMemo(() => {
    if (!siteId) return null;
    return sites.find((s) => s.id === siteId) ?? null;
  }, [siteId, sites]);

  const { data, loading, error, refetch, fetchMore } = useQuery(SITE_PAGES, {
    variables: {
      siteId: siteId ?? 0,
      search: search || null,
      first,
      after: null
    },
    fetchPolicy: "network-only",
    skip: !siteId
  });

  const edges: { node: PageNode }[] = data?.sitePages?.edges ?? [];
  const pageInfo = data?.sitePages?.pageInfo;

  const loadMore = async () => {
    const endCursor = pageInfo?.endCursor;
    if (!endCursor || !siteId) return;
    await fetchMore({
      variables: {
        siteId,
        search: search || null,
        first,
        after: endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const prevEdges = prev?.sitePages?.edges ?? [];
        const nextEdges = fetchMoreResult?.sitePages?.edges ?? [];
        const nextPageInfo =
          fetchMoreResult?.sitePages?.pageInfo ?? prev?.sitePages?.pageInfo;
        return {
          ...prev,
          sitePages: {
            ...prev.sitePages,
            edges: [...prevEdges, ...nextEdges],
            pageInfo: nextPageInfo
          }
        };
      }
    });
  };

  return (
    <main className="px-4 pb-16 pt-0">
      <div className="sm:flex sm:items-center sm:justify-between gap-4">
        <div className="sm:flex-auto relative">
          <h1 className="text-xl font-semibold text-slate-900 flex items-center">
            Page
            <button
              type="button"
              onClick={() => refetch()}
              disabled={loading}
              className="ml-2 inline-flex items-center rounded p-1 hover:bg-slate-100 disabled:opacity-60"
              title="Refresh"
            >
              <BoltIcon className="h-4 w-4" />
            </button>
          </h1>
          <p className="mt-2 text-sm text-slate-700">
            Pages inside the selected site.
          </p>
        </div>

        <div className="min-w-56">
          <Listbox value={selectedSite} onChange={(next) => setSiteId(next?.id ?? null)}>
            <div className="relative">
              <Listbox.Label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-900 z-10">
                Site
              </Listbox.Label>
              <Listbox.Button className="relative w-full rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-left text-sm text-slate-700">
                <span className="block truncate">
                  {selectedSite?.title ?? "Select site"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                  {sites.map((site) => (
                    <Listbox.Option
                      key={site.id}
                      value={site}
                      className={({ active }) =>
                        [
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                          active ? "bg-indigo-600 text-white" : "text-slate-900"
                        ].join(" ")
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={[
                              "block truncate",
                              selected ? "font-semibold" : "font-normal"
                            ].join(" ")}
                          >
                            {site.title}
                          </span>
                          {selected ? (
                            <span
                              className={[
                                "absolute inset-y-0 right-0 flex items-center pr-3",
                                active ? "text-white" : "text-indigo-600"
                              ].join(" ")}
                            >
                              <CheckIcon className="h-5 w-5" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-md border bg-white p-4 text-sm text-rose-600">
          {String(error.message)}
        </div>
      ) : null}

      {!siteId ? (
        <div className="mt-6 rounded-md border bg-white p-6 text-sm text-slate-600">
          Select a site to view pages.
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-16 px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    SL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {edges.map((edge, index) => {
                  const page = edge.node;
                  return (
                    <tr key={page.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-600 bg-amber-50">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate">{page.title ?? ""}</span>
                          <Link
                            to={`/page/update/?id=${page.id}&siteId=${siteId ?? ""}`}
                            className="text-xs font-medium text-brand-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Update
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {page.slug ?? ""}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {page.updatedAt ? dayjs(page.updatedAt).fromNow() : ""}
                      </td>
                    </tr>
                  );
                })}
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : null}
                {!loading && edges.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No pages found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t bg-white px-4 py-3">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{edges.length}</span>
            </div>
            <button
              type="button"
              onClick={loadMore}
              disabled={!pageInfo?.endCursor || loading}
              className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
