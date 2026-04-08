import { useMemo } from "react";
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

export default function Acquisition() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const { data } = useQuery(STORE_STORE, {
    variables: { id: siteId },
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

  const customerLine = metrics?.customerLine?.filter((line: any) => dayjs(line.date) <= dayjs()) ?? [];

  const customerByDays = useMemo(
    () => ({
      labels: customerLine.length ? customerLine.map((line: any) => dayjs(line.date).format("DD MMM")) : last7Days,
      datasets: [
        {
          type: "line" as const,
          label: "Customer Progress",
          backgroundColor: "rgb(255, 29, 64, 0.4)",
          borderColor: "rgb(255, 29, 10, 0.4)",
          order: 0,
          data: customerLine.length ? customerLine.map((line: any) => line.total) : [40, 20, 12, 39, 10, 40, 39],
          tension: 0.3
        },
        {
          type: "bar" as const,
          label: "Customer",
          backgroundColor: "rgb(75, 192, 192, 0.4)",
          borderColor: "rgb(75, 192, 10, 0.4)",
          borderRadius: { topLeft: 10, topRight: 10 },
          borderWidth: 2,
          data: customerLine.length ? customerLine.map((line: any) => line.customer) : [60, 10, 2, 29, 10, 40, 39]
        },
        {
          type: "bar" as const,
          label: "Total",
          backgroundColor: "rgb(255, 159, 64, 0.4)",
          borderColor: "rgb(255, 159, 10, 0.4)",
          borderRadius: { topLeft: 10, topRight: 10 },
          borderWidth: 2,
          data: customerLine.length ? customerLine.map((line: any) => line.total) : [40, 20, 12, 39, 10, 40, 39]
        },
        {
          type: "bar" as const,
          label: "Reseller",
          backgroundColor: "rgb(255, 99, 132, 0.4)",
          borderColor: "rgb(255, 99, 10, 0.4)",
          borderRadius: { topLeft: 10, topRight: 10 },
          borderWidth: 2,
          data: customerLine.length ? customerLine.map((line: any) => line.reseller) : [60, 10, 2, 29, 10, 40, 39]
        },
        {
          type: "bar" as const,
          label: "Affiliate",
          backgroundColor: "rgb(255, 29, 432, 0.4)",
          borderColor: "rgb(255, 29, 432)",
          borderRadius: { topLeft: 10, topRight: 10 },
          borderWidth: 2,
          data: customerLine.length ? customerLine.map((line: any) => line.affiliate) : [60, 10, 2, 29, 10, 40, 39]
        }
      ]
    }),
    [customerLine, last7Days]
  );

  const options = useMemo(
    () => ({
      responsive: false,
      maintainAspectRatio: true,
      plugins: { legend: { position: "top" as const } }
    }),
    []
  );

  return (
    <main className="px-4 pb-[60px] pt-[70px] md:pt-0 sm:pb-4">
      <div className="flex align-center space-between">
        <h3 className="text-lg w-full font-medium text-gray-900">Last 7 days</h3>
      </div>

      <div className="mt-4 rounded-lg shadow bg-white px-4 py-2 w-full">
        <Bar style={{ height: 300, width: "100%" }} data={customerByDays} options={options} />
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-800">Customer Acquisition</h3>
        <p className="text-sm text-slate-500 mt-1">User list module will be ported next to match Vue acquisition view.</p>
      </div>
    </main>
  );
}
