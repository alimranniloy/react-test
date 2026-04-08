import gql from 'graphql-tag'
// SITE_FEEDBACKS
export const SITE_FEEDBACKS = gql `
query($siteId: Int!, $userId: Int, $status: Int, $priority: Int, $search: String, $after: String, $first: Int) {
  siteFeedbacks(siteId: $siteId, userId: $userId, status: $status, priority: $priority, search: $search, first: $first, after: $after) {
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

// SELF_SITE_FEEDBACK_CREATE
export const SELF_SITE_FEEDBACK_CREATE = gql `
mutation selfSiteFeedbackCreate(
  $userId: Int!
  $siteId: Int!
  $body: String!
  $contact: String!
  $image: Upload
  $name: String!
  $priority: Int!
  $source: String!
  $status: Int!
  $title: String!
) {
  selfSiteFeedbackCreate(
    userId: $userId
    data: {
      body: $body
      contact: $contact
      image: $image
      name: $name
      priority: $priority
      siteId: $siteId
      source: $source
      status: $status
      title: $title
    }
  ) {
    id
  }
}
`;
// SELF_SITE_FEEDBACK_UPDATE
export const SELF_SITE_FEEDBACK_UPDATE = gql `
mutation selfSiteFeedbackUpdate(
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
  selfSiteFeedbackUpdate(
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

// SELF_SITE_FEEDBACK_DELETE
export const SELF_SITE_FEEDBACK_DELETE = gql `
mutation selfSiteFeedbackDelete(
  $userId: Int!
  $feedbackId: Int!
) {
  selfSiteFeedbackDelete(
    userId: $userId
    feedbackId: $feedbackId
  )
}
`;