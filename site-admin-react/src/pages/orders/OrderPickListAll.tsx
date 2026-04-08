import OrderReport from "@/pages/orders/OrderReport";

export default function OrderPickListAll() {
  return (
    <OrderReport
      title="Pick list (all)"
      description="Combined picking list for all matching orders."
      compact
    />
  );
}
