import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ANALYTICS_SITE_PAGE, ANALYTICS_SITE_PAGE_SUBSCRIPTION } from "@/graphql/queries/analytics";
import { STORE_STORE } from "@/graphql/queries/store";
import OrderList from "@/pages/orders/OrderList";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatMoney = (value: number | null | undefined, currency?: string | null) => {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "BDT",
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `${value}`;
  }
};

const formatNumber = (value: number, style: "compact" | "standard" = "compact") => {
  const formatter = new Intl.NumberFormat("en", {
    notation: style === "compact" ? "compact" : "standard"
  });
  return formatter.format(value ?? 0);
};

const truncateText = (text: string) => (text.length > 65 ? `${text.slice(0, 25)}…` : text);

const accentForLabel = (label: string) => {
  const key = label.toLowerCase();
  if (key.includes("sale") || key.includes("profit") || key.includes("transaction")) return "bg-emerald-500";
  if (key.includes("order") || key.includes("pending") || key.includes("processing")) return "bg-indigo-500";
  if (key.includes("return") || key.includes("cancel")) return "bg-rose-400";
  if (key.includes("charge")) return "bg-amber-500";
  if (key.includes("product")) return "bg-sky-500";
  return "bg-slate-300";
};

export default function Dashboard() {
  const site = useSiteStore((state) => state.site);
  const siteMeta = site as Record<string, any> | null;
  const user = useAuthStore((state) => state.user);
  const siteId = site?.id ?? null;

  const [liveVisitor, setLiveVisitor] = useState(0);
  const [totalVisitor, setTotalVisitor] = useState(0);
  const [livePages, setLivePages] = useState<{ page: string; total: number }[]>([]);

  const defaultEnd = useMemo(() => dayjs(), []);
  const defaultStart = useMemo(() => dayjs().subtract(6, "day"), []);
  const [dateRange, setDateRange] = useState<[string, string]>([
    defaultStart.format("YYYY-MM-DD"),
    defaultEnd.format("YYYY-MM-DD")
  ]);

  const range = useMemo(() => {
    const [from, to] = dateRange;
    return {
      from: dayjs(from).tz("Asia/Dhaka").startOf("day").utc().toISOString(),
      to: dayjs(to).tz("Asia/Dhaka").endOf("day").utc().toISOString()
    };
  }, [dateRange]);

  const rangeLabel = useMemo(() => {
    if (!dateRange[0] || !dateRange[1]) return "Date range";
    return `${dayjs(dateRange[0]).format("DD MMM")} - ${dayjs(dateRange[1]).format("DD MMM")}`;
  }, [dateRange]);

  const { data: analyticsData, loading: analyticsLoading } = useQuery(ANALYTICS_SITE_PAGE, {
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

  const { data: storeData, refetch } = useQuery(STORE_STORE, {
    variables: { id: siteId, ...range },
    skip: !siteId
  });


  useEffect(() => {
    if (analyticsData?.analyticsSitePage) {
      setLiveVisitor(analyticsData.analyticsSitePage.live ?? 0);
      setTotalVisitor(analyticsData.analyticsSitePage.total ?? 0);
      setLivePages(analyticsData.analyticsSitePage.pages ?? []);
    }
  }, [analyticsData]);

  useEffect(() => {
    if (!siteId) return;
    refetch({ id: siteId, ...range }).catch(() => undefined);
  }, [range, refetch, siteId]);

  const store = storeData?.storeStore ?? null;
  const metrics = store?.data ?? null;

  const completedSteps = site?.completedStep ?? [];
  const setupProgress = completedSteps.filter((el) => [1, 2, 3, 4, 5].includes(el)).length;
  const completionPercent = Math.min(100, Math.round((setupProgress / 5) * 100));
  const remainingSteps = Math.max(0, 5 - setupProgress);

  const heroSubtitle = useMemo(() => {
    if (remainingSteps === 0) {
      return "Your dashboard is ready. Focus on the signals that move revenue and retention.";
    }
    return `Complete ${remainingSteps} quick setup step${remainingSteps > 1 ? "s" : ""} to unlock full insights.`;
  }, [remainingSteps]);

  const welcomeMessage = useMemo(() => {
    const name = user?.name || "Admin";
    return `Welcome back, ${name}.`;
  }, [user?.name]);

  const pendingCount = useMemo(() => (metrics ? metrics.placed + metrics.pending : 0), [metrics]);
  const processingCount = useMemo(
    () => (metrics ? metrics.confirmed + metrics.shipment + metrics.station + metrics.onTheWay + metrics.packaging : 0),
    [metrics]
  );

  const derived = useMemo(() => {
    const orders = metrics?.orders ?? 0;
    const delivered = metrics?.delivered ?? 0;
    const returned = metrics?.returned ?? 0;
    const cancelled = metrics?.cancelled ?? 0;
    const netSale = metrics?.netSale ?? 0;
    const profit = metrics?.profit ?? 0;
    const aov = orders ? Math.round(netSale / orders) : 0;
    const margin = netSale ? Math.round((profit / netSale) * 100) : 0;
    const fulfillment = orders ? Math.round((delivered / orders) * 100) : 0;
    const returnRate = orders ? Math.round((returned / orders) * 100) : 0;
    const cancelRate = orders ? Math.round((cancelled / orders) * 100) : 0;
    return { aov, margin, fulfillment, returnRate, cancelRate };
  }, [metrics]);

  const summaryCards = useMemo(
    () => [
      {
        title: "Net Sales",
        value: formatMoney(metrics?.netSale ?? 0, site?.currency),
        meta: `AOV ${formatMoney(derived.aov, site?.currency)} • Margin ${derived.margin}%`
      },
      {
        title: "Orders",
        value: formatNumber(metrics?.orders ?? 0, "compact"),
        meta: `Fulfillment ${derived.fulfillment}% • Pending ${formatNumber(pendingCount, "compact")}`
      },
      {
        title: "Profit",
        value: formatMoney(metrics?.profit ?? 0, site?.currency),
        meta: `Returns ${derived.returnRate}% • Cancels ${derived.cancelRate}%`
      }
    ],
    [derived, metrics?.netSale, metrics?.orders, metrics?.profit, pendingCount, site?.currency]
  );

  const topPage = useMemo(() => {
    if (!livePages.length) return null;
    const page = livePages[0];
    const pagePath = page.page === "/" ? site?.domain ?? "" : page.page;
    const label =
      page.page === "/"
        ? site?.domain ?? ""
        : truncateText(decodeURIComponent(page.page.replace(/\/$/, "").split("/").slice(-2).join("/")));
    const href = site?.domain ? `https://${site.domain}${pagePath}` : pagePath;
    return { label, href, total: page.total };
  }, [livePages, site?.domain]);

  const setupColumns = useMemo(
    () => [
      { id: 1, title: "Logo", completed: completedSteps.includes(1), link: "/tool/setting/" },
      { id: 2, title: "Category", completed: completedSteps.includes(2), link: "/product/category/" },
      { id: 3, title: "Products", completed: completedSteps.includes(3), link: "/product/" },
      { id: 4, title: "Gateway", completed: completedSteps.includes(4), link: "/tool/gateway/" },
      { id: 5, title: "Logistics", completed: completedSteps.includes(5), link: "/tool/logistics/" }
    ],
    [completedSteps]
  );

  const shortcuts = [
    { label: "Today", range: [dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")] },
    { label: "Yesterday", range: [dayjs().subtract(1, "day").format("YYYY-MM-DD"), dayjs().subtract(1, "day").format("YYYY-MM-DD")] },
    { label: "Past 7 days", range: [dayjs().subtract(7, "day").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")] },
    { label: "Past 30 days", range: [dayjs().subtract(30, "day").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")] },
    { label: "This month", range: [dayjs().startOf("month").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")] },
    { label: "This year", range: [dayjs().startOf("year").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")] },
    { label: "Last week", range: [dayjs().subtract(1, "week").startOf("week").format("YYYY-MM-DD"), dayjs().subtract(1, "week").endOf("week").format("YYYY-MM-DD")] },
    { label: "Last month", range: [dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD"), dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD")] },
    { label: "Last year", range: [dayjs().subtract(1, "year").startOf("year").format("YYYY-MM-DD"), dayjs().subtract(1, "year").endOf("year").format("YYYY-MM-DD")] }
  ];

  const actionItems = useMemo(() => {
    const orders = metrics?.orders ?? 0;
    const returned = metrics?.returned ?? 0;
    const cancelled = metrics?.cancelled ?? 0;
    const notResponding = metrics?.notResponding ?? 0;
    const pending = metrics ? metrics.placed + metrics.pending : 0;
    const returnRate = orders ? Math.round((returned / orders) * 100) : 0;
    const cancelRate = orders ? Math.round((cancelled / orders) * 100) : 0;
    const list = [];
    if (pending > 0) list.push({ label: `Process ${formatNumber(pending, "compact")} pending orders`, href: "/order/" });
    if (notResponding > 0) list.push({ label: `Follow up ${formatNumber(notResponding, "compact")} not-responding`, href: "/order/" });
    if (returnRate >= 5) list.push({ label: `Review returns (${returnRate}%)`, href: "/order/" });
    if (cancelRate >= 5) list.push({ label: `Reduce cancellations (${cancelRate}%)`, href: "/order/" });
    if (!site?.completedStep || site?.completedStep.length < 5) list.push({ label: "Complete setup checklist", href: "/tool/setting/" });
    return list.slice(0, 4);
  }, [metrics, site?.completedStep]);

  return (
    <main className="space-y-2">
      <section className="rounded-2xl border border-slate-100 bg-white/90 p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{site?.title || "Store Admin"}</p>
            <h1 className="text-lg font-semibold text-slate-900">{welcomeMessage}</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{heroSubtitle}</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="rounded-full bg-slate-50 px-3 py-1 font-semibold text-slate-600">{rangeLabel}</span>
            <span>Report window</span>
          </div>
        </div>

        {!user?.isStaff ? (
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={dateRange[0]}
                onChange={(event) => setDateRange([event.target.value, dateRange[1]])}
                className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
              />
              <input
                type="date"
                value={dateRange[1]}
                onChange={(event) => setDateRange([dateRange[0], event.target.value])}
                className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {shortcuts.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setDateRange([item.range[0], item.range[1]])}
                  className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          <Link to="/order/" className="rounded-full bg-slate-50 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100">
            Review orders
          </Link>
          <Link to="/product/" className="rounded-full bg-slate-50 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100">
            Manage products
          </Link>
          <Link to="/marketing/new/" className="rounded-full bg-slate-50 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100">
            Launch campaign
          </Link>
          <Link to="/live-visitor/" className="rounded-full bg-slate-50 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100">
            View analytics
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white/90 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Live pulse</p>
            <h2 className="text-sm font-semibold text-slate-900">Traffic focus</h2>
          </div>
          <Link to="/live-visitor/" className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800">
            Open live analytics
          </Link>
        </div>
        <div className="mt-2 grid gap-2 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Live now</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(liveVisitor, "compact")}</p>
              <p className="text-[11px] text-slate-500">People browsing right now</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Today</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(totalVisitor, "compact")}</p>
              <p className="text-[11px] text-slate-500">Total visitors today</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Active pages</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(livePages.length, "standard")}</p>
              <p className="text-[11px] text-slate-500">Pages getting traffic</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Top page</p>
            {analyticsLoading ? (
              <div className="mt-2 text-[11px] text-slate-400">Loading live feed…</div>
            ) : topPage ? (
              <div className="mt-2">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={topPage.href}
                  className="text-sm font-semibold text-slate-900 hover:text-indigo-600"
                >
                  {topPage.label}
                </a>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
                    {formatNumber(topPage.total, "compact")}
                  </span>
                  <span>Active visitors here</span>
                </div>
              </div>
            ) : (
              <div className="mt-2 rounded-lg bg-slate-50 px-3 py-3 text-center text-[11px] text-slate-400">
                Waiting for live traffic…
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white/90 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Business snapshot</p>
            <h2 className="text-sm font-semibold text-slate-900">Compact, actionable summary</h2>
          </div>
          <span className="text-xs text-slate-500">{rangeLabel}</span>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">{card.title}</p>
                <span className={`inline-flex h-2 w-2 rounded-full ${accentForLabel(card.title)}`} />
              </div>
              <p className="mt-1 text-base font-semibold text-slate-900">{card.value}</p>
              <p className="mt-1 text-[11px] text-slate-500">{card.meta}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-slate-50 px-3 py-1 text-slate-600">
            Pending <strong className="text-slate-900">{formatNumber(pendingCount, "compact")}</strong>
          </span>
          <span className="rounded-full bg-slate-50 px-3 py-1 text-slate-600">
            Processing <strong className="text-slate-900">{formatNumber(processingCount, "compact")}</strong>
          </span>
          <span className="rounded-full bg-slate-50 px-3 py-1 text-slate-600">
            Delivered <strong className="text-slate-900">{formatNumber(metrics?.delivered ?? 0, "compact")}</strong>
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white/90 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Focus</p>
            <h2 className="text-sm font-semibold text-slate-900">Actionable priorities</h2>
          </div>
          <span className="text-xs text-slate-500">Live checklist</span>
        </div>
        <div className="mt-2 grid gap-2 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-1.5">
            {actionItems.length ? (
              actionItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <span>{item.label}</span>
                  <span className="text-slate-400">Open</span>
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5 text-[11px] text-slate-400">
                No urgent actions right now.
              </div>
            )}
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Store readiness</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{completionPercent}% complete</p>
            <div className="mt-2 h-2 rounded-full bg-white/70">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${completionPercent}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>{remainingSteps} steps left</span>
              <span>Plan: 5 steps</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {setupColumns
                .filter((item) => !item.completed)
                .slice(0, 3)
                .map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-white"
                  >
                    Add {item.title}
                  </Link>
                ))}
              {!setupColumns.some((item) => !item.completed) ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  Ready for growth
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Next payment</span>
              <span className="font-semibold text-slate-700">
                {siteMeta?.lastPayment ? dayjs(siteMeta.lastPayment as string).format("MMM D, YY") : "—"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white/90 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Orders</p>
            <h2 className="text-sm font-semibold text-slate-900">Current order pipeline</h2>
          </div>
          <Link to="/order/" className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800">
            Open orders
          </Link>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Pending</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(pendingCount, "compact")}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Processing</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(processingCount, "compact")}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Delivered</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {formatNumber(metrics?.delivered ?? 0, "compact")}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Returned</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {formatNumber(metrics?.returned ?? 0, "compact")}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Cancelled</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {formatNumber(metrics?.cancelled ?? 0, "compact")}
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
          <span className="rounded-full bg-slate-50 px-3 py-1">
            Total orders <strong className="text-slate-900">{formatNumber(metrics?.orders ?? 0, "compact")}</strong>
          </span>
          <span className="rounded-full bg-slate-50 px-3 py-1">
            Not responding <strong className="text-slate-900">{formatNumber(metrics?.notResponding ?? 0, "compact")}</strong>
          </span>
          <span className="rounded-full bg-slate-50 px-3 py-1">
            Hold <strong className="text-slate-900">{formatNumber(metrics?.hold ?? 0, "compact")}</strong>
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white/90 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order list</p>
            <h2 className="text-sm font-semibold text-slate-900">Full order list</h2>
          </div>
        </div>
        <div className="mt-2">
          <OrderList />
        </div>
      </section>
    </main>
  );
}
