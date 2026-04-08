import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import FilePondUploader from "@/components/FilePondUploader";
import { SITE_PAGE } from "@/graphql/queries/page";
import { SELF_SITE_PAGE_CREATE, SELF_SITE_PAGE_DELETE, SELF_SITE_PAGE_UPDATE } from "@/graphql/mutations/page";
import { SELF_FILE_FILE_CREATE, SELF_FILE_FILE_CREATE_URL } from "@/graphql/mutations/file";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

const rndStr = (len: number) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < len; i += 1) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
};

export default function PageAction({ mode }: { mode: "create" | "update" }) {
  const navigate = useNavigate();
  const params = useParams();
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const pageId = params.id ? Number(params.id) : null;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [html, setHtml] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const { data } = useQuery(SITE_PAGE, {
    variables: { siteId: siteId ?? 0, id: pageId ?? 0 },
    skip: !siteId || !pageId || mode !== "update"
  });

  const [createPage, { loading: creating }] = useMutation(SELF_SITE_PAGE_CREATE);
  const [updatePage, { loading: updating }] = useMutation(SELF_SITE_PAGE_UPDATE);
  const [deletePage, { loading: deleting }] = useMutation(SELF_SITE_PAGE_DELETE);
  const [createUrl] = useMutation(SELF_FILE_FILE_CREATE_URL);
  const [createFile] = useMutation(SELF_FILE_FILE_CREATE);

  const page = data?.sitePage ?? null;
  useEffect(() => {
    if (!page) return;
    setTitle(page.title ?? "");
    setSlug(page.slug ?? "");
    setDescription(page.description ?? "");
    setHtml(page.html ?? "");
    setIsActive(Boolean(page.isActive));
  }, [page]);

  const handleUpload = async (file: File) => {
    if (!user?.id) return;
    const ext = file.name.split(".").pop() ?? "";
    const filename = `file/${rndStr(15)}.${ext}`;
    const response = await createUrl({ variables: { userId: user.id, filename } });
    const signedUrl = response.data?.selfFileFileCreateUrl;
    if (!signedUrl) return;
    await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "x-amz-acl": "public-read",
        "x-amz-meta-access-control-allow-origin": "*"
      },
      body: file
    });
    await createFile({
      variables: {
        userId: user.id,
        file: null,
        mimeType: file.type,
        size: file.size,
        title: file.name,
        url: filename
      }
    });
    setUploadUrl(filename);
  };

  const handleSave = async () => {
    if (!user?.id || !siteId) return;
    if (!title || title.trim().length < 3) return;
    if (!slug) return;

    if (mode === "update" && pageId) {
      await updatePage({
        variables: {
          userId: user.id,
          siteId,
          id: pageId,
          description,
          html,
          isActive,
          slug,
          title
        }
      });
    } else {
      await createPage({
        variables: {
          userId: user.id,
          siteId,
          description,
          html,
          index: "",
          isActive,
          isExcludedFromSitemap: false,
          isFooterHidden: false,
          isNavHidden: false,
          metaDescription: description,
          metaKeywords: "",
          metaTitle: title,
          schema: {},
          slug,
          title
        }
      });
    }

    navigate("/tool/page/");
  };

  const handleDelete = async () => {
    if (!user?.id || !siteId || !pageId) return;
    if (!window.confirm("Delete this page?")) return;
    await deletePage({ variables: { userId: user.id, siteId, id: pageId } });
    navigate("/tool/page/");
  };

  return (
    <div className="space-y-4 px-4 pb-[60px] pt-[70px] md:pt-0 sm:pb-4">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Page</h3>
        <p className="mt-1 text-sm text-gray-500">This information will be displayed publicly so be careful what you share.</p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <div className="relative rounded-md border border-gray-300 px-3 py-3">
            <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 outline-none sm:text-sm"
              placeholder="Enter title"
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <div className="relative rounded-md border border-gray-300 px-3 py-3">
            <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">URL</label>
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
              placeholder="Enter url"
            />
          </div>
        </div>
        <div className="sm:col-span-6">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Enter description"
          />
        </div>
        <div className="sm:col-span-6">
          <textarea
            value={html}
            onChange={(event) => setHtml(event.target.value)}
            rows={14}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
            placeholder="Enter page HTML"
          />
        </div>
        <div className="sm:col-span-6">
          <div className="relative rounded-md border border-gray-300 px-3 py-3">
            <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Upload</label>
            <FilePondUploader accepted="image/*, video/*, application/pdf" onAdded={handleUpload} />
            {uploadUrl ? (
              <div className="mt-2 text-xs text-gray-500">Uploaded: {uploadUrl}</div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Status</h3>
        <p className="mt-1 text-sm text-gray-500">The details used to determine your category behaviour around the web.</p>
      </div>
      <div className="mt-2">
        <fieldset>
          <div className="mt-4 space-y-4">
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isActive" className="font-medium text-gray-700">
                  Active
                </label>
                <p className="text-gray-500">User can view and filter tools.</p>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/tool/page/")}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={creating || updating}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {mode === "update" ? "Update" : "Save"}
          </button>
          {mode === "update" ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
