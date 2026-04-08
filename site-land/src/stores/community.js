import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { FEED_COMMUNITY_BY_USER, FEED_COMMUNITY_CREATE } from "@/gql/community";
import { cloneDeep } from "lodash";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useCommunityStore = defineStore(
  "community_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      community: null,
      tempCommunity: null,
    }),
    getters: {},
    actions: {
      async getCommunityByUser(userId, slug) {
        const { onResult, loading, onError } = useQuery(
          FEED_COMMUNITY_BY_USER,
          {
            userId: userId,
            slug: slug,
          }
        );
        onResult((queryResult) => {
          this.community = cloneDeep(queryResult.data.feedCommunityFindByUser);
        });
      },
      async createCommunityByUser(userId, data) {
        const { mutate, loading, error } = useMutation(FEED_COMMUNITY_CREATE, {
          variables: {
            userId: userId,
            admins: data.admins,
            avatar: data.avatar,
            cover: data.cover,
            interest: data.interest,
            isPrivate: data.isPrivate,
            slug: data.slug,
            score: data.score,
            staffs: data.staffs,
            title: data.title,
          },
        });
        try {
          const response = await mutate();
          if (response.data.feedCommunityCreate) {
            this.community = response.data.feedCommunityCreate;
          }
        } catch (error) {}
      },
      async setTempCommunity(community) {
        this.tempCommunity = community;
      },
    },
    persist: {
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    },
  }
);
