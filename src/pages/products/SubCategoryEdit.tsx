import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { STORE_CATEGORIES, STORE_SUB_CATEGORY } from "@/graphql/queries/catalog";
import { SELF_STORE_SUB_CATEGORY_UPDATE } from "@/graphql/mutations/catalog";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import SearchableMultiSelect from "@/components/SearchableMultiSelect";
import FilePondUploader from "@/components/FilePondUploader";

export default function SubCategoryEdit() {
  const { id } = useParams();
  const subCategoryId = Number(id);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const [categoryId, setCategoryId] = useState<number[]>([]);
  const [title, setTitle] = useState("");
  const [translation, setTranslation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data } = useQuery(STORE_SUB_CATEGORY, {
    variables: { id: subCategoryId },
    skip: !subCategoryId
  });

  const { data: categoryData } = useQuery(STORE_CATEGORIES, {
    variables: { siteId: site?.id ? [site.id] : [], first: 200 },
    skip: !site?.id
  });

  const [updateSubCategory, { loading }] = useMutation(SELF_STORE_SUB_CATEGORY_UPDATE);

  useEffect(() => {
    const subCategory = data?.storeSubCategory;
    if (!subCategory) return;
    setCategoryId(subCategory.categoryId ? [Number(subCategory.categoryId)] : []);
    setTitle(subCategory.title ?? "");
    setTranslation(subCategory.translation ?? "");
    setDescription(subCategory.description ?? "");
    setPriority(Number(subCategory.priority ?? 0));
    setIsActive(Boolean(subCategory.isActive));
    setIsPrivate(Boolean(subCategory.isPrivate));
  }, [data]);

  const handleSave = async () => {
    if (!user?.id || !site?.id || !subCategoryId) return;
    await updateSubCategory({
      variables: {
        userId: user.id,
        siteId: site.id,
        id: subCategoryId,
        categoryId: categoryId.length ? categoryId[0] : undefined,
        title: title.trim(),
        translation: translation.trim() || title.trim(),
        description: description.trim() || "",
        image: imageFile,
        isActive,
        isPrivate,
        priority
      }
    });
    navigate("/product/sub-category/");
  };

  const categories = categoryData?.storeCategories?.edges?.map((edge: any) => edge.node) ?? [];

  return (
    <main className="space-y-4">
      <section className="rounded-2xl bg-white/90 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Edit</p>
            <h2 className="text-lg font-semibold text-slate-900">Sub category</h2>
            <p className="text-xs text-slate-500 mt-1">Update the details for this sub category.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/product/sub-category/")}
            className="text-xs text-indigo-600 hover:underline"
          >
            Back
          </button>
        </div>
      </section>

      <section className="rounded-2xl bg-white/90 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <SearchableMultiSelect
            label="Parent category"
            helperText="Pick the parent category for this sub category."
            options={categories}
            selected={categoryId}
            onChange={setCategoryId}
            placeholder="Search categories..."
            multiple={false}
          />
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Sub category name"
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
            disabled={loading}
            className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/product/sub-category/")}
            className="rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600"
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
