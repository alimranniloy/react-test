import gql from "graphql-tag";
// FEED_FEEDS
export const FEED_FEEDS = gql`
  query (
    $userId: Int
    $communityId: Int
    $parentId: Int
    $childId: Int
    $queryType: String
    $after: String
    $first: Int
  ) {
    feedFeeds(
      userId: $userId
      communityId: $communityId
      parentId: $parentId
      queryType: $queryType
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          communityId
          feedType
          hid
          id
          isLiked(childId: $childId)
          link {
            description
            id
            image
            title
            url
          }
          parentId
          parent {
            id
            hid
            text
            images
            likes
            share
            replies
            userId
            link {
              description
              id
              image
              title
              url
            }
            user {
              id
              isVerified
              name
              avatar
              username
            }
            updatedAt
          }
          text
          images
          likes
          share
          replies
          userId
          user {
            id
            isVerified
            name
            avatar
            username
          }
          topReplies {
            communityId
            id
            hid
            text
            images
            user {
              id
              isVerified
              name
              avatar
              username
            }
            updatedAt
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
// FEED_FEED_DETAILS
export const FEED_FEED_DETAILS = gql`
  query ($id: Int!, $childId: Int) {
    feedFeed(id: $id) {
      communityId
      feedType
      hid
      id
      isLiked(childId: $childId)
      link {
        description
        id
        image
        title
        url
      }
      parentId
      parent {
        id
        hid
        text
        images
        likes
        share
        replies
        link {
          description
          id
          image
          title
          url
        }
        userId
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      text
      images
      likes
      share
      replies
      userId
      user {
        id
        isVerified
        name
        avatar
        username
      }
      topReplies {
        communityId
        id
        hid
        text
        images
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      updatedAt
    }
  }
`;
// SELF_FEED_FEED_CREATE
export const SELF_FEED_FEED_CREATE = gql`
  mutation selfFeedFeedCreate(
    $userId: Int!
    $communityId: Int
    $feedType: Int!
    $hashtag: [Int]
    $link: JSON
    $linkId: Int
    $text: String!
    $images: JSON
    $parent: JSON
    $parentId: Int
  ) {
    selfFeedFeedCreate(
      userId: $userId
      data: {
        communityId: $communityId
        feedType: $feedType
        hashtag: $hashtag
        link: $link
        linkId: $linkId
        text: $text
        images: $images
        parent: $parent
        parentId: $parentId
      }
    ) {
      communityId
      feedType
      hid
      id
      isLiked
      link {
        description
        id
        image
        title
        url
      }
      parentId
      parent {
        id
        hid
        text
        images
        likes
        share
        replies
        link {
          description
          id
          image
          title
          url
        }
        userId
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      text
      images
      likes
      share
      replies
      userId
      user {
        id
        isVerified
        name
        avatar
        username
      }
      topReplies {
        communityId
        id
        hid
        text
        images
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      updatedAt
    }
  }
`;
// SELF_FEED_FEED_SUBSCRIPTION
export const SELF_FEED_FEED_SUBSCRIPTION = gql`
  subscription feedFeed($channel: String!) {
    feedFeed(channel: $channel) {
      communityId
      feedType
      hid
      id
      isLiked
      link {
        description
        id
        image
        title
        url
      }
      parentId
      parent {
        id
        hid
        text
        images
        likes
        share
        replies
        link {
          description
          id
          image
          title
          url
        }
        userId
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      text
      images
      likes
      share
      replies
      userId
      user {
        id
        isVerified
        name
        avatar
        username
      }
      topReplies {
        communityId
        id
        hid
        text
        images
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      updatedAt
    }
  }
`;
// SELF_FEED_FEED_UPDATE
export const SELF_FEED_FEED_UPDATE = gql`
  mutation selfFeedFeedUpdate(
    $userId: Int!
    $id: Int!
    $feedType: Int
    $link: JSON
    $images: JSON
    $parent: JSON
    $text: String!
  ) {
    selfFeedFeedUpdate(
      userId: $userId
      id: $id
      data: {
        feedType: $feedType
        link: $link
        text: $text
        images: $images
        parent: $parent
      }
    ) {
      communityId
      feedType
      hid
      id
      isLiked
      link {
        description
        id
        image
        title
        url
      }
      parentId
      parent {
        id
        hid
        text
        images
        likes
        share
        replies
        link {
          description
          id
          image
          title
          url
        }
        userId
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      text
      images
      likes
      share
      replies
      userId
      user {
        id
        isVerified
        name
        avatar
        username
      }
      topReplies {
        communityId
        id
        hid
        text
        images
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      updatedAt
    }
  }
`;

// SELF_FEED_FEED_DELETE
export const SELF_FEED_FEED_DELETE = gql`
  mutation selfFeedFeedDelete($userId: Int!, $id: Int!) {
    selfFeedFeedDelete(userId: $userId, id: $id)
  }
`;

// SELF_FEED_FEED_DELETE_BY_ADMIN
export const SELF_FEED_FEED_DELETE_BY_ADMIN = gql`
  mutation selfFeedFeedDeleteByAdmin(
    $userId: Int!
    $id: Int!
    $communityId: Int!
  ) {
    selfFeedFeedDeleteByAdmin(
      userId: $userId
      id: $id
      communityId: $communityId
    )
  }
`;
// FEED_FEED_SUBSCRIPTION
export const FEED_FEED_SUBSCRIPTION = gql`
  subscription feedFeedSubscription($channel: String!) {
    feedFeedSubscription(channel: $channel) {
      communityId
      feedType
      hid
      id
      isLiked
      link {
        description
        id
        image
        title
        url
      }
      parentId
      parent {
        id
        hid
        text
        images
        likes
        share
        replies
        link {
          description
          id
          image
          title
          url
        }
        userId
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      text
      images
      likes
      share
      replies
      userId
      user {
        id
        isVerified
        name
        avatar
        username
      }
      topReplies {
        communityId
        id
        hid
        text
        images
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      updatedAt
    }
  }
`;

// SELF_FEED_FEED_UPDATE_LIKES
export const SELF_FEED_FEED_UPDATE_LIKES = gql`
  mutation selfFeedFeedUpdateLikes(
    $userId: Int!
    $id: Int!
    $status: String!
    $score: Float!
  ) {
    selfFeedFeedUpdateLikes(
      userId: $userId
      id: $id
      status: $status
      score: $score
    ) {
      communityId
      feedType
      hid
      id
      isLiked
      link {
        description
        id
        image
        title
        url
      }
      parentId
      parent {
        id
        hid
        text
        images
        likes
        share
        replies
        link {
          description
          id
          image
          title
          url
        }
        userId
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      text
      images
      likes
      share
      replies
      userId
      user {
        id
        isVerified
        name
        avatar
        username
      }
      topReplies {
        communityId
        id
        hid
        text
        images
        user {
          id
          isVerified
          name
          avatar
          username
        }
        updatedAt
      }
      updatedAt
    }
  }
`;

// FEED_TRAIN
export const FEED_TRAIN = gql`
  mutation feedTrain {
    feedTrain
  }
`;
