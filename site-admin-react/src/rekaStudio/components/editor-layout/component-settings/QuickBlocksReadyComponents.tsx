import { useQuery } from '@apollo/client';
import {
  ChevronRightIcon,
  ComponentPlaceholderIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { useDrag } from 'react-dnd';
import * as React from 'react';

import { cn } from '@app/utils';
import {
  SITE_COMPONENT_CATEGORIES,
  SITE_COMPONENTS,
} from '@/graphql/queries/siteComponents';

import {
  STUDIO_BLOCK_ITEM_TYPE,
  type StudioDragItem,
} from './blockPresets';
import { QuickBlocksGroup } from './QuickBlocksGroup';

type ReadyComponentCategory = {
  id: number;
  title?: string | null;
  description?: string | null;
  priority?: number | null;
};

type ReadyComponentItem = {
  id: number;
  categoryId?: number | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  image?: string | null;
  priority?: number | null;
};

type ReadyComponentGroup = {
  category: ReadyComponentCategory;
  items: ReadyComponentItem[];
};

const ReadyComponentCard = ({
  component,
  categoryTitle,
}: {
  component: ReadyComponentItem;
  categoryTitle: string;
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);
  const imageSrc =
    typeof component.image === 'string' ? component.image.trim() : '';
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: STUDIO_BLOCK_ITEM_TYPE,
      item: {
        kind: 'component',
        componentId: Number(component.id),
        componentTitle: String(
          component.title ?? component.slug ?? `Component #${component.id}`
        ),
      } satisfies StudioDragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [component.id, component.slug, component.title]
  );

  return (
    <button
      ref={drag}
      type="button"
      className={cn(
        'overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50/70 text-left transition hover:border-sky-300 hover:bg-sky-50',
        {
          'opacity-40': isDragging,
        }
      )}
      title={component.title || component.slug || `Component #${component.id}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-slate-200 bg-slate-100">
        {imageSrc && !imageFailed ? (
          <img
            src={imageSrc}
            alt={component.title || 'Component preview'}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-between bg-[linear-gradient(145deg,#0f172a_0%,#1e293b_52%,#334155_100%)] p-3 text-white">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/10">
              <ComponentPlaceholderIcon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Ready Component
              </div>
              <div className="mt-2 text-[13px] font-semibold leading-5">
                {component.title || component.slug || `Component #${component.id}`}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 text-[12px] font-semibold text-slate-900">
            <div className="truncate">
              {component.title || component.slug || `Component #${component.id}`}
            </div>
          </div>
          <div className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Drag
          </div>
        </div>

        <div className="line-clamp-2 text-[11px] leading-5 text-slate-500">
          {component.description ||
            'Reusable section from your component database.'}
        </div>

        <div className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {categoryTitle}
        </div>
      </div>
    </button>
  );
};

const CategoryListItem = ({
  category,
  count,
  thumbnail,
  active,
  onClick,
}: {
  category: ReadyComponentCategory;
  count: number;
  thumbnail: string;
  active: boolean;
  onClick: () => void;
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-[14px] border px-3 py-2 text-left transition',
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
      )}
      title={category.title ?? 'Untitled'}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-slate-100">
        {thumbnail && !imageFailed ? (
          <img
            src={thumbnail}
            alt={category.title || 'Category thumbnail'}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ComponentPlaceholderIcon className="h-4 w-4 text-slate-400" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-semibold">
          {category.title ?? 'Untitled'}
        </div>
        <div
          className={cn('truncate text-[11px]', {
            'text-white/70': active,
            'text-slate-400': !active,
          })}
        >
          {count} components
        </div>
      </div>

      <ChevronRightIcon
        className={cn('h-4 w-4 shrink-0', {
          'text-white/70': active,
          'text-slate-400': !active,
        })}
      />
    </button>
  );
};

export const QuickBlocksReadyComponents = () => {
  const [search, setSearch] = React.useState('');
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(
    null
  );

  const categoriesQuery = useQuery(SITE_COMPONENT_CATEGORIES, {
    variables: { first: 4096, after: null },
    fetchPolicy: 'network-only',
  });
  const componentsQuery = useQuery(SITE_COMPONENTS, {
    variables: { first: 4096, after: null },
    fetchPolicy: 'network-only',
  });

  const categories = React.useMemo(() => {
    const edges = categoriesQuery.data?.siteComponentCategories?.edges ?? [];

    return edges
      .map((edge: { node?: ReadyComponentCategory | null }) => edge?.node)
      .filter(
        (
          category: ReadyComponentCategory | null | undefined
        ): category is ReadyComponentCategory => Boolean(category)
      )
      .sort(
        (a: ReadyComponentCategory, b: ReadyComponentCategory) =>
          (a.priority ?? 0) - (b.priority ?? 0)
      );
  }, [categoriesQuery.data]);

  const components = React.useMemo(() => {
    const edges = componentsQuery.data?.siteComponents?.edges ?? [];

    return edges
      .map((edge: { node?: ReadyComponentItem | null }) => edge?.node)
      .filter(
        (
          component: ReadyComponentItem | null | undefined
        ): component is ReadyComponentItem => Boolean(component)
      )
      .sort(
        (a: ReadyComponentItem, b: ReadyComponentItem) =>
          (a.priority ?? 0) - (b.priority ?? 0)
      );
  }, [componentsQuery.data]);

  const normalizedSearch = search.trim().toLowerCase();

  const countByCategoryId = React.useMemo(() => {
    const map = new Map<number, number>();

    components.forEach((component: ReadyComponentItem) => {
      const categoryId = Number(component.categoryId ?? 0);

      if (!categoryId) {
        return;
      }

      map.set(categoryId, (map.get(categoryId) ?? 0) + 1);
    });

    return map;
  }, [components]);

  const thumbnailByCategoryId = React.useMemo(() => {
    const map = new Map<number, string>();

    components.forEach((component: ReadyComponentItem) => {
      const categoryId = Number(component.categoryId ?? 0);
      const imageSrc =
        typeof component.image === 'string' ? component.image.trim() : '';

      if (!categoryId || !imageSrc || map.has(categoryId)) {
        return;
      }

      map.set(categoryId, imageSrc);
    });

    return map;
  }, [components]);

  const filteredCategories = React.useMemo(() => {
    return categories.filter((category: ReadyComponentCategory) => {
      if (!normalizedSearch) {
        return true;
      }

      const haystack = [category.title, category.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (haystack.includes(normalizedSearch)) {
        return true;
      }

      return components.some((component: ReadyComponentItem) => {
        if (Number(component.categoryId ?? 0) !== Number(category.id)) {
          return false;
        }

        const componentHaystack = [
          component.title,
          component.slug,
          component.description,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return componentHaystack.includes(normalizedSearch);
      });
    });
  }, [categories, components, normalizedSearch]);

  const filteredComponents = React.useMemo(() => {
    if (!normalizedSearch) {
      return components;
    }

    return components.filter((component: ReadyComponentItem) => {
      const haystack = [component.title, component.slug, component.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [components, normalizedSearch]);

  const groupedComponents = React.useMemo(() => {
    const visibleCategories = selectedCategoryId
      ? filteredCategories.filter(
          (category: ReadyComponentCategory) =>
            Number(category.id) === Number(selectedCategoryId)
        )
      : filteredCategories;

    return visibleCategories
      .map((category: ReadyComponentCategory) => {
        const items = filteredComponents.filter(
          (component: ReadyComponentItem) =>
            Number(component.categoryId ?? 0) === Number(category.id)
        );

        return {
          category,
          items,
        };
      })
      .filter((group: ReadyComponentGroup) => group.items.length > 0);
  }, [filteredCategories, filteredComponents, selectedCategoryId]);

  React.useEffect(() => {
    if (!selectedCategoryId) {
      return;
    }

    const exists = categories.some(
      (category: ReadyComponentCategory) =>
        Number(category.id) === Number(selectedCategoryId)
    );

    if (!exists) {
      setSelectedCategoryId(null);
    }
  }, [categories, selectedCategoryId]);

  const handleRefresh = async () => {
    await Promise.all([categoriesQuery.refetch(), componentsQuery.refetch()]);
  };

  const isLoading = categoriesQuery.loading || componentsQuery.loading;

  return (
    <div className="space-y-3">
      <div className="rounded-[18px] border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search components or categories..."
              className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 pl-9 text-[12px] text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white"
            />
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <button
            type="button"
            onClick={() => {
              void handleRefresh();
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300 hover:bg-white"
            title="Refresh components"
          >
            <ReloadIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-[18px] border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            All Components
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition',
              selectedCategoryId == null
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white'
            )}
          >
            Show All
          </button>
        </div>

        {isLoading ? (
          <div className="mt-3 rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-4 text-[12px] text-slate-500">
            Loading categories...
          </div>
        ) : null}

        {!isLoading && filteredCategories.length === 0 ? (
          <div className="mt-3 rounded-[14px] border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-[12px] text-slate-500">
            No component category matched your search.
          </div>
        ) : null}

        {!isLoading && filteredCategories.length > 0 ? (
          <div className="mt-3 space-y-2">
            {filteredCategories.map((category: ReadyComponentCategory) => (
              <CategoryListItem
                key={category.id}
                category={category}
                count={countByCategoryId.get(Number(category.id)) ?? 0}
                thumbnail={thumbnailByCategoryId.get(Number(category.id)) ?? ''}
                active={selectedCategoryId === Number(category.id)}
                onClick={() => setSelectedCategoryId(Number(category.id))}
              />
            ))}
          </div>
        ) : null}
      </div>

      {selectedCategoryId != null ? (
        <div className="flex items-center justify-between rounded-[16px] border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500">
          <span>Showing one category</span>
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-[10px] border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300 hover:bg-white"
            title="Close category filter"
          >
            <Cross2Icon className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {!isLoading && groupedComponents.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-[12px] leading-6 text-slate-500">
          No components matched this search.
        </div>
      ) : null}

      {!isLoading
        ? groupedComponents.map((group: ReadyComponentGroup, index: number) => (
            <QuickBlocksGroup
              key={group.category.id}
              title={String(group.category.title ?? 'Untitled')}
              count={group.items.length}
              defaultOpen={selectedCategoryId != null || index === 0}
            >
              {group.category.description ? (
                <div className="mb-3 text-[11px] leading-5 text-slate-500">
                  {group.category.description}
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-2">
                {group.items.map((component: ReadyComponentItem) => (
                  <ReadyComponentCard
                    key={component.id}
                    component={component}
                    categoryTitle={String(group.category.title ?? 'Category')}
                  />
                ))}
              </div>
            </QuickBlocksGroup>
          ))
        : null}

      <div className="rounded-[16px] border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-[11px] leading-5 text-slate-500">
        Database components are loaded from Site Admin categories. Use a
        category filter or keep `Show All` active to browse everything.
      </div>
    </div>
  );
};
