import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { FEED_MEMBERS, FEED_MEMBER_DETAILS } from "@/gql/member";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useMemberStore = defineStore(
  "community_member" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      member: null,
    }),
    getters: {},
    actions: {
      async getMemberByUser(userId, communityId) {
        const { onResult, loading, error } = useQuery(FEED_MEMBER_DETAILS, {
          id: 1,
        });
        onResult((queryResult) => {
          this.member = queryResult.data.feedMember;
        });
      },
      async getMembers(userId, slug) {
        const { onResult, loading, error } = useQuery(FEED_MEMBERS, {
          userId: userId,
          slug: slug,
        });
        onResult((queryResult) => {
          this.member = queryResult.data.feedMemberFindByUser;
        });
      },
      setMember(member) {
        this.member = member;
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
