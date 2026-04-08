<template>
  <main  class="flex-1">
    <div class="relative mx-auto max-w-4xl md:px-8 xl:px-0">
      <div class="pt-10 pb-16">
        <div class="px-4 sm:px-6 md:px-0">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">
            Settings
          </h1>
        </div>
        <div class="px-4 sm:px-6 md:px-0">
          <div class="py-6">
            <!-- Tabs -->
            <div class="lg:hidden">
              <label for="selected-tab" class="sr-only">Select a tab</label>
              <select
                v-model="selectedTab"
                id="selected-tab"
                name="selected-tab"
                class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
              >
                <option
                  v-for="item in tabs"
                  :key="item.name"
                  :selected="selectedTab == item.name"
                  :value="item.name"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="hidden lg:block">
              <div class="border-b border-gray-200">
                <nav class="overflow-x-auto -mb-px flex space-x-8">
                  <div
                    @click="selectedTab = item.name"
                    v-for="item in tabs"
                    :key="item.name"
                    :class="[
                      item.name == selectedTab
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer active:cursor-wait',
                    ]"
                  >
                    {{ item.name }}
                  </div>
                </nav>
              </div>
            </div>

            <!-- Description list with inline editing -->
            <div
              v-show="selectedTab == 'General'"
              class="mt-10 divide-y divide-gray-200"
            >
              <div class="space-y-1">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Profile
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
                      <p
                        class="max-w-2xl text-xs mt-2 font-normal text-gray-500"
                      >
                        The details used to identify your business around the
                        web
                      </p>
                    </dt>
                    <dd
                      class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                    >
                      <div
                        class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="title"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Title</label
                        >
                        <input
                          v-model="selfSite.title"
                          type="text"
                          name="title"
                          id="title"
                          autocomplete="off"
                          class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter title"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.title.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div
                        class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="metaDescription"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Description</label
                        >
                        <input
                          v-model="selfSite.metaDescription"
                          type="text"
                          name="metaDescription"
                          id="metaDescription"
                          autocomplete="off"
                          class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter description"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.metaDescription.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div
                        class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="email"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Email</label
                        >
                        <input
                          v-model="selfSite.email"
                          type="email"
                          name="email"
                          id="email"
                          autocomplete="off"
                          class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter email"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.email && selfSite.email.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div
                        class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="street"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Street</label
                        >
                        <input
                          v-model="selfSite.street"
                          type="text"
                          name="street"
                          id="street"
                          autocomplete="off"
                          class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter description"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.street && selfSite.street.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div
                        class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="address"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Map address</label
                        >
                        <input
                          v-model="selfSite.address"
                          type="text"
                          name="address"
                          id="address"
                          autocomplete="off"
                          class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter address"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="
                              selfSite.address && selfSite.address.length < 3
                            "
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </dd>
                  </div>
                  <div
                    class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5"
                  >
                    <dt class="text-sm font-medium text-gray-500 mb-4">
                      Favicon & Logo
                      <p
                        class="max-w-2xl text-xs mt-2 font-normal text-gray-500"
                      >
                        The details used to identify your business around the
                        web
                      </p>
                    </dt>
                    <dd
                      class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                    >
                      <div
                        class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="description"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Favicon</label
                        >
                        <file-pond
                          class="bg-white pt-4 px-2"
                          :files="filesFavicon"
                          @onAdded="onAddedFavicon"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.metaDescription.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div
                        class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="description"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Phone Logo</label
                        >
                        <file-pond
                          class="bg-white pt-4 px-2"
                          :files="filesPhone"
                          @onAdded="onAddedPhoneLogo"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.metaDescription.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div
                        class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="description"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Desktop Logo</label
                        >
                        <file-pond
                          class="bg-white pt-4 px-2"
                          :files="filesDesktop"
                          @onAdded="onAddedDektopLogo"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.metaDescription.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>


<div
              v-show="selectedTab == 'Notice'"
              class="mt-10 divide-y divide-gray-200"
            >
              <div class="space-y-1">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Notice
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
                      <p
                        class="max-w-2xl text-xs mt-2 font-normal text-gray-500"
                      >
                        The details used to identify your business around the
                        web
                      </p>
                    </dt>
                    <dd
                      class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                    >
                      <div
                        class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="notice"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Notice</label
                        >
                        <input
                          v-model="selfSite.notice"
                          type="text"
                          name="notice"
                          id="notice"
                          autocomplete="off"
                          class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter notice"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.notice && selfSite.notice.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      </dd>
              </div>
              </dl>
              </div>
              </div>
