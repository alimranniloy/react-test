import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { SITE_BLOG_POSTS } from "@/graphql/queries/marketing";
import { BLOG_POST_CREATE, BLOG_POST_UPDATE, BLOG_POST_DELETE } from "@/graphql/mutations/marketing";
import { useSiteStore } from "@/store/useSiteStore";
import { useAuthStore } from "@/store/useAuthStore";
import ActionDrawer from "@/components/ActionDrawer";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

const postTypes = [
  { value: "blog", label: "Blog" },
  { value: "news", label: "News" },
  { value: "announcement", label: "Announcement" }
];

export default function Blog() {
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const siteId = site?.id ?? null;

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      limit: 30
    }),
    [siteId]
  );

  const { data, loading, refetch } = useQuery(SITE_BLOG_POSTS, {
    variables,
    skip: !siteId
  });

  const [createBlog, { loading: creating }] = useMutation(BLOG_POST_CREATE);
  const [updateBlog, { loading: updating }] = useMutation(BLOG_POST_UPDATE);
  const [deleteBlog, { loading: deleting }] = useMutation(BLOG_POST_DELETE);

  const rows = data?.siteBlogPosts?.edges?.map((edge: any) => edge.node) ?? [];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    postType: "blog",
    description: "",
    body: "",
    image: "",
    isActive: true
  });

  const openCreate = () => {
    setEditing(null);
    setSelectedTab("Overview");
    setForm({
      title: "",
      slug: "",
      postType: "blog",
      description: "",
      body: "",
      image: "",
      isActive: true
    });
    setDrawerOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    setSelectedTab("Overview");
    setForm({
      title: row.title ?? "",
      slug: row.slug ?? "",
      postType: row.postType ?? "blog",
      description: row.description ?? "",
      body: row.body ?? "",
      image: row.image ?? "",
      isActive: Boolean(row.isActive)
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async () => {
    if (!user?.id || !siteId) return;
    if (!form.title.trim()) return;

    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-")
    };

    if (editing) {
      await updateBlog({
        variables: {
          userId: user.id,
          siteId,
          id: editing.id,
          data: {
            ...payload,
            postType: form.postType,
            description: form.description,
            body: form.body,
            image: form.image,
            isActive: form.isActive
          }
        }
      });
    } else {
      await createBlog({
        variables: {
          userId: user.id,
          data: {
            ...payload,
            siteId,
            postType: form.postType,
            description: form.description,
            body: form.body,
            image: form.image,
            isActive: form.isActive
          }
        }
      });
    }

    await refetch();
    setDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (!editing || !user?.id || !siteId) return;
    if (!window.confirm("Delete this post?")) return;
    await deleteBlog({ variables: { userId: user.id, siteId, id: editing.id } });
    await refetch();
    setDrawerOpen(false);
  };

  const currentType = postTypes.find((type) => type.value === form.postType) ?? postTypes[0];
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => row.title
      },
      {
        id: "postType",
        header: "Type",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.postType
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm",
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
              row.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {row.isActive ? "Active" : "Inactive"}
          </span>
        )
      },
      {
        id: "action",
        header: "Action",
        headClassName: "px-4 py-3.5 text-right text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-right text-sm",
        cell: (row) => (
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              Blog Posts
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Manage blog posts and status.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            Add Post
          </button>
        </div>
      </div>

      <DataTable
        rows={rows}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
      />

      <ActionDrawer
        open={drawerOpen}
        title={editing ? `Blog Post - ${editing.title ?? "Edit"}` : "Create Blog Post"}
        subtitle="Craft compelling narratives and control publishing."
        onClose={() => setDrawerOpen(false)}
        footer={
          <div className="flex items-center justify-between">
            <div>
              {editing ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                  disabled={deleting}
                >
                  Delete
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
              disabled={creating || updating}
            >
              {editing ? "Save Changes" : "Create Post"}
            </button>
          </div>
        }
      >
        <div className="border-b border-slate-200 pb-3">
          <nav className="flex flex-wrap gap-2 text-sm">
            {["Overview", "SEO", "Meta"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`rounded-2xl px-4 py-2 font-semibold transition ${
                  selectedTab === tab ? "bg-indigo-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {selectedTab === "Overview" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <label className="text-xs font-semibold text-gray-500">Post Type</label>
                <button
                  type="button"
                  onClick={() => setShowTypeDropdown((prev) => !prev)}
                  className="mt-2 flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <span>{currentType.label}</span>
                  <span className="text-gray-400">▾</span>
                </button>
                {showTypeDropdown ? (
                  <div className="absolute z-10 mt-2 w-full rounded-md border border-slate-100 bg-white p-1 shadow-lg">
                    {postTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, postType: type.value }));
                          setShowTypeDropdown(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                          form.postType === type.value ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50"
                        }`}
                      >
                        {type.label}
                        {form.postType === type.value ? <span className="text-indigo-600">✓</span> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <label className="text-sm font-medium text-gray-700">
                Title
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Slug
                <input
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Image URL
                <input
                  value={form.image}
                  onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="text-sm font-medium text-gray-700">
              Description
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                rows={3}
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Body
              <textarea
                value={form.body}
                onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                rows={6}
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
              />
              Active
            </label>
          </div>
        ) : null}

        {selectedTab === "SEO" ? (
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Meta Title
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Meta Description
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                rows={3}
              />
            </label>
          </div>
        ) : null}

        {selectedTab === "Meta" ? (
          <div className="space-y-3 text-sm text-gray-600">
            <p>Post type: {currentType.label}</p>
            <p>Slug preview: {form.slug || form.title.toLowerCase().replace(/\s+/g, "-")}</p>
            <p>Image: {form.image || "—"}</p>
          </div>
        ) : null}
      </ActionDrawer>
    </div>
  );
}
