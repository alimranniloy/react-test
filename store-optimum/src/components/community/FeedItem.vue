<template>
  <article v-if="!isDeleted">
    <div
      class="accent-tab hover-card relative flex flex-col gap-y-4 pt-4 outline-none duration-200 dark:bg-gray-900 rounded">
      <div class="flex flex-col gap-2">
        <!-- post top info -->
        <div class="flex gap-3 px-4">
          <router-link class="blur-picture flex self-start" tabindex="0" :to="`/feed/${item.user.username}`">
            <img :alt="item.user.name" v-lazy="item.user.avatar"
              class="rounded-full object-cover w-10 h-10 aspect-square" />
          </router-link>
          <div>
            <div class="flex flex-col truncate xs:overflow-visible xs:whitespace-normal leading-5">
              <router-link
                class="flex items-center truncate font-bold custom-underline text-gray-600 gap-1 text-md dark:text-gray-200"
                tabindex="0" :to="`/feed/${item.user.username}`">
                <p class="truncate">{{ item.user.name }}</p>
                <CheckBadgeIcon v-if="item.user.isVerified" class="fill-blue-400 w-5 h-5 stroke-transparent">
                </CheckBadgeIcon>
              </router-link>
              <div class="group relative text-gray-600">
                <router-link class="peer whitespace-nowrap text-sm dark:text-gray-400"
                  :to="`/feed/post/${item.hid}/`">{{
                  dayjs(item.updatedAt).fromNow() }}</router-link>
                <div
                  class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-1 peer-focus:opacity-100 peer-focus-visible:visible peer-focus-visible:delay-200">
                  <span>{{ dayjs(item.updatedAt) }}</span>
                </div>
              </div>
            </div>
            <!-- post menu -->
            <div class="px-4">
              <Menu as="div">
                <MenuButton
                  class="custom-button main-tab main-tab group group absolute top-2 right-2 p-2 hover:bg-accent-red/10 focus-visible:bg-accent-red/10 focus-visible:!ring-accent-red/80 active:bg-accent-red/20 dark:hover:bg-gray-300">
                  <div class="group relative">
                    <EllipsisHorizontalIcon
                      class="h-6 w-56text-light-secondary group-hover:text-gray-800 group-focus-visible:text-gray-800 /80 dark:text-gray-400" />

                    <div
                      class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3">
                      <span>More</span>
                    </div>
                  </div>
                </MenuButton>
                <transition enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0">
                  <MenuItems
                    class="menu-container absolute right-4 top-12 w-60 font-normal bg-white shadow-md rounded-md py-2 z-50 gap-5 px-2">
                    <MenuItem v-if="(me && me.id != item.user.id) || me == null" as="div">
                    <router-link
                      class="flex w-full cursor gap-3 rounded-md px-4 py-1 duration-200 items-center hover:bg-gray-100"
                      :to="`/feed/${item.user.username}/`">
                      <UserPlusIcon class="w-5 h-5 text-gray-600" />Follow
                    </router-link></MenuItem>
                    <MenuItem v-if="me && me.id == item.user.id" as="div">
                    <button
                      class="flex w-full cursor gap-3 rounded-md px-4 py-1 duration-200 items-center hover:bg-gray-100"
                      @click="isEdit = true">
                      <PencilIcon class="w-5 h-5 text-gray-600" />Edit
                    </button></MenuItem>
                    <MenuItem v-if="me && me.id == item.user.id" as="div">
                    <button
                      class="flex w-full cursor gap-3 rounded-md px-4 py-1 duration-200 items-center hover:bg-gray-100"
                      @click="deleteFeed(item.id)">
                      <TrashIcon class="w-5 h-5 text-gray-600" />Delete
                    </button></MenuItem>
                    <MenuItem v-else-if="
                      me && community && community.admins.includes(me.id)
                    " as="div">
                    <button
                      class="flex w-full cursor gap-3 rounded-md px-4 py-1 duration-200 items-center hover:bg-gray-100"
                      @click="deleteFeedByAdmin(item.id)">
                      <TrashIcon class="w-5 h-5 text-gray-600" />Delete
                    </button></MenuItem>
                    <MenuItem v-if="me && me.id == item.user.id" as="div">
                    <button
                      class="flex w-full cursor gap-3 rounded-md px-4 py-1 duration-200 items-center hover:bg-gray-100">
                      <StarIcon class="w-5 h-5 text-gray-600" />Pin in your
                      profile
                    </button></MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>

        <!-- post details -->
        <div class="flex min-w-0 flex-col">
          <div class="px-4 space-y-3">
            <dynamic-content :content="item.text.trim()" />
            <div v-if="item.link" class="relative w-full mx-auto overflow-hidden bg-gray-100 rounded-md shadow ring-1">
              <div class="flex flex-col space-y">
                <a :href="item.link.url" target="_blank" class="w-full">
                  <img class="object-cover aspect-video" v-lazy="item.link.image" :alt="item.link.title" />
                </a>
                <div class="flex flex-col p-3 space-y">
                  <a :href="item.link.url" target="_blank"
                    class="m-0 text-md leading-tight text-gray-900 no-underline hover:no-underline hover:text-gray-900 line-clamp-1">{{
                    item.link.title }}</a>
                  <p class="text-gray-500 text-sm">{{ getHostname(item.link.url) }}</p>
                  <p class="text-sm line-clamp-2">
                    {{ item.link.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- image  -->
            <div :key="dominantColor" @click="images = item.images" v-if="item.images.length > 0"
              :style="{ backgroundColor: dominantColor }" class="grid mt-2 gap-0.5" :class="{
                'grid-cols-1 grid-rows-1': item.images.length === 1,
                'grid-cols-2 grid-rows-1': item.images.length === 2,
                'grid-cols-1 grid-rows-2': item.images.length === 3,
                'grid-cols-1 grid-rows-2': item.images.length > 3
              }">
              <button v-if="item.images.length == 4" type="button"
                class="accent-tab relative transition-shadow row-span-2">
                <figure
                  class="relative w-full flex items-center justify-center cursor-pointer transition hover:brightness-75 hover:duration-200">
                  <img :alt="''" :ref="'image0'" v-lazy="item.images[0].image" class="object-cover aspect-square" />
                </figure>
                <div class="grid grid-cols-4 gap-2 mt-2">
                  <template :key="index" v-for="(img, index) in item.images">
                    <img :alt="''" v-lazy="img.image" class="object-cover aspect-square" />
                  </template>
                </div>
              </button>
              <button v-if="item.images.length > 4" type="button"
                class="accent-tab relative transition-shadow row-span-2">
                <figure
                  class="relative w-full flex items-center justify-center cursor-pointer transition hover:brightness-75 hover:duration-200">
                  <img :alt="''" :ref="'image0'" v-lazy="item.images[0].image" class="object-cover aspect-square" />
                </figure>
                <div class="grid grid-cols-4 gap-2 mt-2">
                  <template :key="index" v-for="(img, index) in item.images.slice(1, 4)">
                    <img :alt="''" v-lazy="img.image" class="object-cover aspect-square" />
                  </template>
                  <div v-if="item.images.length - 4 > 0"
                    class="flex items-center justify-center text-md object-cover aspect-square bg-gray-300">
                    +{{ item.images.length - 4 }}
                  </div>
                </div>
              </button>

              <template v-else>
                <button v-for="(img, index) in item.images" :key="index" type="button"
                  class="accent-tab relative transition-shadow row-span-2">
                  <figure
                    class="relative w-full cursor-pointer flex items-center justify-center transition hover:brightness-75 hover:duration-200 h-full">
                    <img :id="'image_' + item.id" crossorigin="anonymous" v-lazy="img.image"
                      class="object-contain aspect-square" />
                  </figure>
                </button>
              </template>
            </div>
            <div v-if="item.feedType == 2 && item.parent" class="flex flex-col gap-2 z-40 border rounded-md">
              <div class="accent-tab hover-card relative flex flex-col gap-y-4 px-4 py-3 outline-none duration-200">
                <div class="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
                  <div class="flex flex-col items-center gap-2">
                    <router-link class="blur-picture flex self-start" tabindex="0"
                      :to="`/feed/${item.parent.user.username}`">
                      <img :alt="item.parent.user.name" v-lazy="item.parent.user.avatar"
                        class="rounded-full object-cover w-6 h-6" />
                    </router-link><i class="hover-animation h-full w-0.5 bg-gray-200"></i>
                  </div>
                  <div class="flex min-w-0 flex-col">
                    <div class="flex justify-between gap-2 text-light-secondary">
                      <div class="flex gap-1 truncate xs:overflow-visible xs:whitespace-normal">
                        <router-link class="flex items-center gap-1 truncate font-bold custom-underline text-gray-700"
                          tabindex="0" :to="`/feed/${item.parent.user.username}`">
                          <p class="truncate">
                            {{ item.parent.user.name }}
                          </p>
                        </router-link>
                        <div class="flex gap-1">
                          <i>·</i>
                          <div class="group relative">
                            <router-link class="custom-underline peer whitespace-nowrap"
                              :to="`/feed/post/${item.parent.hid}`">{{
                              dayjs(item.parent.updatedAt).fromNow()
                              }}</router-link>
                            <div
                              class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-1 peer-focus:opacity-100 peer-focus-visible:visible peer-focus-visible:delay-200">
                              <span>{{
                                dayjs(item.parent.updatedAt).fromNow()
                                }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <router-link :to="`/feed/post/${item.parent.hid}/`" class="">
                      <dynamic-content :content="item.parent.text.trim()" />

                      <div v-if="item.parent.link"
                        class="relative w-full mx-auto overflow-hidden bg-gray-100 rounded-md shadow ring-1 my-2">
                        <div class="flex flex-col space-y">
                          <a :href="item.parent.link.url" target="_blank" class="w-full">
                            <img class="object-cover aspect-video" v-lazy="item.parent.link.image"
                              :alt="item.parent.link.title" />
                          </a>
                          <div class="flex flex-col p-3 space-y">
                            <a :href="item.parent.link.url" target="_blank"
                              class="m-0 text-md leading-tight text-gray-900 no-underline hover:no-underline hover:text-gray-900 line-clamp-1">{{
                              item.parent.link.title }}</a>
                            <p class="text-gray-500 text-sm">{{ getHostname(item.parent.link.url) }}</p>
                            <p class="text-sm line-clamp-2">
                              {{ item.parent.link.description }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- image  -->
                      <div :key="dominantColor" @click="images = item.parent.images"
                        v-if="item.parent.images.length > 0" :style="{ backgroundColor: dominantColor }"
                        class="grid mt-2 gap-0.5" :class="{
                          'grid-cols-1 grid-rows-1': item.parent.images.length === 1,
                          'grid-cols-2 grid-rows-1': item.parent.images.length === 2,
                          'grid-cols-1 grid-rows-2': item.parent.images.length === 3,
                          'grid-cols-1 grid-rows-2': item.parent.images.length > 3
                        }">
                        <button v-if="item.parent.images.length == 4" type="button"
                          class="accent-tab relative transition-shadow row-span-2">
                          <figure
                            class="relative w-full flex items-center justify-center cursor-pointer transition hover:brightness-75 hover:duration-200">
                            <img :alt="''" :ref="'image0'" v-lazy="item.parent.images[0].image"
                              class="object-cover aspect-square" />
                          </figure>
                          <div class="grid grid-cols-4 gap-2 mt-2">
                            <template :key="index" v-for="(img, index) in item.parent.images">
                              <img :alt="''" v-lazy="img.image" class="object-cover aspect-square" />
                            </template>
                          </div>
                        </button>
                        <button v-if="item.parent.images.length > 4" type="button"
                          class="accent-tab relative transition-shadow row-span-2">
                          <figure
                            class="relative w-full flex items-center justify-center cursor-pointer transition hover:brightness-75 hover:duration-200">
                            <img :alt="''" :ref="'image0'" v-lazy="item.parent.images[0].image"
                              class="object-cover aspect-square" />
                          </figure>
                          <div class="grid grid-cols-4 gap-2 mt-2">
                            <template :key="index" v-for="(img, index) in item.parent.images.slice(1, 4)">
                              <img :alt="''" v-lazy="img.image" class="object-cover aspect-square" />
                            </template>
                            <div v-if="item.parent.images.length - 4 > 0"
                              class="flex items-center justify-center text-md object-cover aspect-square bg-gray-300">
                              +{{ item.parent.images.length - 4 }}
                            </div>
                          </div>
                        </button>

                        <template v-else>
                          <button v-for="(img, index) in item.parent.images" :key="index" type="button"
                            class="accent-tab relative transition-shadow row-span-2">
                            <figure
                              class="relative w-full cursor-pointer flex items-center justify-center transition hover:brightness-75 hover:duration-200 h-full">
                              <img :id="'image_' + item.parent.id" crossorigin="anonymous" v-lazy="img.image"
                                class="object-contain aspect-square" />
                            </figure>
                          </button>
                        </template>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- user interactions -->
          <div class="my-2">
            <div class="flex justify-between gap-5 text-light-secondary inner:outline-none px-4 relative mb-1">
              <div class="flex gap-5">
                <!-- reactions -->
                <button @click="
                  updateLike(item.id, isLiked ? 'decrement' : 'increment'),
                  (isLiked = !isLiked)
                  "
                  class="rounded-full gap-2 py-2 not-italic duration-200 group-hover:bg-accent-red/10 group-focus-visible:bg-accent-red/10 group-focus-visible:ring-2 group-focus-visible:ring-accent-red/80 group-active:bg-accent-red/20 flex items-center">
                  <HeartIcon class="w-5 h-5" :class="isLiked
                    ? 'fill-red-600 text-red-600'
                    : 'text-gray-600 dark:text-gray-400'
                    " />
                  <div class="overflow-hidden">
                    <p class="text-sm dark:text-gray-400" style="opacity: 1; transform: none">
                      {{ likes }}
                    </p>
                  </div>
                </button>
                <!-- <Menu as="div">
                  <MenuButton
                    class="rounded-full gap-2 py-2 not-italic duration-200 group-hover:bg-accent-red/10 group-focus-visible:bg-accent-red/10 group-focus-visible:ring-2 group-focus-visible:ring-accent-red/80 group-active:bg-accent-red/20 flex items-center"
                  >
                    <HeartIcon class="w-5 h-5 text-gray-600" />
                    <div class="overflow-hidden">
                      <p class="text-sm" style="opacity: 1; transform: none">
                        0
                      </p>
                    </div>
                  </MenuButton>

                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <MenuItems
                      class="menu-container absolute -top-12 left-4 p-1 px-2 bg-white rounded-full drop-shadow-md w-[212px] text-2xl"
                      ><div class="flex gap-5">
                        <MenuItem
                          class="text-red-600 hover:scale-125 duration-300"
                        >
                          <span> 👍 </span>
                        </MenuItem>
                        <MenuItem
                          class="text-red-600 hover:scale-125 duration-300"
                        >
                          <span> ❤️ </span>
                        </MenuItem>
                        <MenuItem
                          class="text-red-600 hover:scale-125 duration-300"
                        >
                          <span> 😂 </span>
                        </MenuItem>
                        <MenuItem
                          class="text-red-600 hover:scale-125 duration-300"
                        >
                          <span> 😯 </span>
                        </MenuItem>
                        <MenuItem
                          class="text-red-600 hover:scale-125 duration-300"
                        >
                          <span> 😢 </span>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu> -->

                <!-- comments -->
                <button @click="reply()"
                  class="group flex items-center gap-1.5 p-0 transition-none disabled:cursor-not-allowed inner:transition inner:duration-200 hover:text-gray-800 focus-visible:text-gray-800">
                  <ChatBubbleOvalLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />

                  <div class="overflow-hidden">
                    <p class="text-sm dark:text-gray-400" style="opacity: 1; transform: none">
                      {{ item.replies }}
                    </p>
                  </div>
                </button><button @click="repost()"
                  class="group flex items-center gap-1.5 p-0 transition-none disabled:cursor-not-allowed inner:transition inner:duration-200 hover:text-accent-green focus-visible:text-accent-green">
                  <ArrowPathRoundedSquareIcon class="w-5 h-5 text-gray-600" />
                  <div class="overflow-hidden">
                    <p class="text-sm dark:text-gray-400" style="opacity: 1; transform: none">
                      {{ item.share }}
                    </p>
                  </div>
                </button>
              </div>

              <div class="flex gap-5">
                <button @click="copy(`https://${site.domain}/feed/${item.hid}/`)"
                  class="group text-sm flex items-center gap-1.5 p-0 transition-none disabled:cursor-not-allowed inner:transition inner:duration-200 hover:text-accent-green focus-visible:text-accent-green">
                  <LinkIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span class="dark:text-gray-400">Copy</span>

                  <div class="overflow-hidden"></div>
                </button>
                <div
                  class="group relative flex items-center gap-1.5 p-0 transition-none disabled:cursor-not-allowed inner:transition inner:duration-200 focus-visible:text-accent-pink">
                  <Menu as="div">
                    <MenuButton
                      class="group text-sm flex items-center gap-1.5 p-0 transition-none disabled:cursor-not-allowed inner:transition inner:duration-200 hover:text-accent-green focus-visible:text-accent-green">
                      <PaperAirplaneIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span class="dark:text-gray-400">Share</span>
                    </MenuButton>
                    <transition enter-active-class="transition duration-100 ease-out"
                      enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-in"
                      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                      <MenuItems
                        class="menu-container absolute bottom-12 right-0 w-60 font-normal bg-white shadow-md rounded-md py-2 z-40">
                        <MenuItem as="div" v-for="item in social" :key="item.name" @click="shareUrl(item.name)">
                        <button class="flex w-full cursor gap-3 rounded-t-md px-4 py-1 duration-200 items-center">
                          <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />{{ item.name }}
                        </button></MenuItem>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>

                <!-- <button
                  class="group flex items-center gap-1 p-0 transition-none disabled:cursor-not-allowed inner:transition inner:duration-200 hover:text-accent-pink focus-visible:text-accent-pink"
                >
                  <ArrowUpOnSquareIcon class="w-5 h-5 text-gray-600" />
                </button> -->
              </div>
            </div>

            <!-- post's comment -->
            <div class="flex flex-col">
              <div v-if="item.topReplies.length > 0"
                class="border-t border-gray-100 dark:border-gray-500 px-4 py-2 sm:py-3 space-y-3">
                <!-- single comment -->
                <div v-for="reply in item.topReplies" :key="reply.id" class="flex gap-3">
                  <div class="flex flex-col items-center gap-2">
                    <img class="aspect-square w-6 h-6 object-cover rounded-full mt-1" :alt="reply.user.name"
                      v-lazy="reply.user.avatar" />

                    <i class="hover-animation h-full w-0.5 bg-gray-200"></i>
                  </div>
                  <div class="flex flex-col text-sm w-full">
                    <div class="relative">
                      <router-link :to="`/feed/${reply.user.username}`"
                        class="font-semibold flex items-center dark:text-gray-200">{{
                        reply.user.name }}
                        <CheckBadgeIcon v-if="reply.user.isVerified"
                          class="fill-blue-400 w-4 h-4 stroke-transparent ml-1">
                        </CheckBadgeIcon>
                      </router-link>
                      <div class="px-4">
                        <Menu as="div">
                          <MenuButton
                            class="custom-button main-tab main-tab group group absolute top-0 right-0 p-2 hover:bg-accent-red/10 focus-visible:bg-accent-red/10 focus-visible:!ring-accent-red/80 active:bg-accent-red/20 dark:hover:bg-gray-100">
                            <div class="group relative">
                              <EllipsisHorizontalIcon
                                class="h-6 w-56text-light-secondary group-hover:text-gray-800 group-focus-visible:text-gray-800 /80 dark:text-gray-100" />

                              <div
                                class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3">
                                <span>More</span>
                              </div>
                            </div>
                          </MenuButton>
                          <transition enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0">
                            <MenuItems
                              class="menu-container absolute right-4 top-12 w-60 font-normal bg-white shadow-md rounded-md py-2 z-50 gap-5 px-2 dark:bg-black dark:text-gray-50">
                              <MenuItem v-if="
                                (me && me.id != reply.user.id) || me == null
                              " as="div">
                              <router-link
                                class="flex w-full cursor gap-3 rounded-md px-4 py-1 duration-200 items-center hover:bg-gray-800"
                                :to="`/feed/${reply.user.username}/`">
                                <UserPlusIcon class="w-5 h-5 text-gray-600 dark:text-gray-200" />Follow
                              </router-link></MenuItem>
                              <MenuItem v-if="me && me.id == reply.user.id" as="div">
                              <button
                                class="flex w-full cursor gap-3 dark:text-gray-200 rounded-md px-4 py-1 duration-200 items-center hover:bg-gray-100"
                                @click="isEdit = true">
                                <PencilIcon class="w-5 h-5 text-gray-600 dark:text-gray-200" />Edit
                              </button></MenuItem>
                              <MenuItem v-if="me && me.id == reply.user.id" as="div">
                              <button
                                class="flex w-full cursor gap-3 rounded-md px-4 py-1 duration-200 items-center hover:bg-gray-100"
                                @click="deleteFeed(reply.id)">
                                <TrashIcon class="w-5 h-5 text-gray-600" />Delete
                              </button></MenuItem>
                              <MenuItem v-else-if="
                                me &&
                                community &&
                                community.admins.includes(me.id)
                              " as="div">
                              <button
                                class="flex w-full cursor gap-3 rounded-md px-4 py-1 duration-200 items-center hover:bg-gray-100"
                                @click="deleteFeedByAdmin(reply.id)">
                                <TrashIcon class="w-5 h-5 text-gray-600" />Delete
                              </button></MenuItem>
                              <MenuItem v-if="me && me.id == reply.user.id" as="div">
                              <button
                                class="flex w-full cursor gap-3 rounded-md px-4 py-1 duration-200 items-center hover:bg-gray-100">
                                <StarIcon class="w-5 h-5 text-gray-600" />Pin
                                in your profile
                              </button></MenuItem>
                            </MenuItems>
                          </transition>
                        </Menu>
                      </div>
                    </div>
                    <dynamic-content :content="reply.text.trim()" />
                    <div v-if="reply.link"
                      class="relative w-full mx-auto overflow-hidden bg-gray-100 rounded-md shadow ring-1">
                      <div class="flex flex-col space-y">
                        <a :href="reply.link.url" target="_blank" class="w-full">
                          <img class="object-cover aspect-video" v-lazy="reply.link.image" :alt="reply.link.title" />
                        </a>
                        <div class="flex flex-col p-3 space-y">
                          <a :href="reply.link.url" target="_blank"
                            class="m-0 text-md leading-tight text-gray-900 no-underline hover:no-underline hover:text-gray-900 line-clamp-1">{{
                            reply.link.title }}</a>
                          <p class="text-gray-500 text-sm">{{ getHostname(reply.link.url) }}</p>
                          <p class="text-sm line-clamp-2">
                            {{ reply.link.description }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- image  -->
                    <div :key="dominantColor" @click="images = reply.images" v-if="reply.images.length > 0"
                      :style="{ backgroundColor: dominantColor }" class="grid mt-2 gap-0.5" :class="{
                        'grid-cols-1 grid-rows-1': reply.images.length === 1,
                        'grid-cols-2 grid-rows-1': reply.images.length === 2,
                        'grid-cols-1 grid-rows-2': reply.images.length === 3,
                        'grid-cols-1 grid-rows-2': reply.images.length > 3
                      }">
                      <button v-if="reply.images.length == 4" type="button"
                        class="accent-tab relative transition-shadow row-span-2">
                        <figure
                          class="relative w-full flex replys-center justify-center cursor-pointer transition hover:brightness-75 hover:duration-200">
                          <img :alt="''" :ref="'image0'" v-lazy="reply.images[0].image"
                            class="object-cover aspect-square" />
                        </figure>
                        <div class="grid grid-cols-4 gap-2 mt-2">
                          <template :key="index" v-for="(img, index) in reply.images">
                            <img :alt="''" v-lazy="img.image" class="object-cover aspect-square" />
                          </template>
                        </div>
                      </button>
                      <button v-if="reply.images.length > 4" type="button"
                        class="accent-tab relative transition-shadow row-span-2">
                        <figure
                          class="relative w-full flex replys-center justify-center cursor-pointer transition hover:brightness-75 hover:duration-200">
                          <img :alt="''" :ref="'image0'" v-lazy="reply.images[0].image"
                            class="object-cover aspect-square" />
                        </figure>
                        <div class="grid grid-cols-4 gap-2 mt-2">
                          <template :key="index" v-for="(img, index) in reply.images.slice(1, 4)">
                            <img :alt="''" v-lazy="img.image" class="object-cover aspect-square" />
                          </template>
                          <div v-if="reply.images.length - 4 > 0"
                            class="flex replys-center justify-center text-md object-cover aspect-square bg-gray-300">
                            +{{ reply.images.length - 4 }}
                          </div>
                        </div>
                      </button>

                      <template v-else>
                        <button v-for="(img, index) in reply.images" :key="index" type="button"
                          class="accent-tab relative transition-shadow row-span-2">
                          <figure
                            class="relative w-full cursor-pointer flex items-center justify-center transition hover:brightness-75 hover:duration-200 h-full">
                            <img :id="'image_' + reply.id" crossorigin="anonymous" v-lazy="img.image"
                              class="object-contain aspect-square" />
                          </figure>
                        </button>
                      </template>
                    </div>

                  </div>
                </div>
                <!-- more comments -->
                <button v-if="item.topReplies.length > 2" type="button"
                  class="flex items-center gap-1.5 text-gray-500 dark:text-gray-500 hover:text-blue-500 text-sm">
                  <ChevronDownIcon class="w-4 h-4 dark:text-gray-500" />
                  More Comments
                </button>
              </div>
              <div @click="reply()"
                class="flex items-center gap-1 border-t border-gray-100 dark:border-gray-700 py-1 px-4 sm:py-2 text-sm">
                <img class="aspect-square w-6 h-6 object-cover rounded-full self-start mt-2"
                  v-lazy="me ? me.avatar : ''" alt="profile picture" />
                <div class="flex-1">
                  <div
                    class="w-full py-2 px-4 text-gray-600 dark:text-gray-400 font-medium border-0 focus:ring-transparent">
                    Add Comment.....
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
  <ImageView v-if="images.length > 0" :images="images" @close="images = []"></ImageView>

  <TransitionRoot v-if="isEdit" appear :show="isEdit" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="hover-animation fixed inset-0 bg-black/40" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto scrollbar-thin p-4 flex items-start justify-center">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95">
          <DialogPanel class="bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden">
            <Edit class="block" :item="item"></Edit>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import ColorThief from "colorthief";
import { CheckBadgeIcon } from "@heroicons/vue/24/outline";
import { cloneDeep } from "lodash";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/vue";
import {
  SELF_FEED_FEED_DELETE,
  SELF_FEED_FEED_DELETE_BY_ADMIN,
  SELF_FEED_FEED_UPDATE_LIKES,
} from "@/gql/feed";
import {
  EllipsisHorizontalIcon,
  UserPlusIcon,
  StarIcon,
  TrashIcon,
  ShareIcon,
  LinkIcon,
  BookmarkIcon,
  PencilIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  ArrowUpOnSquareIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import { copyText } from "vue3-clipboard";
import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  computed,
  ref,
  watch,
  defineAsyncComponent,
  onMounted,
  defineComponent,
  shallowRef,
  h,
} from "vue";
import { storeToRefs } from "pinia";
import { useMeStore } from "@/stores/me";
import { useCommunityStore } from "@/stores/community";
import { useNotificationsStore } from "@/stores/notifications";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useSiteStore } from "@/stores/site";
import { useFeedStore } from "@/stores/feed";
import { useShareStore } from "@/stores/share";
dayjs.extend(relativeTime);
const ImageView = defineAsyncComponent(() =>
  import("@/components/community/ImageView.vue")
);
const DynamicContent = defineAsyncComponent(() =>
  import("@/components/community/DynamicContent.vue")
);
const Edit = defineAsyncComponent(() => import("@/components/community/Edit.vue"));
const router = useRouter();
const { addShare } = useShareStore();
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { feed, isShowCreate, feedType } = storeToRefs(useFeedStore());
const { community } = storeToRefs(useCommunityStore());
const { site, locale } = storeToRefs(useSiteStore());
const { setFeed } = useFeedStore();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const isLiked = ref(props.item.isLiked);
const likes = ref(props.item.likes);
const isReact = ref(false);
const isDeleted = ref(false);
const isEdit = ref(false);
const images = ref([]);
const dominantColor = ref("rgb(255,255,255)");
const updateLike = async (id, status) => {
  if (me.value) {
    const { mutate, loading, error } = useMutation(
      SELF_FEED_FEED_UPDATE_LIKES,
      {
        variables: {
          userId: me.value.id,
          id: id,
          status: status,
          score: 4,
        },
      }
    );
    try {
      const response = await mutate();
      if (response.data.selfFeedFeedUpdateLikes) {
        if (status == "increment") {
          isLiked.value = true;
        } else {
          isLiked.value = false;
        }
        likes.value = response.data.selfFeedFeedUpdateLikes.likes;
      }
    } catch (error) {
      addNotification(
        { title: "Brand info", subTitle: error.message },
        "error"
      );
    }
  } else {
    closeModal();
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
};
const deleteFeed = async (id) => {
  const { mutate, loading, error } = useMutation(SELF_FEED_FEED_DELETE, {
    variables: {
      userId: me.value.id,
      id: id,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfFeedFeedDelete) {
      isDeleted.value = true;
    }
  } catch (error) {
    addNotification({ title: "Brand info", subTitle: error.message }, "error");
  }
};
const deleteFeedByAdmin = async (id) => {
  const { mutate, loading, error } = useMutation(
    SELF_FEED_FEED_DELETE_BY_ADMIN,
    {
      variables: {
        userId: me.value.id,
        id: id,
        communityId: community.value.id,
      },
    }
  );
  try {
    const response = await mutate();
    if (response.data.selfFeedFeedDeleteByAdmin) {
      isDeleted.value = true;
    }
  } catch (error) {
    addNotification({ title: "Brand info", subTitle: error.message }, "error");
  }
};
const copy = (url) => {
  console.log(url);
  copyText(url);

  addNotification(
    { title: "Feed info", subTitle: "Copied successfully!" },
    "success"
  );
};
const reply = () => {
  feed.value = props.item;
  isShowCreate.value = true;
  feedType.value = 1;
};
const repost = () => {
  feed.value = props.item;
  isShowCreate.value = true;
  feedType.value = 2;
};
const closeModal = () => {
  isEdit.value = false;
};

const getColor = () => {
  const colorThief = new ColorThief();
  const img = document.getElementById("image_" + props.item.id);
  img.addEventListener("load", function () {
    const d = colorThief.getColor(img);
    dominantColor.value = `rgb(${d.join(",")})`;
  });
  if (img.complete) {
    const d = colorThief.getColor(img);
    if (`rgb(${d.join(",")})` == "rgb(244, 244, 244)") {
      dominantColor.value = `rgb(${d.join(",")})`;
    }
  }
};
const share = computed(() => {
  return {
    title: "props.item.text",
    url: `https://${site.value.domain}/feed/post/${props.item.hid}`,
    description: props.item.text,
    quote: "",
    media: props.item.images.length > 0 ? props.item.images[0].image : "",
    twitterUser: "",
    hashtags: ["boisodai", "booklover"],
  };
});
const key = shallowRef("facebook");
const networks = shallowRef({
  email: "mailto:?subject=@t&body=@u%0D%0A@d",
  facebook:
    "https://www.facebook.com/sharer/sharer.php?u=@u&title=@t&description=@d&quote=@q&hashtag=@h",
  reddit: "https://www.reddit.com/submit?url=@u&title=@t",
  sms: "sms:?body=@t%0D%0A@u%0D%0A@d",
  twitter: "https://twitter.com/intent/tweet?text=@t&url=@u&hashtags=@h@tu",
  whatsapp: "https://api.whatsapp.com/send?text=@t%0D%0A@u%0D%0A@d",
});

const rawLink = computed(() => {
  const ua = navigator.userAgent.toLowerCase();
  if (
    key.value === "sms" &&
    (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1)
  ) {
    return networks.value[key.value].replace(":?", ":&");
  }
  return networks.value[key.value];
});
const shareLink = computed(() => {
  let link = rawLink.value;
  if (key.value === "twitter") {
    if (!share.value.hashtags.length) link = link.replace("&hashtags=@h", "");
    if (!share.value.twitterUser.length) link = link.replace("@tu", "");
  }
  return link
    .replace(/@tu/g, "&via=" + encodeURIComponent(share.value.twitterUser))
    .replace(/@u/g, encodeURIComponent(share.value.url))
    .replace(/@t/g, encodeURIComponent(share.value.title))
    .replace(/@d/g, encodeURIComponent(share.value.description))
    .replace(/@q/g, encodeURIComponent(share.value.quote))
    .replace(/@h/g, encodedHashtags.value)
    .replace(/@m/g, encodeURIComponent(share.value.media));
});
const encodedHashtags = computed(() => {
  if (key.value === "facebook" && share.value.hashtags.length) {
    return "%23" + share.value.hashtags[0];
  }

  return share.value.hashtags;
});
const shareUrl = (item) => {
  key.value = item;
  var win = window.open(shareLink.value, "_blank");
  win.focus();
};
const social = shallowRef([
  {
    name: "facebook",
    href: "https://www.facebook.com/",
    icon: defineComponent({
      render: () =>
        h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
          h("path", {
            "fill-rule": "evenodd",
            d: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
            "clip-rule": "evenodd",
          }),
        ]),
    }),
  },
  {
    name: "instagram",
    href: "https://www.instagram.com/",
    icon: defineComponent({
      render: () =>
        h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
          h("path", {
            "fill-rule": "evenodd",
            d: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
            "clip-rule": "evenodd",
          }),
        ]),
    }),
  },
  // {
  //   name: "twitter",
  //   href: "https://www.twitter.com/",
  //   icon: defineComponent({
  //     render: () =>
  //       h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
  //         h("path", {
  //           d: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
  //         }),
  //       ]),
  //   }),
  // },
  {
    name: "whatsapp",
    href: "https://www.whatsapp.com/",
    icon: defineComponent({
      render: () =>
        h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
          h("path", {
            "fill-rule": "evenodd",
            d: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z",
            "clip-rule": "evenodd",
          }),
        ]),
    }),
  },
]);
onMounted(() => {
  setTimeout(() => {
    getColor();
  }, 100);
});

const getHostname = (url) => {
  return new URL(url).hostname;
}
</script>
