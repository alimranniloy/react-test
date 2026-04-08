import { gql } from "@apollo/client";

export const STORE_CAMPAIGNS = gql`
  query ($siteId: [Int]!, $isActive: Boolean, $search: String, $first: Int, $after: String) {
    storeCampaigns(siteId: $siteId, isActive: $isActive, search: $search, first: $first, after: $after) {
      total
      edges {
        node {
          cover
          createdAt
          hid
          id
          image
          isActive
          isHome
          isPrivate
          priority
          priorityHome
          queryType
          siteId
          slug
          title
          translation
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

export const STORE_COLLECTIONS = gql`
  query ($siteId: [Int]!, $isActive: Boolean, $search: String, $first: Int, $after: String) {
    storeCollections(siteId: $siteId, isActive: $isActive, search: $search, first: $first, after: $after) {
      edges {
        node {
          cover
          createdAt
          hid
          id
          image
          isActive
          isExternal
          isHome
          isPrivate
          priority
          priorityHome
          queryType
          siteId
          slug
          title
          translation
          updatedAt
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

export const STORE_VOUCHERS = gql`
  query ($siteId: Int!, $search: String, $after: String, $first: Int) {
    storeVouchers(siteId: $siteId, search: $search, after: $after, first: $first) {
      total
      edges {
        node {
          code
          currency
          discount
          maxDiscount
          endDate
          html
          id
          isActive
          isAuto
          isPublic
          title
          usageLimit
          used
          voucherType
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

export const SITE_SLIDERS = gql`
  query ($siteId: [Int]!, $childId: Int, $isPrivate: Boolean, $after: String, $isActive: Boolean) {
    siteSliders(siteId: $siteId, isPrivate: $isPrivate, after: $after, isActive: $isActive) {
      total
      edges {
        node {
          body
          cover(childId: $childId)
          id
          isActive(childId: $childId)
          isExternal
          isPrivate
          isPhone
          priority
          siteId
          title
          updatedAt
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

export const SITE_BLOG_POSTS = gql`
  query ($siteId: Int!, $limit: Int, $offset: Int, $isActive: Boolean, $postType: String) {
    siteBlogPosts(siteId: $siteId, limit: $limit, offset: $offset, isActive: $isActive, postType: $postType) {
      total
      edges {
        node {
          authorId
          authorName
          body
          postType
          createdAt
          createdById
          description
          extra
          id
          image
          isActive
          publishedAt
          siteId
          slug
          title
          updatedAt
          updatedById
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

export const STORE_FEATURES = gql`
  query ($isActive: Boolean, $first: Int, $after: String) {
    storeFeatures(isActive: $isActive, first: $first, after: $after) {
      total
      edges {
        node {
          feature
          id
          isActive
          keyword
          priority
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

export const SITE_NOTIFICATIONS = gql`
  query ($siteId: Int!, $after: String, $first: Int) {
    siteNotifications(siteId: $siteId, first: $first, after: $after) {
      total
      edges {
        node {
          body
          createdAt
          id
          isPublic
          isUnread
          title
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
