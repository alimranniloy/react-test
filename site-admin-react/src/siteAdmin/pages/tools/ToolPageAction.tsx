import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SITE_PAGE } from "@/graphql/queries/page";
import {
  SELF_SITE_PAGE_CREATE,
  SELF_SITE_PAGE_DELETE,
  SELF_SITE_PAGE_UPDATE
} from "@/graphql/mutations/page";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";

type TabName = "Overview" | "General";

function safeJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

export default function ToolPageAction() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const addToast = useToastStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);
  const siteId = useSiteAdminStore((s) => s.siteId);

  const idParam = params.get("id");
  const pageId = idParam ? Number(idParam) : null;
  const isUpdate = !!(pageId && Number.isFinite(pageId));

  const [tab, setTab] = useState<TabName>(isUpdate ? "Overview" : "General");

  const pageQuery = useQuery(SITE_PAGE, {
    variables: { siteId: siteId ?? 0, id: pageId ?? 0 },
    fetchPolicy: "network-only",
    skip: !isUpdate || !siteId,
  });

  const page = pageQuery.data?.sitePage ?? null;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [schemaText, setSchemaText] = useState("{}");
  const [htmlText, setHtmlText] = useState("{}");

  useEffect(() => {
    if (!page) return;
    setTitle(String(page.title ?? ""));
    setSlug(String(page.slug ?? ""));
    setDescription(String(page.description ?? ""));
    setIsActive(!!page.isActive);
    setSchemaText(safeJsonStringify(page.schema));
    setHtmlText(typeof page.html === "string" ? page.html : safeJsonStringify(page.html));
  }, [page?.id]);

  const [createPage, createState] = useMutation(SELF_SITE_PAGE_CREATE, {
    onCompleted: (data) => {
      const id = data?.selfSitePageCreate?.id;
      addToast({ kind: "success", title: "Page", subTitle: "Created." });
      if (id) navigate(`/tool/page/update/?id=${id}`, { replace: true });
      else navigate("/tool/page/", { replace: true });
    },
    onError: (err) => addToast({ kind: "error", title: "Page", subTitle: err.message }),
  });

  const [updatePage, updateState] = useMutation(SELF_SITE_PAGE_UPDATE, {
    onCompleted: async () => {
      addToast({ kind: "success", title: "Page", subTitle: "Updated." });
      await pageQuery.refetch();
    },
    onError: (err) => addToast({ kind: "error", title: "Page", subTitle: err.message }),
  });

  const [deletePage, deleteState] = useMutation(SELF_SITE_PAGE_DELETE, {
    onCompleted: () => {
      addToast({ kind: "success", title: "Page", subTitle: "Deleted." });
      navigate("/tool/page/", { replace: true });
    },
    onError: (err) => addToast({ kind: "error", title: "Page", subTitle: err.message }),
  });

  const saving = createState.loading || updateState.loading;

  const canSave = useMemo(() => {
    return !!user?.id && !!siteId && title.trim().length >= 3 && slug.trim().length >= 1;
  }, [siteId, slug, title, user?.id]);

  const handleSave = async () => {
    if (!user?.id || !siteId) return;
    if (!isUpdate) {
      const schema = safeJsonParse(schemaText);
      const html = safeJsonParse(htmlText);
      if (schema == null || html == null) {
        addToast({ kind: "error", title: "JSON", subTitle: "Invalid schema/html JSON." });
        return;
      }
      await createPage({
        variables: {
          userId: user.id,
          siteId,
          title,
          slug,
          description,
          isActive,
          schema,
          html,
          index: "",
          metaTitle: title,
          metaDescription: description,
          metaKeywords: "",
          isExcludedFromSitemap: false,
          isFooterHidden: false,
          isNavHidden: false,
        },
      });
      return;
    }

    const schema = safeJsonParse(schemaText);
    if (schema == null) {
      addToast({ kind: "error", title: "JSON", subTitle: "Invalid schema JSON." });
      return;
    }
    await updatePage({
      variables: {
        userId: user.id,
        siteId,
        id: pageId,
        title,
        slug,
        description,
        isActive,
        html: htmlText,
        schema,
      },
    });
  };

  const handleDelete = async () => {
    if (!user?.id || !siteId || !pageId) return;
    const ok = window.confirm("Delete Page?");
    if (!ok) return;
    await deletePage({ variables: { userId: user.id, siteId, id: pageId } });
  };

  if (!siteId) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">Select site first</h2>
        <p className="mt-2 text-sm text-slate-500">
          Select a site in <Link to="/site/" className="text-brand-600 underline">Site</Link>.
        </p>
      </div>
    );
  }

  return (
    <main className="px-4 pb-16 pt-0">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium leading-6 text-slate-900">Page</h3>
          <p className="mt-1 text-sm text-slate-500">
            This information will be displayed publicly so be careful what you share.
          </p>

          {isUpdate ? (
            <div className="mt-4 border-b border-slate-200">
              <nav className="overflow-x-auto -mb-px flex gap-6">
                {(["Overview", "General"] as TabName[]).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setTab(name)}
                    className={[
                      "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
                      tab === name
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
                    ].join(" ")}
                  >
                    {name}
                  </button>
                ))}
              </nav>
            </div>
          ) : null}
        </div>

        {isUpdate && tab === "Overview" ? (
          <div className="rounded-md border bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">Schema (JSON)</div>
            <textarea
              value={schemaText}
              onChange={(e) => setSchemaText(e.target.value)}
              className="mt-3 w-full min-h-72 rounded-md border p-3 font-mono text-xs"
            />
            <div className="mt-4 text-sm font-semibold text-slate-900">HTML (string or JSON)</div>
            <textarea
              value={htmlText}
              onChange={(e) => setHtmlText(e.target.value)}
              className="mt-3 w-full min-h-56 rounded-md border p-3 font-mono text-xs"
            />
          </div>
        ) : null}

        {(!isUpdate || tab === "General") ? (
          <div className="rounded-md border bg-white p-4">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Enter title"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">URL</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Enter url"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm min-h-24"
                  placeholder="Enter short description"
                />
              </div>
            </div>

            <div className="pt-6">
              <h3 className="text-lg font-medium leading-6 text-slate-900">Status</h3>
              <p className="mt-1 text-sm text-slate-500">
                The details used to determine behaviour around the web.
              </p>
            </div>
            <div className="mt-4">
              <label className="inline-flex items-start gap-3">
                <input
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600"
                />
                <span>
                  <span className="block text-sm font-medium text-slate-700">Active</span>
                  <span className="block text-sm text-slate-500">User can view and filter tools.</span>
                </span>
              </label>
            </div>

            {!isUpdate ? (
              <div className="mt-6 grid grid-cols-1 gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Schema (JSON)</div>
                  <textarea
                    value={schemaText}
                    onChange={(e) => setSchemaText(e.target.value)}
                    className="mt-2 w-full min-h-48 rounded-md border p-3 font-mono text-xs"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">HTML (JSON)</div>
                  <textarea
                    value={htmlText}
                    onChange={(e) => setHtmlText(e.target.value)}
                    className="mt-2 w-full min-h-40 rounded-md border p-3 font-mono text-xs"
                  />
                </div>
              </div>
            ) : null}

            <div className="pt-5">
              <div className="flex justify-end gap-3">
                <Link
                  to="/tool/page/"
                  className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave || saving}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                >
                  {isUpdate ? "Update" : "Save"}
                </button>
                {isUpdate ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteState.loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-rose-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </div>

            {pageQuery.loading ? (
              <div className="pt-4 text-sm text-slate-500">Loading...</div>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}

