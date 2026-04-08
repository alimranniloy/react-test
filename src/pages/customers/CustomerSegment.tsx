import BasicFormPage from "@/pages/common/BasicFormPage";

export default function CustomerSegment() {
  return (
    <BasicFormPage
      title="Customer segment"
      description="Create segments to target customers by behavior, order value, or lifecycle."
      backTo="/customer/"
      fields={[
        { name: "title", label: "Segment name", placeholder: "VIP Customers" },
        { name: "rule", label: "Rule", placeholder: "e.g., Orders > 5" },
        { name: "status", label: "Status", type: "select", options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" }
        ] },
        { name: "notes", label: "Notes", type: "textarea", placeholder: "Internal notes" }
      ]}
      submitLabel="Save segment"
      note="Rules and data binding will be wired to the customer graph in the next pass."
    />
  );
}
