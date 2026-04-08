<template>
  <div class="space-y-0 lg:col-span-3 lg:col-start-1 mt-4">
    <div class="flow-root">
      <ul role="list" class="-mb-8">
        <li v-for="review in reviews.edges" :key="review.node.id">
          <div class="relative pb-8 flex justify-between">
            <span
              class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            />
            <div class="relative flex items-start space-x-3">
              <div class="relative">
                <img
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white border"
                  v-lazy="review.node.user.avatar"
                  alt=""
                />
              </div>
              <div class="min-w-0 flex-1">
                <div>
                  <div class="text-sm">
                    <a :href="'#'" class="font-medium text-gray-900">{{
                      review.node.user.name
                    }}</a>
                  </div>
                  <p class="mt-0.5 text-sm text-gray-500">
                    {{ dayjs(review.node.createdAt).fromNow() }}
                  </p>
                </div>
                <div class="text-sm text-gray-700">
                  <div class="mt-1 flex items-center mb-2 text-xs">
                    <StarIcon
                      class="w-4 h-4 text-yellow-400 me-1"
                      :class="review.node.rating >= 1 ? 'fill-yellow-400' : ''"
                    />
                    <StarIcon
                      class="w-4 h-4 text-yellow-400 me-1"
                      :class="review.node.rating >= 2 ? 'fill-yellow-400' : ''"
                    />
                    <StarIcon
                      class="w-4 h-4 text-yellow-400 me-1"
                      :class="review.node.rating >= 3 ? 'fill-yellow-400' : ''"
                    />
                    <StarIcon
                      class="w-4 h-4 text-yellow-400 me-1"
                      :class="review.node.rating >= 4 ? 'fill-yellow-400' : ''"
                    />
                    <StarIcon
                      class="w-4 h-4 text-yellow-400 me-1"
                      :class="review.node.rating >= 5 ? 'fill-yellow-400' : ''"
                    />
                    <!-- <p class="ms-1 text-xs font-medium text-gray-500 dark:text-gray-400">4.95</p>
                    <p class="ms-1 text-xs font-medium text-gray-500 dark:text-gray-400">out of</p>
                    <p class="ms-1 text-xs font-medium text-gray-500 dark:text-gray-400">5</p> -->
                  </div>
                  <p>{{ review.node.description }}</p>
                </div>
              </div>
            </div>
            <div v-if="me && review.node.user.id == me.id" class="">
              <button
                @click="deleteReview(review.node.id)"
                class="bg-red-400 text-white px-2 py-1 rounded text-sm mt-2 w-full hover:bg-gray-300 transition-all whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="pt-8 flex items-start space-x-4">
      <div class="flex-shrink-0 z-10">
        <img
          class="inline-block h-10 w-10 rounded-full"
          v-lazy="site.favicon"
          alt=""
        />
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center mb-4">
          <StarIcon
            @click="rating = 1"
            class="w-6 h-6 text-yellow-400 me-1"
            :class="rating >= 1 ? 'fill-yellow-400' : ''"
          />
          <StarIcon
            @click="rating = 2"
            class="w-6 h-6 text-yellow-400 me-1"
            :class="rating >= 2 ? 'fill-yellow-400' : ''"
          />
          <StarIcon
            @click="rating = 3"
            class="w-6 h-6 text-yellow-400 me-1"
            :class="rating >= 3 ? 'fill-yellow-400' : ''"
          />
          <StarIcon
            @click="rating = 4"
            class="w-6 h-6 text-yellow-400 me-1"
            :class="rating >= 4 ? 'fill-yellow-400' : ''"
          />
          <StarIcon
            @click="rating = 5"
            class="w-6 h-6 text-yellow-400 me-1"
            :class="rating == 5 ? 'fill-yellow-400' : ''"
          />
          <!-- <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">4.95</p> -->
          <!-- <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p> -->
          <!-- <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p> -->
        </div>
        <div class="relative">
          <div
            class="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within: focus-within:ring-1 focus-within:ring-[--primary]"
          >
            <label for="comment" class="sr-only">Add your comment</label>
            <textarea
              v-model="description"
              rows="2"
              name="comment"
              id="comment"
              class="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
              placeholder="Add your comment..."
            />
            <div class="py-2" aria-hidden="true">
              <div class="py-px">
                <div class="h-9" />
              </div>
            </div>
          </div>
          <div
            class="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2"
          >
            <div class="flex-shrink-0">
              <button
                @click="confirm()"
                type="submit"
                class="inline-flex items-center rounded-md border border-transparent bg-[--primary] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:ring-offset-2"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { StarIcon } from "@heroicons/vue/24/outline";
import {
  STORE_PRODUCT_REVIEWS,
  SELF_STORE_PRODUCT_REVIEW_CREATE,
  SELF_STORE_PRODUCT_REVIEW_DELETE,
} from "@/gql/productReview";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useMeStore } from "@/stores/me";
import { useNotificationsStore } from "@/stores/notifications";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useSiteStore } from "@/stores/site";
dayjs.extend(relativeTime);
const router = useRouter();
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { site } = storeToRefs(useSiteStore());

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
});

const description = ref("");
const rating = ref(5);
const first = ref([1].includes(site.value.industry) ? 10 : 12);
const after = ref(null);
// query
const { result, fetchMore, loading, error, refetch } = useQuery(
  STORE_PRODUCT_REVIEWS,
  {
    productId: props.productId,
    first: first.value,
    after: after.value,
  }
);
const reviews = computed(
  () => result.value?.storeProductReviews ?? { edges: [] }
);
const loadMore = () => {
  fetchMore({
    variables: {
      first: first.value,
      after: reviews.value.pageInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.storeProductReviews.edges;
      const newEdges = fetchMoreResult.storeProductReviews.edges;
      const pageInfo = fetchMoreResult.storeProductReviews.pageInfo;
      return newEdges.length
        ? {
            storeProductReviews: {
              __typename: previousResult.storeProductReviews.__typename,
              total: previousResult.storeProductReviews.total,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};

const confirm = async () => {
  if (description.value.length >= 5) {
    if (me.value) {
      const { mutate, loading, error } = useMutation(
        SELF_STORE_PRODUCT_REVIEW_CREATE,
        {
          variables: {
            userId: me.value.id,
            productId: props.productId,
            description: description.value,
            rating: rating.value,
          },
        }
      );
      try {
        const response = await mutate();
        if (response.data.selfStoreProductReviewCreate) {
          description.value = "";
          refetch();
        }
      } catch (error) {}
    } else {
      router.push(`/login/?redirect=${router.currentRoute.value.path}`);
    }
  } else {
    addNotification(
      {
        title: "Review info",
        subTitle: "Comment must be more than 5 character",
      },
      "error"
    );
  }
  rating.value = 5;
};
const deleteReview = async (id) => {
  if (me.value) {
    const { mutate, loading, error } = useMutation(
      SELF_STORE_PRODUCT_REVIEW_DELETE,
      {
        variables: {
          userId: me.value.id,
          id: id,
        },
      }
    );
    try {
      const response = await mutate();
      if (response.data.selfStoreProductReviewDelete) {
        refetch();
      }
    } catch (error) {}
  } else {
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
};
</script>
