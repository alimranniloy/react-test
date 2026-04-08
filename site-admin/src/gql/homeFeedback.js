import gql from 'graphql-tag'
// HOME_FEEDBACKS
export const HOME_FEEDBACKS = gql `
query($userId: Int!, $status: Int, $priority: Int, $search: String, $after: String, $first: Int) {
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
      hasPreviousPage
      endCursor
    }
  }
}
`;

// SELF_HOME_FEEDBACK_CREATE
export const SELF_HOME_FEEDBACK_CREATE = gql `
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
// SELF_HOME_FEEDBACK_UPDATE
export const SELF_HOME_FEEDBACK_UPDATE = gql `
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

// SELF_HOME_FEEDBACK_DELETE
export const SELF_HOME_FEEDBACK_DELETE = gql `
mutation selfHomeFeedbackDelete(
  $userId: Int!
  $feedbackId: Int!
) {
  selfHomeFeedbackDelete(
    userId: $userId
    feedbackId: $feedbackId
  )
}
`;