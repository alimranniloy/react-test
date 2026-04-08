import { gql } from "@apollo/client";

export const STORE_TAGS = gql`
  query ($siteId: [Int]!, $isPrivate: Boolean, $search: String, $first: Int, $after: String, $offset: Int) {
    storeTags(
      siteId: $siteId
      isPrivate: $isPrivate
      search: $search
      first: $first
      after: $after
      offset: $offset
    ) {
      total
      edges {
        node {
          id
          slug
          isActive
          isPrivate
          title
          siteId
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

export const STORE_TAG = gql`
  query ($id: Int!) {
    storeTag(id: $id) {
      id
      slug
      isActive
      isPrivate
      siteId
      title
      translation
      updatedAt
    }
  }
`;
