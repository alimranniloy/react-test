<template>
  <div
    class="flex flex-col px-4 py-1.5 border-b border-solid border-outline setting-section last:border-none flex-1 relative"
  >
    <div class="flex items-center justify-between mt-2 mb-1">
      <header class="flex items-center gap-2">
        <span class="text-slate-800 text-sm font-medium flex items-center">
          Components
        </span>
        <button
          class="inline-flex [&>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-gray-500 hover:bg-black/5 hover:text-neutral-900 text-xs py-1.5 px-1.5 rounded-md [&>svg]:w-3 [&>svg]:h-3"
          title="Refresh remote library"
          @click="getComponents()"
        >
          <BoltIcon class="h-4 w-4" />
        </button>
      </header>
      <span
        class="text-[11px] font-medium uppercase tracking-wider text-slate-400"
      >
        {{ programComponents.length }} items
      </span>
    </div>

    <div class="mt-2 px-1">
      <label for="component-search" class="sr-only">Search components</label>
      <div class="relative">
        <input
          id="component-search"
          v-model="searchTerm"
          type="search"
          autocomplete="off"
          placeholder="Search components, categories, blocks..."
          class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <MagnifyingGlassIcon
          class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
    <div class="mt-2 px-1 flex flex-wrap items-center gap-2">
      <button
        v-if="canSaveCurrentFilter"
        class="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-[11px] font-medium text-primary-600 transition hover:bg-primary-100"
        @click="saveCurrentFilter"
      >
        <BookmarkIcon class="h-3.5 w-3.5" />
        Save filter
      </button>
      <div
        v-if="savedComponentFilters.length"
        class="flex flex-wrap items-center gap-3"
      >
        <button
          v-for="filter in savedComponentFilters"
          :key="filter.id"
          class="filter-card group relative flex items-center gap-2 rounded-xl border px-2 py-1 text-left transition"
          :class="
            isFilterActive(filter)
              ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-500 hover:border-primary-200 hover:bg-primary-50/60'
          "
          type="button"
          @click="applySavedFilter(filter)"
        >
          <div
            class="flex h-7 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-100"
          >
            <img
              v-if="deriveFilterThumbnail(filter)"
              :src="deriveFilterThumbnail(filter)"
              alt="filter preview"
              class="h-full w-full object-cover"
            />
            <TagIcon v-else class="h-4 w-4 text-slate-400" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-[11px] font-medium">
              {{ filter.label }}
            </p>
            <p class="truncate text-[10px] text-slate-400">
              {{ filter.query }}
            </p>
          </div>
          <button
            class="rounded-full p-0.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
            title="Remove filter"
            @click.stop="removeSavedFilter(filter.id)"
          >
            <XMarkIcon class="h-3 w-3" />
          </button>
        </button>
      </div>
    </div>

    <Transition name="toolbar">
      <div
        v-if="selectionCount > 0"
        class="mt-3 px-2 py-2 rounded-lg border border-slate-200 bg-slate-50/65 shadow-sm"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="min-w-[40%]">
            <p class="text-[12px] font-medium text-slate-700">
              {{ selectionCount }} selected
            </p>
            <p class="text-[11px] text-slate-400">
              {{ selectionSummary }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-1.5 text-slate-600">
            <button
              class="toolbar-btn"
              :disabled="!actionableSelectionCount"
              @click="duplicateSelection"
              title="Duplicate · ⌘/Ctrl + D"
            >
              <DocumentDuplicateIcon class="h-4 w-4" />
            </button>
            <button
              class="toolbar-btn"
              :disabled="!actionableSelectionCount"
              @click="deleteSelection"
              title="Delete · Delete"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
            <button
              class="toolbar-btn"
              :disabled="!canMoveUp"
              @click="moveSelection('up')"
              title="Move Up · ⌥ + ↑"
            >
              <ArrowUpIcon class="h-4 w-4" />
            </button>
            <button
              class="toolbar-btn"
              :disabled="!canMoveDown"
              @click="moveSelection('down')"
              title="Move Down · ⌥ + ↓"
            >
              <ArrowDownIcon class="h-4 w-4" />
            </button>
            <button
              class="toolbar-btn"
              :disabled="!actionableSelectionCount"
              @click="sendSelectionToEdge('start')"
              title="Send to Top · ⌘/Ctrl + ⇧ + ↑"
            >
              <ArrowLongUpIcon class="h-4 w-4" />
            </button>
            <button
              class="toolbar-btn"
              :disabled="!actionableSelectionCount"
              @click="sendSelectionToEdge('end')"
              title="Send to Bottom · ⌘/Ctrl + ⇧ + ↓"
            >
              <ArrowLongDownIcon class="h-4 w-4" />
            </button>
            <button
              class="toolbar-btn"
              :disabled="selectionCount === 0"
              @click="setInsertTarget('up')"
              title="Insert Above · ⇧ + I"
            >
              <ArrowUpTrayIcon class="h-4 w-4" />
            </button>
            <button
              class="toolbar-btn"
              :disabled="selectionCount === 0"
              @click="setInsertTarget('down')"
              title="Insert Below · I"
            >
              <ArrowDownTrayIcon class="h-4 w-4" />
            </button>
            <button
              class="toolbar-btn"
              :disabled="actionableSelectionCount < 2"
              @click="shuffleSelection"
              title="Shuffle Selection"
            >
              <ArrowsUpDownIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <section class="-mx-4">
      <div class="py-3 pb-4 max-h-[50vh]">
        <div
          ref="componentListEl"
          tabindex="0"
          class="flex max-h-[50vh] flex-col px-2 overflow-y-auto no-scrollbar focus:outline-none"
          @mouseenter="sidebarHasFocus = true"
          @mouseleave="sidebarHasFocus = false"
          @focusin="sidebarHasFocus = true"
          @focusout="sidebarHasFocus = false"
        >
          <TransitionGroup name="stagger" tag="div" class="space-y-1.5">
            <div
              v-for="(item, index) in visibleComponents"
              :key="item.id"
              :class="componentRowClass(item)"
              class="group relative flex items-start justify-between gap-3 rounded-md border border-transparent px-3 py-2 text-xs transition-all duration-150 ease-out hover:-translate-y-0 hover:shadow-sm"
              @click="handleComponentClick($event, item, index)"
              @dblclick="focusComponent(item)"
            >
              <div class="flex min-w-0 flex-1 items-start gap-3">
                <div
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] font-semibold truncate max-w-[100px]"
                  :class="
                    isSelected(item.id)
                      ? 'border-primary-400 bg-primary-50 text-primary-600'
                      : 'border-slate-200 bg-white text-slate-400'
                  "
                >
                  {{ displayIndex(index) }}
                </div>
                <div class="min-w-0 w-full">
                  <div class="flex gap-2 items-center justify-between">
                    <div class="flex items-center gap-2">
                      <component
                        :is="
                          item instanceof t.RekaComponent
                            ? CubeIcon
                            : CubeTransparentIcon
                        "
                        class="h-4 w-4 text-slate-400"
                      />
                      <p
                        class="truncate text-[12px] font-medium text-slate-700 max-w-[50px]"
                        v-html="highlightMatch(item.name)"
                      ></p>
                    </div>
                    <span
                      v-if="componentBadges(item).length"
                      class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500"
                    >
                      <span
                        v-for="tag in componentBadges(item)"
                        :key="tag"
                        class="max-w-[50px] truncate"
                      >
                        {{ tag }}
                      </span>
                    </span>
                  </div>
                  <div
                    class="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400"
                  >
                    <span class="flex items-center gap-1">
                      <SparklesIcon class="h-3.5 w-3.5" />
                      {{ componentInsights(item).structure }}
                    </span>
                    <span
                      v-if="componentInsights(item).state"
                      class="flex items-center gap-1"
                    >
                      <AdjustmentsHorizontalIcon class="h-3.5 w-3.5" />
                      {{ componentInsights(item).state }}
                    </span>
                    <div
                      class="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100"
                    >
                      <button
                        class="row-btn"
                        title="Insert Above"
                        @click.stop="setInsertTargetForItem(item, 'up')"
                      >
                        <ArrowUpTrayIcon class="h-4 w-4" />
                      </button>
                      <button
                        class="row-btn"
                        title="Insert Below"
                        @click.stop="setInsertTargetForItem(item, 'down')"
                      >
                        <ArrowDownTrayIcon class="h-4 w-4" />
                      </button>
                      <button
                        class="row-btn"
                        :disabled="item.name === 'App'"
                        title="Duplicate"
                        @click.stop="duplicateComponent(item)"
                      >
                        <DocumentDuplicateIcon class="h-4 w-4" />
                      </button>
                      <button
                        class="row-btn"
                        :disabled="item.name === 'App'"
                        title="Delete"
                        @click.stop="deleteComponent(item)"
                      >
                        <TrashIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="isSelected(item.id)"
                class="pointer-events-none absolute inset-0 rounded-md ring-2 ring-primary-400 ring-offset-1"
              ></div>
            </div>
          </TransitionGroup>
          <p
            v-if="!visibleComponents.length"
            class="px-3 py-4 text-center text-xs text-slate-400"
          >
            No components match your search.
          </p>
        </div>
      </div>
    </section>

    <Transition name="fade">
      <div
        v-if="selectionCount === 1 && previewComponent"
        class="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-3"
      >
        <div class="flex items-center justify-between">
          <h3
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Details
          </h3>
          <span class="text-[11px] text-slate-400">
            {{ previewComponent.name }}
          </span>
        </div>
        <ComponentPreview />
      </div>
    </Transition>

    <div class="mt-5 px-1">
      <p
        class="text-[11px] font-semibold uppercase tracking-wider text-slate-500"
      >
        Quick blocks
      </p>
      <TransitionGroup
        name="stagger"
        tag="div"
        class="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3"
      >
        <DndBasicComponent
          v-for="item in quickBlocks"
          :key="item.key"
          @add="addComponent"
          :item="item"
        />
      </TransitionGroup>
      <p
        v-if="quickBlocks.length === 0"
        class="px-2 py-4 text-center text-xs text-slate-400"
      >
        No quick blocks found.
      </p>
    </div>

    <div class="flex items-center cursor-pointer mt-4 mb-2">
      <header class="flex flex-1 items-center">
        <span class="text-slate-800 text-sm font-medium flex items-center">
          All Components
        </span>
      </header>
    </div>

    <section class="-mx-4 h-half overflow-y-auto no-scrollbar relative">
      <div class="flex max-h-[50vh] no-scrollbar flex-col px-2">
        <div class="col-span-1 px-2">
          <div v-if="pinnedCategories.length" class="mb-4">
            <p
              class="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
            >
              Pinned categories
            </p>
            <div class="mt-2 space-y-1.5">
              <div
                v-for="category in pinnedCategories"
                :key="category.id"
                class="flex items-center gap-3 rounded-md border border-transparent bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-slate-200 hover:bg-slate-100"
              >
                <div
                  class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-slate-100"
                >
                  <img
                    v-if="deriveCategoryThumbnail(category)"
                    :src="deriveCategoryThumbnail(category)"
                    alt="category thumbnail"
                    class="h-full w-full object-cover"
                  />
                  <BookmarkIcon v-else class="h-4 w-4 text-slate-400" />
                </div>
                <button
                  class="flex flex-1 items-center justify-between text-left"
                  @click="openCategory(category)"
                >
                  <span class="truncate">{{ category.title }}</span>
                  <ArrowRightIcon class="h-4 w-4 shrink-0 text-slate-400" />
                </button>
                <button
                  class="ml-2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                  title="Unpin category"
                  @click.stop="togglePinnedCategory(category.id)"
                >
                  <BookmarkSlashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div
            v-for="(items, index) in groupArray(unpinnedCategories, 3)"
            :key="index"
            class="space-y-1.5"
          >
            <div
              v-for="item in items"
              :key="item.id"
              class="flex items-center gap-3 rounded-md border border-transparent px-3 py-2 transition-all"
              :class="
                selectedComponentCategoryId === item.id
                  ? 'bg-gray-200 text-slate-800'
                  : 'bg-white text-slate-600 hover:bg-gray-100 hover:border-slate-200'
              "
            >
              <div
                class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-slate-100"
              >
                <img
                  v-if="deriveCategoryThumbnail(item)"
                  :src="deriveCategoryThumbnail(item)"
                  alt="category thumbnail"
                  class="h-full w-full object-cover"
                />
                <BookmarkIcon v-else class="h-4 w-4 text-slate-400" />
              </div>
              <button
                class="flex flex-1 items-center justify-between text-left"
                @click="openCategory(item)"
                :title="item.title"
              >
                <span class="truncate">{{ item.title }}</span>
                <ArrowRightIcon class="h-4 w-4 shrink-0 text-slate-400" />
              </button>
              <button
                class="ml-2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                :title="
                  pinnedCategorySet.has(item.id)
                    ? 'Unpin category'
                    : 'Pin category'
                "
                @click.stop="togglePinnedCategory(item.id)"
              >
                <BookmarkIcon
                  v-if="pinnedCategorySet.has(item.id)"
                  class="h-4 w-4"
                />
                <BookmarkSlashIcon v-else class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Transition name="sidebar-flyout">
      <div
        v-if="isOpenComponent && activeCategory"
        class="bg-white overflow-y-auto h-full fixed top-14 bottom-0 w-[260px] left-[285px] border-x z-[999999] shadow-lg transition-all duration-500"
      >
        <div class="h-full flex flex-col">
          <div class="flex items-center justify-between border-b px-4 py-4">
            <span class="text-sm font-semibold text-gray-600">
              {{ activeCategory ? activeCategory.title : "Components" }}
            </span>
            <button
              @click="
                (selectedComponentCategoryId = null), (isOpenComponent = false)
              "
              class="rounded-md border border-transparent p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <ArrowLeftIcon class="h-4 w-4" />
            </button>
          </div>
          <ul class="grid grid-cols-1 gap-4 px-4 py-4 overflow-y-auto">
            <li v-for="item in filteredCategoryComponents" :key="item.id">
              <DndComponent
                @add="addComponent"
                type="button"
                class="relative"
                :item="item"
              />
            </li>
            <li
              v-if="filteredCategoryComponents.length === 0"
              class="text-center text-xs text-slate-400"
            >
              No component matches your search in this category.
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import * as t from "@rekajs/types";
import Fuse from "fuse.js";
import {
  ref,
  inject,
  computed,
  defineAsyncComponent,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
import { useComponentStore } from "@/stores/component";
import { getIdentifierFromStr } from "@rekajs/parser";
import {
  BASIC_COMPONENT_PALETTE,
  createComponentFromDragPayload,
  ensureUniqueComponentName,
} from "@/reka";
import {
  CubeTransparentIcon,
  ChevronRightIcon,
  CubeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLongUpIcon,
  ArrowLongDownIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  BookmarkIcon,
  BookmarkSlashIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const componentStore = useComponentStore();
const editorStore = useEditorStore();

const { components, componentCategories } = storeToRefs(componentStore);
const { getComponents, getComponentCategories } = componentStore;

const {
  componentId,
  position,
  positionId,
  selectedComponentIds,
  isNewComponent,
  pinnedComponentCategoryIds,
  savedComponentFilters,
} = storeToRefs(editorStore);

const reka = inject("reka");

const ComponentPreview = defineAsyncComponent(() =>
  import("@/views/editor/component/ComponentPreview.vue")
);
const DndBasicComponent = defineAsyncComponent(() =>
  import("@/views/editor/template/DndBasicComponent.vue")
);
const DndComponent = defineAsyncComponent(() =>
  import("@/views/editor/template/DndComponent.vue")
);

if (!componentCategories.value.length) {
  getComponentCategories();
}

if (!components.value.length) {
  getComponents();
}

const searchTerm = ref("");
const selectedComponentCategoryId = ref(null);
const isOpenComponent = ref(false);
const componentListEl = ref(null);
const sidebarHasFocus = ref(false);
const anchorIndex = ref(null);

const normalizedSearch = computed(() => searchTerm.value.trim().toLowerCase());

const programComponents = computed(
  () => reka.value?.state?.program?.components ?? []
);

const fuse = computed(() => {
  const list = programComponents.value.map((component) => ({
    ...component,
    tags: component?.meta?.tags ?? [],
    description: component?.meta?.description ?? "",
  }));

  return new Fuse(list, {
    includeScore: true,
    threshold: 0.38,
    keys: [
      { name: "name", weight: 0.6 },
      { name: "tags", weight: 0.25 },
      { name: "description", weight: 0.15 },
    ],
  });
});

const visibleComponents = computed(() => {
  if (!normalizedSearch.value) {
    return programComponents.value;
  }
  return fuse.value.search(normalizedSearch.value).map((entry) => entry.item);
});

const selectionSet = computed(
  () => new Set(selectedComponentIds.value.filter(Boolean))
);

const actionableSelectionIds = computed(() => {
  return selectedComponentIds.value.filter((id) => {
    const component = programComponents.value.find((item) => item.id === id);
    return component && component.name !== "App";
  });
});

const actionableSelectionCount = computed(
  () => actionableSelectionIds.value.length
);

const selectionCount = computed(() => selectedComponentIds.value.length);

const componentById = (id) =>
  programComponents.value.find((component) => component.id === id);

const previewComponent = computed(() => {
  if (!selectionCount.value) {
    return null;
  }
  const first = selectedComponentIds.value[0];
  return first ? componentById(first) ?? null : null;
});

const selectionSummary = computed(() => {
  if (!selectionCount.value) {
    return "";
  }
  const names = selectedComponentIds.value
    .map((id) => componentById(id)?.name)
    .filter(Boolean);
  if (!names.length) {
    return "Select components with ⌘/Ctrl + click or ⇧ + click to extend.";
  }
  if (names.length <= 3) {
    return names.join(", ");
  }
  const remaining = names.length - 2;
  return `${names.slice(0, 2).join(", ")} +${remaining} more`;
});

const canMoveUp = computed(() => {
  if (!actionableSelectionCount.value) {
    return false;
  }
  const ids = new Set(actionableSelectionIds.value);
  const components = programComponents.value;
  return components.some((component, index) => {
    if (!ids.has(component.id)) {
      return false;
    }
    if (index === 0) {
      return false;
    }
    const previous = components[index - 1];
    return previous && !ids.has(previous.id);
  });
});

const canMoveDown = computed(() => {
  if (!actionableSelectionCount.value) {
    return false;
  }
  const ids = new Set(actionableSelectionIds.value);
  const components = programComponents.value;
  for (let index = components.length - 1; index >= 0; index -= 1) {
    const component = components[index];
    if (!ids.has(component.id)) {
      continue;
    }
    if (index === components.length - 1) {
      return false;
    }
    const next = components[index + 1];
    if (next && !ids.has(next.id)) {
      return true;
    }
  }
  return false;
});

const quickBlocks = computed(() => {
  if (!normalizedSearch.value) {
    return BASIC_COMPONENT_PALETTE;
  }

  return BASIC_COMPONENT_PALETTE.filter((item) =>
    item.label.toLowerCase().includes(normalizedSearch.value)
  );
});

const sortedCategories = computed(() =>
  [...componentCategories.value].sort((a, b) => a.priority - b.priority)
);

const filteredCategories = computed(() => {
  if (!normalizedSearch.value) {
    return sortedCategories.value;
  }

  return sortedCategories.value.filter((category) =>
    category.title.toLowerCase().includes(normalizedSearch.value)
  );
});

const pinnedCategorySet = computed(
  () => new Set(pinnedComponentCategoryIds.value.filter(Boolean))
);

const pinnedCategories = computed(() =>
  filteredCategories.value.filter((category) =>
    pinnedCategorySet.value.has(category.id)
  )
);

const unpinnedCategories = computed(() =>
  filteredCategories.value.filter(
    (category) => !pinnedCategorySet.value.has(category.id)
  )
);

const activeCategory = computed(
  () =>
    componentCategories.value.find(
      (category) => category.id === selectedComponentCategoryId.value
    ) ?? null
);

const filteredCategoryComponents = computed(() => {
  if (!selectedComponentCategoryId.value) {
    return [];
  }

  const candidates = components.value
    .filter(
      (component) => component.categoryId === selectedComponentCategoryId.value
    )
    .sort((a, b) => a.priority - b.priority);

  if (!normalizedSearch.value) {
    return candidates;
  }

  return candidates.filter((component) =>
    component.title.toLowerCase().includes(normalizedSearch.value)
  );
});

const canSaveCurrentFilter = computed(() => {
  const query = normalizedSearch.value;
  if (!query) {
    return false;
  }
  return !savedComponentFilters.value.some((filter) => filter.query === query);
});

const isFilterActive = (filter) =>
  filter?.query && filter.query === normalizedSearch.value;

const deriveFilterThumbnail = (filter) => {
  if (filter?.thumbnail) {
    return filter.thumbnail;
  }
  if (filter?.sampleComponentId) {
    const component = programComponents.value.find(
      (entry) => entry.id === filter.sampleComponentId
    );
    return component?.meta?.thumbnail ?? null;
  }
  const fallback = visibleComponents.value.find((component) =>
    (component?.name ?? "")
      .toLowerCase()
      .includes(filter?.query?.toLowerCase?.() ?? "")
  );
  return fallback?.meta?.thumbnail ?? null;
};

const deriveCategoryThumbnail = (category) => {
  if (!category) {
    return null;
  }
  if (category.thumbnail) {
    return category.thumbnail;
  }
  const candidate = components.value.find(
    (component) => component.categoryId === category.id && component.thumbnail
  );
  return candidate?.thumbnail ?? null;
};

const highlightMatch = (value) => {
  if (!normalizedSearch.value) {
    return escapeHtml(value);
  }
  const pattern = new RegExp(`(${escapeRegExp(normalizedSearch.value)})`, "gi");
  return escapeHtml(value).replace(pattern, "<mark>$1</mark>");
};

const componentBadges = (component) => {
  const tags = component?.meta?.tags ?? [];
  if (tags.length) {
    return tags.slice(0, 2);
  }
  const name = component?.name ?? "";
  if (!name) {
    return [];
  }
  const parts = name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ");
  return Array.from(new Set(parts)).slice(0, 2);
};

const componentInsights = (component) => {
  if (!component || !(component instanceof t.RekaComponent)) {
    return { structure: "External component", state: "" };
  }
  const childrenCount =
    component?.template?.children?.length ?? component?.state?.length ?? 0;
  const structure =
    childrenCount === 0
      ? "Empty template"
      : `${childrenCount} child${childrenCount === 1 ? "" : "ren"}`;
  const stateCount = component?.state?.length ?? 0;
  const state =
    stateCount === 0
      ? ""
      : `${stateCount} state ${stateCount === 1 ? "field" : "fields"}`;
  return {
    structure,
    state,
  };
};

const togglePinnedCategory = (categoryId) => {
  if (!categoryId) {
    return;
  }
  const next = new Set(pinnedComponentCategoryIds.value);
  if (next.has(categoryId)) {
    next.delete(categoryId);
  } else {
    next.add(categoryId);
  }
  pinnedComponentCategoryIds.value = Array.from(next);
};

const openCategory = (category) => {
  if (!category) {
    return;
  }
  selectedComponentCategoryId.value = category.id;
  isOpenComponent.value = true;
};

const saveCurrentFilter = () => {
  const query = normalizedSearch.value;
  if (!query) {
    return;
  }

  const suggested = query.length > 24 ? `${query.slice(0, 21)}…` : query;
  const label =
    (typeof window !== "undefined"
      ? window.prompt("Name this filter", suggested)
      : suggested) ?? "";
  const trimmed = label.trim();
  if (!trimmed) {
    return;
  }

  const sample = visibleComponents.value[0];
  const thumbnail = deriveFilterThumbnail({
    query,
    sampleComponentId: sample?.id,
  });

  const filter = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    label: trimmed,
    query,
    sampleComponentId: sample?.id ?? null,
    thumbnail: thumbnail ?? sample?.meta?.thumbnail ?? null,
  };

  const existing = savedComponentFilters.value.filter(
    (item) => item.query !== query
  );

  savedComponentFilters.value = [...existing, filter].slice(-12);
};

const applySavedFilter = (filter) => {
  if (!filter) {
    return;
  }
  searchTerm.value = filter.query;
};

const removeSavedFilter = (filterId) => {
  savedComponentFilters.value = savedComponentFilters.value.filter(
    (filter) => filter.id !== filterId
  );
};

const componentRowClass = (component) => {
  if (isSelected(component.id)) {
    return "bg-primary-50 text-primary-700 border-primary-200 shadow-sm";
  }
  return "bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50";
};

const isSelected = (id) => selectionSet.value.has(id);

const displayIndex = (index) => {
  const padded = index + 1;
  return padded > 99 ? padded : String(padded).padStart(2, "0");
};

const escapeHtml = (input) =>
  input
    ?.toString()
    ?.replace(/&/g, "&amp;")
    ?.replace(/</g, "&lt;")
    ?.replace(/>/g, "&gt;")
    ?.replace(/"/g, "&quot;")
    ?.replace(/'/g, "&#39;") ?? "";

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const handleComponentClick = (event, item, visibleIndex) => {
  const isRange = event.shiftKey;
  const isToggle = event.metaKey || event.ctrlKey;

  const current = new Set(selectedComponentIds.value);

  if (isRange && visibleComponents.value.length) {
    const anchor = anchorIndex.value ?? visibleIndex;
    const start = Math.min(anchor, visibleIndex);
    const end = Math.max(anchor, visibleIndex);
    const rangeIds = visibleComponents.value
      .slice(start, end + 1)
      .map((component) => component.id);

    if (isToggle) {
      rangeIds.forEach((id) => current.add(id));
    } else {
      current.clear();
      rangeIds.forEach((id) => current.add(id));
    }

    anchorIndex.value = anchor;
  } else if (isToggle) {
    if (current.has(item.id)) {
      current.delete(item.id);
    } else {
      current.add(item.id);
    }
    anchorIndex.value = visibleIndex;
  } else {
    current.clear();
    current.add(item.id);
    anchorIndex.value = visibleIndex;
  }

  selectedComponentIds.value = Array.from(current);
};

const focusComponent = (component) => {
  if (!component) {
    return;
  }
  selectedComponentIds.value = [component.id];
  componentId.value = component.id;
};

const setInsertTarget = (direction) => {
  if (!selectedComponentIds.value.length) {
    return;
  }
  const targetId =
    direction === "up"
      ? selectedComponentIds.value[0]
      : selectedComponentIds.value[selectedComponentIds.value.length - 1];
  position.value = direction === "up" ? "up" : "down";
  positionId.value = targetId;
  isNewComponent.value = true;
};

const setInsertTargetForItem = (component, direction) => {
  if (!component) {
    return;
  }
  position.value = direction === "up" ? "up" : "down";
  positionId.value = component.id;
  isNewComponent.value = true;
};

const setSelection = (ids, anchor = null) => {
  selectedComponentIds.value = Array.from(new Set(ids.filter(Boolean)));
  if (anchor !== null) {
    anchorIndex.value = anchor;
  }
};

const selectAllVisible = () => {
  const ids = visibleComponents.value
    .map((component) => component.id)
    .filter(Boolean);
  setSelection(ids, 0);
};

const componentListIds = () =>
  programComponents.value.map((component) => component.id);

const getAppComponent = () =>
  programComponents.value.find((component) => component.name === "App");

const getAppChildren = () => getAppComponent()?.template?.children ?? [];

const findChildIndexByComponentName = (name) => {
  const children = getAppChildren();
  return children.findIndex(
    (child) =>
      child?.type === "ComponentTemplate" && child?.component?.name === name
  );
};

const duplicateComponent = (component) => {
  if (!component || component.name === "App") {
    return;
  }

  const program = reka.value.program.components;
  const appComponent = getAppComponent();

  let cloneId = null;

  reka.value.change(() => {
    const index = program.findIndex((item) => item.id === component.id);
    if (index === -1) {
      return;
    }

    const clone = t.clone(component, { replaceExistingId: true });
    clone.name = ensureUniqueComponentName(component.name, reka.value);
    program.splice(index + 1, 0, clone);

    if (appComponent) {
      const childIndex = findChildIndexByComponentName(component.name);
      if (childIndex !== -1) {
        const template = t.componentTemplate({
          component: getIdentifierFromStr(clone.name),
          props: [],
          children: [],
        });
        appComponent.template.children.splice(childIndex + 1, 0, template);
      }
    }

    cloneId = clone.id;
  });

  if (cloneId) {
    nextTick(() => {
      setSelection([cloneId]);
    });
  }
};

const duplicateSelection = () => {
  if (!actionableSelectionIds.value.length) {
    return;
  }

  const program = reka.value.program.components;
  const appComponent = getAppComponent();
  const idToIndex = new Map(
    program.map((component, index) => [component.id, index])
  );

  const sortedSelection = [...actionableSelectionIds.value].sort(
    (a, b) => idToIndex.get(b) - idToIndex.get(a)
  );

  const createdIds = [];

  reka.value.change(() => {
    for (const id of sortedSelection) {
      const index = program.findIndex((component) => component.id === id);
      if (index === -1) {
        continue;
      }
      const component = program[index];
      if (!component || component.name === "App") {
        continue;
      }

      const clone = t.clone(component, { replaceExistingId: true });
      clone.name = ensureUniqueComponentName(component.name, reka.value);
      program.splice(index + 1, 0, clone);
      createdIds.push(clone.id);

      if (appComponent) {
        const childIndex = findChildIndexByComponentName(component.name);
        if (childIndex !== -1) {
          const template = t.componentTemplate({
            component: getIdentifierFromStr(clone.name),
            props: [],
            children: [],
          });
          appComponent.template.children.splice(childIndex + 1, 0, template);
        }
      }
    }
  });

  if (createdIds.length) {
    nextTick(() => {
      setSelection(createdIds);
    });
  }
};

const deleteComponent = (component) => {
  if (!component || component.name === "App") {
    return;
  }

  const program = reka.value.program.components;
  const appComponent = getAppComponent();
  const frame = reka.value.frames.find(
    (frameInstance) => frameInstance.id === component.name
  );

  reka.value.change(() => {
    const index = program.indexOf(component);
    if (index !== -1) {
      program.splice(index, 1);
    }
    if (appComponent) {
      const childIndex = findChildIndexByComponentName(component.name);
      if (childIndex !== -1) {
        appComponent.template.children.splice(childIndex, 1);
      }
    }
  });

  if (frame) {
    reka.value.removeFrame(frame);
  }

  selectedComponentIds.value = selectedComponentIds.value.filter(
    (id) => id !== component.id
  );
};

const deleteSelection = () => {
  if (!actionableSelectionIds.value.length) {
    return;
  }

  const idsToRemove = new Set(actionableSelectionIds.value);
  const program = reka.value.program.components;
  const appComponent = getAppComponent();
  const componentsToRemove = program.filter((component) =>
    idsToRemove.has(component.id)
  );
  const namesToRemove = new Set(
    componentsToRemove.map((component) => component.name)
  );

  reka.value.change(() => {
    for (let index = program.length - 1; index >= 0; index -= 1) {
      const component = program[index];
      if (idsToRemove.has(component.id) && component.name !== "App") {
        program.splice(index, 1);
      }
    }

    if (appComponent) {
      for (
        let index = appComponent.template.children.length - 1;
        index >= 0;
        index -= 1
      ) {
        const child = appComponent.template.children[index];
        const name = child?.component?.name;
        if (name && namesToRemove.has(name)) {
          appComponent.template.children.splice(index, 1);
        }
      }
    }
  });

  componentsToRemove.forEach((component) => {
    const frame = reka.value.frames.find(
      (frameInstance) => frameInstance.id === component.name
    );
    if (frame) {
      reka.value.removeFrame(frame);
    }
  });

  selectedComponentIds.value = [];
};

const swapAppChildren = (nameA, nameB) => {
  const children = getAppChildren();
  const indexA = findChildIndexByComponentName(nameA);
  const indexB = findChildIndexByComponentName(nameB);
  if (indexA === -1 || indexB === -1) {
    return;
  }
  [children[indexA], children[indexB]] = [children[indexB], children[indexA]];
};

const moveSelection = (direction) => {
  if (!actionableSelectionIds.value.length) {
    return;
  }

  const ids = new Set(actionableSelectionIds.value);
  const program = reka.value.program.components;

  reka.value.change(() => {
    if (direction === "up") {
      for (let index = 1; index < program.length; index += 1) {
        const current = program[index];
        const previous = program[index - 1];
        if (ids.has(current.id) && !ids.has(previous.id)) {
          [program[index - 1], program[index]] = [
            program[index],
            program[index - 1],
          ];
          swapAppChildren(current.name, previous.name);
        }
      }
    } else if (direction === "down") {
      for (let index = program.length - 2; index >= 0; index -= 1) {
        const current = program[index];
        const next = program[index + 1];
        if (ids.has(current.id) && !ids.has(next.id)) {
          [program[index + 1], program[index]] = [
            program[index],
            program[index + 1],
          ];
          swapAppChildren(current.name, next.name);
        }
      }
    }
  });
};

const sendSelectionToEdge = (positionEdge) => {
  if (!actionableSelectionIds.value.length) {
    return;
  }

  const ids = new Set(actionableSelectionIds.value);
  const program = reka.value.program.components;
  const appComponent = getAppComponent();

  reka.value.change(() => {
    const selected = program.filter((component) => ids.has(component.id));
    const others = program.filter((component) => !ids.has(component.id));

    const newOrder =
      positionEdge === "start"
        ? [...selected, ...others]
        : [...others, ...selected];

    program.splice(0, program.length, ...newOrder);

    if (appComponent) {
      const children = appComponent.template.children;
      const selectedNames = new Set(
        selected.map((component) => component.name)
      );
      const selectedChildren = children.filter((child) =>
        selectedNames.has(child?.component?.name)
      );
      const otherChildren = children.filter(
        (child) => !selectedNames.has(child?.component?.name)
      );
      const newChildren =
        positionEdge === "start"
          ? [...selectedChildren, ...otherChildren]
          : [...otherChildren, ...selectedChildren];
      children.splice(0, children.length, ...newChildren);
    }
  });
};

const shuffleSelection = () => {
  if (actionableSelectionIds.value.length < 2) {
    return;
  }

  const ids = new Set(actionableSelectionIds.value);
  const program = reka.value.program.components;
  const appComponent = getAppComponent();

  reka.value.change(() => {
    const selected = program.filter((component) => ids.has(component.id));
    const shuffled = selected.slice().sort(() => Math.random() - 0.5);

    let shuffleIndex = 0;
    for (let index = 0; index < program.length; index += 1) {
      if (ids.has(program[index].id)) {
        program[index] = shuffled[shuffleIndex];
        shuffleIndex += 1;
      }
    }

    if (appComponent) {
      const selectedNames = new Set(
        selected.map((component) => component.name)
      );
      const targetOrder = program
        .filter((component) => selectedNames.has(component.name))
        .map((component) => component.name);

      const children = appComponent.template.children;
      const orderedChildren = [];
      const remainingChildren = [];

      children.forEach((child) => {
        const name = child?.component?.name;
        if (name && selectedNames.has(name)) {
          orderedChildren.push(child);
        } else {
          remainingChildren.push(child);
        }
      });

      orderedChildren.sort(
        (a, b) =>
          targetOrder.indexOf(a.component?.name) -
          targetOrder.indexOf(b.component?.name)
      );

      appComponent.template.children.splice(
        0,
        appComponent.template.children.length,
        ...orderedChildren,
        ...remainingChildren
      );
    }
  });
};

const insertComponentIntoProgram = (component, dropMeta) => {
  const targetId = dropMeta?.targetId ?? positionId.value ?? null;
  const placement = dropMeta?.position ?? position.value ?? "down";
  const program = reka.value.program.components;
  const referenceComponent = targetId
    ? program.find((entry) => entry.id === targetId)
    : null;
  const referenceIndex = referenceComponent
    ? program.findIndex((entry) => entry.id === referenceComponent.id)
    : -1;
  const insertionIndex =
    referenceIndex === -1
      ? program.length
      : placement === "up"
      ? referenceIndex
      : placement === "down"
      ? referenceIndex + 1
      : referenceIndex + 1;

  reka.value.change(() => {
    program.splice(insertionIndex, 0, component);
    const appComponent = program.find((entry) => entry.name === "App");

    if (!appComponent) {
      return;
    }

    const node = t.componentTemplate({
      component: getIdentifierFromStr(component.name),
      props: [],
      children: [],
    });

    if (placement === "child" && dropMeta?.templateId) {
      const targetTemplate = reka.value.getNodeFromId(
        dropMeta.templateId,
        t.Template
      );
      if (targetTemplate instanceof t.SlottableTemplate) {
        targetTemplate.children.push(node);
        return;
      }
      if (targetTemplate && targetTemplate.children) {
        targetTemplate.children.push(node);
        return;
      }
    }

    const children = appComponent.template.children;

    if (!referenceComponent) {
      children.push(node);
      return;
    }

    const templateIndex = children.findIndex(
      (child) => child.component?.name === referenceComponent.name
    );
    const templateInsertionIndex =
      templateIndex === -1
        ? children.length
        : placement === "up"
        ? templateIndex
        : templateIndex + 1;

    children.splice(templateInsertionIndex, 0, node);
  });

  setSelection([component.id], null);
  positionId.value = null;
  position.value = "down";
  selectedComponentCategoryId.value = null;
  isOpenComponent.value = false;
};

const addComponent = (payload) => {
  if (!payload) {
    return;
  }

  if (payload instanceof t.Component) {
    const cloneWithNewId = t.clone(payload, {
      replaceExistingId: true,
    });
    insertComponentIntoProgram(cloneWithNewId);
    return;
  }

  const component = createComponentFromDragPayload(payload.payload, reka.value);

  if (!(component instanceof t.Component)) {
    return;
  }

  insertComponentIntoProgram(component, payload.dropMeta);
};

watch(
  componentCategories,
  (categories) => {
    const availableIds = new Set(categories.map((category) => category.id));
    if (pinnedComponentCategoryIds.value.some((id) => !availableIds.has(id))) {
      pinnedComponentCategoryIds.value =
        pinnedComponentCategoryIds.value.filter((id) => availableIds.has(id));
    }
  },
  { immediate: true }
);

watch(
  savedComponentFilters,
  (filters) => {
    const unique = [];
    const seen = new Set();
    for (const filter of filters) {
      if (!filter || !filter.query) {
        continue;
      }
      if (seen.has(filter.query)) {
        continue;
      }
      seen.add(filter.query);
      const sample =
        filter.sampleComponentId && componentById(filter.sampleComponentId)
          ? componentById(filter.sampleComponentId)
          : visibleComponents.value.find((component) =>
              (component?.name ?? "")
                .toLowerCase()
                .includes(filter.query.toLowerCase())
            );
      const thumbnail =
        filter.thumbnail ??
        sample?.meta?.thumbnail ??
        deriveFilterThumbnail({
          query: filter.query,
          sampleComponentId: sample?.id ?? filter.sampleComponentId,
        });
      unique.push({
        id:
          filter.id ??
          `${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 6)}`,
        label: filter.label ?? filter.query,
        query: filter.query,
        sampleComponentId: sample?.id ?? filter.sampleComponentId ?? null,
        thumbnail: thumbnail ?? null,
      });
    }
    if (unique.length !== filters.length) {
      savedComponentFilters.value = unique.slice(-12);
    } else if (unique.length > 12) {
      savedComponentFilters.value = unique.slice(-12);
    }
  },
  { deep: true, immediate: true }
);

watch(visibleComponents, () => {
  const available = new Set(componentListIds());
  const filtered = selectedComponentIds.value.filter((id) => available.has(id));
  if (filtered.length !== selectedComponentIds.value.length) {
    selectedComponentIds.value = filtered;
  }
});

watch(
  () => selectedComponentIds.value,
  (ids) => {
    const first = ids[0] ?? null;
    if (first !== componentId.value) {
      componentId.value = first;
    }
  },
  { immediate: true }
);

watch(componentId, (id) => {
  if (!id) {
    return;
  }
  if (!selectionSet.value.has(id)) {
    selectedComponentIds.value = [id];
  }
});

watch(filteredCategories, (categories) => {
  if (
    selectedComponentCategoryId.value &&
    !categories.some(
      (category) => category.id === selectedComponentCategoryId.value
    )
  ) {
    selectedComponentCategoryId.value = null;
    isOpenComponent.value = false;
  }
});

watch(activeCategory, (category) => {
  if (!category) {
    isOpenComponent.value = false;
  }
});

watch(filteredCategoryComponents, (items) => {
  if (isOpenComponent.value && items.length === 0) {
    isOpenComponent.value = false;
  }
});

const handleKeydown = (event) => {
  if (!sidebarHasFocus.value) {
    return;
  }

  const tagName = event.target?.tagName?.toLowerCase?.();
  if (["input", "textarea", "select"].includes(tagName)) {
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
    event.preventDefault();
    selectAllVisible();
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
    event.preventDefault();
    duplicateSelection();
    return;
  }

  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    deleteSelection();
    return;
  }

  if (event.altKey && !event.shiftKey && event.key === "ArrowUp") {
    event.preventDefault();
    moveSelection("up");
    return;
  }

  if (event.altKey && !event.shiftKey && event.key === "ArrowDown") {
    event.preventDefault();
    moveSelection("down");
    return;
  }

  if (
    (event.metaKey || event.ctrlKey) &&
    event.shiftKey &&
    event.key === "ArrowUp"
  ) {
    event.preventDefault();
    sendSelectionToEdge("start");
    return;
  }

  if (
    (event.metaKey || event.ctrlKey) &&
    event.shiftKey &&
    event.key === "ArrowDown"
  ) {
    event.preventDefault();
    sendSelectionToEdge("end");
  }

  if (
    !event.shiftKey &&
    !event.metaKey &&
    !event.ctrlKey &&
    event.key === "i"
  ) {
    event.preventDefault();
    setInsertTarget("down");
  }

  if (
    event.shiftKey &&
    !event.metaKey &&
    !event.ctrlKey &&
    event.key.toLowerCase() === "i"
  ) {
    event.preventDefault();
    setInsertTarget("up");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

const groupArray = (array, groupSize) => {
  const result = [];
  for (let index = 0; index < array.length; index += groupSize) {
    result.push(array.slice(index, index + groupSize));
  }
  return result;
};
</script>

<style scoped>
.stagger-enter-active,
.stagger-leave-active {
  transition: all 0.18s ease-out;
}

.stagger-enter-from,
.stagger-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.sidebar-flyout-enter-active,
.sidebar-flyout-leave-active {
  transition: transform 0.22s ease, opacity 0.18s ease;
}

.sidebar-flyout-enter-from,
.sidebar-flyout-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.filter-card {
  @apply min-w-[160px] max-w-[220px];
}

.toolbar-enter-active,
.toolbar-leave-active {
  transition: all 0.2s ease;
}

.toolbar-enter-from,
.toolbar-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toolbar-btn {
  @apply inline-flex items-center justify-center rounded-md border border-transparent bg-white px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-40;
}

.row-btn {
  @apply inline-flex items-center justify-center rounded-md border border-transparent bg-white p-1 text-slate-400 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-600 disabled:pointer-events-none disabled:opacity-40;
}
</style>
