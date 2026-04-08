import { gql } from "@apollo/client";

export const SELF_STORE_GATEWAY_CREATE = gql`
  mutation selfStoreGatewayCreate(
    $userId: Int!
    $siteId: Int!
    $credential: JSON!
    $discount: Float!
    $fee: Float!
    $gatewayType: Int!
    $heighlight: String
    $isActive: Boolean!
    $isDiscount: Boolean!
    $isFreeLogistics: Boolean!
    $isManual: Boolean!
    $isSandbox: Boolean!
    $logo: String
    $note: String!
    $priority: Int
    $title: String!
    $paymentProviderId: Int
  ) {
    selfStoreGatewayCreate(
      userId: $userId
      siteId: $siteId
      data: {
        credential: $credential
        discount: $discount
        fee: $fee
        gatewayType: $gatewayType
        heighlight: $heighlight
        title: $title
        note: $note
        isActive: $isActive
        isDiscount: $isDiscount
        isFreeLogistics: $isFreeLogistics
        isManual: $isManual
        isSandbox: $isSandbox
        logo: $logo
        priority: $priority
        paymentProviderId: $paymentProviderId
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_GATEWAY_UPDATE = gql`
  mutation selfStoreGatewayUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $credential: JSON
    $discount: Float!
    $fee: Float!
    $gatewayType: Int!
    $heighlight: String
    $isActive: Boolean!
    $isDiscount: Boolean!
    $isFreeLogistics: Boolean!
    $isManual: Boolean!
    $isSandbox: Boolean!
    $logo: String
    $note: String!
    $priority: Int
    $title: String!
    $paymentProviderId: Int
  ) {
    selfStoreGatewayUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        credential: $credential
        discount: $discount
        fee: $fee
        gatewayType: $gatewayType
        heighlight: $heighlight
        title: $title
        note: $note
        isActive: $isActive
        isDiscount: $isDiscount
        isFreeLogistics: $isFreeLogistics
        isManual: $isManual
        isSandbox: $isSandbox
        logo: $logo
        priority: $priority
        paymentProviderId: $paymentProviderId
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_GATEWAY_DELETE = gql`
  mutation selfStoreGatewayDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreGatewayDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;
