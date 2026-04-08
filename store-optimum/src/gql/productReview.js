import gql from "graphql-tag";
// STORE_PRODUCT_REVIEWS
export const STORE_PRODUCT_REVIEWS = gql`
  query ($productId: Int, $after: String, $first: Int) {
    storeProductReviews(productId: $productId, first: $first, after: $after) {
      total
      edges {
        node {
          createdAt
          description
          id
          rating
          userId
          user {
            id
            name
            avatar
          }
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
// SELF_STORE_PRODUCT_REVIEW_CREATE
export const SELF_STORE_PRODUCT_REVIEW_CREATE = gql`
  mutation selfStoreProductReviewCreate(
    $userId: Int!
    $productId: Int!
    $description: String!
    $rating: Int!
  ) {
    selfStoreProductReviewCreate(
      userId: $userId
      productId: $productId
      data: {
        description: $description
        productId: $productId
        rating: $rating
        userId: $userId
      }
    ) {
      id
    }
  }
`;
// SELF_STORE_PRODUCT_REVIEW_UPDATE
export const SELF_STORE_PRODUCT_REVIEW_UPDATE = gql`
  mutation selfStoreProductReviewUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $description: String
    $rating: String
  ) {
    selfStoreProductReviewUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: { description: $description, rating: $rating }
    ) {
      id
    }
  }
`;
// SELF_STORE_PRODUCT_REVIEW_DELETE
export const SELF_STORE_PRODUCT_REVIEW_DELETE = gql`
  mutation selfStoreProductReviewDelete($userId: Int!, $id: Int!) {
    selfStoreProductReviewDelete(userId: $userId, id: $id)
  }
`;
