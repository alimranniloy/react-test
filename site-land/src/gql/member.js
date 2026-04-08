import gql from "graphql-tag";
// FEED_MEMBERS
export const FEED_MEMBERS = gql`
  query ($communityId: Int, $after: String, $first: Int) {
    feedMembers(communityId: $communityId, first: $first, after: $after) {
      total
      edges {
        node {
          avatar
          id
          isActive
          isVerified
          score
          title
          userId
          username
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
// FEED_MEMBER_DETAILS
export const FEED_MEMBER_DETAILS = gql`
  query ($id: Int!) {
    feedMember(id: $id) {
      avatar
      id
      isActive
      isVerified
      score
      title
      userId
      username
    }
  }
`;
// FEED_MEMBER_DETAILS
export const FEED_MEMBER_FIND_BY_USER = gql`
  query ($userId: Int!, $communityId: Int!) {
    feedMemberFindByUser(userId: $userId, communityId: $communityId) {
      avatar
      id
      isActive
      isVerified
      score
      title
      userId
      username
    }
  }
`;
// SELF_FEED_MEMBER_CREATE
export const SELF_FEED_MEMBER_CREATE = gql`
  mutation selfFeedMemberCreate(
    $userId: Int!
    $communityId: Int!
    $avatar: String!
    $isActive: Boolean!
    $isVerified: Boolean!
    $score: Float!
    $title: String!
    $username: String!
  ) {
    selfFeedMemberCreate(
      userId: $userId
      data: {
        avatar: $avatar
        communityId: $communityId
        isActive: $isActive
        isVerified: $isVerified
        score: $score
        title: $title
        username: $username
      }
    ) {
      avatar
      id
      isActive
      isVerified
      score
      title
      userId
      username
    }
  }
`;
// SELF_FEED_MEMBER_UPDATE
export const SELF_FEED_MEMBER_UPDATE = gql`
  mutation selfFeedMemberUpdate(
    $userId: Int!
    $id: Int!
    $avatar: String
    $isActive: Boolean
    $isVerified: Boolean
    $score: Float
    $title: String
    $username: String
  ) {
    selfFeedMemberUpdate(
      userId: $userId
      id: $id
      data: {
        avatar: $avatar
        communityId: $communityId
        isActive: $isActive
        isVerified: $isVerified
        score: $score
        title: $title
        username: $username
      }
    ) {
      avatar
      id
      isActive
      isVerified
      score
      title
      userId
      username
    }
  }
`;

// SELF_FEED_MEMBER_DELETE
export const SELF_FEED_MEMBER_DELETE = gql`
  mutation selfFeedMemberDelete($userId: Int!, $id: Int!) {
    selfFeedMemberDelete(userId: $userId, id: $id)
  }
`;
