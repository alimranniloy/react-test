import gql from "graphql-tag";
// WEB_CATEGORIES
export const WEB_CATEGORIES = gql`
  query (
    $siteId: [Int]!
    $isActive: Boolean
    $isPrivate: Boolean
    $search: String
    $after: String
    $first: Int
  ) {
    webCategories(
      siteId: $siteId
      isActive: $isActive
      isPrivate: $isPrivate
      search: $search
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          description
          createdAt
          id
          hid
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
// WEB_CATEGORY_PREVIEW
export const WEB_CATEGORY_PREVIEW = gql`
  query ($id: Int!) {
    webCategory(id: $id) {
      description
      createdAt
      id
      hid
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
`; // SELF_WEB_CATEGORY_CREATE
export const SELF_WEB_CATEGORY_CREATE = gql`
  mutation selfWebCategoryCreate(
    $userId: Int!
    $siteId: Int!
    $description: String!
    $image: Upload!
    $isActive: Boolean!
    $isPrivate: Boolean!
    $priority: Int!
    $title: String!
    $translation: String!
  ) {
    selfWebCategoryCreate(
      userId: $userId
      siteId: $siteId
      data: {
        description: $description
        image: $image
        isActive: $isActive
        isPrivate: $isPrivate
        priority: $priority
        title: $title
        translation: $translation
      }
    ) {
      id
      title
    }
  }
`;
// SELF_WEB_CATEGORY_UPDATE
export const SELF_WEB_CATEGORY_UPDATE = gql`
  mutation selfWebCategoryUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $description: String
    $image: Upload
    $isActive: Boolean
    $isPrivate: Boolean
    $priority: Int
    $title: String
    $translation: String
  ) {
    selfWebCategoryUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        description: $description
        image: $image
        isActive: $isActive
        isPrivate: $isPrivate
        priority: $priority
        title: $title
        translation: $translation
      }
    ) {
      id
      title
    }
  }
`;
// SELF_WEB_CATEGORY_DELETE
export const SELF_WEB_CATEGORY_DELETE = gql`
  mutation selfWebCategoryDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfWebCategoryDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;