<div
              v-show="selectedTab == 'Meta'"
              class="mt-10 divide-y divide-gray-200"
            >
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
                      Title & Description
                      <p
                        class="max-w-2xl text-xs mt-2 font-normal text-gray-500"
                      >
                        The details used to identify your business around the
                        web
                      </p>
                    </dt>
                    <dd
                      class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                    >
                      <div
                        class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="metaTitle"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Meta Title</label
                        >
                        <input
                          v-model="selfSite.metaTitle"
                          type="text"
                          name="metaTitle"
                          id="metaTitle"
                          autocomplete="off"
                          class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter meta title"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.metaTitle && selfSite.metaTitle.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div
                        class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="metaDescription"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Meta Description</label
                        >
                        <input
                          v-model="selfSite.metaDescription"
                          type="text"
                          name="metaDescription"
                          id="metaDescription"
                          autocomplete="off"
                          class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter meta title"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.metaDescription && selfSite.metaDescription.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      </dd>
              </div>
              </dl>
                <dl class="divide-y divide-gray-200">
                  <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt class="text-sm font-medium text-gray-500 mb-4">
                      Title & Description
                      <p
                        class="max-w-2xl text-xs mt-2 font-normal text-gray-500"
                      >
                        The details used to identify your business around the
                        web
                      </p>
                    </dt>
                    <dd
                      class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                    >
                      <div
                        class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="metaTitle"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Meta Title</label
                        >
                        <input
                          v-model="selfSite.metaTitle"
                          type="text"
                          name="metaTitle"
                          id="metaTitle"
                          autocomplete="off"
                          class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter meta title"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.metaTitle && selfSite.metaTitle.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div
                        class="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 mb-4"
                      >
                        <label
                          for="metaDescription"
                          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >Meta Description</label
                        >
                        <input
                          v-model="selfSite.metaDescription"
                          type="text"
                          name="metaDescription"
                          id="metaDescription"
                          autocomplete="off"
                          class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter meta title"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ExclamationCircleIcon
                            v-if="selfSite.metaDescription && selfSite.metaDescription.length < 3"
                            class="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      </dd>
              </div>
              </dl>
              </div>
              </div>
            <div
              v-show="selectedTab == 'Notification'"
              class="mt-10 divide-y divide-gray-200"
            >
              <div class="space-y-1">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Setting
                </h3>
                <p class="max-w-2xl text-sm text-gray-500">
                  Manage how information is displayed on your account.
                </p>
              </div>
              <div class="mt-6">
                <dl class="divide-y divide-gray-200">
                  <SwitchGroup
                    as="div"
                    class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5"
                  >
                    <SwitchLabel
                      as="dt"
                      class="text-sm font-medium text-gray-500"
                      
                      >OTP Login<br />
                      <p class="text-xs text-gray-500 font-normal mt-2">
                        Customer can login with only OTP nor password rquired.
                      </p>
                    </SwitchLabel>
                    <dd
                      class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                    >
                      <Switch
                        v-model="isOtp"
                        :class="[
                          isOtp ? 'bg-purple-600' : 'bg-gray-200',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-auto',
                        ]"
                      >
                        <span
                          aria-hidden="true"
                          :class="[
                            isOtp ? 'translate-x-5' : 'translate-x-0',
                            'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          ]"
                        />
                      </Switch>
                    </dd>
                  </SwitchGroup>
                  <SwitchGroup
                    as="div"
                    class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200 sm:py-5"
                  >
                    <SwitchLabel
                      as="dt"
                      class="text-sm font-medium text-gray-500"
                      passive
                      >Guest Login<br />
                      <p class="text-xs text-gray-500 font-normal mt-2">
                        Customer can order anonymously, and you won't have any
                        control on them. So decide wisely.
                      </p>
                    </SwitchLabel>
                    <dd
                      class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                    >
                      <Switch
                        v-model="isGuest"
                        :class="[
                          isGuest ? 'bg-purple-600' : 'bg-gray-200',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-auto',
                        ]"
                      >
                        <span
                          aria-hidden="true"
                          :class="[
                            isGuest
                              ? 'translate-x-5'
                              : 'translate-x-0',
                            'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          ]"
                        />
                      </Switch>
                    </dd>
                  </SwitchGroup>
                  <SwitchGroup
                    as="div"
                    class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200 sm:py-5"
                  >
                    <SwitchLabel
                      as="dt"
                      class="text-sm font-medium text-gray-500"
                      passive
                      >SMS Per Order<br />
                      <p class="text-xs text-gray-500 font-normal mt-2">
                        Bponi will notify you for every single new order.
                      </p>
                    </SwitchLabel>
                    <dd
                      class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                    >
                      <Switch
                        v-model="sendSmsPerOrder"
                        :class="[
                          sendSmsPerOrder
                            ? 'bg-purple-600'
                            : 'bg-gray-200',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-auto',
                        ]"
                      >
                        <span
                          aria-hidden="true"
                          :class="[
                            sendSmsPerOrder
                              ? 'translate-x-5'
                              : 'translate-x-0',
                            'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          ]"
                        />
                      </Switch>
                    </dd>
                  </SwitchGroup>
                  <SwitchGroup
                    as="div"
                    class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200 sm:py-5"
                  >
                    <SwitchLabel
                      as="dt"
                      class="text-sm font-medium text-gray-500"
                      passive
                      >SMS Per Order Event<br />
                      <p class="text-xs text-gray-500 font-normal mt-2">
                        Bponi will notify you and your cuostomer for every
                        single new order events.
                      </p>
                    </SwitchLabel>
                    <dd
                      class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                    >
                      <Switch
                        v-model="sendSmsPerEvent"
                        :class="[
                          sendSmsPerEvent
                            ? 'bg-purple-600'
                            : 'bg-gray-200',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-auto',
                        ]"
                      >
                        <span
                          aria-hidden="true"
                          :class="[
                            sendSmsPerEvent
                              ? 'translate-x-5'
                              : 'translate-x-0',
                            'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          ]"
                        />
                      </Switch>
                    </dd>
                  </SwitchGroup>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-5">
          <div class="flex justify-end">
            <router-link
              :to="`/`"
              type="button"
              class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2"
              >Cancel</router-link
            >
            <button
              @click="update()"
              type="submit"
              class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { SELF_SITE_UPDATE } from "@/gql/site";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useNotificationsStore } from "@/stores/notifications";
