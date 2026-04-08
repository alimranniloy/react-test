<template>
  <div v-for="member in members.edges" :key="member.node.id" class="">
    <UserItem :user="member.node" />
  </div>

  <button
    v-if="hasMore"
    @click="loadMore"
    class="rounded-md border-transparent accent-tab hover-card block w-full rounded-2xl rounded-t-none text-center text-main-accent"
  >
    Show more
  </button>
</template>

<script setup>
import { FEED_MEMBERS } from "@/gql/member";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useCommunityStore } from "@/stores/community";
import { useQuery, useMutation } from "@vue/apollo-composable";
const UserItem = defineAsyncComponent(() =>
  import("@/components/community/UserItem.vue")
);
const { community } = storeToRefs(useCommunityStore());
const props = defineProps({
  communityId: {
    type: Number,
    required: false,
  },
});
// customer parameter
const first = ref(5);
const hasMore = ref(true);
// end parameter
// query
const { result, fetchMore } = useQuery(FEED_MEMBERS, {
  communityId: props.communityId
    ? props.communityId
    : community.value
    ? community.value.id
    : null,
  first: first.value,
  after: null,
});
const members = computed(() => {
  return result.value?.feedMembers ?? [];
});
const after = computed(() => {
  return members.value && members.value.pageInfo
    ? members.value.pageInfo.endCursor
    : null;
});
const loadMore = async ($state) => {
  fetchMore({
    variables: {
      first: first.value,
      after: after.value,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.feedMembers.edges;
      const newEdges = fetchMoreResult.feedMembers.edges;
      const pageInfo = fetchMoreResult.feedMembers.pageInfo;
      if (!fetchMoreResult || newEdges.length === 0) {
        $state ? $state.complete() : null;
        hasMore.value = false;
        return previousResult;
      }
      $state ? $state.loaded() : null;
      hasMore.value = true;
      return newEdges.length
        ? {
            feedMembers: {
              __typename: previousResult.feedMembers.__typename,
              total: previousResult.feedMembers.total,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
</script>
