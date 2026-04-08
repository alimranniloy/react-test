import { gql } from "@apollo/client";

export const USERS = gql`
  query (
    $search: String
    $referedId: Int
    $sourceId: Int
    $isActive: Boolean
    $referedById: Boolean
    $after: String
    $first: Int
  ) {
    users(
      search: $search
      referedId: $referedId
      sourceId: $sourceId
      isActive: $isActive
      referedById: $referedById
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          address
          avatar
          dateJoined
          id
          isActive
          name
          phone
          referCode
          refereds {
            id
            parentId
            serial
            title
            userId
            sourceId
          }
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
