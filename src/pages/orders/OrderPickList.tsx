import OrderReport from "@/pages/orders/OrderReport";

export default function OrderPickList() {
  return (
    <OrderReport
      title="Pick list"
      description="Single-run picking list for the selected status and time range."
      compact
    />
  );
}
