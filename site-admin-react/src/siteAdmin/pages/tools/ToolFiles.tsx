import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  FilmIcon,
  FolderIcon,
  LinkIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useNavigate } from "react-router-dom";
import { SELF_FILE_FILE_DELETE } from "@/graphql/mutations/file";
import { FILE_FILES } from "@/graphql/queries/tools";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";
import { copyText } from "@/siteAdmin/utils/clipboard";
import { formatBytes } from "@/siteAdmin/utils/format";

dayjs.extend(relativeTime);

type FileNode = {
  id: number;
  isSecure?: boolean | null;
  size?: number | null;
  title?: string | null;
  updatedAt?: string | null;
  url?: string | null;
};

type FileFilter = "all" | "image" | "video" | "document";
type FileSort = "latest" | "largest" | "name";

const FREE_STORAGE_BYTES = 100 * 1024 * 1024;
const INITIAL_VISIBLE_COUNT = 12;
const EXT_IMAGE = new Set(["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "avif"]);
const EXT_VIDEO = new Set(["mp4", "webm", "mov", "m4v", "ogg", "ogv"]);

const getFileExtension = (value: string) => value.split("?")[0]?.split(".").pop()?.toLowerCase() ?? "";

const getFileKind = (url: string) => {
  const ext = getFileExtension(url);

  if (EXT_IMAGE.has(ext)) return "image";
  if (EXT_VIDEO.has(ext)) return "video";
  return "document";
};

const toSecureUrl = (url: string) => url.replace("video", "drm").replace(".mp4", ".m3u8");

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

function FilePreview(props: { file: FileNode }) {
  const [failed, setFailed] = useState(false);
  const url = String(props.file.url ?? "");
  const kind = getFileKind(url);

  if (!url || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2f7_100%)] text-slate-400">
        <FolderIcon className="h-10 w-10" />
        <div className="text-xs font-semibold uppercase tracking-[0.18em]">No preview</div>
      </div>
    );
  }

  if (kind === "image") {
    return (
      <img
        src={url}
        alt={String(props.file.title ?? "File preview")}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  if (kind === "video") {
    return (
      <video
        src={url}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2f7_100%)] text-slate-500">
      <DocumentTextIcon className="h-10 w-10" />
      <div className="text-xs font-semibold uppercase tracking-[0.18em]">
        {getFileExtension(url) || "file"}
      </div>
    </div>
  );
}

