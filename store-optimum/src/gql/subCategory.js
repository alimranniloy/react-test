import gql from "graphql-tag";
// STORE_SUB_CATEGORIES
export const STORE_SUB_CATEGORIES = gql`
  query (
    $siteId: [Int]!
    $categoryId: Int
    $isActive: Boolean
    $isPrivate: Boolean
    $first: Int
    $after: String
  ) {
    storeSubCategories(
      siteId: $siteId
      categoryId: $categoryId
      isActive: $isActive
      isPrivate: $isPrivate
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          description
          categoryId
          hid
          id
          image
          isActive
          isPrivate
          priority
          siteId
          slug
          title
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
// STORE_SUB_CATEGORY_DETAILS
export const STORE_SUB_CATEGORY_DETAILS = gql`
  query ($id: Int!) {
    storeSubCategory(id: $id) {
      categoryId
      cover
      description
      hid
      id
      image
      isActive
      isPrivate
      priority
      siteId
      title
      translation
    }
  }
`;
// SELF_STORE_SUB_CATEGORY_CREATE
export const SELF_STORE_SUB_CATEGORY_CREATE = gql`
  mutation selfStoreSubCategoryCreate(
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
  ) {
    selfStoreSubCategoryCreate(
      userId: $userId
      siteId: $siteId
      data: {
        categoryId: $categoryId
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
      description
      id
      image
      isActive
      isPrivate
      priority
      slug
      title
      translation
      updatedAt
    }
  }
`;
// SELF_STORE_SUB_CATEGORY_UPDATE
export const SELF_STORE_SUB_CATEGORY_UPDATE = gql`
  mutation selfStoreSubCategoryUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $categoryId: Int
    $cover: Upload
    $description: String
    $image: Upload
    $isActive: Boolean
    $isPrivate: Boolean
    $priority: Int
    $title: String
    $translation: String
  ) {
    selfStoreSubCategoryUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        categoryId: $categoryId
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
      id
      image
      isActive
      isPrivate
      priority
      siteId
      slug
      title
      translation
      updatedAt
    }
  }
`;
// SELF_STORE_SUB_CATEGORY_DELETE
export const SELF_STORE_SUB_CATEGORY_DELETE = gql`
  mutation selfStoreSubCategoryDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreSubCategoryDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;
