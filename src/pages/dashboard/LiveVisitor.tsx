import { useEffect, useMemo, useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { ANALYTICS_SITE_PAGE, ANALYTICS_SITE_PAGE_SUBSCRIPTION } from "@/graphql/queries/analytics";
import { useSiteStore } from "@/store/useSiteStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

const formatNumber = (value: number, style: "compact" | "standard" = "compact") => {
  const formatter = new Intl.NumberFormat("en", {
    notation: style === "compact" ? "compact" : "standard"
  });
  return formatter.format(value ?? 0);
};

const truncateText = (text: string) => (text.length > 85 ? `${text.slice(0, 25)}…` : text);

export default function LiveVisitor() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [liveVisitor, setLiveVisitor] = useState(0);
  const [totalVisitor, setTotalVisitor] = useState(0);
  const [livePages, setLivePages] = useState<{ page: string; total: number }[]>([]);

  const { data: analyticsData } = useQuery(ANALYTICS_SITE_PAGE, {
    variables: { siteId },
    skip: !siteId
  });

  useSubscription(ANALYTICS_SITE_PAGE_SUBSCRIPTION, {
    variables: { channel: siteId ? `analytics_site_${siteId}` : "" },
    skip: !siteId,
    onData: ({ data }) => {
      const payload = data.data?.analyticsSitePage;
      if (payload) {
        setLiveVisitor(payload.live ?? 0);
        setTotalVisitor(payload.total ?? 0);
        setLivePages(payload.pages ?? []);
      }
    }
  });

  useEffect(() => {
    if (analyticsData?.analyticsSitePage) {
      setLiveVisitor(analyticsData.analyticsSitePage.live ?? 0);
      setTotalVisitor(analyticsData.analyticsSitePage.total ?? 0);
      setLivePages(analyticsData.analyticsSitePage.pages ?? []);
    }
  }, [analyticsData]);

  const domain = site?.domain ?? "";
  const pageRows = useMemo(() => livePages.filter((page) => page.total > 10), [livePages]);
  const columns = useMemo<DataTableColumn<{ page: string; total: number }>[]>(() => {
    return [
      {
        id: "path",
        header: "Page Path",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-slate-700 max-w-[250px] overflow-hidden break-words whitespace-normal",
        cell: (page) => {
          const cleaned = page.page === "/" ? domain : decodeURIComponent(page.page.replace(/\/$/, ""));
          const trimmed = page.page === "/" ? domain : truncateText(cleaned.split("/").slice(-2).join("/"));
          const href = domain ? `https://${domain}${page.page}` : page.page;
          return (
            <a target="_blank" rel="noreferrer" href={href} className="inline-block max-w-[300px] break-words whitespace-normal">
              {trimmed}
            </a>
          );
        }
      },
      {
        id: "visitors",
        header: "Visitors",
        headClassName: "px-4 py-3.5 text-right text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-right text-sm font-medium text-slate-500",
        cell: (page) => formatNumber(page.total, "compact")
      }
    ];
  }, [domain]);

  return (
    <main>
      <div>
        <div className="flex align-center space-between">
          <h3 className="text-sm md:text-lg w-full font-medium text-gray-900">Last 7 days</h3>
        </div>

        <div className="grid grid-cols-1 gap-5 my-5">
          <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Live Visitors</h2>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-200 my-5">
              <div className="flex items-center gap-4 pr-4">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-50 text-indigo-600">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 12h4l3 8 4-16 3 8h4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Currently Online</p>
                  <p className="text-2xl font-bold text-slate-800">{formatNumber(liveVisitor, "compact")}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-4">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-50 text-indigo-600">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M16 11a4 4 0 10-8 0 4 4 0 008 0zM2 21a8 8 0 0116 0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Today</p>
                  <p className="text-2xl font-bold text-slate-800">{formatNumber(totalVisitor, "compact")}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-700 mb-3">Popular Pages (10+ visitors)</h3>

              <DataTable
                rows={pageRows}
                getRowId={(page) => page.page}
                columns={columns}
                emptyLabel="No pages with 10+ visitors."
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
