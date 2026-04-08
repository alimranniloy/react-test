import gql from 'graphql-tag'
// STORE_TAGS
export const STORE_TAGS = gql `
query($siteId: [Int]!, $isPrivate: Boolean, $search: String, $first: Int, $after: String) {
  storeTags(
    siteId: $siteId,
    isPrivate: $isPrivate
    search: $search
    first: $first
    after: $after
  ) {
      total
      edges {
      node {
        id
        slug
        isActive
        isPrivate
        title
        siteId
        translation
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
// STORE_TAG_DETAILS
export const STORE_TAG_DETAILS = gql `
query($id: Int!){
  storeTag(id: $id){
    id
    slug
    isActive
    isPrivate
    siteId
    title
    translation
    updatedAt
  }
}
`;
// SELF_STORE_TAG_CREATE
export const SELF_STORE_TAG_CREATE = gql `
mutation selfStoreTagCreate(
  $userId: Int!
  $siteId: Int!
  $isActive: Boolean!
  $isPrivate: Boolean!
  $title: String!
  $translation: String!
) {
  selfStoreTagCreate(
    userId: $userId
    siteId: $siteId
    data: {
      isActive: $isActive
      isPrivate: $isPrivate
      title: $title
      translation: $translation
    }
  ) {
    id
    title
    translation
  }
}
`;
// SELF_STORE_TAG_UPDATE
export const SELF_STORE_TAG_UPDATE = gql `
mutation selfStoreTagUpdate(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $isActive: Boolean
  $isPrivate: Boolean
  $title: String
  $translation: String
) {
  selfStoreTagUpdate(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      isActive: $isActive
      isPrivate: $isPrivate
      title: $title
      translation: $translation
    }
  ) {
    id
    title
  }
}
`;
// SELF_STORE_TAG_DELETE
export const SELF_STORE_TAG_DELETE = gql `
mutation selfStoreTagDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfStoreTagDelete(userId: $userId, siteId: $siteId, id: $id) 
}
`;
// SELF_STORE_TAG_ADD_PRODUCTS
export const SELF_STORE_TAG_ADD_PRODUCTS = gql `
mutation selfStoreTagAddProducts($userId: Int!, $tagId: Int!, $productId: Int!) {
  selfStoreTagAddProducts(userId: $userId, tagId: $tagId, productId: $productId) 
}
`;
// SELF_STORE_TAG_REMOVE_PRODUCTS
export const SELF_STORE_TAG_REMOVE_PRODUCTS = gql `
mutation selfStoreTagRemoveProducts($userId: Int!, $tagId: Int!, $productId: Int!) {
  selfStoreTagRemoveProducts(userId: $userId, tagId: $tagId, productId: $productId) 
}
`;
