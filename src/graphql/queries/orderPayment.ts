import { gql } from "@apollo/client";

export const STORE_ORDER_PAYMENTS = gql`
  query (
    $siteId: Int!
    $customerId: Int
    $customerTitle: String
    $isPaid: Boolean
    $isSettle: Boolean
    $paymentType: String
    $after: String
    $first: Int
  ) {
    storeOrderPayments(
      siteId: $siteId
      customerId: $customerId
      customerTitle: $customerTitle
      isPaid: $isPaid
      isSettle: $isSettle
      paymentType: $paymentType
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          createdAt
          customerId
          customerPhone
          customerTitle
          hid
          id
          invoiceId
          isPaid
          isSettle
          note
          orderIds
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