import FilePond from "@/components/FilePond.vue";
import { ref } from "vue";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import { cloneDeep } from "lodash";
const { addNotification } = useNotificationsStore();
const tabs = [
  { name: "General" },
  { name: "Notice" },
  { name: "Meta" },
  { name: "Notification" },
  // { name: "Connection"},
];
const selectedTab = ref("General");
const { site } = storeToRefs(useSiteStore());
const { setLoading, getSite } = useSiteStore();
const { me } = storeToRefs(useMeStore());
const selfSite = ref(cloneDeep(site.value));
const favicon = ref(null);
const mobileLogo = ref(null);
const desktopLogo = ref(null);
const filesFavicon = ref([site.value.favicon]);
const filesPhone = ref([site.value.phoneLogo]);
const filesDesktop = ref([site.value.desktopLogo]);

const isOtp = ref(selfSite.value.isOtp);
const isGuest = ref(selfSite.value.isGuest);
const sendSmsPerOrder = ref(selfSite.value.sendSmsPerOrder);
const sendSmsPerEvent = ref(selfSite.value.sendSmsPerEvent);
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
    filesPhone.value[0].split("/")[
      filesPhone.value[0].split("/").length - 1
    ] == file.name
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

const update = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_SITE_UPDATE, {
    variables: {
      userId: me.value.id,
      siteId: selfSite.value.id,
      address: selfSite.value.address,
      completedStep: selfSite.value.completedStep,
      coverImage: selfSite.value.coverImage,
      currency: selfSite.value.currency,
      desktopLogo: desktopLogo.value,
      desktopTheme: selfSite.value.desktopTheme,
      domain: selfSite.value.domain,
      email: selfSite.value.email,
      favicon: favicon.value,
      foot: selfSite.value.foot,
      head: selfSite.value.head,
      industry: selfSite.value.industry,
      isGuest: isGuest.value,
      isGuide: selfSite.value.isGuide,
      isOtp: isOtp.value,
      isPublic: selfSite.value.isPublic,
      latitude: selfSite.value.latitude,
      locale: selfSite.value.locale,
      longitude: selfSite.value.longitude,
      meta: selfSite.value.meta,
      metaDescription: selfSite.value.metaDescription,
      metaTitle: selfSite.value.metaTitle,
      navigation: selfSite.value.navigation,
      notice: selfSite.value.notice,
      parent: humps.decamelizeKeys(selfSite.value.parent),
      parents: selfSite.value.parents,
      percentage: selfSite.value.percentage,
      phone: parseInt(selfSite.value.phone),
      phoneLogo: mobileLogo.value,
      sendSmsPerEvent: sendSmsPerEvent.value,
      sendSmsPerOrder: sendSmsPerOrder.value,
      social: selfSite.value.social,
      street: selfSite.value.street,
      theme: selfSite.value.theme,
      title: selfSite.value.title,
      tools: selfSite.value.tools,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfSiteUpdate) {
      getSite(response.data.selfSiteUpdate.domain);
      addNotification(
        { title: "Site info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "Brand info", subTitle: error.message }, "error");
    setLoading(false);
  }
};
</script>
