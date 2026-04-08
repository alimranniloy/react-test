import { gql } from "@apollo/client";

export const SITE_TRANSACTIONS = gql`
  query (
    $siteId: Int
    $receiverId: Int
    $status: Int
    $after: String
    $first: Int
  ) {
    siteTransactions(
      siteId: $siteId
      receiverId: $receiverId
      status: $status
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          hid
          id
          isPaid
          isSettle
          note
          paymentDate
          paymentId
          paymentNo
          paymentTitle
          referId
          referPhone
          referTitle
          receiverId
          source
          status
          subTotal
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
