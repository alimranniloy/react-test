import gql from 'graphql-tag'
// SHORT_URL_URLS
export const SHORT_URL_URLS = gql `
query($userId: Int!, $after: String, $first: Int) {
  shortUrlUrls(userId: $userId, first: $first, after: $after) {
      total
      edges {
      node {
        createdAt
        hid
        id
        title
        url
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

// SELF_SHORT_URL_URL_CREATE
export const SELF_SHORT_URL_URL_CREATE = gql `
mutation selfShortUrlUrlCreate(
  $userId: Int!
  $title: String!
  $url: String!
) {
  selfShortUrlUrlCreate(
    userId: $userId
    data: {
      title: $title
      url: $url
    }
  ) {
    createdAt
    hid
    id
    title
    url
  }
}
`;


// SELF_SHORT_URL_URL_UPDATE
export const SELF_SHORT_URL_URL_UPDATE = gql `
mutation selfShortUrlUrlUpdate(
  $userId: Int!
  $urlId: Int!
  $title: String
  $url: String
) {
  selfShortUrlUrlUpdate(
    userId: $userId
    urlId: $urlId
    data: {
      title: $title
      url: $url
    }
  ) {
    createdAt
    hid
    id
    title
    url
  }
}
`;
// SELF_SHORT_URL_URL_DELETE
export const SELF_SHORT_URL_URL_DELETE = gql `
mutation selfShortUrlUrlDelete(
  $userId: Int!
  $urlId: Int!
) {
  selfShortUrlUrlDelete(
    userId: $userId
    urlId: $urlId
  )
}
`;