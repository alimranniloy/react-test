import gql from "graphql-tag";
// ANALYTICS_SITE_PAGE_CREATE
export const ANALYTICS_SITE_PAGE_CREATE = gql`
  mutation analyticsSitePageCreate(
    $userId: String!
    $siteId: Int!
    $page: String!
  ) {
    analyticsSitePageCreate(userId: $userId, siteId: $siteId, page: $page)
  }
`;
