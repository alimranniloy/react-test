import { gql } from "@apollo/client";

export const STORE_ORDERS = gql`
  query (
    $siteId: Int!
    $search: String
    $status: Int
    $sourceId: [Int]
    $staffId: Int
    $logisticsId: Int
    $customerType: Int
    $from: DateTime
    $to: DateTime
    $filterAt: String
    $after: String
    $first: Int
    $offset: Int
  ) {
    storeOrders(
      siteId: $siteId
      search: $search
      status: $status
      sourceId: $sourceId
      staffId: $staffId
      logisticsId: $logisticsId
      customerType: $customerType
      from: $from
      to: $to
      filterAt: $filterAt
      first: $first
      after: $after
      offset: $offset
    ) {
      total
      edges {
        node {
          id
          orderId
          customerName
          customerPhone
          customerAddress
          customerNote
          customerType
          status
          total
          netAmount
          profit
          currency
          sourceId
          orderType
          logisticsCharge
          logisticsExtraCharge
          logisticsId
          logisticsNote
          logisticsIsConfirmed
          logisticsText
          createdAt
          updatedAt
          trackingId
          paid
          resellerIsPaid
          resellAmount
          resellerCommission
          isPre
          isSettle
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const STORE_ORDER = gql`
  query ($siteId: Int!, $id: Int!) {
    storeOrder(siteId: $siteId, id: $id) {
      id
      orderId
      customerName
      customerPhone
      customerAddress
      customerNote
      status
      total
      netAmount
      profit
      currency
      createdAt
      updatedAt
      logisticsCharge
      logisticsExtraCharge
      trackingId
      discount
      discountName
      paid
      isPaid
      logisticsText
      logisticsNote
      logisticsUrl
      lines {
        id
        productName
        productSku
        quantity
        price
        comparePrice
        cost
        resellPrice
        resellCommission
        vat
        unit
        unitType
        image
      }
      events {
        id
        eventType
        note
        createdAt
      }
      pays {
        id
        createdAt
        paymentTitle
        paymentNo
        total
        note
      }
    }
  }
`;
