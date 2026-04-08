import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { SELF_STORE_CATEGORY_CREATE } from "@/graphql/mutations/catalog";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import FilePondUploader from "@/components/FilePondUploader";

export default function CategoryCreate() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const [title, setTitle] = useState("");
  const [translation, setTranslation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [priorityHome, setPriorityHome] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isHome, setIsHome] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [createCategory, { loading }] = useMutation(SELF_STORE_CATEGORY_CREATE);

  const handleSave = async () => {
    if (!user?.id || !site?.id || !title.trim() || !imageFile) return;
    await createCategory({
      variables: {
        userId: user.id,
        siteId: site.id,
        title: title.trim(),
        translation: translation.trim() || title.trim(),
        description: description.trim() || "",
        cover: null,
        external: "",
        image: imageFile,
        isActive,
        isExternal: false,
        isHome,
        isParent: true,
        isPrivate,
        priority,
        priorityHome,
        queryType: "default"
      }
    });
    navigate("/product/category/");
  };

  return (
    <main className="space-y-4">
      <section className="rounded-2xl bg-white/90 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Create</p>
            <h2 className="text-lg font-semibold text-slate-900">Category</h2>
            <p className="text-xs text-slate-500 mt-1">Add a new top-level category for your catalog.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/product/category/")}
            className="text-xs text-indigo-600 hover:underline"
          >
            Back
          </button>
        </div>
      </section>

      <section className="rounded-2xl bg-white/90 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Category name"
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Translation
            <input
              value={translation}
              onChange={(event) => setTranslation(event.target.value)}
              placeholder="Optional translation"
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Priority
            <input
              type="number"
              value={priority}
              onChange={(event) => setPriority(Number(event.target.value))}
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Home priority
            <input
              type="number"
              value={priorityHome}
              onChange={(event) => setPriorityHome(Number(event.target.value))}
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Status
            <select
              value={isActive ? "active" : "inactive"}
              onChange={(event) => setIsActive(event.target.value === "active")}
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Show on home
            <select
              value={isHome ? "yes" : "no"}
              onChange={(event) => setIsHome(event.target.value === "yes")}
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Visibility
            <select
              value={isPrivate ? "private" : "public"}
              onChange={(event) => setIsPrivate(event.target.value === "private")}
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Image
            <FilePondUploader
              accepted="image/*"
              onAdded={(file) => setImageFile(file)}
              onRemove={() => setImageFile(null)}
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500 md:col-span-2">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short description"
              className="min-h-[120px] rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !imageFile}
            className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Create category"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/product/category/")}
            className="rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600"
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
