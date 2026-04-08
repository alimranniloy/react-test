import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import FilePondUploader from "@/components/FilePondUploader";
import { FILE_FILE } from "@/graphql/queries/tools";
import {
  SELF_FILE_FILE_CREATE,
  SELF_FILE_FILE_CREATE_URL,
  SELF_FILE_FILE_DELETE,
  SELF_FILE_FILE_UPDATE
} from "@/graphql/mutations/file";
import { useAuthStore } from "@/store/useAuthStore";

const isImage = (filename: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return imageExtensions.includes(`.${ext}`);
};

const rndStr = (len: number) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < len; i += 1) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
};

export default function FileAction({ mode }: { mode: "create" | "update" }) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;
  const navigate = useNavigate();
  const params = useParams();
  const fileId = params.id ? Number(params.id) : null;

  const [title, setTitle] = useState("");
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [size, setSize] = useState(0);
  const [mimeType, setMimeType] = useState("");
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const { data } = useQuery(FILE_FILE, {
    variables: { id: fileId ?? 0 },
    skip: !fileId || mode !== "update"
  });

  const fileFile = data?.fileFile ?? null;

  const [createFile, { loading: creating }] = useMutation(SELF_FILE_FILE_CREATE);
  const [updateFile, { loading: updating }] = useMutation(SELF_FILE_FILE_UPDATE);
  const [deleteFile, { loading: deleting }] = useMutation(SELF_FILE_FILE_DELETE);
  const [createUrl] = useMutation(SELF_FILE_FILE_CREATE_URL);

  useEffect(() => {
    if (!fileFile) return;
    setTitle(fileFile.title ?? "");
    setSize(fileFile.size ?? 0);
    setMimeType(fileFile.mimeType ?? "");
    setUrl(fileFile.url ?? "");
  }, [fileFile]);

  const handleAdded = (file: File) => {
    setFileObj(file);
    setSize(file.size);
    setMimeType(file.type);
    setUrl(file.name);
  };

  const handleRemoved = () => {
    setFileObj(null);
    setSize(0);
    setMimeType("");
    setUrl("");
  };

  const uploadBySignedUrl = async (filename: string, file: File) => {
    const response = await createUrl({ variables: { userId: userId ?? 0, filename } });
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
  };

  const handleSave = async () => {
    if (!userId) return;
    if (!title || title.trim().length < 3) return;

    let finalUrl = url;
    if (fileObj && !isImage(fileObj.name)) {
      const filename = fileObj.type.includes("video")
        ? `video/${rndStr(15)}.${fileObj.name.split(".").pop()}`
        : `file/${rndStr(15)}.${fileObj.name.split(".").pop()}`;
      setProgress(5);
      await uploadBySignedUrl(filename, fileObj);
      setProgress(100);
      finalUrl = filename;
    }

    if (mode === "update" && fileId) {
      await updateFile({
        variables: {
          userId,
          id: fileId,
          file: isImage(fileObj?.name ?? "") ? fileObj : null,
          mimeType: mimeType || fileObj?.type || fileFile?.mimeType || "application/octet-stream",
          size: size || fileObj?.size || fileFile?.size || 0,
          title,
          url: finalUrl || fileFile?.url || ""
        }
      });
    } else {
      await createFile({
        variables: {
          userId,
          file: isImage(fileObj?.name ?? "") ? fileObj : null,
          mimeType: mimeType || fileObj?.type || "application/octet-stream",
          size: size || fileObj?.size || 0,
          title,
          url: finalUrl
        }
      });
    }

    navigate("/tool/file/");
  };

  const handleDelete = async () => {
    if (!userId || !fileId) return;
    if (!window.confirm("Delete this file?")) return;
    await deleteFile({ variables: { userId, id: fileId } });
    navigate("/tool/file/");
  };

  const previewFiles = useMemo(() => {
    if (!fileFile?.url) return [];
    return [fileFile.url];
  }, [fileFile]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">File</h3>
        <p className="mt-1 text-sm text-gray-500">This information will be displayed publicly so be careful what you share.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <div className="relative rounded-md border border-gray-300 px-3 py-3">
            <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
              placeholder="Enter title"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          {progress > 0 ? (
            <div className="w-full bg-gray-200 rounded-full my-3">
              <div
                className="bg-green-400 text-xs font-medium text-gray-100 text-center p-1 leading-none rounded-full"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          ) : null}
          <div className="relative rounded-md border border-gray-300 px-3 py-3">
            <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">File</label>
            <FilePondUploader
              files={previewFiles}
              allowReplace
              accepted="image/*, video/*, application/pdf"
              onAdded={handleAdded}
              onRemove={handleRemoved}
            />
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/tool/file/")}
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
