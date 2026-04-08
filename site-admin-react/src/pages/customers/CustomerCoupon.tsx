import BasicFormPage from "@/pages/common/BasicFormPage";

export default function CustomerCoupon() {
  return (
    <BasicFormPage
      title="Customer coupon"
      description="Create coupons for retention or targeted promotions."
      backTo="/customer/"
      fields={[
        { name: "code", label: "Coupon code", placeholder: "SAVE10" },
        { name: "discount", label: "Discount amount", type: "number", placeholder: "10" },
        { name: "minOrder", label: "Minimum order", type: "number", placeholder: "500" },
        { name: "status", label: "Status", type: "select", options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" }
        ] },
        { name: "notes", label: "Notes", type: "textarea", placeholder: "Internal notes" }
      ]}
      submitLabel="Save coupon"
      note="Coupon validation will be wired to checkout rules next."
    />
  );
}
