import { gql } from "@apollo/client";

export const SELF_STORE_TAG_CREATE = gql`
  mutation selfStoreTagCreate(
    $userId: Int!
    $siteId: Int!
    $isActive: Boolean!
    $isPrivate: Boolean!
    $title: String!
    $translation: String!
  ) {
    selfStoreTagCreate(
      userId: $userId
      siteId: $siteId
      data: {
        isActive: $isActive
        isPrivate: $isPrivate
        title: $title
        translation: $translation
      }
    ) {
      id
      title
      translation
    }
  }
`;

export const SELF_STORE_TAG_UPDATE = gql`
  mutation selfStoreTagUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $isActive: Boolean
    $isPrivate: Boolean
    $title: String
    $translation: String
  ) {
    selfStoreTagUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        isActive: $isActive
        isPrivate: $isPrivate
        title: $title
        translation: $translation
      }
    ) {
      id
      title
    }
  }
`;
