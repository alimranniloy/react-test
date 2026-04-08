<template>
  <div class="mb-4">
    <h3 class="font-extrabold text-2xl text-black dark:text-white hidden">
      Stories
    </h3>

    <div class="relative overflow-hidden">
      <!-- <div class="px-4 pt-2">
        <Flicking
          :key="'home_flicking'"
          class="rounded-md overflow-hidden"
          :options="{
            align: 'prev',
            circular: true,
            circularFallback: 'bound',
            panelsPerView: isMobile ? 6 : 12,
          }"
          :plugins="sliderPlugin"
        >
          <div class="md:pr-3">
            <div
              class="md:w-16 md:h-16 w-12 h-12 rounded-full relative border-2 border-dashed grid place-items-center bg-slate-200 border-slate-300 dark:border-slate-700 dark:bg-dark2 shrink-0"
            >
              <CameraIcon class="h-5 w-5 text-black" />
            </div>
          </div>
          <div
            v-for="member in members.edges" :key="member.node.id"
            class="md:pr-3 pr-2 hover:scale-[1.15] hover:-rotate-2 duration-300"
          >
            <router-link :to="`/feed/${member.node.username}`">
              <div
                class="md:w-16 md:h-16 w-12 h-12 relative md:border-4 border-2 shadow border-white rounded-full overflow-hidden dark:border-slate-700"
              >
                <img
                  :alt="member.node.username"
                  v-lazy="member.node.avatar"
                  class="absolute w-full h-full object-cover"
                />
              </div>
            </router-link>
          </div>
          <div class="md:pr-3 pr-2">
            <div
              class="md:w-16 md:h-16 w-12 h-12 bg-slate-200/60 rounded-full dark:bg-dark2 animate-pulse"
            ><CameraIcon class="h-5 w-5 text-black" /></div>
          </div>
        </Flicking>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import {
  CameraIcon,
} from "@heroicons/vue/24/outline";
import { FEED_MEMBERS } from "@/gql/member";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useCommunityStore } from "@/stores/community";
import { useQuery, useMutation, } from "@vue/apollo-composable";
import { useSiteStore } from "@/stores/site";
const { site, isMobile } = storeToRefs(useSiteStore());
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
const { result, fetchMore, loading, error, refetch } = useQuery(FEED_MEMBERS, {
  communityId: props.communityId ? props.communityId : community.value ? community.value.id : null,
  first: first.value,
  after: null,
});
const members = computed(() => {
  return result.value?.feedMembers ?? {edges: []};
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

