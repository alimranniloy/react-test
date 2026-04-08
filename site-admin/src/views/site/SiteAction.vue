<template>
  <main :key="site.id" v-if="site" class="flex-1">
    <div class="relative mx-auto md:px-8 xl:px-0">
      <div class="flex items-center space-x-5">
        <div class="flex-shrink-0">
          <div class="relative">
            <img class="h-16 w-16 rounded-full" v-lazy="site.favicon" alt="" />
            <span class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ site.title }}
          </h1>
          <p class="text-sm font-medium text-blue-700">
            <a :href="`https://${site.hostname}.site.bponi.com`" target="_blank">{{ site.hostname }}</a> | <a
              :href="`https://${site.domain}`" target="_blank">{{ site.domain }}</a>
          </p>
        </div>
      </div>
      <div class="px-4 sm:px-6 md:px-0">
        <div class="py-0">
          <!-- Tabs -->
          <div class="lg:hidden">
            <label for="selected-tab" class="sr-only">Select a tab</label>
            <select v-model="selectedTab" id="selected-tab" name="selected-tab"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm">
              <option v-for="item in tabs" :key="item.name" :selected="selectedTab == item.name" :value="item.name">
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="lg:block">
            <div class="border-b border-gray-200">
              <nav class="overflow-x-auto -mb-px flex space-x-8">
                <div @click="selectedTab = item.name" v-for="item in tabs" :key="item.name" :class="[
                  item.name == selectedTab
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer active:cursor-wait',
                ]">
                  {{ item.name }}
                </div>
              </nav>
            </div>
          </div>
          <div v-if="selectedTab == 'Home' && site.schema" class="border border-t-0">
            <Editor :key="site.id + '_' + site.version" :page="'site'" :schema="site.schema"></Editor>
          </div>
          <div v-else-if="selectedTab == 'Pages'" class="mt-4 divide-y divide-gray-200">
            <Page :site="site"></Page>
          </div>
          <div v-else-if="selectedTab == 'General'" class="mt-4 divide-y divide-gray-200">
            <div class="space-y-1">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                General
              </h3>
              <p class="max-w-2xl text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
            <div class="mt-6">
              <dl class="divide-y divide-gray-200">
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500 mb-4">
                    Title & Description
                    <p class="max-w-2xl text-xs mt-2 font-normal text-gray-500">
                      The details used to identify your business around the web
                    </p>
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="title"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Title</label>
                      <input v-model="site.title" type="text" name="title" id="title" autocomplete="off"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter title" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.title.length < 3" class="h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="metaDescription"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Description</label>
                      <textarea v-model="site.metaDescription" type="text" name="metaDescription" id="metaDescription"
                        autocomplete="off"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter description" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.metaDescription.length < 3" class="h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="email"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Email</label>
                      <input v-model="site.email" type="email" name="email" id="email" autocomplete="off"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter email" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.email && site.email.length < 3" class="h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="street"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Street</label>
                      <input v-model="site.street" type="text" name="street" id="street" autocomplete="off"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter description" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.street && site.street.length < 3" class="h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="address"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Map
                        address</label>
                      <input v-model="site.address" type="text" name="address" id="address" autocomplete="off"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter address" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.address && site.address.length < 3"
                          class="h-5 w-5 text-red-500" aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                  <dt class="text-sm font-medium text-gray-500 mb-4">
                    Favicon & Logo
                    <p class="max-w-2xl text-xs mt-2 font-normal text-gray-500">
                      The details used to identify your business around the
                      web
                    </p>
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <div
                      class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="description"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Favicon</label>
                      <file-pond class="bg-white pt-4 px-2" :files="filesFavicon" @onAdded="onAddedFavicon" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.metaDescription.length < 3" class="h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                    <!-- <div
                      class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="description"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Phone
                        Logo</label>
                      <file-pond class="bg-white pt-4 px-2" :files="filesPhone" @onAdded="onAddedPhoneLogo" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.metaDescription.length < 3" class="h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div> -->
                    <div
                      class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="description"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Preview
                        Image</label>
                      <file-pond class="bg-white pt-4 px-2" :files="filesDesktop" @onAdded="onAddedDektopLogo" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.metaDescription.length < 3" class="h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                    <div
                      class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="description"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Cover</label>
                      <file-pond :key="'scover'" class="bg-white pt-4 px-2" :files="filesCover"
                        @onAdded="onAddedCover" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.metaDescription.length < 3" class="h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div v-else-if="selectedTab == 'Meta'" class="mt-4 divide-y divide-gray-200">
            <div class="space-y-1">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                Meta
              </h3>
              <p class="max-w-2xl text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
            <div class="mt-6">
              <dl class="divide-y divide-gray-200">
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500 mb-4">
                    Meta title and Description
                    <p class="max-w-2xl text-xs mt-2 font-normal text-gray-500">
                      The details used to identify your business around the
                      web
                    </p>
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="metaTitle"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Meta
                        Title</label>
                      <input v-model="site.metaTitle" type="text" name="metaTitle" id="metaTitle" autocomplete="off"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter meta title" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.metaTitle && site.metaTitle.length < 3"
                          class="h-5 w-5 text-red-500" aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="metaDescription"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Meta
                        Description</label>
                      <textarea v-model="site.metaDescription" type="text" name="metaDescription" id="metaDescription"
                        autocomplete="off"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter meta title" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.metaDescription &&
                          site.metaDescription.length < 3
                        " class="h-5 w-5 text-red-500" aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                  </dd>
                </div>
              </dl>
              <dl class="divide-y divide-gray-200">
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500 mb-4">
                    Title & Description
                    <p class="max-w-2xl text-xs mt-2 font-normal text-gray-500">
                      The details used to identify your business around the
                      web
                    </p>
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="head"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">{{
                          `

                        <head>`}}
                          custom HTML code:
                      </label>
                      <textarea v-model="site.head" type="text" name="head" id="head" autocomplete="off" rows="6"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter meta title" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.head && site.head.length < 3" class="h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="foot"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        {{ `</body>` }} custom HTML code:</label>
                      <textarea v-model="site.foot" type="text" name="foot" id="foot" autocomplete="off" rows="6"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter meta title" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="site.foot &&
                          site.foot.length < 3
                        " class="h-5 w-5 text-red-500" aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div v-else-if="selectedTab == 'Domain'" class="mt-4 divide-y divide-gray-200">
            <div class="space-y-1">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                Domain
              </h3>
              <p class="max-w-2xl text-sm text-gray-500">
                Manage Domain Tags and SEO Settings for Improved Search Engine
                Visibility
              </p>
            </div>
            <div class="mt-6">
              <dl class="divide-y divide-gray-200">
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500 mb-4">
                    Setting Up Domain Records
                    <p class="max-w-2xl text-xs mt-2 font-normal text-gray-500">
                      To set up your domain, follow these steps to configure the necessary DNS records in your domain
                      management panel
                    </p>
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">


                    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" class="px-6 py-3">
                              Type
                            </th>
                            <th scope="col" class="px-6 py-3">
                              Host
                            </th>
                            <th scope="col" class="px-6 py-3">
                              Value
                            </th>
                            <th scope="col" class="px-6 py-3">
                              TTL
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              A Record
                            </th>
                            <td class="px-6 py-4">
                              @
                            </td>
                            <td class="px-6 py-4">
                              18.143.34.188
                            </td>
                            <td class="px-6 py-4">
                              Automatic
                            </td>
                          </tr>
                          <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              A Record
                            </th>
                            <td class="px-6 py-4">
                              www
                            </td>
                            <td class="px-6 py-4">
                              18.143.34.188
                            </td>
                            <td class="px-6 py-4">
                              Automatic
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </dd>
                </div>
              </dl>
              <dl class="divide-y divide-gray-200">
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500 mb-4">
                    Domain and Hostnme
                    <p class="max-w-2xl text-xs mt-2 font-normal text-gray-500">
                      Optimize Domain Titles and Descriptions for Effective SEO
                      and User Engagement
                    </p>
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="hostname"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Hostname</label>
                      <input v-model="hostname" type="text" name="hostname" id="hostname" autocomplete="off"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter meta title" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="!isHostnameAvailable" class="h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                    <div
                      class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4">
                      <label for="domain"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Domain
                      </label>
                      <input v-model="domain" type="text" name="domain" id="domain" autocomplete="off"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter meta title" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon v-if="!isDomainAvailable" class=" h-5 w-5 text-red-500"
                          aria-hidden="true" />
                        <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div v-if="['General', 'Meta', 'Domain'].includes(selectedTab)" class="pt-5">
        <div class="flex justify-end">
          <router-link :to="`/`" type="button"
            class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2">Cancel</router-link>
          <button @click="update()" type="submit"
            class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2">
            Update
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Page from "@/views/tool/page.vue";
import Editor from "@/views/editor/Editor.vue";
import { SITE_SCHEMA_DETAILS, SELF_SITE_UPDATE, SITE_IS_EXISTS } from "@/gql/site";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useNotificationsStore } from "@/stores/notifications";
import FilePond from "@/components/FilePond.vue";
import { ref, watch } from "vue";
import { cloneDeep } from "lodash";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
const { siteId, site } = storeToRefs(useSiteStore());
const { setLoading, getSite } = useSiteStore();
const { me } = storeToRefs(useMeStore());
const { addNotification } = useNotificationsStore();
const props = defineProps({
  id: {
    type: Number,
    required: false,
  },
});

