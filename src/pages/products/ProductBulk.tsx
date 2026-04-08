import AppTable from "@/components/AppTable";
import { useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useMutation } from "@apollo/client";
import { SELF_STORE_PRODUCT_CREATE } from "@/graphql/mutations/product";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type CsvRow = Record<string, string>;

type Progress = {
  total: number;
  completed: number;
  failed: number;
};

const parseCsv = (text: string) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [] as CsvRow[];

  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: CsvRow = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trim();
    });
    return row;
  });
};

const toNumber = (value?: string) => {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const toJsonArray = (value?: string) => {
  if (!value) return [] as number[];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((item) => Number(item)).filter((item) => Number.isFinite(item)) : [];
  } catch {
    return [];
  }
};

export default function ProductBulk() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [rows, setRows] = useState<CsvRow[]>([]);
  const [progress, setProgress] = useState<Progress>({ total: 0, completed: 0, failed: 0 });
  const [running, setRunning] = useState(false);

  const [createProduct] = useMutation(SELF_STORE_PRODUCT_CREATE);

  const previewRows = useMemo(() => rows.slice(0, 10), [rows]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRows(parseCsv(text));
    setProgress({ total: 0, completed: 0, failed: 0 });
  };

  const handleRun = async () => {
    if (!user?.id || !siteId || rows.length === 0 || running) return;
    setRunning(true);
    setProgress({ total: rows.length, completed: 0, failed: 0 });

    let completed = 0;
    let failed = 0;

    for (const row of rows) {
      try {
        await createProduct({
          variables: {
            userId: user.id,
            siteId,
            title: row.title || row.translation || "Untitled",
            sku: row.sku || null,
            description: row.description || null,
            price: toNumber(row.price),
            comparePrice: toNumber(row.comparePrice),
            cost: toNumber(row.cost),
            quantity: toNumber(row.quantity),
            categories: toJsonArray(row.categories),
            brands: toJsonArray(row.brands)
          }
        });
        completed += 1;
      } catch {
        failed += 1;
      }
      setProgress({ total: rows.length, completed, failed });
    }

    setRunning(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Product Bulk Upload</h1>
            <p className="mt-2 text-sm text-gray-700">Upload CSV and create products in batch.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
            >
              Upload CSV
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleUpload} />
            <button
              type="button"
              onClick={handleRun}
              disabled={running || rows.length === 0}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              {running ? "Processing..." : "Run Import"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-600">
          Progress: {progress.completed}/{progress.total} completed, {progress.failed} failed.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <AppTable className="data-table min-w-full divide-y divide-gray-300">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Title</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">SKU</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {previewRows.map((row, index) => (
              <TableRow key={`${row.title}-${index}`}>
                <TableCell className="px-4 py-3 text-sm text-gray-700">{row.title || row.translation || "Untitled"}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{row.sku || "—"}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{row.price || "—"}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{row.quantity || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </AppTable>
        {rows.length === 0 ? (
          <div className="text-center border-t border-gray-200 bg-white px-4 py-6 text-sm text-gray-700">No CSV loaded.</div>
        ) : null}
      </div>
    </div>
  );
}
