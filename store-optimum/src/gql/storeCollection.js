import gql from "graphql-tag";
// STORE_COLLECTIONS
export const STORE_COLLECTIONS = gql`
  query ($siteId: [Int]!, $search: String, $after: String, $first: Int) {
    storeCollections(
      siteId: $siteId
      search: $search
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          createdAt
          hid
          id
          image
          isActive
          isExternal
          isPrivate
          priority
          siteId
          slug
          title
          translation
          url
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
// STORE_COLLECTION_DETAILS
export const STORE_COLLECTION_DETAILS = gql`
  query ($id: Int!) {
    storeCollection(id: $id) {
      createdAt
      description
      hid
      id
      image
      isActive
      isExternal
      isPrivate
      priority
      siteId
      slug
      title
      translation
      url
    }
  }
`; // SELF_STORE_COLLECTION_CREATE
export const SELF_STORE_COLLECTION_CREATE = gql`
  mutation selfStoreCollectionCreate(
    $userId: Int!
    $siteId: Int!
    $description: String!
    $image: Upload!
    $isActive: Boolean!
    $isExternal: Boolean!
    $isPrivate: Boolean!
    $priority: Int!
    $title: String!
    $translation: String!
    $url: String!
  ) {
    selfStoreCollectionCreate(
      userId: $userId
      siteId: $siteId
      data: {
        description: $description
        image: $image
        isActive: $isActive
        isExternal: $isExternal
        isPrivate: $isPrivate
        priority: $priority
        title: $title
        translation: $translation
        url: $url
      }
    ) {
      id
    }
  }
`;
// SELF_STORE_COLLECTION_UPDATE
export const SELF_STORE_COLLECTION_UPDATE = gql`
  mutation selfStoreCollectionUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $description: String
    $image: Upload
    $isActive: Boolean
    $isExternal: Boolean
    $isPrivate: Boolean
    $priority: Int
    $title: String
    $translation: String
    $url: String
  ) {
    selfStoreCollectionUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        description: $description
        image: $image
        isActive: $isActive
        isExternal: $isExternal
        isPrivate: $isPrivate
        priority: $priority
        title: $title
        translation: $translation
        url: $url
      }
    ) {
      id
    }
  }
`;
// SELF_STORE_COLLECTION_DELETE
export const SELF_STORE_COLLECTION_DELETE = gql`
  mutation selfStoreCollectionDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreCollectionDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;
