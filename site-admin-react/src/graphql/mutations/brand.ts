import { gql } from "@apollo/client";

export const SELF_STORE_BRAND_CREATE = gql`
  mutation selfStoreBrandCreate(
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
    selfStoreBrandCreate(
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
    }
  }
`;

export const SELF_STORE_BRAND_UPDATE = gql`
  mutation selfStoreBrandUpdate(
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
    selfStoreBrandUpdate(
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
    }
  }
`;
