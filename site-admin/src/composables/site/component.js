import { apolloClient } from "@/vue-apollo";
import { SITE_COMPONENTS, SITE_COMPONENT } from "@/gql/site/component";

/**
 * Fetches component using the Apollo client and returns a Promise.
 */
export async function getComponentData(id) {
  const result = await apolloClient.query({
    query: SITE_COMPONENT,
    variables: {
      id: id,
    },
    fetchPolicy: "network-only",
  });

  if (result.data?.siteComponent) {
    return result.data.siteComponent;
  }
  return null;
}

/**
 * Fetches components using the Apollo client and returns a Promise.
 */
export async function getCategoriesData(siteId, search) {
  const result = await apolloClient.query({
    query: SITE_COMPONENTS,
    variables: {
      first: 256,
      limit: 256,
    },
    fetchPolicy: "network-only",
  });

  if (result.data?.siteCompoents) {
    return result.data.siteCompoents.edges.map((v) => ({
      id: v.node.id,
      title: v.node.title,
    }));
  }

  return [];
}
