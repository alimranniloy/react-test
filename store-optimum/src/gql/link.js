import gql from "graphql-tag";
// FEED_LINKS
export const FEED_LINKS = gql`
  query ($after: String, $first: Int) {
    feedLinks(first: $first, after: $after) {
      total
      edges {
        node {
          description
          id
          image
          isActive
          linkType
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
// FEED_LINK_DETAILS
export const FEED_LINK_DETAILS = gql`
  query ($id: Int!) {
    feedLink(id: $id) {
      description
      id
      image
      isActive
      linkType
      title
      url
    }
  }
`;
// FEED_LINK_DETAILS_BY_URL
export const FEED_LINK_DETAILS_BY_URL = gql`
  query ($url: String!) {
    feedLinkByUrl(url: $url) {
      description
      id
      image
      isActive
      linkType
      title
      url
    }
  }
`;
// SELF_FEED_LINK_CREATE
export const SELF_FEED_LINK_CREATE = gql`
  mutation selfFeedLinkCreate(
    $userId: Int!
    $description: String!
    $image: String!
    $isActive: Boolean!
    $linkType: String!
    $title: String!
    $url: String!
  ) {
    selfFeedLinkCreate(
      userId: $userId
      data: {
        description: $description
        image: $image
        isActive: $isActive
        linkType: $linkType
        title: $title
        url: $url
      }
    ) {
      description
      id
      image
      isActive
      linkType
      title
      url
    }
  }
`;
// SELF_FEED_LINK_UPDATE
export const SELF_FEED_LINK_UPDATE = gql`
  mutation selfFeedLinkUpdate(
    $userId: Int!
    $id: Int!
    $description: String
    $image: String
    $isActive: Boolean
    $linkType: String
    $title: String
    $url: String
  ) {
    selfFeedLinkUpdate(
      userId: $userId
      id: $id
      data: {
        description: $description
        image: $image
        isActive: $isActive
        linkType: $linkType
        title: $title
        url: $url
      }
    ) {
      description
      id
      image
      isActive
      linkType
      title
      url
    }
  }
`;

// SELF_FEED_LINK_DELETE
export const SELF_FEED_LINK_DELETE = gql`
  mutation selfFeedLinkDelete($userId: Int!, $id: Int!) {
    selfFeedLinkDelete(userId: $userId, id: $id)
  }
`;
