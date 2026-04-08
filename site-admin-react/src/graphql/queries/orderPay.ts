import { gql } from "@apollo/client";

export const STORE_ORDER_PAYS = gql`
  query ($siteId: Int!, $orderId: Int, $after: String, $first: Int) {
    storeOrderPays(siteId: $siteId, orderId: $orderId, after: $after, first: $first) {
      total
      edges {
        node {
          createdAt
          id
          orderId
          isPaid
          isSettle
          note
          paymentDate
          paymentId
          paymentNo
          paymentTitle
          status
          total
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`;
