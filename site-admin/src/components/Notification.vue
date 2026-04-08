<template>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div v-for="(notification, index) in notifications" :key="index" aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[99999]">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg  shadow-lg ring-1 ring-black ring-opacity-5"
          :class="notification.type == 'error' ? 'bg-red-50' : 'bg-white'">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <XCircleIcon v-if="notification.type == 'error'" class="h-6 w-6 text-red-400" aria-hidden="true" />
                <CheckCircleIcon v-else class="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium " :class="notification.type == 'error' ? 'text-red-700' : 'text-gray-900'">
                  {{ notification.title }}</p>
                <p class="mt-1 text-sm" :class="notification.type == 'error' ? 'text-red-500' : 'text-gray-500'">{{
                  notification.subTitle }}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="removeNotification(notification)"
                  class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-offset-2">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
const { notifications } = storeToRefs(useNotificationsStore());
const { removeNotification } = useNotificationsStore();
</script>