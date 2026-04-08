import BasicFormPage from "@/pages/common/BasicFormPage";

export default function FileBulk() {
  return (
    <BasicFormPage
      title="Bulk upload"
      description="Upload multiple files in one batch for media, documents, or templates."
      backTo="/tool/file/"
      fields={[
        { name: "folder", label: "Target folder", placeholder: "e.g., products/2026" },
        { name: "files", label: "Files", type: "file" },
        { name: "notes", label: "Notes", type: "textarea", placeholder: "Optional notes" }
      ]}
      submitLabel="Upload files"
      note="Bulk uploader will be wired to FilePond pipeline next."
    />
  );
}
