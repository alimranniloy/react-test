import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { STORE_TAG } from "@/graphql/queries/tag";
import { SELF_STORE_TAG_UPDATE } from "@/graphql/mutations/tag";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

export default function TagEdit() {
  const { id } = useParams();
  const tagId = Number(id);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const [title, setTitle] = useState("");
  const [translation, setTranslation] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  const { data } = useQuery(STORE_TAG, {
    variables: { id: tagId },
    skip: !tagId
  });

  const [updateTag, { loading }] = useMutation(SELF_STORE_TAG_UPDATE);

  useEffect(() => {
    const tag = data?.storeTag;
    if (!tag) return;
    setTitle(tag.title ?? "");
    setTranslation(tag.translation ?? "");
    setIsActive(Boolean(tag.isActive));
    setIsPrivate(Boolean(tag.isPrivate));
  }, [data]);

  const handleSave = async () => {
    if (!user?.id || !site?.id || !tagId) return;
    await updateTag({
      variables: {
        userId: user.id,
        siteId: site.id,
        id: tagId,
        title: title.trim(),
        translation: translation.trim() || title.trim(),
        isActive,
        isPrivate
      }
    });
    navigate("/product/tag/");
  };

  return (
    <main className="space-y-4">
      <section className="rounded-2xl bg-white/90 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Edit</p>
            <h2 className="text-lg font-semibold text-slate-900">Tag</h2>
            <p className="text-xs text-slate-500 mt-1">Update tag name and visibility.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/product/tag/")}
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
              placeholder="Tag title"
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
            onClick={() => navigate("/product/tag/")}
            className="rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600"
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
