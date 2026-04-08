import { useQuery, useMutation } from "@vue/apollo-composable";
import { ANALYTICS_SITE_PAGE_CREATE } from "@/gql/analytics";
import { computed } from "vue";

export default function bponiAnalytics(userConfig) {
  return {
    name: "bponi-analytics",
    config: Object.assign({}, userConfig),
    initializeStart: ({ config }) => {},
    pageStart: async ({ payload, config }) => {
      const { mutate, loading, error } = useMutation(
        ANALYTICS_SITE_PAGE_CREATE,
        {
          variables: {
            userId: payload.anonymousId,
            siteId: config.siteId,
            page: payload.properties.path,
          },
        }
      );
      try {
        const response = await mutate();
      } catch (error) {}
    },
    identifyStart: ({ config }) => {},
    trackStart: async ({ payload, config }) => {
      //console.log(payload)
    },
  };
}
