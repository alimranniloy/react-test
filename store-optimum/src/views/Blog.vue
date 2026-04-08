<template>
  <div>
    <section
      class="relative bg-gradient-to-br from-gray-900 to-slate-950 font-sans overflow-hidden py-20 lg:py-28"
    >
      <div class="mx-auto px-4 w-full sm:container">
        <!-- Main Grid Layout -->
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full"
        >
          <!-- Left Column: Content -->
          <div class="text-center lg:text-left sm:py-0 py-2">
            <!-- "Our Blogs" Tag -->
            <div
              class="inline-block bg-yellow-200 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-md mb-4"
            >
              Our Blogs
            </div>

            <!-- Main Heading -->
            <h1
              class="text-4xl md:text-5xl font-extrabold text-slate-300 leading-tight mb-6"
            >
              Get updated with latest development news and events
            </h1>

            <!-- Description -->
            <p class="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 mb-8">
              Looking for top-tier IT staff augmentation service? Bponi has you
              covered. We offer comprehensive solutions.
            </p>

            <!-- Email Subscription Form -->
            <!-- <form
            @submit.prevent="handleSubscription"
            class="flex flex-col sm:flex-row gap-3 max-w-fit mx-auto lg:mx-0"
          >
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email"
              required
              class="flex-grow w-full px-4 py-1 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow"
            />
            <button
              type="submit"
              class="bg-amber-300 hover:bg-amber-400 text-white font-bold py-1 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Get started
            </button>
          </form> -->

            <!-- Privacy Notice -->
            <!-- <p class="text-xs text-gray-500 mt-3 max-w-md mx-auto lg:mx-0">
            We care about your data in our
            <a href="#" class="underline hover:text-amber-400">privacy policy</a
            >.
          </p> -->
          </div>

          <!-- Right Column: Image Collage -->
          <div class="grid grid-cols-2 grid-rows-2 gap-4 h-96">
            <!-- Tech Stack Card -->
            <div
              class="bg-amber-100 rounded-3xl p-6 flex flex-col justify-center items-center text-center"
            >
              <p class="font-semibold text-amber-400">Tech Stack</p>
              <p class="text-6xl font-extrabold text-amber-500 mt-2">5+</p>
            </div>

            <!-- Image 1 -->
            <div class="overflow-hidden rounded-tr-3xl rounded-bl-3xl">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                alt="Team collaborating"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Image 2 -->
            <div class="overflow-hidden rounded-bl-3xl rounded-tr-3xl">
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop"
                alt="Professional team member"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Image 3 -->
            <div class="overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2132&auto=format&fit=crop"
                alt="Team meeting"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="bg-[#100320] text-white font-sans">
      <div class="sm:container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <!-- Section Header -->
        <div class="text-center lg:text-left mb-12">
          <h1 class="text-4xl md:text-5xl font-bold">Resources and blogs</h1>
          <p class="text-gray-400 mt-2">
            The latest industry news, interviews, technologies, and resources.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <aside class="col-span-1">
            <div class="sticky top-20">
              <div class="relative mb-8">
                <input
                  v-model="searchBlog"
                  type="text"
                  placeholder="Search"
                  class="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
              </div>
              <div class="block sm:hidden">
                <Listbox
                  v-model="selectedCategory"
                  @update:modelValue="selectCategory"
                >
                  <div class="relative">
                    <ListboxButton
                      class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg text-left flex justify-between items-center"
                    >
                      Blog Categories
                      <svg
                        class="h-4 w-4 ml-2 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </ListboxButton>

                    <ListboxOptions
                      class="mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg"
                    >
                      <ListboxOption
                        v-for="category in subCategories"
                        :key="category.id"
                        :value="category"
                        class="px-4 py-2 cursor-pointer hover:bg-gray-800"
                      >
                        {{ category.title }}
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
              <div class="hidden sm:block">
                <h2 class="text-lg font-semibold mb-4">Blog Categories</h2>
                <ul v-if="loadingSubCategories" class="animate-pulse">
                  <li
                    v-for="n in 5"
                    :key="n"
                    class="h-8 bg-gray-700 rounded-lg mb-6"
                  ></li>
                </ul>
                <ul v-else>
                  <li
                    v-for="category in subCategories"
                    :key="category"
                    @click="selectCategory(category)"
                    :class="[
                      'px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 mb-2',
                      selectedCategory === category
                        ? 'bg-amber-500 text-white'
                        : 'hover:bg-gray-800',
                    ]"
                  >
                    {{ category.title }}
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <main class="col-span-1 lg:col-span-3">
            <div
              v-if="loading"
              class="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-8 animate-pulse"
            >
              <div
                v-for="n in 4"
                :key="n"
                class="bg-[#1a0f2e] rounded-xl overflow-hidden flex flex-col"
              >
                <div class="h-56 bg-gray-700"></div>

                <div class="p-6 flex flex-col flex-grow">
                  <div class="h-3 w-1/4 bg-gray-600 rounded mb-4"></div>

                  <div class="h-4 w-3/4 bg-gray-500 rounded mb-3"></div>

                  <div class="h-3 w-full bg-gray-600 rounded mb-2"></div>
                  <div class="h-3 w-5/6 bg-gray-600 rounded"></div>

                  <div
                    class="flex items-center mt-6 pt-4 border-t border-gray-800 gap-4"
                  >
                    <div class="w-10 h-10 bg-gray-600 rounded-full"></div>
                    <div class="flex flex-col gap-2 flex-grow">
                      <div class="h-3 w-1/2 bg-gray-600 rounded"></div>
                      <div class="h-3 w-1/3 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else-if="filteredPosts.length > 0"
              class="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-8"
            >
              <router-link
                v-for="post in filteredPosts"
                :key="post.title"
                class="bg-[#1a0f2e] rounded-xl overflow-hidden transition-shadow duration-300 flex flex-col"
                :to="`/blog/${post.slug}-${post.id}`"
              >
                <div class="relative">
                  <img
                    :src="`https://placehold.co/40x40/FCD34D/ffffff?text=${
                      getCategoryTitles(post.subCategories)[0]
                    }`"
                    :alt="post.title"
                    class="w-full h-40 object-cover"
                  />
                  <span
                    class="absolute top-4 right-4 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-md"
                    >{{ post.tag }}</span
                  >
                </div>
                <div class="p-6 flex flex-col flex-grow">
                  <p class="text-sm text-amber-400 font-semibold">
                    {{ getCategoryTitles(post.subCategories)[0] }}
                  </p>
                  <h3 class="text-xl font-bold mt-2 flex-grow">
                    {{ post.title }}
                  </h3>
                  <p class="text-gray-400 mt-2 text-sm">
                    {{ post.description.split(" ").slice(0, 15).join(" ")
                    }}{{ post.description.split(" ").length > 15 ? "..." : "" }}
                  </p>

                  <div
                    class="flex items-center mt-6 pt-4 border-t border-gray-800"
                  >
                    <img
                      src="https://placehold.co/40x40/FCD34D/000000?text=B"
                      alt="Author"
                      class="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p class="font-semibold text-sm">Bponi</p>
                      <p class="text-xs text-gray-500">{{ post.date }}</p>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
            <div v-else class="text-center py-20">
              <p class="text-gray-400">No posts found for this category.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { WEB_CONTENTS } from "@/gql/content";
import { WEB_CATEGORIES } from "@/gql/webCategory";
import { WEB_SUB_CATEGORIES } from "@/gql/webSubCategory";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const email = ref("");
const searchBlog = ref("");

const handleSubscription = () => {
  if (email.value) {
    console.log("Subscribed with email:", email.value);
    alert(`Thank you for subscribing with ${email.value}!`);
    email.value = "";
  }
};

const { result, fetchMore, loading, error, refetch } = useQuery(WEB_CONTENTS, {
  siteId: 16284,
});

const posts = computed(() => {
  if (!result.value || !result.value.webContents?.edges) return [];
  return result.value.webContents.edges.map((edge) => edge.node);
});

const getCategoryTitles = (cats) => {
  return cats
    .map((id) => subCategories.value.find((cat) => cat.id === id)?.title)
    .filter(Boolean);
};

const {
  result: subCategoriesResult,
  fetchMore: fetchMoreSubCategories,
  loading: loadingSubCategories,
  error: errorSubCategories,
  refetch: refetchSubCategories,
} = useQuery(WEB_SUB_CATEGORIES, {
  siteId: 16284,
});

const extraCategories = [{ id: 0, title: "All Categories" }];

const subCategories = computed(() => {
  const baseCategories =
    subCategoriesResult.value?.webSubCategories?.edges?.map(
      (edge) => edge.node
    ) ?? [];

  return [...extraCategories, ...baseCategories];
});

const {
  result: categoriesResult,
  fetchMore: fetchMoreCategories,
  loading: loadingCategories,
  error: errorCategories,
  refetch: refetchCategories,
} = useQuery(WEB_CATEGORIES, {
  siteId: 16284,
});

const categories = computed(() => {
  if (!categoriesResult.value || !categoriesResult.value.webCategories?.edges)
    return [];

  return categoriesResult.value.webCategories.edges.map((edge) => edge.node);
});

const selectedCategory = ref("All Categories");

const selectCategory = (category) => {
  selectedCategory.value = category;
};

watch(
  searchBlog,
  (newVal) => {
    if (newVal.length >= 2 || newVal.length === 0) {
      refetch({
        siteId: 16284,
        searchQuery: newVal,
      });
    }
  },
  { immediate: false }
);

const filteredPosts = computed(() => {
  if (!selectedCategory.value.id) {
    return posts.value;
  }

  return posts.value.filter((post) => {
    if (
      typeof post.subCategories === "string" ||
      typeof post.subCategories === "number"
    ) {
      return post.subCategories === selectedCategory.value.id;
    }

    if (Array.isArray(post.subCategories)) {
      return post.subCategories.includes(selectedCategory.value.id);
    }

    return false;
  });
});
</script>

<style scoped>
/* Scoped styles can be added here if needed, but Tailwind handles most styling. */
</style>