const favicon = ref(null);
const mobileLogo = ref(null);
const desktopLogo = ref(null);
const coverImage = ref(null);
const cover = ref(null);
const filesFavicon = ref([]);
const filesPhone = ref([]);
const filesDesktop = ref([]);
const filesCover = ref([]);

const { onResult, loading, error, refetch } = useQuery(SITE_SCHEMA_DETAILS, {
  id: props.id ? props.id : siteId.value,
});
onResult((queryResult) => {
  if (queryResult.data) {
    site.value = cloneDeep(queryResult.data.siteById);
    filesFavicon.value = [site.value.favicon];
    filesPhone.value = [site.value.phoneLogo];
    filesDesktop.value = [site.value.desktopLogo];
    filesCover.value = site.value.cover ? [site.value.cover] : [];
  }
});

const tabs = [
  { name: "Home" },
  { name: "General" },
  { name: "Meta" },
  { name: "Domain" },
  { name: "Billing" },
  { name: "Pages" },
];
const selectedTab = ref("Home");

const onAddedFavicon = (file) => {
  if (
    filesFavicon.value.length > 0 &&
    filesFavicon.value[0].split("/")[
    filesFavicon.value[0].split("/").length - 1
    ] == file.name
  ) {
    favicon.value = null;
  } else {
    const maxSizeInBytes = 3 * 1024 * 1024; // Specify the maximum file size in bytes (e.g., 10MB)
    if (
      file &&
      file.size <= maxSizeInBytes &&
      filesFavicon.value[0] != file.name
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        favicon.value = file;
      };
    } else {
      addNotification(
        {
          title: "Product info",
          subTitle: "File size exceeds the maximum (3 MB) allowed limit.",
        },
        "error"
      );
    }
  }
};
const onAddedDektopLogo = (file) => {
  if (
    filesDesktop.value.length > 0 &&
    filesDesktop.value[0].split("/")[
    filesDesktop.value[0].split("/").length - 1
    ] == file.name
  ) {
    desktopLogo.value = null;
  } else {
    const maxSizeInBytes = 3 * 1024 * 1024; // Specify the maximum file size in bytes (e.g., 10MB)
    if (
      file &&
      file.size <= maxSizeInBytes &&
      filesDesktop.value[0] != file.name
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        desktopLogo.value = file;
      };
    } else {
      addNotification(
        {
          title: "Product info",
          subTitle: "File size exceeds the maximum (3 MB) allowed limit.",
        },
        "error"
      );
    }
  }
};
const onAddedPhoneLogo = (file) => {
  if (
    filesPhone.value.length > 0 &&
    filesPhone.value[0].split("/")[filesPhone.value[0].split("/").length - 1] ==
    file.name
  ) {
    mobileLogo.value = null;
  } else {
    const maxSizeInBytes = 3 * 1024 * 1024; // Specify the maximum file size in bytes (e.g., 10MB)
    if (
      file &&
      file.size <= maxSizeInBytes &&
      filesPhone.value[0] != file.name
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        mobileLogo.value = file;
      };
    } else {
      addNotification(
        {
          title: "Product info",
          subTitle: "File size exceeds the maximum (3 MB) allowed limit.",
        },
        "error"
      );
    }
  }
};

