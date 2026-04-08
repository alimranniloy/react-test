import { useSiteStore } from "@/store/useSiteStore";

export default function Invoice() {
  const site = useSiteStore((state) => state.site);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900">Invoice</h1>
        <p className="mt-2 text-sm text-gray-700">Invoice templates and exports.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{site?.title ?? "Invoice"}</h2>
            <p className="text-sm text-gray-500">{site?.domain ?? site?.hostname ?? ""}</p>
          </div>
          {site?.favicon ? (
            <img src={site.favicon} alt="Logo" className="h-12 w-12 rounded-full" />
          ) : null}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
            <div className="text-xs font-semibold text-gray-500">Currency</div>
            <div className="text-sm text-gray-700">{site?.currency ?? "—"}</div>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
            <div className="text-xs font-semibold text-gray-500">Phone</div>
            <div className="text-sm text-gray-700">{site?.phone ?? "—"}</div>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
          Invoice templates are managed in the Vue admin. We can port the full invoice editor UI next.
        </div>
      </div>
    </div>
  );
}
