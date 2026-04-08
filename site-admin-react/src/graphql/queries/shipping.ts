import { gql } from "@apollo/client";

export const STORE_SHIPPING_METHODS = gql`
  query ($siteId: Int!, $after: String, $first: Int) {
    storeShippingMethods(siteId: $siteId, first: $first, after: $after) {
      total
      edges {
        node {
          id
          title
          note
          currency
          price
          minimumOrderPrice
          maximumOrderPrice
          isActive
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
