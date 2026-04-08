import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { BoltIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import {
  SITE_COMPONENT_CATEGORIES,
  SITE_COMPONENTS
} from "@/graphql/queries/siteComponents";
import { useAuthStore } from "@/store/useAuthStore";

type Category = {
  id: number;
  title: string;
  description?: string | null;
  priority?: number | null;
};

type ComponentItem = {
  id: number;
  categoryId: number;
  title: string;
  image?: string | null;
  priority?: number | null;
};

function groupArray<T>(array: T[], size: number) {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default function Components() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const canCreate = !!(user?.isStaff || user?.isSuperuser);

  const categoriesQuery = useQuery(SITE_COMPONENT_CATEGORIES, {
    variables: { first: 4096, after: null },
    fetchPolicy: "network-only"
  });
  const componentsQuery = useQuery(SITE_COMPONENTS, {
    variables: { first: 4096, after: null },
    fetchPolicy: "network-only"
  });

  const categories: Category[] = useMemo(() => {
    const edges = categoriesQuery.data?.siteComponentCategories?.edges ?? [];
    return edges.map((e: any) => e.node).filter(Boolean);
  }, [categoriesQuery.data]);

  const components: ComponentItem[] = useMemo(() => {
    const edges = componentsQuery.data?.siteComponents?.edges ?? [];
    return edges.map((e: any) => e.node).filter(Boolean);
  }, [componentsQuery.data]);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }, [categories]);

  const sortedComponents = useMemo(() => {
    return [...components].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }, [components]);

  const scrollToElement = (title: string) => {
    const el = document.getElementById(`targetElement_${title}`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const refresh = async () => {
    await Promise.all([categoriesQuery.refetch(), componentsQuery.refetch()]);
  };

  return (
    <main className="px-4 pb-16 pt-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto relative">
          <h1 className="text-xl font-semibold text-slate-900 flex items-center">
            Component
            <button
              type="button"
              onClick={refresh}
              className="ml-2 inline-flex items-center rounded p-1 hover:bg-slate-100"
              title="Refresh"
            >
              <BoltIcon className="h-4 w-4" />
            </button>
          </h1>
          <p className="mt-2 text-sm text-slate-700">
            A list of all components in your account.
          </p>
        </div>
        {canCreate ? (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/component/create/"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Add New
            </Link>
          </div>
        ) : null}
      </div>

      <div className="mx-auto mt-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1 lg:sticky lg:top-0 lg:h-[80vh] lg:overflow-auto rounded-md border bg-white p-3">
            {groupArray(sortedCategories, 3).map((items, idx) => (
              <div key={idx} className="py-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    className="block w-full text-left py-1 text-sm text-slate-600 hover:text-blue-500 truncate"
                    onClick={() => scrollToElement(item.title)}
                    title={item.title}
                    type="button"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 h-[80vh] overflow-auto p-4 border rounded-md bg-white">
            <ul className="space-y-6">
              {sortedCategories.map((cat) => (
                <li key={cat.id} className="pb-2">
                  <h2
                    id={`targetElement_${cat.title}`}
                    className="text-xl font-bold text-slate-800 flex items-center"
                  >
                    {cat.title}
                    {cat.title === "Hero" ? (
                      <span
                        className="ml-2 rounded-sm bg-emerald-500 px-2 py-0.5 text-xs font-normal text-white"
                        style={{ cursor: "default" }}
                      >
                        We recommend to start with a Hero
                      </span>
                    ) : null}
                  </h2>
                  <div className="text-sm text-slate-500">{cat.description ?? ""}</div>

                  <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full pt-3 pb-4">
                    {sortedComponents
                      .filter((c) => c.categoryId === cat.id)
                      .map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => navigate(`/component/update/?id=${c.id}`)}
                            className="relative w-full text-left"
                          >
                            <div className="overflow-hidden rounded-md border bg-slate-50">
                              {c.image ? (
                                <img
                                  src={String(c.image)}
                                  alt={c.title}
                                  className="h-48 w-full object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="h-48 w-full grid place-items-center text-sm text-slate-400">
                                  No image
                                </div>
                              )}
                            </div>
                            <span className="absolute right-0 bottom-2 rounded-l-sm bg-rose-400 px-2 py-1 text-xs text-white">
                              {c.title}
                            </span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>

            {categoriesQuery.loading || componentsQuery.loading ? (
              <div className="py-10 text-center text-sm text-slate-500">Loading...</div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
