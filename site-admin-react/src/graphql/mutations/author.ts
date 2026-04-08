import { gql } from "@apollo/client";

export const SELF_STORE_AUTHOR_CREATE = gql`
  mutation selfStoreAuthorCreate(
    $userId: Int!
    $siteId: Int!
    $categories: [Int]!
    $description: String!
    $image: Upload!
    $isActive: Boolean!
    $isHome: Boolean!
    $isPrivate: Boolean!
    $priority: Int!
    $priorityHome: Int!
    $queryType: String!
    $subCategories: [Int]!
    $title: String!
    $translation: String!
  ) {
    selfStoreAuthorCreate(
      userId: $userId
      siteId: $siteId
      data: {
        categories: $categories
        description: $description
        image: $image
        isActive: $isActive
        isHome: $isHome
        isPrivate: $isPrivate
        priority: $priority
        priorityHome: $priorityHome
        queryType: $queryType
        subCategories: $subCategories
        title: $title
        translation: $translation
      }
    ) {
      id
      title
      categories
    }
  }
`;

export const SELF_STORE_AUTHOR_UPDATE = gql`
  mutation selfStoreAuthorUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $categories: [Int]
    $description: String
    $image: Upload
    $isActive: Boolean
    $isHome: Boolean
    $isPrivate: Boolean
    $priority: Int
    $priorityHome: Int
    $queryType: String
    $subCategories: [Int]
    $title: String
    $translation: String
  ) {
    selfStoreAuthorUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        categories: $categories
        description: $description
        image: $image
        isActive: $isActive
        isHome: $isHome
        isPrivate: $isPrivate
        priority: $priority
        priorityHome: $priorityHome
        queryType: $queryType
        subCategories: $subCategories
        title: $title
        translation: $translation
      }
    ) {
      id
      title
      categories
    }
  }
`;
