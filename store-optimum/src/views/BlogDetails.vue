<template>
  <div
    class="relative bg-gradient-to-br from-gray-900 to-slate-950 font-sans overflow-hidden pt-10"
    v-if="loading && !post"
  >
    <section
      class="relative mt-12 font-sans overflow-hidden text-white min-h-[450px] flex items-center justify-center"
    >
      <div class="absolute inset-0 bg-gray-800"></div>
      <div
        class="max-w-5xl w-full mx-auto px-6 text-center animate-pulse relative z-10"
      >
        <div class="flex flex-wrap justify-center gap-2 mb-6">
          <span
            v-for="i in 3"
            :key="i"
            class="h-6 w-20 bg-amber-300/30 rounded-full"
          ></span>
        </div>

        <div class="mx-auto h-8 sm:h-10 bg-gray-600 rounded w-3/4 mb-4"></div>

        <div class="space-y-2 hidden sm:block">
          <div class="mx-auto h-4 bg-gray-700 rounded w-2/3"></div>
          <div class="mx-auto h-4 bg-gray-700 rounded w-1/2"></div>
        </div>

        <div
          class="mt-6 flex justify-center items-center space-x-6 text-sm opacity-75"
        >
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-gray-600"></div>
            <div class="h-4 w-16 bg-gray-700 rounded"></div>
          </div>
          <div class="h-4 w-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-6 sm:py-16 py-8 animate-pulse">
      <div class="space-y-4">
        <div v-for="i in 16" :key="i" class="h-4 bg-gray-700 rounded"></div>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-6 pb-12 animate-pulse">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="i in 5"
          :key="i"
          class="h-6 w-16 bg-gray-300 rounded-full"
        ></div>
      </div>
    </div>

    <section class="bg-gray-100 py-12 animate-pulse">
      <div class="max-w-6xl mx-auto px-6">
        <div class="h-6 w-48 bg-gray-300 rounded mb-8"></div>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-white rounded-xl shadow p-5 space-y-4"
          >
            <div class="w-full h-40 bg-gray-300 rounded-lg"></div>
            <div class="h-4 w-3/4 bg-gray-300 rounded"></div>
            <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
            <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div class="h-4 w-24 bg-gray-300 rounded mt-4"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div
    class="relative bg-gradient-to-br from-gray-900 to-slate-950 font-sans overflow-hidden pt-10"
    v-else-if="!loading && post"
  >
    <section
      class="relative mt-12 font-sans overflow-hidden text-white min-h-[450px]"
      :style="{
        backgroundImage: `url(${
          backendUrl + post.image ||
          'https://placehold.co/1200x450/1a0f2e/ffffff?text=No+Image'
        })`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }"
    >
      <div class="absolute inset-0 bg-black/10"></div>
    </section>

    <section class="blog-header bg-gray-800 px-2">
      <!-- optional bg to make white text visible -->
      <div class="max-w-5xl w-full mx-auto py-10 text-left text-white">
        <!-- text-left + text-white -->

        <!-- Categories -->
        <span
          v-for="(category, index) in post.subCategoryTitles"
          :key="index"
          class="bg-amber-400 text-black px-4 py-1 rounded-full text-sm font-semibold mr-2"
        >
          {{ category }}
        </span>

        <!-- Title -->
        <h1 class="mt-6 text-2xl md:text-4xl font-bold leading-tight z-20">
          {{ post.title }}
        </h1>

        <!-- Description -->
        <p class="mt-4 text-lg opacity-80 sm:block hidden">
          {{ useTruncateWords(post?.description, 50) }}
        </p>

        <!-- Author & Date -->
        <div
          class="mt-6 flex justify-start items-center space-x-6 text-sm opacity-75"
        >
          <div class="author flex items-center gap-2">
            <img
              src="https://placehold.co/30x30/FCD34D/000000?text=B"
              alt="Author"
              class="w-6 h-6 rounded-full"
            />
            <span>Bponi</span>
          </div>
          <span class="flex items-center gap-1">
            <CalendarDaysIcon class="w-5 h-5" />
            {{ post.createdAtFormatted }}
          </span>
        </div>

        <!-- Share Buttons -->
        <div class="flex space-x-3 justify-start mt-5">
          <div
            class="facebook-share w-8 h-8 cursor-pointer"
            @click="shareFacebook"
          >
            <img
              src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/56b3745c-1c2e-44d9-aa57-98bb19669c32.png"
              alt="facebook share"
            />
          </div>

          <div
            class="twitter-share w-8 h-8 cursor-pointer"
            @click="shareTwitter"
          >
            <img
              src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/4c4e3be0-bd7e-4a7d-8b10-eaa40143785a.png"
              alt="twitter share"
            />
          </div>
        </div>
      </div>
    </section>

    <section
      class="blog-html-content max-w-5xl mx-auto sm:py-16 py-8 text-white px-2"
    >
      <div v-html="post.htmlContent"></div>
    </section>

    <div class="max-w-5xl mx-auto pb-12">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(tag, i) in post.tags"
          :key="i"
          class="px-4 py-1 bg-indigo-100 text-amber-700 rounded-full text-sm font-medium"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { WEB_CONTENT_PREVIEW } from "@/gql/content";
