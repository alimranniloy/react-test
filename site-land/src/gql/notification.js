import gql from 'graphql-tag'
// SITE_NOTIFICATIONS
export const SITE_NOTIFICATIONS = gql `
query($siteId: Int!, $after: String, $first: Int) {
  siteNotifications(
    siteId: $siteId
    first: $first
    after: $after
  ) {
      total
      edges {
      node {
        body
        createdAt
        id
        isPublic
        isUnread
        title
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
// SITE_NOTIFICATION_DETAILS
export const SITE_NOTIFICATION_DETAILS = gql `
query($siteId: Int!, $id: Int!) {
  siteNotification(siteId: $siteId, id: $id) {
    body
    createdAt
    id
    isPublic
    isUnread
    title
  }
}
`;
// SELF_SITE_NOTIFICATION_CREATE
export const SELF_SITE_NOTIFICATION_CREATE = gql `
mutation selfSiteNotificationCreate(
  $userId: Int!
  $siteId: Int!
  $body: String!
  $data: String!
  $isPublic: Boolean!
  $isUnread: Boolean!
  $level: Int!
  $title: String!
) {
  selfSiteNotificationCreate(
    userId: $userId
    siteId: $siteId
    data: {
      body: $body
      data: $data
      isPublic: $isPublic
      isUnread: $isUnread
      level: $level
      title: $title
    }
  ) {
    id
  }
}
`;
// SELF_SITE_NOTIFICATION_UPDATE
export const SELF_SITE_NOTIFICATION_UPDATE = gql `
mutation selfSiteNotificationUpdate(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $body: String
  $data: String
  $isPublic: Boolean
  $isUnread: Boolean
  $level: Int
  $title: String
) {
  selfSiteNotificationUpdate(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      body: $body
      data: $data
      isPublic: $isPublic
      isUnread: $isUnread
      level: $level
      title: $title
    }
  ) {
    id
  }
}
`;
// SELF_SITE_NOTIFICATION_DELETE
export const SELF_SITE_NOTIFICATION_DELETE = gql `
mutation selfSiteNotificationDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfSiteNotificationDelete(userId: $userId, siteId: $siteId, id: $id) 
}
`;