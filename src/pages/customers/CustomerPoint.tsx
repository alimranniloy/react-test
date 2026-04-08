import BasicFormPage from "@/pages/common/BasicFormPage";

export default function CustomerPoint() {
  return (
    <BasicFormPage
      title="Customer points"
      description="Configure loyalty points and redemption rules."
      backTo="/customer/"
      fields={[
        { name: "title", label: "Program name", placeholder: "Loyalty Points" },
        { name: "earning", label: "Earning rule", placeholder: "1 point per 100 BDT" },
        { name: "redeem", label: "Redemption rule", placeholder: "100 points = 50 BDT" },
        { name: "status", label: "Status", type: "select", options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" }
        ] }
      ]}
      submitLabel="Save program"
      note="Point accrual wiring will be connected to order events next."
    />
  );
}
