import { gql } from "@apollo/client";

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

export const CHAT_TYPING_SUBSCRIPTION = gql`
  subscription chatTyping($channel: String!) {
    chatTyping(channel: $channel) {
      userId
    }
  }
`;
