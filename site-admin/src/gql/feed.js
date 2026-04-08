import gql from 'graphql-tag'
// SITE_FEEDS
export const SITE_FEEDS = gql `
query($siteId: Int!, $after: String, $first: Int) {
  siteFeeds(siteId: $siteId, first: $first, after: $after) {
      total
      edges {
      node {
        id
        description
        image
        isActive
        user {
          name
          avatar
        }
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
// SITE_FEED_PREVIEW
export const SITE_FEED_PREVIEW = gql`
  query ($id: Int!) {
    siteFeed(id: $id) {
        id
        description
        image
        isActive
        user {
          name
          avatar
        }
        updatedAt
    }
  }
`; 
// SELF_SITE_FEED_CREATE
export const SELF_SITE_FEED_CREATE = gql `
mutation selfSiteFeedCreate(
  $userId: Int!
  $siteId: Int!
  $description: String!
  $image: Upload
  $isActive: Boolean!
  $isAnnouncement: Boolean!
) {
  selfSiteFeedCreate(
    userId: $userId
    siteId: $siteId
    data: {
      description: $description
      image: $image
      isActive: $isActive
      isAnnouncement: $isAnnouncement
    }
  ) {
    id
    image
    description
  }
}
`;
// SELF_SITE_FEED_SUBSCRIPTION
export const SELF_SITE_FEED_SUBSCRIPTION = gql `
subscription siteFeed($channel: String!) { 
  siteFeed(channel: $channel) {
    description
    id
    image
    isActive
    isAnnouncement
    updatedAt
  }
}
`;
// SELF_SITE_FEED_UPDATE
export const SELF_SITE_FEED_UPDATE = gql `
mutation selfSiteFeedUpdate(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $isActive: Boolean!
  $isAnnouncement: Boolean!
  $description: String!
) {
  selfSiteFeedUpdate(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      description: $description
      isActive: $isActive
      isAnnouncement: $isAnnouncement
    }
  ) {
    id
  }
}
`;

// SELF_SITE_FEED_DELETE
export const SELF_SITE_FEED_DELETE = gql `
mutation selfSiteFeedDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfSiteFeedDelete(userId: $userId, siteId: $siteId, id: $id)
}
`;