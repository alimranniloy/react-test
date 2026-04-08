import { useMutation } from "@vue/apollo-composable";
import {
  ANALYTICS_SITE_PAGE_START,
  ANALYTICS_SITE_TRACK_START,
} from "@/gql/analytics";

function generateEventId() {
  const random = Math.random().toString(36).slice(2);
  return `evt_${Date.now()}_${random}`;
}

export default function bponiAnalytics(userConfig) {
  return {
    name: "bponi-analytics",
    config: Object.assign({}, userConfig),
    initializeStart: ({ config }) => {},
    pageStart: async ({ payload, config }) => {
      const { mutate } = useMutation(ANALYTICS_SITE_PAGE_START, {
        variables: {
          userId: payload.anonymousId,
          siteId: config.siteId,
          event: "PageView",
          eventId: payload.messageId || payload.eventId || generateEventId(),
          properties: {
            path: payload.properties.path,
            url: payload.properties.url,
            title: payload.properties.title,
            referrer: payload.properties.referrer,
            search: payload.properties.search,
          },
          customer: {
            address: config.customer ? config.customer.address : null,
            name: config.customer ? config.customer.name : null,
            phone: config.customer ? config.customer.phone : null,
            ip: config.customer ? config.customer.ip : null,
            userAgent: config.customer ? config.customer.userAgent : null,
            fbp: config.customer ? config.customer.fbp : null,
            fbc: config.customer ? config.customer.fbc : null,
          },
        },
      });
      try {
        const response = await mutate();
      } catch (error) {}
    },
    identifyStart: ({ config }) => {},
    trackStart: async ({ payload, config }) => {
      const { mutate } = useMutation(ANALYTICS_SITE_TRACK_START, {
        variables: {
          userId: payload.anonymousId,
          siteId: config.siteId,
          event: payload.event,
          eventId: payload.messageId || payload.eventId || generateEventId(),
          properties: payload.properties,
          customer: {
            address: config.customer ? config.customer.address : null,
            name: config.customer ? config.customer.name : null,
            phone: config.customer ? config.customer.phone : null,
            ip: config.customer ? config.customer.ip : null,
            userAgent: config.customer ? config.customer.userAgent : null,
            fbp: config.customer ? config.customer.fbp : null,
            fbc: config.customer ? config.customer.fbc : null,
          },
        },
      });
      try {
        const response = await mutate();
      } catch (error) {}
    },
  };
}
