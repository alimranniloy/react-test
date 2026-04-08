import gql from 'graphql-tag'
// STORE_BRANDS
export const STORE_BRANDS = gql`
  query (
    $siteId: [Int]!
    $childId: Int
    $isActive: Boolean
    $isPrivate: Boolean
    $search: String
    $first: Int
    $after: String
  ) {
    storeBrands(
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
          hid
          id
          image(childId: $childId)
          isActive(childId: $childId)
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
// STORE_BRAND_DETAILS
export const STORE_BRAND_DETAILS = gql `
query($id: Int!) {
  storeBrand(id: $id) {
    categories
    description
    id
    image
    isActive
    isPrivate
    priority
    siteId
    subCategories
    title
    translation
  }
}
`; // SELF_STORE_BRAND_CREATE
export const SELF_STORE_BRAND_CREATE = gql `
mutation selfStoreBrandCreate(
  $userId: Int!
  $siteId: Int!
  $categories: [Int]!
  $description: String!
  $image: Upload!
  $isActive: Boolean!
  $isPrivate: Boolean!
  $priority: Int!
  $subCategories: [Int]!
  $title: String!
  $translation: String!
) {
  selfStoreBrandCreate(
    userId: $userId
    siteId: $siteId
    data: {
      categories: $categories
      description: $description
      image: $image
      isActive: $isActive
      isPrivate: $isPrivate
      priority: $priority
      subCategories: $subCategories
      title: $title
      translation: $translation
    }
  ) {
    id
    title
  }
}
`;
// SELF_STORE_BRAND_UPDATE
export const SELF_STORE_BRAND_UPDATE = gql `
mutation selfStoreBrandUpdate(
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
  selfStoreBrandUpdate(
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
// SELF_STORE_BRAND_UPDATE_BY_CHILD
export const SELF_STORE_BRAND_UPDATE_BY_CHILD = gql `
mutation selfStoreBrandUpdateByChild(
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
  selfStoreBrandUpdateByChild(
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
// SELF_STORE_BRAND_DELETE
export const SELF_STORE_BRAND_DELETE = gql `
mutation selfStoreBrandDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfStoreBrandDelete(userId: $userId, siteId: $siteId, id: $id)
}
`;