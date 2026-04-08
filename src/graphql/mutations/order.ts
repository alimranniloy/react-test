import { gql } from "@apollo/client";

export const SELF_STORE_ORDER_EVENT_CREATE = gql`
  mutation selfStoreOrderEventCreate(
    $userId: Int!
    $siteId: Int!
    $orderId: Int!
    $eventType: Int!
    $note: String!
    $status: Int!
  ) {
    selfStoreOrderEventCreate(
      userId: $userId
      siteId: $siteId
      orderId: $orderId
      eventType: $eventType
      note: $note
      status: $status
    ) {
      id
      eventType
      note
      createdAt
    }
  }
`;

export const SELF_STORE_ORDERS_EVENT_CREATE = gql`
  mutation selfStoreOrdersEventCreate(
    $userId: Int!
    $siteId: Int!
    $orderIds: [Int]!
    $eventType: Int!
    $note: String!
    $status: Int!
  ) {
    selfStoreOrdersEventCreate(
      userId: $userId
      siteId: $siteId
      orderIds: $orderIds
      eventType: $eventType
      note: $note
      status: $status
    )
  }
`;
