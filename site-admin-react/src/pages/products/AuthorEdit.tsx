import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { STORE_AUTHOR } from "@/graphql/queries/author";
import { SELF_STORE_AUTHOR_UPDATE } from "@/graphql/mutations/author";
import { STORE_CATEGORIES, STORE_SUB_CATEGORIES } from "@/graphql/queries/catalog";
import SearchableMultiSelect from "@/components/SearchableMultiSelect";
import FilePondUploader from "@/components/FilePondUploader";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

export default function AuthorEdit() {
  const { id } = useParams();
  const authorId = Number(id);
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
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);

  const { data } = useQuery(STORE_AUTHOR, {
    variables: { id: authorId },
    skip: !authorId
  });

  const { data: categoriesData } = useQuery(STORE_CATEGORIES, {
    variables: { siteId: site?.id ? [site.id] : [], first: 200 },
    skip: !site?.id
  });

  const { data: subCategoriesData } = useQuery(STORE_SUB_CATEGORIES, {
    variables: { siteId: site?.id ? [site.id] : [], first: 200 },
    skip: !site?.id
  });

  const [updateAuthor, { loading }] = useMutation(SELF_STORE_AUTHOR_UPDATE);

  useEffect(() => {
    const author = data?.storeAuthor;
    if (!author) return;
    setTitle(author.title ?? "");
    setTranslation(author.translation ?? "");
    setDescription(author.description ?? "");
    setPriority(Number(author.priority ?? 0));
    setPriorityHome(Number(author.priorityHome ?? 0));
    setIsActive(Boolean(author.isActive));
    setIsHome(Boolean(author.isHome));
    setIsPrivate(Boolean(author.isPrivate));
    setSelectedCategories((author.categories ?? []).map((value: number) => Number(value)));
    setSelectedSubCategories((author.subCategories ?? []).map((value: number) => Number(value)));
  }, [data]);

  const handleSave = async () => {
    if (!user?.id || !site?.id || !authorId) return;
    await updateAuthor({
      variables: {
        userId: user.id,
        siteId: site.id,
        id: authorId,
        title: title.trim(),
        translation: translation.trim() || title.trim(),
        description: description.trim() || "",
        image: imageFile,
        isActive,
        isHome,
        isPrivate,
        priority,
        priorityHome,
        queryType: "default",
        categories: selectedCategories,
        subCategories: selectedSubCategories
      }
    });
    navigate("/product/author/");
  };

  return (
    <main className="space-y-4">
      <section className="rounded-2xl bg-white/90 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Edit</p>
            <h2 className="text-lg font-semibold text-slate-900">Author</h2>
            <p className="text-xs text-slate-500 mt-1">Update author profile and visibility.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/product/author/")}
            className="text-xs text-indigo-600 hover:underline"
          >
            Back
          </button>
        </div>
      </section>

      <section className="rounded-2xl bg-white/90 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Name
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Author name"
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
            Avatar
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
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <SearchableMultiSelect
            label="Categories"
            helperText="Group the author under relevant categories."
            options={(categoriesData?.storeCategories?.edges ?? []).map((edge: { node: { id: number; title: string } }) => edge.node)}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Search categories..."
          />
          <SearchableMultiSelect
            label="Sub-categories"
            helperText="Optional sub-category tags."
            options={(subCategoriesData?.storeSubCategories?.edges ?? []).map((edge: { node: { id: number; title: string } }) => edge.node)}
            selected={selectedSubCategories}
            onChange={setSelectedSubCategories}
            placeholder="Search sub-categories..."
          />
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
            onClick={() => navigate("/product/author/")}
            className="rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600"
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