export default function ToolFiles() {
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FileFilter>("all");
  const [sort, setSort] = useState<FileSort>("latest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, loading, error, refetch } = useQuery(FILE_FILES, {
    variables: {
      userId: user?.id ?? 0,
      queryType: null,
      search: null,
      after: null,
      first: 1000,
      limit: 1000,
    },
    fetchPolicy: "network-only",
    skip: !user?.id,
  });

  const [deleteFile] = useMutation(SELF_FILE_FILE_DELETE, {
    onCompleted: async () => {
      addToast({
        kind: "success",
        title: "File",
        subTitle: "File deleted successfully.",
      });
      setDeletingId(null);
      await refetch();
    },
    onError: (mutationError) => {
      addToast({
        kind: "error",
        title: "File",
        subTitle: mutationError.message,
      });
      setDeletingId(null);
    },
  });

  const files = useMemo(() => {
    const edges = data?.fileFiles?.edges ?? [];
    return edges
      .map((edge: { node?: FileNode | null }) => edge?.node)
      .filter(Boolean) as FileNode[];
  }, [data?.fileFiles?.edges]);

  const storageUsedBytes = useMemo(
    () => files.reduce((sum, file) => sum + Number(file.size ?? 0), 0),
    [files]
  );

  const counts = useMemo(() => {
    let images = 0;
    let videos = 0;
    let documents = 0;

    files.forEach((file) => {
      const kind = getFileKind(String(file.url ?? ""));
      if (kind === "image") images += 1;
      else if (kind === "video") videos += 1;
      else documents += 1;
    });

    return { images, videos, documents };
  }, [files]);

  const storageUsedPercent = clampPercent(
    FREE_STORAGE_BYTES > 0 ? (storageUsedBytes / FREE_STORAGE_BYTES) * 100 : 0
  );
  const overQuota = storageUsedBytes > FREE_STORAGE_BYTES;

  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    const next = files.filter((file) => {
      const title = String(file.title ?? "").toLowerCase();
      const url = String(file.url ?? "").toLowerCase();
      const kind = getFileKind(String(file.url ?? ""));

      const matchesSearch = !query || title.includes(query) || url.includes(query);
      const matchesFilter = filter === "all" || kind === filter;

      return matchesSearch && matchesFilter;
    });

    next.sort((a, b) => {
      if (sort === "largest") {
        return Number(b.size ?? 0) - Number(a.size ?? 0);
      }

      if (sort === "name") {
        return String(a.title ?? "").localeCompare(String(b.title ?? ""));
      }

      return dayjs(b.updatedAt ?? 0).valueOf() - dayjs(a.updatedAt ?? 0).valueOf();
    });

    return next;
  }, [files, filter, search, sort]);

  const visibleFiles = filteredFiles.slice(0, visibleCount);
  const remainingBytes = Math.max(0, FREE_STORAGE_BYTES - storageUsedBytes);
  const showingAll = visibleFiles.length >= filteredFiles.length;

  const handleCopyUrl = async (url: string, label: string) => {
    const ok = await copyText(url);
    addToast({
      kind: ok ? "success" : "error",
      title: "File",
      subTitle: ok ? `${label} copied.` : "Copy failed.",
    });
  };

  const handleDelete = async (file: FileNode) => {
    if (!user?.id) return;
    const confirmed = window.confirm(`Delete "${String(file.title ?? "Untitled file")}"?`);
    if (!confirmed) return;

    setDeletingId(file.id);
    await deleteFile({ variables: { userId: user.id, id: file.id } });
  };

  return (
    <main className="space-y-4 pb-16">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="rounded-[16px] border border-[#dce3ec] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:px-5"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dce6ff] bg-[#f4f7ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#335cff]">
              <FolderIcon className="h-3.5 w-3.5" />
              File Library
            </div>
            <h1 className="mt-3 text-[24px] font-bold tracking-[-0.04em] text-slate-900">
              File library, previews, and storage usage
            </h1>
            <p className="mt-2 max-w-[720px] text-[13px] leading-5 text-slate-500">
              Manage uploaded assets with live preview cards, direct edit and delete actions, and a real storage summary for your current account.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/tool/file/create/"
                className="inline-flex h-9 items-center justify-center rounded-[10px] bg-indigo-600 px-3.5 text-[13px] font-semibold text-white transition hover:bg-indigo-700"
              >
                <CloudArrowUpIcon className="mr-2 h-4 w-4" />
                Upload File
              </Link>
              <Link
                to="/tool/file/bulk/"
                className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-300 bg-white px-3.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Bulk Upload
              </Link>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-300 bg-white px-3.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowPathIcon className="mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          <div className="rounded-[14px] border border-[#e7ebf1] bg-[#f8fafc] p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Free User Storage
                </div>
                <div className="mt-1 text-[17px] font-semibold tracking-[-0.03em] text-slate-900">
                  {formatBytes(storageUsedBytes)} / 100.00 MB
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {overQuota ? "Storage limit exceeded. Remove unused files or upgrade." : "Real-time usage across all uploaded files in this account."}
                </div>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
                {storageUsedPercent.toFixed(1)}% used
              </div>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#335cff_0%,#60a5fa_100%)] transition-all duration-300"
                style={{ width: `${storageUsedPercent}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5 text-sm text-slate-600">
              <div className="rounded-[10px] border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Remaining
                </div>
                <div className="mt-1 font-semibold text-slate-900">{formatBytes(remainingBytes)}</div>
              </div>
              <div className="rounded-[10px] border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Total Files
                </div>
                <div className="mt-1 font-semibold text-slate-900">{files.length}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.05 }}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          { label: "Images", value: counts.images, icon: PhotoIcon },
          { label: "Videos", value: counts.videos, icon: FilmIcon },
          { label: "Documents", value: counts.documents, icon: DocumentTextIcon },
          { label: "Secure Files", value: files.filter((file) => file.isSecure).length, icon: LinkIcon },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-[14px] border border-[#dce3ec] bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    {item.label}
                  </div>
                  <div className="mt-1.5 text-[20px] font-bold tracking-[-0.04em] text-slate-900">{item.value}</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f4f7ff] text-[#335cff]">
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
            </div>
          );
        })}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="rounded-[16px] border border-[#dce3ec] bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-4"
      >
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
              placeholder="Search by title or URL"
              className="h-10 w-full rounded-[10px] border border-slate-200 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition focus:border-slate-300"
            />
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {([
                ["all", "All"],
                ["image", "Images"],
                ["video", "Videos"],
                ["document", "Docs"],
              ] as Array<[FileFilter, string]>).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setFilter(value);
                    setVisibleCount(INITIAL_VISIBLE_COUNT);
                  }}
                  className={[
                    "inline-flex h-9 items-center justify-center rounded-[10px] px-3 text-[11px] font-semibold transition",
                    filter === value
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {([
              ["latest", "Latest"],
              ["largest", "Largest"],
              ["name", "Name"],
            ] as Array<[FileSort, string]>).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSort(value)}
                className={[
                  "inline-flex h-9 items-center justify-center rounded-[10px] px-3 text-[11px] font-semibold transition",
                  sort === value
                    ? "bg-[#f4f7ff] text-[#335cff]"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {error ? (
        <div className="rounded-md border bg-white p-4 text-sm text-rose-600">
          {String(error.message)}
        </div>
      ) : null}

      <section className="space-y-4">
        {loading ? (
          <div className="rounded-[18px] border border-[#dce3ec] bg-white px-5 py-12 text-center text-sm text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            Loading file library...
          </div>
        ) : null}

        {!loading && visibleFiles.length === 0 ? (
          <div className="rounded-[18px] border border-[#dce3ec] bg-white px-5 py-12 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#f4f7ff] text-[#335cff]">
              <FolderIcon className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No files found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Upload a new file or change the current search and filters.
            </p>
          </div>
        ) : null}

        {!loading ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleFiles.map((file, index) => {
              const url = String(file.url ?? "");
              const kind = getFileKind(url);
              const secureUrl = kind === "video" && url.includes(".mp4") ? toSecureUrl(url) : null;

              return (
                <motion.article
                  key={file.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.18) }}
                  className="overflow-hidden rounded-[16px] border border-[#dce3ec] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-28px_rgba(15,23,42,0.35)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-slate-200 bg-slate-100">
                    <FilePreview file={file} />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-700 backdrop-blur">
                        {kind}
                      </span>
                      {file.isSecure ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                          Secure
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-3 p-3.5">
                    <div>
                      <div className="truncate text-[15px] font-semibold tracking-[-0.02em] text-slate-900">
                        {file.title || "Untitled file"}
                      </div>
                      <div className="mt-1 break-all text-[11px] text-slate-400">{url || "No URL"}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-[10px] border border-slate-200 bg-slate-50 px-2.5 py-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Size</div>
                        <div className="mt-1 font-semibold text-slate-900">{formatBytes(Number(file.size ?? 0))}</div>
                      </div>
                      <div className="rounded-[10px] border border-slate-200 bg-slate-50 px-2.5 py-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Updated</div>
                        <div className="mt-1 font-semibold text-slate-900">{file.updatedAt ? dayjs(file.updatedAt).fromNow() : "Recently"}</div>
                      </div>
                      <div className="rounded-[10px] border border-slate-200 bg-slate-50 px-2.5 py-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Format</div>
                        <div className="mt-1 font-semibold uppercase text-slate-900">{getFileExtension(url) || "file"}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <button
                        type="button"
                        onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                        className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <ArrowTopRightOnSquareIcon className="mr-1.5 h-4 w-4" />
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/tool/file/update/?id=${file.id}`)}
                        className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Cog6ToothIcon className="mr-1.5 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(url, "File URL")}
                        className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <DocumentDuplicateIcon className="mr-1.5 h-4 w-4" />
                        Copy URL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(file)}
                        disabled={deletingId === file.id}
                        className="inline-flex h-9 items-center justify-center rounded-[10px] border border-rose-200 bg-rose-50 px-2.5 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                      >
                        <TrashIcon className="mr-1.5 h-4 w-4" />
                        Delete
                      </button>
                    </div>

                    {secureUrl ? (
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(secureUrl, "Secure URL")}
                        className="inline-flex h-9 w-full items-center justify-center rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <LinkIcon className="mr-1.5 h-4 w-4" />
                        Copy Secure Stream URL
                      </button>
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : null}

        {!loading && filteredFiles.length > visibleCount ? (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + INITIAL_VISIBLE_COUNT)}
            className="inline-flex h-10 items-center justify-center rounded-[10px] border border-slate-300 bg-white px-4 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Load More Files
            </button>
          </div>
        ) : null}

        {!loading && files.length > 1000 ? (
          <div className="text-center text-xs text-slate-400">
            Showing the first 1000 files from your library.
          </div>
        ) : null}

        {!loading && filteredFiles.length > 0 ? (
          <div className="text-center text-xs text-slate-400">
            Showing {visibleFiles.length} of {filteredFiles.length} files
            {showingAll ? "" : " in the current filter"}
          </div>
        ) : null}
      </section>
    </main>
  );
}
