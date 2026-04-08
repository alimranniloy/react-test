import gql from 'graphql-tag'
// STORE_SHIPPINGMETHODS
export const STORE_SHIPPINGMETHODS = gql `
query($siteId: Int!, $after: String, $first: Int){
  storeShippingMethods(siteId: $siteId, first: $first, after: $after){
      total
      edges {
      node {
        id
        title
        note
        currency
        price
        isActive
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
// STORE_SHIPPINGMETHOD_DETAILS
export const STORE_SHIPPINGMETHOD_DETAILS = gql `
query($siteId: Int!, $id: Int!){
  storeShippingMethod(siteId: $siteId, id: $id){
    id
    title
    note
    currency
    price
    minimumOrderPrice
    maximumOrderPrice
    isActive
    updatedAt
  }
}  
`; // SELF_STORE_SHIPPINGMETHOD_CREATE
export const SELF_STORE_SHIPPINGMETHOD_CREATE = gql `
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
// SELF_STORE_SHIPPINGMETHOD_UPDATE
export const SELF_STORE_SHIPPINGMETHOD_UPDATE = gql `
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
// SELF_STORE_SHIPPINGMETHOD_DELETE
export const SELF_STORE_SHIPPINGMETHOD_DELETE = gql `
mutation selfStoreShippingMethodDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfStoreShippingMethodDelete(userId: $userId, siteId: $siteId, id: $id) 
}
`;