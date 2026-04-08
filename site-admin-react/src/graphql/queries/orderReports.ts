import { gql } from "@apollo/client";

export const STORE_ORDER_STATISTICS_BY_DAYS = gql`
  query (
    $siteId: Int!
    $previous: Int
    $next: Int
    $shopId: Int
    $staffId: Int
    $productId: Int
    $status: Int
    $queryType: String
    $after: String
    $first: Int
  ) {
    storeOrdersStatisticsByDays(
      siteId: $siteId
      previous: $previous
      next: $next
      shopId: $shopId
      staffId: $staffId
      productId: $productId
      status: $status
      queryType: $queryType
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          amount
          date
          delivered
          returned
          total
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

export const STORE_ORDER_STATISTICS_BY_STAFFS = gql`
  query (
    $siteId: Int!
    $from: DateTime
    $to: DateTime
    $productId: Int
    $after: String
    $first: Int
  ) {
    storeOrdersStatisticsByStaffs(
      siteId: $siteId
      from: $from
      to: $to
      productId: $productId
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          cancelled
          charge
          confirmed
          delivered
          hold
          notResponding
          pending
          placed
          profit
          packaging
          rejected
          returned
          sale
          shipment
          staffId
          station
          total
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

export const STORE_ORDER_STATISTICS_BY_PRODUCT = gql`
  query (
    $siteId: Int!
    $from: DateTime!
    $to: DateTime!
    $after: String
    $first: Int
    $productIds: [Int]
    $productSku: String
    $categoryId: Int
    $supplierId: Int
    $authorId: Int
    $status: Int
  ) {
    storeOrdersStatisticsByProduct(
      siteId: $siteId
      from: $from
      to: $to
      first: $first
      after: $after
      productIds: $productIds
      productSku: $productSku
      categoryId: $categoryId
      supplierId: $supplierId
      status: $status
      authorId: $authorId
    ) {
      total
      edges {
        node {
          authorId
          authorName
          categoryId
          categoryName
          comparePrice
          cost
          orderIds
          price
          productSku
          quantity
          supplierId
          supplierName
          title
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

export const SITE_STAFFS = gql`
  query (
    $siteId: Int!
    $staffType: Int
    $search: String
    $isActive: Boolean
    $after: String
    $first: Int
  ) {
    siteStaffs(
      siteId: $siteId
      staffType: $staffType
      search: $search
      isActive: $isActive
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          id
          isActive
          phone
          staffType
          title
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
