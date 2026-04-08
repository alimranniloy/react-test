import { gql } from "@apollo/client";

export const CHAT_THREADS = gql`
  query ($userId: Int!, $search: String, $first: Int, $after: String) {
    chatThreads(userId: $userId, search: $search, first: $first, after: $after) {
      total
      edges {
        node {
          id
          isSeenByReceiver
          isSeenBySender
          lastMessage
          updatedAt
          receiver {
            avatar
            email
            id
            name
          }
          sender {
            avatar
            email
            id
            name
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

export const CHAT_THREAD_PREVIEW = gql`
  query ($id: Int!) {
    chatThread(id: $id) {
      id
      isSeenByReceiver
      isSeenBySender
      lastMessage
      updatedAt
      receiver {
        avatar
        email
        id
        name
      }
      sender {
        avatar
        email
        id
        name
      }
    }
  }
`;

export const CHAT_MESSAGES = gql`
  query ($threadId: Int!, $first: Int, $after: String) {
    chatMessages(threadId: $threadId, first: $first, after: $after) {
      total
      edges {
        node {
          createdAt
          id
          image
          message
          user {
            id
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
