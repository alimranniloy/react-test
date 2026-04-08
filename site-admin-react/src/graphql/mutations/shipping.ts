import { gql } from "@apollo/client";

export const SELF_STORE_SHIPPING_METHOD_CREATE = gql`
  mutation selfStoreShippingMethodCreate(
    $userId: Int!
    $siteId: Int!
    $currency: String!
    $isActive: Boolean!
    $maximumOrderPrice: Float!
    $minimumOrderPrice: Float!
    $title: String!
    $note: String!
    $price: Float!
  ) {
    selfStoreShippingMethodCreate(
      userId: $userId
      siteId: $siteId
      data: {
        currency: $currency
        isActive: $isActive
        maximumOrderPrice: $maximumOrderPrice
        minimumOrderPrice: $minimumOrderPrice
        title: $title
        note: $note
        price: $price
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_SHIPPING_METHOD_UPDATE = gql`
  mutation selfStoreShippingMethodUpdate(
    $userId: Int!
    $siteId: Int!
    $currency: String!
    $id: Int!
    $isActive: Boolean!
    $maximumOrderPrice: Float!
    $minimumOrderPrice: Float!
    $note: String!
    $price: Float!
    $title: String!
  ) {
    selfStoreShippingMethodUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        currency: $currency
        isActive: $isActive
        maximumOrderPrice: $maximumOrderPrice
        minimumOrderPrice: $minimumOrderPrice
        note: $note
        price: $price
        title: $title
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_SHIPPING_METHOD_DELETE = gql`
  mutation selfStoreShippingMethodDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreShippingMethodDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;
