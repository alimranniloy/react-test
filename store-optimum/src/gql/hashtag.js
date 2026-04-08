import gql from "graphql-tag";
// FEED_HASHTAGS
export const FEED_HASHTAGS = gql`
  query ($search: Int, $after: String, $first: Int) {
    feedHashtags(search: $search, first: $first, after: $after) {
      total
      edges {
        node {
          id
          score
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
// FEED_HASHTAG_DETAILS
export const FEED_HASHTAG_DETAILS = gql`
  query ($id: Int!) {
    feedHashtag(id: $id) {
      id
      score
      title
    }
  }
`;
// FEED_HASHTAG_DETAILS_BY_TITLE
export const FEED_HASHTAG_DETAILS_BY_TITLE = gql`
  query ($title: String!) {
    feedHashtagByTtitle(title: $title) {
      id
      score
      title
    }
  }
`;
// SELF_FEED_HASHTAG_CREATE
export const SELF_FEED_HASHTAG_CREATE = gql`
  mutation selfFeedHashtagCreate(
    $userId: Int!
    $title: String!
  ) {
    selfFeedHashtagCreate(
      userId: $userId
      data: {
        title: $title
      }
    ) {
      id
      score
      title
    }
  }
`;
// SELF_FEED_HASHTAG_UPDATE
export const SELF_FEED_HASHTAG_UPDATE = gql`
  mutation selfFeedHashtagUpdate(
    $userId: Int!
    $id: Int!
    $title: String
  ) {
    selfFeedHashtagUpdate(
      userId: $userId
      id: $id
      data: {
        title: $title
      }
    ) {
      id
      score
      title
    }
  }
`;

// SELF_FEED_HASHTAG_DELETE
export const SELF_FEED_HASHTAG_DELETE = gql`
  mutation selfFeedHashtagDelete($userId: Int!, $id: Int!) {
    selfFeedHashtagDelete(userId: $userId, id: $id)
  }
`;
