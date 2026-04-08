import { gql } from "@apollo/client";

export const SELF_STORE_CATEGORY_UPDATE_STATUS = gql`
  mutation selfStoreCategoryUpdate($userId: Int!, $siteId: Int!, $id: Int!, $isActive: Boolean) {
    selfStoreCategoryUpdate(userId: $userId, siteId: $siteId, id: $id, data: { isActive: $isActive }) {
      id
      title
    }
  }
`;

export const SELF_STORE_CATEGORY_DELETE = gql`
  mutation selfStoreCategoryDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreCategoryDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;

export const SELF_STORE_CATEGORY_CREATE = gql`
  mutation selfStoreCategoryCreate(
    $userId: Int!
    $siteId: Int!
    $description: String!
    $cover: Upload
    $external: String!
    $image: Upload!
    $isActive: Boolean!
    $isExternal: Boolean!
    $isHome: Boolean!
    $isParent: Boolean!
    $isPrivate: Boolean!
    $priority: Int!
    $priorityHome: Int!
    $queryType: String!
    $title: String!
    $translation: String!
  ) {
    selfStoreCategoryCreate(
      userId: $userId
      siteId: $siteId
      data: {
        description: $description
        cover: $cover
        external: $external
        image: $image
        isActive: $isActive
        isExternal: $isExternal
        isHome: $isHome
        isParent: $isParent
        isPrivate: $isPrivate
        priority: $priority
        priorityHome: $priorityHome
        queryType: $queryType
        title: $title
        translation: $translation
      }
    ) {
      id
      title
    }
  }
`;

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
    $isHome: Boolean
    $isParent: Boolean
    $isPrivate: Boolean
    $priority: Int
    $priorityHome: Int
    $queryType: String
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
        isHome: $isHome
        isParent: $isParent
        isPrivate: $isPrivate
        priority: $priority
        priorityHome: $priorityHome
        queryType: $queryType
        title: $title
        translation: $translation
      }
    ) {
      id
      title
    }
  }
`;

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
      id
      title
    }
  }
`;

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
      id
      title
    }
  }
`;

export const SELF_STORE_SUB_SUB_CATEGORY_CREATE = gql`
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
      id
      title
    }
  }
`;

export const SELF_STORE_SUB_SUB_CATEGORY_UPDATE = gql`
  mutation selfStoreSubSubCategoryUpdate(
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
    $subCategoryId: Int
  ) {
    selfStoreSubSubCategoryUpdate(
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
        subCategoryId: $subCategoryId
      }
    ) {
      id
      title
    }
  }
`;
