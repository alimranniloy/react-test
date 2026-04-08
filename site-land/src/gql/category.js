import gql from "graphql-tag";
// STORE_CATEGORIES
export const STORE_CATEGORIES = gql`
  query (
    $siteId: [Int]!
    $childId: Int
    $isActive: Boolean
    $isPrivate: Boolean
    $search: String
    $after: String
    $first: Int
  ) {
    storeCategories(
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
          external
          id
          hid
          image(childId: $childId)
          cover
          isActive(childId: $childId)
          isExternal
          isParent
          isPrivate
          priority
          siteId
          slug
          title
          total
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
// STORE_CATEGORY_DETAILS
export const STORE_CATEGORY_DETAILS = gql`
  query ($id: Int!, $childId: Int) {
    storeCategory(id: $id) {
      description
      createdAt
      external
      id
      hid
      image(childId: $childId)
      isActive(childId: $childId)
      isExternal
      isParent
      isPrivate
      priority
      siteId
      slug
      title
      total
      translation
      updatedAt
    }
  }
`; // SELF_STORE_CATEGORY_CREATE
export const SELF_STORE_CATEGORY_CREATE = gql`
  mutation selfStoreCategoryCreate(
    $userId: Int!
    $siteId: Int!
    $description: String!
    $external: String!
    $image: Upload!
    $isActive: Boolean!
    $isExternal: Boolean!
    $isParent: Boolean!
    $isPrivate: Boolean!
    $priority: Int!
    $title: String!
    $translation: String!
  ) {
    selfStoreCategoryCreate(
      userId: $userId
      siteId: $siteId
      data: {
        description: $description
        external: $external
        image: $image
        isActive: $isActive
        isExternal: $isExternal
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
// SELF_STORE_CATEGORY_UPDATE
export const SELF_STORE_CATEGORY_UPDATE = gql`
  mutation selfStoreCategoryUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $cover: Upload
    $description: String
    $external: String
    $image: Upload
    $isActive: Boolean
    $isExternal: Boolean
    $isParent: Boolean
    $isPrivate: Boolean
    $priority: Int
    $title: String
    $translation: String
  ) {
    selfStoreCategoryUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        cover: $cover
        description: $description
        external: $external
        image: $image
        isActive: $isActive
        isExternal: $isExternal
        isParent: $isParent
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
// SELF_STORE_CATEGORY_UPDATE_BY_CHILD
export const SELF_STORE_CATEGORY_UPDATE_BY_CHILD = gql`
  mutation selfStoreCategoryUpdateByChild(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $cover: Upload
    $description: String
    $external: String
    $image: Upload
    $isActive: Boolean
    $isExternal: Boolean
    $isParent: Boolean
    $isPrivate: Boolean
    $priority: Int
    $title: String
    $translation: String
  ) {
    selfStoreCategoryUpdateByChild(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        cover: $cover
        description: $description
        external: $external
        image: $image
        isActive: $isActive
        isExternal: $isExternal
        isParent: $isParent
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
// SELF_STORE_CATEGORY_DELETE
export const SELF_STORE_CATEGORY_DELETE = gql`
  mutation selfStoreCategoryDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreCategoryDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;
