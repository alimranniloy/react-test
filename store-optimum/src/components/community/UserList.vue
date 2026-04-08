<template>
  <div v-for="user in users.edges" :key="user.node.id">
    <UserItem :user="user.node" />
  </div>

  <button v-if="hasMore" @click="loadMore"
    class="rounded-md border-transparent accent-tab hover-card block w-full rounded-2xl rounded-t-none text-center text-main-accent"
    >Show more</button
  >
</template>

<script setup>
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import { PlusIcon } from "@heroicons/vue/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { USERS } from "@/gql/user";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useMeStore } from "@/stores/me";
import { useNotificationsStore } from "@/stores/notifications";
import { useUserStore } from "@/stores/user";
import { useSearchStore } from "@/stores/search";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useSiteStore } from "@/stores/site";
dayjs.extend(relativeTime);
const UserItem = defineAsyncComponent(() =>
  import("@/components/community/UserItem.vue")
);
const router = useRouter();
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { search } = storeToRefs(useSearchStore());
const { site, isMobile } = storeToRefs(useSiteStore());

const props = defineProps({
  followerId: {
    type: Number,
    required: false,
  },
  followingId: {
    type: Number,
    required: false,
  },
});
// customer parameter
const first = ref(5);
const hasMore = ref(true);
// end parameter
// query
const { result, fetchMore, loading, error, refetch } = useQuery(USERS, {
  followerId: props.followerId ? props.followerId : null,
  followingId: props.followingId ? props.followingId : null,
  first: first.value,
  after: null,
});
const users = computed(() => {
  return result.value?.users ?? [];
});
const after = computed(() => {
  return users.value && users.value.pageInfo
    ? users.value.pageInfo.endCursor
    : null;
});
const loadMore = async ($state) => {
  fetchMore({
    variables: {
      first: first.value,
      after: after.value,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.users.edges;
      const newEdges = fetchMoreResult.users.edges;
      const pageInfo = fetchMoreResult.users.pageInfo;
      if (!fetchMoreResult || newEdges.length === 0) {
        $state ? $state.complete() : null;
        hasMore.value = false;
        return previousResult;
      }
      $state ? $state.loaded() : null;
      hasMore.value = true;
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
</script>