const onAddedCover = (file) => {
  if (
    filesCover.value.length > 0 &&
    filesCover.value[0].split("/")[
    filesCover.value[0].split("/").length - 1
    ] == file.name
  ) {
    cover.value = null;
  } else {
    const maxSizeInBytes = 3 * 1024 * 1024; // Specify the maximum file size in bytes (e.g., 10MB)
    if (
      file &&
      file.size <= maxSizeInBytes &&
      filesCover.value[0] != file.name
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        cover.value = file;
      };
    } else {
      addNotification(
        {
          title: "Product info",
          subTitle: "File size exceeds the maximum (3 MB) allowed limit.",
        },
        "error"
      );
    }
  }
};
const update = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_SITE_UPDATE, {
    variables: {
      userId: me.value.id,
      siteId: site.value.id,
      address: site.value.address,
      cover: cover.value,
      coverImage: coverImage.value,
      currency: site.value.currency,
      desktopLogo: desktopLogo.value,
      domain: site.value.domain,
      email: site.value.email,
      favicon: favicon.value,
      foot: site.value.foot,
      head: site.value.head,
      industry: site.value.industry,
      isPublic: site.value.isPublic,
      latitude: site.value.latitude,
      locale: site.value.locale,
      longitude: site.value.longitude,
      meta: site.value.meta,
      metaDescription: site.value.metaDescription,
      metaTitle: site.value.metaTitle,
      notice: site.value.notice,
      phone: parseInt(site.value.phone),
      phoneLogo: mobileLogo.value,
      social: site.value.social,
      street: site.value.street,
      title: site.value.title,
    },
  });
  try {
    const response = await mutate();
    if (response.data.siteUpdate) {
      getSite(response.data.siteUpdate.domain);
      addNotification(
        { title: "Site info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "Site info", subTitle: error.message }, "error");
    setLoading(false);
  }
};



const isDomainAvailable = ref(true);
const isHostnameAvailable = ref(true);

const hostname = ref(site.value.hostname);
const domain = ref(site.value.domain);
watch(hostname, () => {
  if (hostname.value.length > 3) {
    const { onResult, loading, onError } = useQuery(SITE_IS_EXISTS, {
      hostname: hostname.value
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]/g, ""),
    });
    onResult((queryResult) => {
      if (!queryResult.data.siteSiteIsExists.exists) {
        addNotification(
          { title: "Store info", subTitle: "Valid username" },
          "success"
        );
        isHostnameAvailable.value = true;
      } else {
        addNotification(
          { title: "Store info", subTitle: "Already a used thie username" },
          "error"
        );
        isHostnameAvailable.value = false;
      }
    });
    onError((error) => {
      if (error.message == "Item not found.") {
        addNotification(
          { title: "Store info", subTitle: "Already a used thie username." },
          "error"
        );
        isHostnameAvailable.value = false;
      }
    });
  }
});

watch(domain, () => {
  if (domain.value.length > 3) {
    const { onResult, loading, onError } = useQuery(SITE_IS_EXISTS, {
      hostname: domain.value
        .toLowerCase()
        .trim(),
    });
    onResult((queryResult) => {
      if (!queryResult.data.siteSiteIsExists.exists) {
        addNotification(
          { title: "Store info", subTitle: "Valid username" },
          "success"
        );
        isDomainAvailable.value = true;
      } else {
        addNotification(
          { title: "Store info", subTitle: "Already a used thie username" },
          "error"
        );
        isDomainAvailable.value = false;
      }
    });
    onError((error) => {
      if (error.message == "Item not found.") {
        addNotification(
          { title: "Store info", subTitle: "Already a used thie username." },
          "error"
        );
        isDomainAvailable.value = false;
      }
    });
  }
});

</script>
