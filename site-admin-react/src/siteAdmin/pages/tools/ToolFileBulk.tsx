import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { SELF_FILE_FILE_CREATE_URL, SELF_FILE_FILE_CREATE } from "@/graphql/mutations/file";
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

export default function ToolFileBulk() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);
  const [getUploadUrl] = useMutation(SELF_FILE_FILE_CREATE_URL);
  const [createFile] = useMutation(SELF_FILE_FILE_CREATE);

  const [progress, setProgress] = useState<{ done: number; total: number; bytes: number }>({
    done: 0,
    total: 0,
    bytes: 0
  });
  const [running, setRunning] = useState(false);

  const handleBulk = async (files: FileList) => {
    if (!user?.id) return;
    setRunning(true);
    setProgress({ done: 0, total: files.length, bytes: 0 });
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const filename = file.type.includes("video")
          ? `video/${rndStr(15)}.${file.name.split(".").pop()}`
          : `file/${rndStr(15)}.${file.name.split(".").pop()}`;
        const res = await getUploadUrl({ variables: { userId: user.id, filename } });
        const putUrl = res.data?.selfFileFileCreateUrl;
        if (!putUrl) throw new Error("Upload URL not returned");
        await putWithProgress(putUrl, file, (p) => {
          setProgress((prev) => ({ ...prev, bytes: p.loaded }));
        });
        await createFile({
          variables: {
            userId: user.id,
            file: null,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            title: file.name,
            url: filename
          }
        });
        setProgress((prev) => ({ ...prev, done: prev.done + 1, bytes: 0 }));
      } catch (err) {
        addToast({ kind: "error", title: "Bulk upload", subTitle: (err as Error).message });
      }
    }
    setRunning(false);
    addToast({ kind: "success", title: "Bulk upload", subTitle: "Completed." });
  };

  return (
    <main className="px-4 pb-16 pt-0">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-slate-900">File Bulk</h3>
          <p className="mt-1 text-sm text-slate-500">Upload multiple files in one go.</p>
        </div>

        <div className="rounded-md border bg-white p-4">
          <input
            type="file"
            multiple
            disabled={running}
            className="text-sm"
            accept="image/*,video/*,application/pdf"
            onChange={(e) => {
              const list = e.target.files;
              if (!list || !list.length) return;
              handleBulk(list);
            }}
          />

          {running ? (
            <div className="mt-4 text-sm text-slate-600">
              Uploading {progress.done}/{progress.total} (current: {formatBytes(progress.bytes)})
            </div>
          ) : null}

          <div className="mt-6 flex justify-end">
            <Link
              to="/tool/file/"
              className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

