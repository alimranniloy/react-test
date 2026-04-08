import gql from "graphql-tag";
// FEED_COMMUNITIES
export const FEED_COMMUNITIES = gql`
  query ($userId: Int, $after: String, $first: Int) {
    feedCommunities(userId: $userId, first: $first, after: $after) {
      total
      edges {
        node {
          createdAt
          id
          hid
          admins
          avatar
          cover
          updatedAt
          interest
          isActive
          isPrivate
          score
          slug
          staffs
          title
          totalMembers
          userId
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
// FEED_COMMUNITY_DETAILS
export const FEED_COMMUNITY_DETAILS = gql`
  query ($id: Int!) {
    feedCommunity(id: $id) {
      createdAt
      id
      hid
      admins
      avatar
      cover
      updatedAt
      interest
      isActive
      isPrivate
      score
      slug
      staffs
      title
      totalMembers
      userId
    }
  }
`;
// FEED_COMMUNITY_BY_USER
export const FEED_COMMUNITY_BY_USER = gql`
  query ($userId: Int!, $slug: String!) {
    feedCommunityFindByUser(userId: $userId, slug: $slug) {
      createdAt
      id
      hid
      admins
      avatar
      cover
      updatedAt
      interest
      isActive
      isPrivate
      score
      slug
      staffs
      title
      totalMembers
      userId
    }
  }
`;
// SELF_FEED_COMMUNITY_CREATE
export const SELF_FEED_COMMUNITY_CREATE = gql`
  mutation selfFeedCommunityCreate(
    $userId: Int!
    $admins: [Int]!
    $avatar: Upload
    $cover: Upload
    $interest: [Int]!
    $isPrivate: Boolean!
    $slug: String!
    $score: Float!
    $staffs: [Int]!
    $title: String!
  ) {
    selfFeedCommunityCreate(
      userId: $userId
      data: {
        admins: $admins
        avatar: $avatar
        cover: $cover
        interest: $interest
        isPrivate: $isPrivate
        slug: $slug
        score: $score
        staffs: $staffs
        title: $title
      }
    ) {
      createdAt
      id
      hid
      admins
      avatar
      cover
      updatedAt
      interest
      isActive
      isPrivate
      score
      slug
      staffs
      title
      totalMembers
      userId
    }
  }
`;
// FEED_COMMUNITY_CREATE
export const FEED_COMMUNITY_CREATE = gql`
  mutation feedCommunityCreate(
    $userId: Int!
    $admins: [Int]!
    $avatar: Upload
    $cover: Upload
    $interest: [Int]!
    $isPrivate: Boolean!
    $slug: String!
    $score: Float!
    $staffs: [Int]!
    $title: String!
  ) {
    feedCommunityCreate(
      userId: $userId
      data: {
        admins: $admins
        avatar: $avatar
        cover: $cover
        interest: $interest
        isPrivate: $isPrivate
        slug: $slug
        score: $score
        staffs: $staffs
        title: $title
      }
    ) {
      createdAt
      id
      hid
      admins
      avatar
      cover
      updatedAt
      interest
      isActive
      isPrivate
      score
      slug
      staffs
      title
      totalMembers
      userId
    }
  }
`;
// SELF_FEED_COMMUNITY_UPDATE
export const SELF_FEED_COMMUNITY_UPDATE = gql`
  mutation selfFeedCommunityUpdate(
    $userId: Int!
    $id: Int!
    $avatar: Upload
    $cover: Upload
    $title: String
    $interest: [Int]
  ) {
    selfFeedCommunityUpdate(
      userId: $userId
      id: $id
      data: {
        avatar: $avatar
        cover: $cover
        interest: $interest
        title: $title
      }
    ) {
      createdAt
      id
      hid
      admins
      avatar
      cover
      updatedAt
      interest
      isActive
      isPrivate
      score
      slug
      staffs
      title
      totalMembers
      userId
    }
  }
`;

// SELF_FEED_COMMUNITY_DELETE
export const SELF_FEED_COMMUNITY_DELETE = gql`
  mutation selfFeedFeedDelete($userId: Int!, $id: Int!) {
    selfFeedFeedDelete(userId: $userId, id: $id)
  }
`;
