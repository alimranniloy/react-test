<template>
  <section class="mt-0.5 xs:mt-0 ">
    <div v-if="loading"
      class="md:rounded-xl shadow-sm p-4 mt-4 space-y-4 bg-slate-200/60 animate-pulse border1 dark:bg-dark2">
      <div class="flex gap-3">
        <div class="w-9 h-9 rounded-full bg-slate-300/60"></div>
        <div class="flex-1 space-y-3">
          <div class="w-40 h-5 rounded-md bg-slate-300/60"></div>
          <div class="w-24 h-4 rounded-md bg-slate-300/60"></div>
        </div>
        <div class="w-6 h-6 rounded-full bg-slate-300/60"></div>
      </div>
      <div class="w-full h-52 rounded-lg bg-slate-300/10 my-3"></div>
      <div class="flex gap-3">
        <div class="w-16 h-5 rounded-md bg-slate-300/60"></div>
        <div class="w-14 h-5 rounded-md bg-slate-300/60"></div>
        <div class="w-6 h-6 rounded-full bg-slate-300/60 ml-auto"></div>
        <div class="w-6 h-6 rounded-full bg-slate-300/60"></div>
      </div>
    </div>
    <div v-for="feed in feeds.edges" :key="feed.node.id"
      class="cursor-pointer bg-white md:my-4 md:rounded-md border-b md:border flex flex-col justify-between">
      <FeedItem :item="feed.node" />
    </div>
    <InfiniteLoading :firstload="false" v-if="hasMore" @infinite="loadMore" />
  </section>
</template>

<script setup>
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import { FEED_FEEDS, FEED_FEED_SUBSCRIPTION, FEED_TRAIN } from "@/gql/feed";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { useMeStore } from "@/stores/me";
import { storeToRefs } from "pinia";
import { useCommunityStore } from "@/stores/community";
import { useSiteStore } from "@/stores/site";
import { useQuery, useMutation, useSubscription } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
const { me } = storeToRefs(useMeStore());
const FeedItem = defineAsyncComponent(() =>
  import("@/components/community/FeedItem.vue")
);
const router = useRouter();
const { community } = storeToRefs(useCommunityStore());
const { site } = storeToRefs(useSiteStore());
const props = defineProps({
  userId: {
    type: Number,
    required: false,
  },
  communityId: {
    type: Number,
    required: false,
  },
  parentId: {
    type: Number,
    required: false,
  },
  queryType: {
    type: String,
    required: false,
  },
});
// customer parameter
const first = ref(15);
const after = ref(null);
const hasMore = ref(true);
// end parameter
// query
const { result, fetchMore, subscribeToMore, loading } = useQuery(FEED_FEEDS, {
  userId: props.queryType == "foryou" && me.value ? me.value.id : props.userId,
  communityId: community.value.id,
  parentId: props.parentId ? props.parentId : null,
  childId: me.value ? me.value.id : null,
  queryType: router.currentRoute.value.query["queryType"]
      ? router.currentRoute.value.query["queryType"] : props.queryType ? props.queryType
      : site.value.queryType,
  first: first.value,
  after: after.value,
});
const feeds = computed(() => {
  return result.value?.feedFeeds ?? [];
});
const loadMore = () => {
  fetchMore({
    variables: {
      first: first.value,
      after: feeds.value.pageInfo.endCursor,
      limit: first.value > 2000 ? first.value : null,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.feedFeeds.edges;
      const newEdges = fetchMoreResult.feedFeeds.edges;
      const pageInfo = fetchMoreResult.feedFeeds.pageInfo;
      return newEdges.length
        ? {
          feedFeeds: {
            __typename: previousResult.feedFeeds.__typename,
            total: previousResult.feedFeeds.total,
            edges: [...previousEdges, ...newEdges],
            pageInfo,
          },
        }
        : previousResult;
    },
  });
};
subscribeToMore(() => ({
  document: FEED_FEED_SUBSCRIPTION,
  variables: {
    channel: props.communityId
      ? window.btoa("feed_community_" + props.communityId)
      : community.value
        ? window.btoa("feed_community_" + community.value.id)
        : me.value
          ? window.btoa("feed_user_" + me.value.id)
          : window.btoa("feed_user_" + 1),
  },
  updateQuery: (previousResult, { subscriptionData }) => {
    const previousEdges = previousResult.feedFeeds.edges;
    const newEdges = [{ node: subscriptionData.data.chatMessage }];
    const pageInfo = previousResult.feedFeeds.pageInfo;
    return newEdges.length
      ? {
        feedFeeds: {
          __typename: previousResult.feedFeeds.__typename,
          edges: [...previousEdges, ...newEdges],
          pageInfo,
        },
      }
      : previousResult;
  },
}));

const train = async () => {
  const { mutate, loading, error } = useMutation(FEED_TRAIN, {
    variables: {},
  });
  try {
    const response = await mutate();
    if (response.data.feedTrain) {
    }
  } catch (error) {
    addNotification({ title: "Brand info", subTitle: error.message }, "error");
  }
};
</script>
