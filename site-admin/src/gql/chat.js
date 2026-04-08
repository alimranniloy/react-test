import gql from 'graphql-tag';
// ------------------------------------------------------------------
// CHAT_THREADS
export const CHAT_THREADS = gql`
query($userId: Int!, $search: String, $first: Int, $after: String) {
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
// CHAT_THREAD_PREVIEW
export const CHAT_THREAD_PREVIEW = gql `
query($id: Int!) {
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
// CHAT_MESSAGES
export const CHAT_MESSAGES = gql`
query($threadId: Int!, $first: Int, $after: String) {
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
// CHAT_THREAD_CREATE
export const CHAT_THREAD_CREATE = gql`
mutation selfChatThreadCreate(
  $userId: Int!
  $channel: String!
  $lastMessage: String,
  $receiverId: Int!
  $receiverName: String!
  $senderId: Int!
  $senderName: String!
) {
  selfChatThreadCreate(
    userId: $userId
    channel: $channel
    data: { channel: $channel, lastMessage: $lastMessage, receiverId: $receiverId, receiverName: $receiverName, senderId: $senderId, senderName: $senderName}
  ) {
    id
    channel
  }
}
`;
// CHAT_MESSAGE_CREATE
export const CHAT_MESSAGE_CREATE = gql`
mutation selfChatMessageCreate(
  $userId: Int!
  $channel: String!
  $image: Upload
  $message: String!
  $threadId: Int!
) {
  selfChatMessageCreate(
    userId: $userId
    channel: $channel
    data: { image: $image, message: $message, threadId: $threadId }
  ) {
    createdAt
    id
    image
    message
    user {
      id
    }
  }
}

`;
// CHAT_TYPING
export const CHAT_TYPING = gql`
  mutation chatTypingCreate($channel: String!, $userId: Int!) {
    chatTypingCreate(channel: $channel, userId: $userId) {
      userId
    }
  }
`;
// CHAT_THREAD_SUBSCRIPTION
export const CHAT_THREAD_SUBSCRIPTION = gql`
subscription chatThread($channel: String!) {
  chatThread(channel: $channel) {
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
// CHAT_MESSAGE_SUBSCRIPTION
export const CHAT_MESSAGE_SUBSCRIPTION = gql`
subscription chatMessage($channel: String!) {
  chatMessage(channel: $channel) {
    createdAt
    id
    image
    message
    user {
      id
    }
  }
}
`;
// CHAT_TYPING_SUBSCRIPTION
export const CHAT_TYPING_SUBSCRIPTION = gql`
subscription chatTyping($channel: String!) { 
  chatTyping(channel: $channel) {
    channel
    userId
  }
}
`;