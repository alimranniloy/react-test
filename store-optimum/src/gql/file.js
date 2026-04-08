import gql from "graphql-tag";
// FILE_FILES
export const FILE_FILES = gql`
  query ($userId: Int!, $queryType: String, $after: String, $first: Int) {
    fileFiles(
      userId: $userId
      queryType: $queryType
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          id
          title
          updatedAt
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
// FILE_FILE_DETAILS
export const FILE_FILE_DETAILS = gql`
  query ($id: Int!) {
    fileFile(id: $id) {
      id
      title
      updatedAt
      url
    }
  }
`;
// SELF_FILE_FILE_CREATE
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
      data: {
        file: $file
        mimeType: $mimeType
        size: $size
        title: $title
        url: $url
      }
    ) {
      id
      title
      url
    }
  }
`;
// SELF_FILE_FILE_UPDATE
export const SELF_FILE_FILE_UPDATE = gql`
  mutation selfFileFileUpdate(
    $userId: Int!
    $id: Int!
    $mimeType: String
    $title: String
    $url: Upload
  ) {
    selfFileFileUpdate(
      userId: $userId
      id: $id
      data: { mimeType: $mimeType, title: $title, url: $url }
    ) {
      id
    }
  }
`;
// SELF_FILE_FILE_DELETE
export const SELF_FILE_FILE_DELETE = gql`
  mutation selfFileFileDelete($userId: Int!, $id: Int!) {
    selfFileFileDelete(userId: $userId, id: $id)
  }
`;
