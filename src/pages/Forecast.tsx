import BasicFormPage from "@/pages/common/BasicFormPage";

export default function Forecast() {
  return (
    <BasicFormPage
      title="Forecast"
      description="Track projections for sales and inventory."
      backTo="/"
      fields={[
        { name: "range", label: "Forecast range", placeholder: "Next 30 days" },
        { name: "model", label: "Model", placeholder: "Baseline / Seasonal" },
        { name: "notes", label: "Notes", type: "textarea", placeholder: "Assumptions or notes" }
      ]}
      submitLabel="Generate forecast"
      note="Forecast engine wiring will be connected after data model sync."
    />
  );
}
