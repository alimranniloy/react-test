<template>
  <div class="container max-w-7xl mx-auto bg-gray-100">
    <nav class="flex items-center justify-between flex-wrap bg-teal px-10 py-5">
      <div class="flex items-center flex-no-shrink text-white mr-6">
        <img
          class="h-12"
          src="https://images.squarespace-cdn.com/content/v1/5ea1e77b4f55522dbc009f83/1613165982747-3M15IW7FTYLDM09TYLYG/Intel.png"
          alt=""
        />
      </div>
      <div class="block sm:hidden">
        <button
          @click="open = open ? false : true"
          class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white"
        >
          <svg
            class="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        :class="open ? 'block' : 'hidden'"
        class="w-full flex-grow sm:flex sm:items-center sm:w-auto"
      >
        <div class="text-sm sm:flex-grow">
          <a
            href="#"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-gray-600 hover:text-gray-400 mr-4"
          >
            Home
          </a>
          <a
            href="#"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-gray-600 hover:text-gray-400 mr-4"
          >
            About
          </a>
          <a
            href="#"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-gray-600 hover:text-gray-400"
          >
            Blog
          </a>
        </div>
        <div>
          <a
            href="#"
            class="no-underline inline-block text-sm px-4 py-2 leading-none border rounded text-blue-400 border-blue-400 hover:text-white hover:bg-blue-400 mt-4 sm:mt-0"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>
<script setup>
import { ref } from "vue";
const open = ref(false);
</script>
