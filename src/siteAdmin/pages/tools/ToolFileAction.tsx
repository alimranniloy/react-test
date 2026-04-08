import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FILE_FILE } from "@/graphql/queries/tools";
import {
  SELF_FILE_FILE_CREATE,
  SELF_FILE_FILE_CREATE_URL,
  SELF_FILE_FILE_DELETE,
  SELF_FILE_FILE_UPDATE
} from "@/graphql/mutations/file";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";
import { putWithProgress } from "@/siteAdmin/utils/upload";
import { formatBytes } from "@/siteAdmin/utils/format";

function rndStr(len: number) {
  let text = "";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < len; i++) text += chars.charAt(Math.floor(Math.random() * chars.length));
  return text;
}

function isImage(filename: string) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"];
  const ext = `.${String(filename).split(".").pop()?.toLowerCase()}`;
  return imageExtensions.includes(ext);
}

export default function ToolFileAction() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const addToast = useToastStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);

  const idParam = params.get("id");
  const fileId = idParam ? Number(idParam) : null;
  const isUpdate = !!(fileId && Number.isFinite(fileId));

  const fileQuery = useQuery(FILE_FILE, {
    variables: { id: fileId ?? 0 },
    fetchPolicy: "network-only",
    skip: !isUpdate
  });

  const fileFile = fileQuery.data?.fileFile ?? null;

  const [title, setTitle] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [size, setSize] = useState<number>(0);
  const [url, setUrl] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedBytes, setUploadedBytes] = useState<number>(0);

  useEffect(() => {
    if (!fileFile) return;
    setTitle(String(fileFile.title ?? ""));
    setMimeType(String(fileFile.mimeType ?? ""));
    setSize(Number(fileFile.size ?? 0));
    setUrl(String(fileFile.url ?? ""));
    setUploadFile(null);
    setUploadProgress(0);
    setUploadedBytes(0);
  }, [fileFile?.id]);

  const [getUploadUrl] = useMutation(SELF_FILE_FILE_CREATE_URL);
  const [createFile, createState] = useMutation(SELF_FILE_FILE_CREATE, {
    onCompleted: (data) => {
      const createdId = data?.selfFileFileCreate?.id;
      addToast({ kind: "success", title: "File", subTitle: "Created." });
      if (createdId) navigate(`/tool/file/update/?id=${createdId}`, { replace: true });
      else navigate("/tool/file/", { replace: true });
    },
    onError: (err) => addToast({ kind: "error", title: "File", subTitle: err.message })
  });
  const [updateFile, updateState] = useMutation(SELF_FILE_FILE_UPDATE, {
    onCompleted: async () => {
      addToast({ kind: "success", title: "File", subTitle: "Updated." });
      await fileQuery.refetch();
    },
    onError: (err) => addToast({ kind: "error", title: "File", subTitle: err.message })
  });
  const [deleteFile, deleteState] = useMutation(SELF_FILE_FILE_DELETE, {
    onCompleted: () => {
      addToast({ kind: "success", title: "File", subTitle: "Deleted." });
      navigate("/tool/file/", { replace: true });
    },
    onError: (err) => addToast({ kind: "error", title: "File", subTitle: err.message })
  });

  const saving = createState.loading || updateState.loading;

  const handleSelect = async (file: File) => {
    setUploadFile(file);
    setMimeType(file.type || "application/octet-stream");
    setSize(file.size);

    if (isImage(file.name)) {
      // Images can be sent via Upload scalar directly; url uses original name.
      setUrl(file.name);
      return;
    }

    const filename = file.type.includes("video")
      ? `video/${rndStr(15)}.${file.name.split(".").pop()}`
      : `file/${rndStr(15)}.${file.name.split(".").pop()}`;

    try {
      const res = await getUploadUrl({ variables: { userId: user?.id, filename } });
      const putUrl = res.data?.selfFileFileCreateUrl;
      if (!putUrl) throw new Error("Upload URL not returned");
      setUploadProgress(0);
      setUploadedBytes(0);
      await putWithProgress(putUrl, file, (p) => {
        setUploadProgress(p.percent);
        setUploadedBytes(p.loaded);
      });
      setUrl(filename);
      addToast({ kind: "success", title: "Upload", subTitle: "Uploaded successfully." });
    } catch (err) {
      addToast({ kind: "error", title: "Upload", subTitle: (err as Error).message });
      setUrl("");
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!title.trim() || !url) {
      addToast({ kind: "error", title: "Validation", subTitle: "Title and file are required." });
      return;
    }
    if (!isUpdate) {
      await createFile({
        variables: {
          userId: user.id,
          file: isImage(url) ? uploadFile : null,
          mimeType,
          size,
          title,
          url
        }
      });
      return;
    }
    await updateFile({
      variables: {
        userId: user.id,
        id: fileId,
        file: isImage(url) ? uploadFile : null,
        mimeType,
        size,
        title,
        url
      }
    });
  };

  const handleDelete = async () => {
    if (!user?.id || !fileId) return;
    const ok = window.confirm("Delete File?");
    if (!ok) return;
    await deleteFile({ variables: { userId: user.id, id: fileId } });
  };

  return (
    <main className="px-4 pb-16 pt-0">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium leading-6 text-slate-900">File</h3>
          <p className="mt-1 text-sm text-slate-500">
            Upload file and save metadata.
          </p>
        </div>

        <div className="rounded-md border bg-white p-4">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Enter title"
              />
            </div>

            <div className="sm:col-span-6">
              {uploadProgress > 0 ? (
                <div className="w-full bg-slate-200 rounded-full my-3">
                  <div
                    className="bg-emerald-500 text-xs font-medium text-white text-center p-1 leading-none rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}% - {formatBytes(uploadedBytes)}
                  </div>
                </div>
              ) : null}

              <label className="block text-xs font-medium text-slate-700 mb-1">File</label>
              <input
                type="file"
                className="text-sm"
                accept="image/*,video/*,application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (!f) return;
                  handleSelect(f);
                }}
              />

              {url ? (
                <div className="mt-2 text-xs text-slate-500">
                  URL key: <span className="font-mono">{url}</span>
                </div>
              ) : null}
            </div>
          </div>

          {isUpdate && fileFile?.url ? (
            <div className="mt-6 rounded-md border p-3">
              <div className="text-xs font-semibold text-slate-700">Preview</div>
              {String(fileFile.url).includes(".mp4") ? (
                <video className="mt-2 w-full rounded-md" controls src={String(fileFile.url)} />
              ) : (
                <a
                  href={String(fileFile.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-brand-600 hover:underline"
                >
                  Open file
                </a>
              )}
            </div>
          ) : null}

          <div className="pt-5">
            <div className="flex justify-end gap-3">
              <Link
                to="/tool/file/"
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

          {fileQuery.loading ? (
            <div className="pt-4 text-sm text-slate-500">Loading...</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
