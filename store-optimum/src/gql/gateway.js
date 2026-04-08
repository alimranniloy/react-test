import gql from 'graphql-tag'
// STORE_GATEWAYS
export const STORE_GATEWAYS = gql `
query($siteId: Int!, $after: String, $first: Int){
  storeGateways(siteId: $siteId, first: $first, after: $after){
      total
      edges {
      node {
        fee
        gatewayType
        id
        isActive
        isFreeLogistics
        isManual
        logo
        note
        title
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
// STORE_GATEWAY_DETAILS
export const STORE_GATEWAY_DETAILS = gql`
  query ($siteId: Int!, $id: Int!) {
    storeGateway(siteId: $siteId, id: $id) {
      fee
      gatewayType
      id
      isActive
      isFreeLogistics
      isManual
      logo
      note
      title
      updatedAt
    }
  }
`;
// SELF_STORE_GATEWAY_CREATE
export const SELF_STORE_GATEWAY_CREATE = gql `
mutation selfStoreGatewayCreate(
  $userId: Int!
  $siteId: Int!
  $credential: JSON!
  $fee: Float!
  $gatewayType: Int!
  $heighlight: String
  $isActive: Boolean!
  $isManual: Boolean!
  $note: String!
  $title: String!
) {
  selfStoreGatewayCreate(
    userId: $userId
    siteId: $siteId
    data: {
      credential: $credential
      fee: $fee
      gatewayType: $gatewayType
      heighlight: $heighlight
      title: $title
      note: $note
      isActive: $isActive
      isManual: $isManual
    }
  ) {
    id
  }
}
`;
// SELF_STORE_GATEWAY_UPDATE
export const SELF_STORE_GATEWAY_UPDATE = gql `
mutation selfStoreGatewayUpdate(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $credential: JSON
  $fee: Float!
  $gatewayType: Int!
  $heighlight: String
  $isActive: Boolean!
  $isManual: Boolean!
  $note: String!
  $title: String!
) {
  selfStoreGatewayUpdate(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      credential: $credential
      fee: $fee
      gatewayType: $gatewayType
      heighlight: $heighlight
      title: $title
      note: $note
      isActive: $isActive
      isManual: $isManual
    }
  ) {
    id
  }
}
`;
// SELF_STORE_GATEWAY_DELETE
export const SELF_STORE_GATEWAY_DELETE = gql `
mutation selfStoreGatewayDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfStoreGatewayDelete(userId: $userId, siteId: $siteId, id: $id) 
}
`;