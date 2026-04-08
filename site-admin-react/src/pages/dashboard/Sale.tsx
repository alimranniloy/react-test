import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  LineController,
  Filler
} from "chart.js";
import { STORE_STORE } from "@/graphql/queries/store";
import { useSiteStore } from "@/store/useSiteStore";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  LineController,
  Filler
);

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

const progress = (total: number, net: number) => {
  if (total > 0) {
    const ratio = (100 * (total - net)) / total;
    return 100 - ratio;
  }
  return total;
};

export default function Sale() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const variables = useMemo(() => {
    const fromValue = from ? dayjs(from).startOf("day").toISOString() : null;
    const toValue = to ? dayjs(to).endOf("day").toISOString() : null;
    return { id: siteId, from: fromValue, to: toValue };
  }, [siteId, from, to]);

  const { data } = useQuery(STORE_STORE, {
    variables,
    skip: !siteId
  });

  const store = data?.storeStore ?? null;
  const metrics = store?.data ?? null;

  const last7Days = useMemo(() => {
    const dates = [] as string[];
    for (let i = 6; i >= 0; i -= 1) {
      dates.push(dayjs().subtract(i, "day").format("DD MMM"));
    }
    return dates;
  }, []);

  const orderLine = metrics?.orderLine?.filter((line: any) => dayjs(line.date) <= dayjs()) ?? [];

  const orderByDays = useMemo(
    () => ({
      labels: orderLine.length ? orderLine.map((line: any) => dayjs(line.date).format("DD MMM")) : last7Days,
      datasets: [
        {
          type: "line" as const,
          label: "Order Progress",
          backgroundColor: "rgb(255, 29, 64, 0.4)",
          borderColor: "rgb(255, 29, 10, 0.4)",
          order: 0,
          data: orderLine.length ? orderLine.map((line: any) => line.total) : [40, 20, 12, 39, 10, 40, 39],
          tension: 0.3
        },
        {
          type: "bar" as const,
          label: "Delivered",
          backgroundColor: "rgb(75, 192, 192, 0.4)",
          borderColor: "rgb(75, 192, 10, 0.4)",
          borderRadius: { topLeft: 10, topRight: 10 },
          borderWidth: 2,
          data: orderLine.length ? orderLine.map((line: any) => line.delivered) : [60, 10, 2, 29, 10, 40, 39]
        },
        {
          type: "bar" as const,
          label: "New Order",
          backgroundColor: "rgb(255, 159, 64, 0.4)",
          borderColor: "rgb(255, 159, 10, 0.4)",
          borderRadius: { topLeft: 10, topRight: 10 },
          borderWidth: 2,
          data: orderLine.length ? orderLine.map((line: any) => line.total) : [40, 20, 12, 39, 10, 40, 39]
        },
        {
          type: "bar" as const,
          label: "Returned",
          backgroundColor: "rgb(255, 99, 132, 0.4)",
          borderColor: "rgb(255, 99, 10, 0.4)",
          borderRadius: { topLeft: 10, topRight: 10 },
          borderWidth: 2,
          data: orderLine.length ? orderLine.map((line: any) => line.returned) : [60, 10, 2, 29, 10, 40, 39]
        }
      ]
    }),
    [orderLine, last7Days]
  );

  const saleByDays = useMemo(
    () => ({
      labels: orderLine.length ? orderLine.map((line: any) => dayjs(line.date).format("DD MMM")) : last7Days,
      datasets: [
        {
          type: "line" as const,
          label: "Sale Progress",
          backgroundColor: "rgb(75, 192, 192, 0.4)",
          borderColor: "rgb(75, 192, 192)",
          order: 0,
          data: orderLine.length ? orderLine.map((line: any) => line.amount) : [40, 20, 12, 39, 10, 40, 39],
          tension: 0.3,
          fill: true
        }
      ]
    }),
    [orderLine, last7Days]
  );

  const options = useMemo(
    () => ({
      responsive: false,
      maintainAspectRatio: true,
      plugins: { legend: { position: "top" as const } }
    }),
    []
  );

  const stats = useMemo(() => {
    if (!metrics) {
      return [
        { name: "Transaction", stat: 0, change: 0, isMoney: true },
        { name: "Net Sale", stat: 0, change: 0, isMoney: true },
        { name: "Profit", stat: 0, change: 0, isMoney: true },
        { name: "Pending", stat: 0, change: 0, isMoney: false },
        { name: "Processing", stat: 0, change: 0, isMoney: false },
        { name: "Cancel", stat: 0, change: 0, isMoney: false },
        { name: "Returned", stat: 0, change: 0, isMoney: false },
        { name: "Deliverd", stat: 0, change: 0, isMoney: false }
      ];
    }

    return [
      { name: "Transaction", stat: metrics.transaction, change: -1, isMoney: true },
      { name: "Net Sale", stat: metrics.netSale, change: progress(metrics.transaction, metrics.netSale), isMoney: true },
      { name: "Profit", stat: metrics.profit, change: progress(metrics.transaction, metrics.profit), isMoney: true },
      { name: "Pending", stat: metrics.placed + metrics.pending, change: progress(metrics.orders, metrics.placed + metrics.pending), isMoney: false },
      {
        name: "Processing",
        stat: metrics.confirmed + metrics.shipment + metrics.station + metrics.onTheWay + metrics.packaging,
        change: progress(metrics.orders, metrics.confirmed + metrics.shipment + metrics.station + metrics.onTheWay + metrics.packaging),
        isMoney: false
      },
      { name: "Cancel", stat: metrics.cancelled, change: progress(metrics.orders, metrics.cancelled), isMoney: false },
      { name: "Returned", stat: metrics.returned, change: progress(metrics.orders, metrics.returned), isMoney: false },
      { name: "Deliverd", stat: metrics.delivered, change: progress(metrics.orders, metrics.delivered), isMoney: false }
    ];
  }, [metrics]);

  const lastDays = useMemo(() => {
    if (from && to) {
      return dayjs(to).diff(dayjs(from), "day");
    }
    return 7;
  }, [from, to]);

  return (
    <main className="px-4 pb-[60px] pt-[70px] md:pt-0 sm:pb-4">
      <div className="flex align-center space-between">
        <h3 className="text-lg w-full font-medium text-gray-900">Last {lastDays} days</h3>
        <div className="flex justify-end w-full max-w-xs gap-2">
          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-5 mb-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-8 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow sm:px-6 sm:pt-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="truncate text-sm font-medium text-slate-500">{item.name}</p>
                  <div className="mt-1 flex items-baseline gap-x-2">
                    <p className="text-lg font-bold text-slate-800">
                      {item.isMoney ? formatMoney(item.stat, site?.currency) : item.stat}
                    </p>
                    {item.change > 0 ? (
                      <div className="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-xs font-medium md:mt-2 lg:mt-0 absolute right-2 top-2 bg-green-100 text-green-800">
                        ▲ {item.change.toFixed(1)}%
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg shadow bg-white px-4 py-2 w-full">
        <Bar style={{ height: 300, width: "100%" }} data={orderByDays} options={options} />
      </div>

      <div className="mt-4 rounded-lg shadow bg-white px-4 py-2 w-full">
        <Bar style={{ height: 300, width: "100%" }} data={saleByDays} options={options} />
      </div>
    </main>
  );
}
