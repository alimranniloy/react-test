import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useSearchParams } from "react-router-dom";
import { SITE_PAGE } from "@/graphql/queries/page";
import {
  SELF_SITE_PAGE_DELETE,
  SELF_SITE_PAGE_UPDATE
} from "@/graphql/mutations/page";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

function safeJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function PageUpdate() {
  const [params] = useSearchParams();
  const addToast = useToastStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);
  const selectedSiteId = useSiteAdminStore((s) => s.siteId);

  const pageId = useMemo(() => {
    const raw = params.get("id");
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const siteId = useMemo(() => {
    const raw = params.get("siteId");
    if (raw) {
      const n = Number(raw);
      if (Number.isFinite(n)) return n;
    }
    return selectedSiteId;
  }, [params, selectedSiteId]);

  const { data, loading, error, refetch } = useQuery(SITE_PAGE, {
    variables: { siteId: siteId ?? 0, id: pageId ?? 0 },
    fetchPolicy: "network-only",
    skip: !siteId || !pageId
  });

  const page = data?.sitePage ?? null;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [htmlText, setHtmlText] = useState("");
  const [schemaText, setSchemaText] = useState("{}");
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (!page) return;
    setTitle(String(page.title ?? ""));
    setSlug(String(page.slug ?? ""));
    setDescription(String(page.description ?? ""));
    setHtmlText(
      typeof page.html === "string" ? page.html : safeJsonStringify(page.html)
    );
    setSchemaText(safeJsonStringify(page.schema));
    setIsActive(!!page.isActive);
  }, [page?.id]);

  const [updatePage, { loading: saving }] = useMutation(SELF_SITE_PAGE_UPDATE, {
    onCompleted: async () => {
      addToast({
        kind: "success",
        title: "Page",
        subTitle: "Successfully updated."
      });
      await refetch();
    },
    onError: (err) => {
      addToast({ kind: "error", title: "Page", subTitle: err.message });
    }
  });

  const [deletePage, { loading: deleting }] = useMutation(SELF_SITE_PAGE_DELETE, {
    onCompleted: () => {
      addToast({ kind: "success", title: "Page", subTitle: "Deleted." });
    },
    onError: (err) => {
      addToast({ kind: "error", title: "Page", subTitle: err.message });
    }
  });

  const handleSave = async () => {
    if (!user?.id || !siteId || !pageId) return;
    const parsedSchema = safeJsonParse(schemaText);
    if (parsedSchema == null) {
      addToast({ kind: "error", title: "Schema", subTitle: "Invalid JSON" });
      return;
    }
    await updatePage({
      variables: {
        userId: user.id,
        siteId,
        id: pageId,
        title: title || null,
        slug: slug || null,
        description: description || null,
        html: htmlText || null,
        isActive,
        schema: parsedSchema
      }
    });
  };

  const handleDelete = async () => {
    if (!user?.id || !siteId || !pageId) return;
    const ok = window.confirm("Delete this page?");
    if (!ok) return;
    await deletePage({ variables: { userId: user.id, siteId, id: pageId } });
  };

  if (!siteId) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">No site selected</h2>
        <p className="mt-2 text-sm text-slate-500">
          Select a site from <Link className="text-brand-600 underline" to="/page/">Page</Link>{" "}
          and then open update.
        </p>
      </div>
    );
  }

  if (!pageId) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">Missing page id</h2>
        <p className="mt-2 text-sm text-slate-500">
          Open this page with `?id=PAGE_ID`.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 truncate">
            {page?.title ?? "Page"}
          </h1>
          <div className="mt-1 text-xs text-slate-500">
            Raw editor (schema/html). This replaces the Vue Editor for now.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-md border bg-white p-4 text-sm text-rose-600">
          {String(error.message)}
        </div>
      ) : null}

      <div className="mt-6 rounded-md border bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full min-h-24 rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>
        </div>

        <div className="mt-5">
          <div className="text-xs font-semibold text-slate-700">Schema JSON</div>
          <textarea
            value={schemaText}
            onChange={(e) => setSchemaText(e.target.value)}
            className="mt-2 w-full min-h-64 rounded-md border p-3 font-mono text-xs"
          />
        </div>

        <div className="mt-5">
          <div className="text-xs font-semibold text-slate-700">HTML / JSON</div>
          <textarea
            value={htmlText}
            onChange={(e) => setHtmlText(e.target.value)}
            className="mt-2 w-full min-h-64 rounded-md border p-3 font-mono text-xs"
          />
        </div>
      </div>

      <div className="pt-5 flex justify-end gap-3">
        <Link
          to="/page/"
          className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          Save
        </button>
      </div>
    </main>
  );
}

