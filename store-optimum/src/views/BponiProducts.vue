<template>
  <div class="container mx-auto py-12">
    <!-- Page Title -->
    <div class="text-center py-7">
      <h2 class="font-semibold text-4xl">Bponi Products</h2>
    </div>

    <!-- Modern Select Filter -->
    <div class="flex items-center justify-center mb-8">
      <label for="filter" class="text-gray-600 mr-3 font-medium"
        >Filter by:</label
      >
      <div class="relative w-64">
        <select
          id="filter"
          v-model="selectedCategory"
          class="appearance-none w-full bg-white border border-gray-300 rounded-xl py-3 px-4 pr-10 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition hover:shadow-md"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <!-- Custom Arrow -->
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
          v-html="chevronDownIcon"
        ></div>
      </div>
    </div>

    <!-- Products Grid -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <a
        v-for="product in filteredProducts"
        :key="product.name"
        :href="product.url"
        target="_blank"
        rel="noopener noreferrer"
        class="group block"
      >
        <div
          class="flex items-center justify-between border border-gray-200 rounded-lg p-4 h-full transition-all duration-300 group-hover:shadow-lg group-hover:border-gray-300"
        >
          <div class="flex items-center">
            <img
              :src="product.image"
              alt=""
              class="w-[70px] mr-4 h-[50px] object-contain"
            />
            <span class="text-gray-800 font-medium">{{ product.name }}</span>
          </div>
          <ArrowTopRightOnSquareIcon
            class="w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </a>
    </div>
  </div>

  <div>
    <el-dropdown class="inline-block">
      <button
        class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/5 hover:bg-white/20"
      >
        Options
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          data-slot="icon"
          aria-hidden="true"
          class="-mr-1 size-5 text-gray-400"
        >
          <path
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          />
        </svg>
      </button>

      <el-menu
        anchor="bottom end"
        popover
        class="m-0 w-56 origin-top-right rounded-md bg-gray-800 p-0 outline outline-1 -outline-offset-1 outline-white/10 transition [--anchor-gap:theme(spacing.2)] [transition-behavior:allow-discrete] data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae hic
          dicta sed quaerat. Consequuntur accusamus nesciunt doloremque
          repellendus explicabo non, nobis expedita similique debitis? Tenetur
          hic pariatur illum quae iusto?
        </p>
        <div class="py-1">
          <a
            href="#"
            class="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:text-white focus:outline-none"
            >Account settings</a
          >
          <a
            href="#"
            class="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:text-white focus:outline-none"
            >Support</a
          >
          <a
            href="#"
            class="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:text-white focus:outline-none"
            >License</a
          >
          <form action="#" method="POST">
            <button
              type="submit"
              class="block w-full px-4 py-2 text-left text-sm text-gray-300 focus:bg-white/5 focus:text-white focus:outline-none"
            >
              Sign out
            </button>
          </form>
        </div>
      </el-menu>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ArrowTopRightOnSquareIcon } from "@heroicons/vue/24/solid";
import { computed, ref } from "vue";

// Selected category
const selectedCategory = ref("");

// Categories
const categories = [
  "Fashion",
  "Educational",
  "Tech",
  "Food/Grocery",
  "LMS / Course",
];

// Products
const products = ref([
  {
    name: "Edge",
    url: "https://edge.store.bponi.com/",
    category: "Fashion",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/f93ac85d-03c3-4a04-bcf8-9fe10053fc7e.jpg",
  },
  {
    name: "Foodi",
    url: "https://foodi.store.bponi.com/",
    category: "Food/Grocery",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/07a6261b-0079-4ef2-9a49-ad6e9b0fcd66.jpg",
  },
  {
    name: "Dropy",
    url: "https://dropy.store.bponi.com/",
    category: "Fashion",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/64971eae-a5c0-4b71-a8e8-8f6cb2d9fac7.jpg",
  },
  {
    name: "Boi",
    url: "https://boiadda.store.bponi.com/",
    category: "Educational",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/9f37eb35-21b9-4154-b999-c1644a628b44.png",
  },
  {
    name: "Tech",
    url: "https://storetech.store.bponi.com/",
    category: "Tech",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/a5a6432d-d4f2-45d2-8456-4de393bb7e1e.jpg",
  },
  {
    name: "LMS-Edo",
    url: "https://www.mainamatisurvey.com.bd/",
    category: "LMS / Course",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/808b0ac9-0fb7-429f-8ff9-f19f465ff970.png",
  },
  {
    name: "Boisodai",
    url: "https://boisodai.com/",
    category: "Educational",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/dd3eaae5-f039-4805-af7d-2f8c7fe2b5a3.png",
  },
  {
    name: "Zero",
    url: "https://zero.store.bponi.com/",
    category: "Fashion",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/f6a4ce72-ad8d-4117-9694-5614ec3ae768.jpg",
  },
  {
    name: "SPR",
    url: "https://bdshopping4.store.bponi.com/",
    category: "Fashion",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/47c108e5-9dae-4ccf-aef4-4b458852761c.png",
  },
  {
    name: "Fabari",
    url: "https://fabrilife.store.bponi.com/",
    category: "Fashion",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/1a38154c-3952-4388-86b5-c7ab31259e0c.png",
  },
  {
    name: "Bing",
    url: "https://bing.store.bponi.com/",
    category: "Fashion",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/ca0bfe1b-473a-452d-adb3-6e07e418396a.png",
  },
  {
    name: "Petra store",
    url: "https://petra.store.bponi.com/",
    category: "Fashion",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/24170e9e-de89-4bde-ac9d-e14e0ecbcbdb.png",
  },
]);

// Computed filtered products
const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value;
  return products.value.filter((p) => p.category === selectedCategory.value);
});

// Chevron arrow for select
const chevronDownIcon = `
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
     viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 9l-7 7-7-7" />
</svg>
`;
</script>
