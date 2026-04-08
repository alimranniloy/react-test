import { gql } from "@apollo/client";

export const SELF_FILE_FILE_CREATE_URL = gql`
  mutation selfFileFileCreateUrl($userId: Int!, $filename: String!) {
    selfFileFileCreateUrl(userId: $userId, filename: $filename)
  }
`;

export const SELF_FILE_FILE_CREATE = gql`
  mutation selfFileFileCreate(
    $userId: Int!
    $file: Upload
    $mimeType: String!
    $size: Float!
    $title: String!
    $url: String!
  ) {
    selfFileFileCreate(
      userId: $userId
      data: { file: $file, mimeType: $mimeType, size: $size, title: $title, url: $url }
    ) {
      id
      size
      title
      updatedAt
      url
    }
  }
`;

export const SELF_FILE_FILE_UPDATE = gql`
  mutation selfFileFileUpdate(
    $userId: Int!
    $id: Int!
    $file: Upload
    $mimeType: String!
    $size: Float!
    $title: String!
    $url: String!
  ) {
    selfFileFileUpdate(
      userId: $userId
      id: $id
      data: { file: $file, mimeType: $mimeType, size: $size, title: $title, url: $url }
    ) {
      id
      size
      title
      updatedAt
      url
    }
  }
`;

export const SELF_FILE_FILE_DELETE = gql`
  mutation selfFileFileDelete($userId: Int!, $id: Int!) {
    selfFileFileDelete(userId: $userId, id: $id)
  }
`;
