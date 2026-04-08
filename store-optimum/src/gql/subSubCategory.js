import gql from 'graphql-tag'
// STORE_SUB_SUB_CATEGORIES
export const STORE_SUB_SUB_CATEGORIES = gql`
  query (
    $siteId: [Int]!
    $categoryId: Int
    $subCategoryId: Int
    $isActive: Boolean
    $isPrivate: Boolean
    $first: Int
    $after: String
  ) {
    storeSubSubCategories(
      siteId: $siteId
      categoryId: $categoryId
      subCategoryId: $subCategoryId
      isActive: $isActive
      isPrivate: $isPrivate
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          categoryId
          id
          hid
          image
          isActive
          isPrivate
          priority
          slug
          subCategoryId
          title
          translation
          siteId
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
// STORE_SUB_SUB_CATEGORY_DETAILS
export const STORE_SUB_SUB_CATEGORY_DETAILS = gql `
query($id: Int!) {
  storeSubSubCategory(id: $id) {
    categoryId
    cover
    description
    id
    hid
    image
    isActive
    isPrivate
    priority
    siteId
    subCategoryId
    title
    translation
  }
}
`;
// SELF_STORE_SUB_SUB_CATEGORY_CREATE
export const SELF_STORE_SUB_SUB_CATEGORY_CREATE = gql `
mutation selfStoreSubSubCategoryCreate(
  $userId: Int!
  $siteId: Int!
  $categoryId: Int!
  $description: String!
  $image: Upload!
  $isActive: Boolean!
  $isPrivate: Boolean!
  $priority: Int!
  $title: String!
  $translation: String!
  $subCategoryId: Int!
) {
  selfStoreSubSubCategoryCreate(
    userId: $userId
    siteId: $siteId
    data: {
      categoryId: $categoryId
      description: $description
      image: $image
      isActive: $isActive
      isPrivate: $isPrivate
      priority: $priority
      subCategoryId: $subCategoryId
      title: $title
      translation: $translation
    }
  ) {
    categoryId
    cover
    id
    subCategoryId
    title
    translation
  }
}
`;
// SELF_STORE_SUB_SUB_CATEGORY_UPDATE
export const SELF_STORE_SUB_SUB_CATEGORY_UPDATE = gql `
mutation selfStoreSubSubCategoryUpdate(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $cover: Upload
  $description: String
  $image: Upload
  $isActive: Boolean
  $isPrivate: Boolean
  $priority: Int
  $title: String
  $translation: String
) {
  selfStoreSubSubCategoryUpdate(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      cover: $cover
      description: $description
      image: $image
      isActive: $isActive
      isPrivate: $isPrivate
      priority: $priority
      title: $title
      translation: $translation
    }
  ) {
    categoryId
    cover
    id
    subCategoryId
    title
    translation
  }
}
`;
// SELF_STORE_SUB_SUB_CATEGORY_DELETE
export const SELF_STORE_SUB_SUB_CATEGORY_DELETE = gql `
mutation selfStoreSubSubCategoryDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfStoreSubSubCategoryDelete(userId: $userId, siteId: $siteId, id: $id) 
}
`;