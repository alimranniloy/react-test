import { gql } from "@apollo/client";

export const SITE_QUOTE_REQUESTS = gql`
  query siteQuoteRequests(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $siteId: Int
    $limit: Int
    $search: String
    $startDate: DateTime
    $endDate: DateTime
    $offset: Int
  ) {
    siteQuoteRequests(
      after: $after
      before: $before
      first: $first
      last: $last
      siteId: $siteId
      limit: $limit
      search: $search
      startDate: $startDate
      endDate: $endDate
      offset: $offset
    ) {
      total
      edges {
        node {
          id
          name
          organizationName
          phone
          fileUrl
        }
      }
    }
  }
`;
