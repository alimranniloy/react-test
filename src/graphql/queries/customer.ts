import { gql } from "@apollo/client";

export const STORE_CUSTOMERS = gql`
  query (
    $siteId: Int!
    $search: String
    $from: DateTime
    $to: DateTime
    $isActive: Boolean
    $isReseller: Boolean
    $isAffiliate: Boolean
    $isWholesale: Boolean
    $queryType: String
    $customerType: Int
    $customerTypes: Int
    $after: String
    $first: Int
    $offset: Int
  ) {
    storeCustomers(
      siteId: $siteId
      search: $search
      from: $from
      to: $to
      isActive: $isActive
      isReseller: $isReseller
      isAffiliate: $isAffiliate
      isWholesale: $isWholesale
      queryType: $queryType
      customerType: $customerType
      customerTypes: $customerTypes
      first: $first
      offset: $offset
      after: $after
    ) {
      total
      edges {
        node {
          address
          avatar
          cartCount
          createdAt
          currency
          customerType
          customerTypes
          id
          isActive
          isReseller
          isAffiliate
          isWholesale
          nid
          ordersTotal
          phone
          resellPaid
          resellPayable
          resellProcessing
          resellTotal
          title
          tags
          totalProfit
          totalPurchase
          updatedAt
          userId
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
