import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from './notifications'
import {
  SITE_FEEDS, SITE_FEED_PREVIEW
} from "@/gql/feed";
const ls = new SecureLS({
  encryptionNamespace: 'site-admin'
});
export const useFeedStore = defineStore("feed_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    feedId: null,
    feed: null,
    feeds: [],
  }),
  getters: {},
  actions: {
    async setFeedId(feedId) {
      this.feedId = feedId;
    },
    async getFeed(id) {
      const { onResult, loading, error } = useQuery(SITE_FEED_PREVIEW, {
        id: id,
      })
      onResult(queryResult => {
        this.feed = queryResult.data.siteFeed;
      });
    },
    async getFeeds(siteId) {
      const { onResult, loading, error } = useQuery(SITE_FEEDS, {
        siteId: siteId,
        first: 15
      })
      onResult(queryResult => {
        if (queryResult.data.siteFeeds) {
          this.feeds = queryResult.data.siteFeeds.edges
            .map((v) => v.node)
            .filter((v) => v.isActive === true);
        }
      });
    },
  },
  persist: {
    storage: {
      getItem: key => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: key => ls.remove(key)
    },
  },
});
