import { gql } from "@apollo/client";

export const STORE_ORDERS_FOR_RESELLER = gql`
  query (
    $siteId: Int!
    $customerName: String
    $status: Int
    $sourceId: [Int]
    $resellerIsPaid: Boolean
    $from: DateTime
    $to: DateTime
    $after: String
    $first: Int
    $offset: Int
  ) {
    storeOrders(
      siteId: $siteId
      customerName: $customerName
      status: $status
      sourceId: $sourceId
      resellerIsPaid: $resellerIsPaid
      from: $from
      to: $to
      first: $first
      offset: $offset
      after: $after
    ) {
      total
      edges {
        node {
          createdAt
          customerName
          id
          orderId
          resellerAdvanceCollect
          resellerCommission
          resellerIsPaid
          sourceId
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
