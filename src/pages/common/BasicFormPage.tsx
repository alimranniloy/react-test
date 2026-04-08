import { useState } from "react";
import { Link } from "react-router-dom";
import FilePondUploader from "@/components/FilePondUploader";

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "file" | "select";
  placeholder?: string;
  options?: { label: string; value: string }[];
};

type BasicFormPageProps = {
  title: string;
  description: string;
  backTo?: string;
  fields: FieldConfig[];
  submitLabel?: string;
  note?: string;
};

export default function BasicFormPage({
  title,
  description,
  backTo,
  fields,
  submitLabel = "Save",
  note
}: BasicFormPageProps) {
  const [values, setValues] = useState<Record<string, string | File | null>>({});

  const handleChange = (name: string, value: string | File | null) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="space-y-4">
      <section className="rounded-2xl bg-white/90 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Manage</p>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          {backTo ? (
            <Link to={backTo} className="text-xs text-indigo-600 hover:underline">
              Back
            </Link>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl bg-white/90 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const value = values[field.name];
            if (field.type === "textarea") {
              return (
                <label key={field.name} className="flex flex-col gap-2 text-xs text-slate-500 md:col-span-2">
                  {field.label}
                  <textarea
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                    placeholder={field.placeholder}
                    className="min-h-[120px] rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                  />
                </label>
              );
            }
            if (field.type === "select") {
              return (
                <label key={field.name} className="flex flex-col gap-2 text-xs text-slate-500">
                  {field.label}
                  <select
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                    className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }
            if (field.type === "file") {
              return (
                <label key={field.name} className="flex flex-col gap-2 text-xs text-slate-500">
                  {field.label}
                  <FilePondUploader
                    allowMultiple={false}
                    accepted="image/*"
                    onAdded={(file) => handleChange(field.name, file)}
                    onRemove={() => handleChange(field.name, null)}
                  />
                </label>
              );
            }
            return (
              <label key={field.name} className="flex flex-col gap-2 text-xs text-slate-500">
                {field.label}
                <input
                  type={field.type ?? "text"}
                  value={typeof value === "string" ? value : ""}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                />
              </label>
            );
          })}
        </div>
        {note ? (
          <p className="mt-3 text-[11px] text-slate-400">{note}</p>
        ) : null}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            {submitLabel}
          </button>
          <button type="button" className="rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
