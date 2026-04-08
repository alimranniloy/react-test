import gql from "graphql-tag";
// ANALYTICS_SITE_PAGE_START
export const ANALYTICS_SITE_PAGE_START = gql`
  mutation analyticsSitePageStart(
    $userId: String!
    $siteId: Int!
    $event: String!
    $eventId: String!
    $customer: JSON!
    $properties: JSON!
  ) {
    analyticsSitePageStart(
      userId: $userId
      siteId: $siteId
      event: $event
      eventId: $eventId
      customer: $customer
      properties: $properties
    )
  }
`;
// ANALYTICS_SITE_TRACK_START
export const ANALYTICS_SITE_TRACK_START = gql`
  mutation analyticsSiteTrackStart(
    $userId: String!
    $siteId: Int!
    $event: String!
    $eventId: String!
    $customer: JSON!
    $properties: JSON!
  ) {
    analyticsSiteTrackStart(
      userId: $userId
      siteId: $siteId
      event: $event
      eventId: $eventId
      customer: $customer
      properties: $properties
    )
  }
`;
