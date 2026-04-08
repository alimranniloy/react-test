import { gql } from "@apollo/client";

export const HOME_FEEDBACKS = gql`
  query ($userId: Int!, $status: Int, $priority: Int, $search: String, $after: String, $first: Int) {
    homeFeedbacks(userId: $userId, status: $status, priority: $priority, search: $search, first: $first, after: $after) {
      total
      edges {
        node {
          body
          contact
          id
          name
          priority
          source
          hid
          status
          title
          updatedAt
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
