import { Fragment, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronUpDownIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  SITE_COMPONENT,
  SITE_COMPONENT_CATEGORIES
} from "@/graphql/queries/siteComponents";
import {
  SELF_SITE_COMPONENT_CREATE,
  SELF_SITE_COMPONENT_DELETE,
  SELF_SITE_COMPONENT_UPDATE
} from "@/graphql/mutations/siteComponents";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";

type Category = {
  id: number;
  title: string;
  priority?: number | null;
};

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

function safeJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ComponentAction() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);

  const idParam = params.get("id");
  const componentId = idParam ? Number(idParam) : null;
  const isUpdate = !!(componentId && Number.isFinite(componentId));

  const categoriesQuery = useQuery(SITE_COMPONENT_CATEGORIES, {
    variables: { first: 200, after: null },
    fetchPolicy: "network-only"
  });

  const categories: Category[] = useMemo(() => {
    const edges = categoriesQuery.data?.siteComponentCategories?.edges ?? [];
    return edges.map((e: any) => e.node).filter(Boolean);
  }, [categoriesQuery.data]);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }, [categories]);

  const componentQuery = useQuery(SITE_COMPONENT, {
    variables: { id: componentId ?? 0 },
    fetchPolicy: "network-only",
    skip: !isUpdate
  });

  const component = componentQuery.data?.siteComponent ?? null;

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [priority, setPriority] = useState<number>(0);
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [componentName, setComponentName] = useState("");
  const [componentDataText, setComponentDataText] = useState("{}");
  const [settingsText, setSettingsText] = useState("{}");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!sortedCategories.length || selectedCategory) return;
    setSelectedCategory(sortedCategories[0] ?? null);
  }, [selectedCategory, sortedCategories]);

  useEffect(() => {
    if (!component) return;
    setTitle(String(component.title ?? ""));
    setPriority(Number(component.priority ?? 0));
    setSlug(String(component.slug ?? ""));
    setDescription(String(component.description ?? ""));
    setComponentName(String(component.component ?? ""));
    setComponentDataText(safeJsonStringify(component.componentData));
    setSettingsText(safeJsonStringify(component.settings));
    setIsActive(!!component.isActive);
    const cat = sortedCategories.find((c) => c.id === component.categoryId) ?? null;
    setSelectedCategory(cat);
    setImageFile(null);
  }, [component?.id, sortedCategories]);

  const [createComponent, createState] = useMutation(SELF_SITE_COMPONENT_CREATE, {
    onCompleted: () => {
      addToast({ kind: "success", title: "Component", subTitle: "Created." });
      navigate("/component/", { replace: true });
    },
    onError: (err) => addToast({ kind: "error", title: "Component", subTitle: err.message })
  });

  const [updateComponent, updateState] = useMutation(SELF_SITE_COMPONENT_UPDATE, {
    onCompleted: () => {
      addToast({ kind: "success", title: "Component", subTitle: "Updated." });
      navigate("/component/", { replace: true });
    },
    onError: (err) => addToast({ kind: "error", title: "Component", subTitle: err.message })
  });

  const [deleteComponent, deleteState] = useMutation(SELF_SITE_COMPONENT_DELETE, {
    onCompleted: () => {
      addToast({ kind: "success", title: "Component", subTitle: "Deleted." });
      navigate("/component/", { replace: true });
    },
    onError: (err) => addToast({ kind: "error", title: "Component", subTitle: err.message })
  });

  const saving = createState.loading || updateState.loading;

  const handleSave = async () => {
    if (!user?.id) return;
    const categoryId = selectedCategory?.id ?? null;
    if (!categoryId) {
      addToast({ kind: "error", title: "Validation", subTitle: "Select category." });
      return;
    }
    const parsedComponentData = safeJsonParse(componentDataText);
    const parsedSettings = safeJsonParse(settingsText);
    if (parsedComponentData == null) {
      addToast({ kind: "error", title: "Validation", subTitle: "Invalid componentData JSON." });
      return;
    }
    if (parsedSettings == null) {
      addToast({ kind: "error", title: "Validation", subTitle: "Invalid settings JSON." });
      return;
    }
    const effectiveSlug = slug.trim() || slugify(title);
    if (!effectiveSlug) {
      addToast({ kind: "error", title: "Validation", subTitle: "Slug is required." });
      return;
    }

    if (isUpdate) {
      await updateComponent({
        variables: {
          userId: user.id,
          componentId,
          categoryId,
          title,
          priority,
          slug: effectiveSlug,
          description,
          component: componentName,
          componentData: parsedComponentData,
          settings: parsedSettings,
          isActive,
          image: imageFile ?? null
        }
      });
      return;
    }

    if (!imageFile) {
      addToast({ kind: "error", title: "Validation", subTitle: "Image is required for create." });
      return;
    }

    await createComponent({
      variables: {
        userId: user.id,
        categoryId,
        title,
        priority,
        slug: effectiveSlug,
        description,
        component: componentName,
        componentData: parsedComponentData,
        settings: parsedSettings,
        isActive,
        image: imageFile
      }
    });
  };

  const handleDelete = async () => {
    if (!user?.id || !isUpdate) return;
    const ok = window.confirm("Delete Component?");
    if (!ok) return;
    await deleteComponent({ variables: { userId: user.id, componentId } });
  };

  return (
    <main className="px-4 pb-16 pt-0">
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-slate-900">
              Component
            </h3>
            {isUpdate ? (
              <button
                type="button"
                onClick={() => navigate("/component/")}
                className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Close
              </button>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            This information will be displayed publicly so be careful what you share.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <div className="relative rounded-md border border-slate-300 bg-white px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-900">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug.trim()) setSlug(slugify(e.target.value));
                }}
                className="block w-full border-0 p-0 text-slate-900 placeholder-slate-400 focus:ring-0 text-sm"
                placeholder="Enter title"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                {title.trim().length < 3 ? (
                  <ExclamationCircleIcon className="h-5 w-5 text-rose-500" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                )}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <Listbox value={selectedCategory} onChange={setSelectedCategory}>
              <div className="relative">
                <Listbox.Label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-900 z-10">
                  Category
                </Listbox.Label>
                <Listbox.Button className="relative w-full cursor-default rounded-md border border-slate-300 bg-white py-3 pl-3 pr-10 text-left text-sm">
                  <span className="block truncate">
                    {selectedCategory?.title ?? "Category"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-40 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {sortedCategories.map((category) => (
                      <Listbox.Option
                        key={category.id}
                        value={category}
                        className={({ active }) =>
                          [
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                            active ? "bg-indigo-600 text-white" : "text-slate-900"
                          ].join(" ")
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={[
                                "block truncate",
                                selected ? "font-semibold" : "font-normal"
                              ].join(" ")}
                            >
                              {category.title}
                            </span>
                            {selected ? (
                              <span
                                className={[
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  active ? "text-white" : "text-indigo-600"
                                ].join(" ")}
                              >
                                <CheckIcon className="h-5 w-5" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          <div className="sm:col-span-1">
            <div className="relative rounded-md border border-slate-300 bg-white px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-900">
                Priority
              </label>
              <input
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                type="number"
                className="block w-full border-0 p-0 text-slate-900 placeholder-slate-400 focus:ring-0 text-sm"
                placeholder="0"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                {priority === 0 ? (
                  <ExclamationCircleIcon className="h-5 w-5 text-rose-500" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                )}
              </div>
            </div>
          </div>

          <div className="sm:col-span-6">
            <div className="relative rounded-md border border-slate-300 bg-white px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-900">
                Slug
              </label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="block w-full border-0 p-0 text-slate-900 placeholder-slate-400 focus:ring-0 text-sm"
                placeholder="hero-1"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <div className="relative rounded-md border border-slate-300 bg-white px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-900">
                Component
              </label>
              <input
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="block w-full border-0 p-0 text-slate-900 placeholder-slate-400 focus:ring-0 text-sm"
                placeholder="Hero"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <div className="relative rounded-md border border-slate-300 bg-white px-3 py-3">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-900">
                Component Data (JSON)
              </label>
              <textarea
                value={componentDataText}
                onChange={(e) => setComponentDataText(e.target.value)}
                className="mt-4 w-full min-h-40 rounded-md border p-3 font-mono text-xs"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <div className="relative rounded-md border border-slate-300 bg-white px-3 py-3">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-900">
                Settings (JSON)
              </label>
              <textarea
                value={settingsText}
                onChange={(e) => setSettingsText(e.target.value)}
                className="mt-4 w-full min-h-24 rounded-md border p-3 font-mono text-xs"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <div className="relative rounded-md border border-slate-300 bg-white px-3 py-3">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-900">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-4 w-full min-h-24 rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <div className="relative rounded-md border border-slate-300 bg-white px-3 py-3">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-900">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="mt-4 text-sm"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              {imageFile ? (
                <div className="mt-2 text-xs text-slate-500">
                  Selected: {imageFile.name}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h3 className="text-lg font-medium leading-6 text-slate-900">
            Status
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            The details used to determine your component behaviour around the web.
          </p>
        </div>

        <div className="mt-2">
          <label className="inline-flex items-start gap-3">
            <input
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              <span className="block text-sm font-medium text-slate-700">
                Active
              </span>
              <span className="block text-sm text-slate-500">
                Users can view and use this component.
              </span>
            </span>
          </label>
        </div>

        <div className="pt-5">
          <div className="flex justify-end gap-3">
            <Link
              to="/component/"
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

        {componentQuery.loading || categoriesQuery.loading ? (
          <div className="pt-4 text-sm text-slate-500">Loading...</div>
        ) : null}
      </div>
    </main>
  );
}

