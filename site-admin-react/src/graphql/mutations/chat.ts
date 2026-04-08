import { gql } from "@apollo/client";

export const CHAT_THREAD_CREATE = gql`
  mutation selfChatThreadCreate(
    $userId: Int!
    $channel: String!
    $lastMessage: String
    $receiverId: Int!
    $receiverName: String!
    $senderId: Int!
    $senderName: String!
  ) {
    selfChatThreadCreate(
      userId: $userId
      channel: $channel
      data: {
        channel: $channel
        lastMessage: $lastMessage
        receiverId: $receiverId
        receiverName: $receiverName
        senderId: $senderId
        senderName: $senderName
      }
    ) {
      id
      channel
    }
  }
`;

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

export const CHAT_TYPING_CREATE = gql`
  mutation chatTypingCreate($channel: String!, $userId: Int!) {
    chatTypingCreate(channel: $channel, userId: $userId) {
      userId
    }
  }
`;

