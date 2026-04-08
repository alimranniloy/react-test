import { gql } from "@apollo/client";

export const SELF_HOME_FEEDBACK_CREATE = gql`
  mutation selfHomeFeedbackCreate(
    $userId: Int!
    $body: String!
    $contact: String!
    $image: Upload
    $name: String!
    $priority: Int!
    $source: String!
    $status: Int!
    $title: String!
  ) {
    selfHomeFeedbackCreate(
      userId: $userId
      data: {
        body: $body
        contact: $contact
        image: $image
        name: $name
        priority: $priority
        source: $source
        status: $status
        title: $title
      }
    ) {
      id
    }
  }
`;

export const SELF_HOME_FEEDBACK_UPDATE = gql`
  mutation selfHomeFeedbackUpdate(
    $userId: Int!
    $feedbackId: Int!
    $body: String!
    $contact: String!
    $image: Upload
    $name: String!
    $priority: Int!
    $source: String!
    $status: Int!
    $title: String!
  ) {
    selfHomeFeedbackUpdate(
      userId: $userId
      feedbackId: $feedbackId
      data: {
        body: $body
        contact: $contact
        image: $image
        name: $name
        priority: $priority
        source: $source
        status: $status
        title: $title
      }
    ) {
      id
    }
  }
`;

export const SELF_HOME_FEEDBACK_DELETE = gql`
  mutation selfHomeFeedbackDelete($userId: Int!, $feedbackId: Int!) {
    selfHomeFeedbackDelete(userId: $userId, feedbackId: $feedbackId)
  }
`;
