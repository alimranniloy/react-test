<template>
  <div>
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Users</h1>
      <p class="mt-2 text-sm text-gray-700">
        A list of all the users in your account including their name, title,
        email and role.
      </p>
    </div>
    <div class="mt-4 mb:mt-8 flex flex-col">
      <div class="mb:-my-2 mb:-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div
          class="inline-block min-w-full py-1 mb:py-2 align-middle px-1 md:px-6 lg:px-8"
        >
          <div
            class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-md md:rounded-lg"
          >
            <!-- <div
            v-if="selectedUser.length > 0"
            class="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16"
          >
            <button
              type="button"
              class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Delete all
            </button>
          </div> -->
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="relative w-6 px-4 sm:w-6 sm:px-4">
                    SL
                  </th>
                  <th scope="col" class="relative w-5 px-5 sm:w-5 sm:px-5">
                    <input
                      type="checkbox"
                      class="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      :checked="
                        indeterminate ||
                        selectedUser.length === users.edges.length
                      "
                      :indeterminate="indeterminate"
                      @change="
                        selectedUser = $event.target.checked
                          ? users.edges.map((p) => p.node.id)
                          : []
                      "
                    />
                  </th>
                  <th
                    scope="col"
                    class="min-w-[6rem] py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-100"
                  >
                    Connection
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    Joined At
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="user in users.edges"
                  :key="user.node.id"
                  :class="[
                    selectedUser.includes(user.node.id) && 'bg-gray-50',
                    user.node.status == 10 ? 'bg-green-100' : '',
                    user.node.status == 9 ? 'bg-red-100' : '',
                    user.node.status == 8 ? 'bg-yellow-100' : '',
                    user.node.status == 7 ? 'bg-orange-100' : '',
                  ]"
                  class="cursor-pointer active:cursor-wait"
                >
                  <td class="relative w-5 px-5 sm:w-5 sm:px-5">
                    <div
                      v-if="selectedUser.includes(user.node.id)"
                      class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                    ></div>
                    <input
                      type="checkbox"
                      class="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      :value="user.node.id"
                      v-model="selectedUser"
                    />
                  </td>
                  <td class="whitespace-nowrap py-2 pl-3 sm:pl-0 pr-3 text-sm">
                    <div class="flex items-center">
                      <div class="ml-0">
                        <div
                          :class="[
                            'whitespace-nowrap text-sm font-medium',
                            selectedUser.includes(user.node.id)
                              ? 'text-indigo-600'
                              : 'font-medium text-gray-900',
                          ]"
                        >
                          #&nbsp;{{ user.node.referCode }}
                        </div>
                        <div class="text-gray-500 text-xs">
                          {{ user.node.name }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    class="whitespace-nowrap px-2 py-2 text-sm text-gray-500 w-100"
                  >
                    <div class="text-gray-900">
                      {{ user.node.name }}
                    </div>
                    <div class="text-gray-500 text-xs">
                      {{ user.node.phone }}
                    </div>
                  </td>
                  <td
                    v-if="user.node.refereds"
                    class="whitespace-nowrap px-2 py-2 text-sm text-gray-500 w-100 flex items-center w-100"
                  >
                    <div
                      v-for="item in cloneDeep(user.node.refereds)
                        .sort((a, b) => b.serial - a.serial)
                        .slice(0, 3)"
                      :key="item.id"
                      class="text-gray-900"
                    >
                      <div
                        class="px-2 py-1 mr-1 bg-green-300 rounded-full text-gray-800 whitespace-nowrap truncate w-20"
                        v-if="
                          user.node.refereds.find((a) => a.userId == me.id)
                            ? user.node.refereds.find((a) => a.userId == me.id)
                                .serial <= item.serial
                            : false
                        "
                      >
                        {{ item.title }}
                      </div>
                    </div>
                    <div
                      v-if="
                        cloneDeep(user.node.refereds).sort(
                          (a, b) => b.serial - a.serial
                        ).length > 3
                      "
                      class="px-2 py-1 mr-1 bg-green-300 rounded-full text-gray-800 whitespace-nowrap truncate"
                    >
                      +&nbsp;{{
                        cloneDeep(user.node.refereds).sort(
                          (a, b) => b.serial - a.serial
                        ).length - 3
                      }}
                    </div>
                  </td>
                  <td
                    class="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right"
                  >
                    <div class="text-gray-900">
                      {{ dayjs(user.node.dateJoined).fromNow() }}
                    </div>
                    <div class="text-gray-500 text-xs">
                      @
                      {{ dayjs(user.node.dateJoined).format("h:mm A MMM D") }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <nav
              v-if="users.edges.length == 0"
              class="text-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6"
              aria-label="Pagination"
            >
              <div class="hidden sm:block">
                <p class="text-sm text-gray-700">No record :-(</p>
              </div>
              <div class="flex flex-1 justify-between sm:justify-end">
                <div class="inline-flex rounded-md shadow-sm"></div>
              </div>
            </nav>
            <nav
              v-else-if="users.edges.length >= first || hasMore"
              class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-4"
              aria-label="Pagination"
            >
              <div class="hidden sm:block">
                <p class="text-sm text-gray-700">
                  Showing
                  {{ " " }}
                  <span class="font-medium">1</span>
                  {{ " " }}
                  to
                  {{ " " }}
                  <span class="font-medium">{{
                    users.edges ? users.edges.length : 0
                  }}</span>
                </p>
              </div>
              <div class="flex flex-1 justify-between sm:justify-end">
                <div class="inline-flex rounded-md shadow-sm">
                  <button
                    @click="loadMore()"
                    type="button"
                    class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
                  >
                    Next
                  </button>
                  <Menu as="div" class="relative -ml-px block">
                    <MenuButton
                      class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none"
                    >
                      <span class="sr-only">Open options</span>{{ first }}
                      <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                    </MenuButton>
                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        class="absolute left-0 sm:left-auto sm:right-0 bottom-12 z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <div class="py-1">
                          <MenuItem
                            @click="first = item.value"
                            v-for="item in moreItems"
                            :key="item.name"
                            v-slot="{ active }"
                          >
                            <div
                              :class="[
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm',
                              ]"
                            >
                              {{ item.name }}
                            </div>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { cloneDeep } from "lodash";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { computed, ref } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { USERS } from "@/gql/user";
import { useQuery } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const { site } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
// customer parameter
const first = ref([1].includes(site.value.industry) ? 10 : 12);
const after = ref(null);
// end parameter

const selectedUser = ref([]);
const indeterminate = computed(
  () =>
    selectedUser.value.length > 0 && selectedUser.value.length < users.length
);
// query
const { result, fetchMore, loading, error, refetch } = useQuery(USERS, {
  referedById: me.value.id,
  first: first.value,
  after: after.value,
});
const users = computed(() => result.value?.users ?? { edges: [] });
const loadMore = () => {
  fetchMore({
    variables: {
      first: first.value,
      after: users.value.pageInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.users.edges;
      const newEdges = fetchMoreResult.users.edges;
      const pageInfo = fetchMoreResult.users.pageInfo;
      return newEdges.length
        ? {
            users: {
              __typename: previousResult.users.__typename,
              total: previousResult.users.total,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
// end query

const moreItems = [
  { name: "15", value: 15 },
  { name: "30", value: 30 },
  { name: "100", value: 100 },
  { name: "200", value: 200 },
];
</script>
