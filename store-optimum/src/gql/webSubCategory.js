import gql from "graphql-tag";
// WEB_SUB_CATEGORIES
export const WEB_SUB_CATEGORIES = gql`
  query (
    $siteId: [Int]!
    $categoryId: Int
    $isActive: Boolean
    $isPrivate: Boolean
    $first: Int
    $after: String
  ) {
    webSubCategories(
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
// WEB_SUB_CATEGORY_PREVIEW
export const WEB_SUB_CATEGORY_PREVIEW = gql`
  query ($id: Int!) {
    webSubCategory(id: $id) {
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
// SELF_WEB_SUB_CATEGORY_CREATE
export const SELF_WEB_SUB_CATEGORY_CREATE = gql`
  mutation selfWebSubCategoryCreate(
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
    selfWebSubCategoryCreate(
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
// SELF_WEB_SUB_CATEGORY_UPDATE
export const SELF_WEB_SUB_CATEGORY_UPDATE = gql`
  mutation selfWebSubCategoryUpdate(
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
    selfWebSubCategoryUpdate(
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
// SELF_WEB_SUB_CATEGORY_DELETE
export const SELF_WEB_SUB_CATEGORY_DELETE = gql`
  mutation selfWebSubCategoryDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfWebSubCategoryDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;
