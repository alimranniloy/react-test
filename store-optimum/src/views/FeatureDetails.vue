<template>
  <div
    class="bg-gray-50 dark:bg-gray-900 font-sans leading-normal tracking-normal"
  >
    <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <article
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <div>
          <img
            class="w-full h-64 sm:h-80 object-cover"
            :src="post.featuredImage"
            alt="Featured image for the blog post"
          />
        </div>

        <div class="p-6 sm:p-8">
          <header class="mb-6">
            <div class="flex items-center mb-4">
              <a
                href="#"
                class="text-indigo-600 dark:text-indigo-400 uppercase font-semibold text-sm tracking-wide hover:underline"
                >{{ post.category }}</a
              >
            </div>
            <h1
              class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3"
            >
              {{ post.title }}
            </h1>
            <div
              class="flex items-center text-sm text-gray-500 dark:text-gray-400"
            >
              <img
                class="w-10 h-10 rounded-full mr-4"
                :src="post.author.avatar"
                alt="Author avatar"
              />
              <div>
                <p class="font-semibold text-gray-800 dark:text-gray-200">
                  {{ post.author.name }}
                </p>
                <p>
                  <time :datetime="post.publishedDate">{{
                    post.publishedDate
                  }}</time>
                  <span class="mx-1">&middot;</span>
                  <span>{{ post.readTime }}</span>
                </p>
              </div>
            </div>
          </header>

          <div
            class="prose prose-lg dark:prose-invert max-w-none prose-indigo prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl"
            v-html="post.content"
          ></div>

          <footer
            class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div class="flex items-center space-x-2">
                <span class="font-semibold text-gray-700 dark:text-gray-300"
                  >Share this post:</span
                >
                <a
                  href="#"
                  class="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                >
                  <svg
                    class="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  class="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                >
                  <svg
                    class="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </article>

      <section class="mt-10">
        <div
          class="flex bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 items-start"
        >
          <img
            class="w-16 h-16 rounded-full mr-6"
            :src="post.author.avatar"
            alt="Author avatar"
          />
          <div>
            <h3
              class="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-1"
            >
              About the author
            </h3>
            <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ post.author.name }}
            </h4>
            <p class="text-gray-600 dark:text-gray-300">
              {{ post.authorBio }}
            </p>
          </div>
        </div>
      </section>

      <section class="mt-10">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Comments
          </h2>
          <div class="text-center text-gray-500 dark:text-gray-400">
            <p>Comments are loading...</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Mock data for a reseller themed blog post. Replace with API data in production.
const post = ref({
  category: "Commerce",
  title: "How to launch a reseller-first business in India",
  author: {
    name: "Aisha Rahman",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  publishedDate: "October 16, 2025",
  readTime: "7 min read",
  featuredImage:
    "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=1770",
  content: `
    <p class="lead">Dreaming about launching an online business without needing a warehouse? Reselling is still one of the fastest ways to test the market and build a brand without touching inventory. In this playbook we break down how modern Indian founders are doing it.</p>
    <p>From Facebook communities to full-fledged storefronts, the reseller model has matured. Today most successful teams run on a mix of social discovery, Optimum Soft’s storefront themes, and embedded logistics partners. The best part: you can start with a curated catalog and expand as demand grows.</p>
    <h3 class="heading">Step 1 · Pick a niche and audience</h3>
    <p>Use simple customer interviews to understand what people already buy online and where they feel underserved. We often see fashion basics, wellness accessories, and educational kits perform well when paired with a strong narrative.</p>
    <h3 class="heading">Step 2 · Secure suppliers and fulfillment</h3>
    <p>Lock down two reliable suppliers plus one backup. Their product photography, specs, and SLA become the backbone of your site. Optimum Soft’s logistics network lets you route orders through partner hubs so delivery windows are clear from day one.</p>
    <h3 class="heading">Step 3 · Launch a branded experience</h3>
    <p>Spin up a storefront using the Optimum Commerce OS template. Customize typography, accent colors, and sections to match your tone. Connect Facebook, TikTok, or email automations using our built-in marketing blocks.</p>
    <h3 class="heading">Step 4 · Operate like a product studio</h3>
    <p>Track conversion, order accuracy, and customer support feedback every week. Resellers win when they behave like product teams—shipping improvements, testing bundles, and staying present in the communities they serve.</p>
    <p class="callout">Bonus: Optimum Soft resellers get access to analytics dashboards, automated invoicing, and a dedicated partner manager once you cross 300 fulfilled orders.</p>
  `,
});
</script>
