<template>
  <div v-for="community in communities.edges" :key="community.node.id">
    <CommunityItem :community="community.node" />
  </div>
  <button v-if="hasMore" @click="loadMore"
    class="rounded-md border-transparent accent-tab hover-card block w-full rounded-2xl rounded-t-none text-center text-main-accent"
    >Show more</button
  >
</template>

<script setup>
import { FEED_COMMUNITIES } from "@/gql/community";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
const CommunityItem = defineAsyncComponent(() =>
  import("@/components/community/CommunityItem.vue")
);
// customer parameter
const first = ref(5);
const hasMore = ref(true);
// end parameter
// query
const { result, fetchMore, loading, error, refetch } = useQuery(FEED_COMMUNITIES, {
  first: first.value,
  after: null,
});
const communities = computed(() => {
  return result.value?.feedCommunities ?? [];
});
const after = computed(() => {
  return communities.value && communities.value.pageInfo
    ? communities.value.pageInfo.endCursor
    : null;
});
const loadMore = async ($state) => {
  fetchMore({
    variables: {
      first: first.value,
      after: after.value,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.feedCommunities.edges;
      const newEdges = fetchMoreResult.feedCommunities.edges;
      const pageInfo = fetchMoreResult.feedCommunities.pageInfo;
      if (!fetchMoreResult || newEdges.length === 0) {
        hasMore.value = false;
        return previousResult;
      }
      hasMore.value = true;
      return newEdges.length
        ? {
            feedCommunities: {
              __typename: previousResult.feedCommunities.__typename,
              total: previousResult.feedCommunities.total,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
</script>