import { WEB_SUB_CATEGORIES } from "@/gql/webSubCategory";
import {
  ArrowUturnRightIcon,
  CalendarDaysIcon,
} from "@heroicons/vue/24/outline";

import { useRoute } from "vue-router";

const route = useRoute();

const postId = computed(() => {
  const slug = route.params.slug;
  if (!slug) return null;
  const parts = slug.split("-");
  const id = parseInt(parts.pop());
  return isNaN(id) ? null : id;
});

const backendUrl = "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/";

const currentUrl = window.location.href;

const shareFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;
  window.open(url, "_blank", "width=600,height=400");
};

const shareTwitter = () => {
  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    currentUrl
  )}&text=Check this out!`;
  window.open(url, "_blank", "width=600,height=400");
};
const tags = ref([
  { id: 1, title: "E-commerce" },
  { id: 2, title: "Marketplace" },
  { id: 3, title: "Payment Gateway" },
  { id: 4, title: "Point of Sale (POS)" },
  { id: 5, title: "Inventory Management" },
  { id: 6, title: "Order Management" },
  { id: 7, title: "Logistics & Delivery" },
  { id: 8, title: "ERP Solutions" },
  { id: 9, title: "Customer Relationship Management (CRM)" },
  { id: 10, title: "Learning Management System (LMS)" },
  { id: 11, title: "Online Exams & Quizzes" },
  { id: 12, title: "Content Management" },
  { id: 13, title: "Analytics & Reporting" },
  { id: 14, title: "Mobile App Development" },
  { id: 15, title: "Web App Development" },
  { id: 16, title: "API Integration" },
  { id: 17, title: "Cloud Solutions" },
  { id: 18, title: "Data Security" },
  { id: 19, title: "UI/UX Design" },
  { id: 20, title: "Custom Software Development" },
]);

const { result, fetchMore, loading, error, refetch } = useQuery(
  WEB_CONTENT_PREVIEW,
  {
    id: postId.value,
  }
);

const {
  result: subCategoriesResult,
  fetchMore: fetchMoreSubCategories,
  loading: loadingSubCategories,
  error: errorSubCategories,
  refetch: refetchSubCategories,
} = useQuery(WEB_SUB_CATEGORIES, {
  siteId: 16284,
});

const subCategoriesList = computed(() => {
  if (
    !subCategoriesResult.value ||
    !subCategoriesResult.value.webSubCategories?.edges
  )
    return [];
  return subCategoriesResult.value.webSubCategories.edges.map(
    (edge) => edge.node
  );
});

const post = computed(() => {
  if (!result.value?.webContent) return null;

  const p = result.value.webContent;

  // Convert blocks to HTML
  const htmlContent = p.html?.blocks
    ?.map((block) => {
      if (block.type === "header")
        return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
      if (block.type === "paragraph") return `<p>${block.data.text}</p>`;
      return "";
    })
    .join("");

  return {
    ...p,

    subCategoryTitles: p.subCategories
      .map((id) => subCategoriesList.value.find((sc) => sc.id === id)?.title)
      .filter(Boolean),
    tags: p.tags
      .map((id) => tags.value.find((t) => t.id === id)?.title)
      .filter(Boolean),
    createdAtFormatted: new Date(p.createdAt).toLocaleDateString(),
    updatedAtFormatted: new Date(p.updatedAt).toLocaleDateString(),
    htmlContent,
  };
});

const relatedBlogs = ref([
  {
    title: "How Headless Commerce is Transforming Retail",
    excerpt:
      "Discover how headless commerce allows for greater flexibility and customization.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Why Microservices Are the Future of Web Development",
    excerpt:
      "Breaking down applications into microservices enables faster innovation.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "The Role of AI in Modern E-Commerce",
    excerpt:
      "AI is changing how businesses interact with customers in online retail.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
]);

watch(postId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
    window.location.reload();
  }
});

function useTruncateWords(text = "", limit = 50) {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}
</script>

<style>
.prose img {
  border-radius: 12px;
  margin: 1.5rem 0;
}
.blog-html-content p {
  padding: 10px 0;
}
</style>
