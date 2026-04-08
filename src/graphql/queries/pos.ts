import { gql } from "@apollo/client";

export const STORE_PRODUCTS_FOR_POS = gql`
  query (
    $siteId: [Int]!
    $brandId: Int
    $campaignId: Int
    $categoryId: Int
    $collectionId: Int
    $isFlash: Boolean
    $childId: Int
    $childType: Int
    $percentage: JSON
    $isReseller: Boolean
    $isBasePrice: Boolean
    $queryType: String
    $search: String
    $stoppageId: Int
    $subCategoryId: Int
    $subSubCategoryId: Int
    $supplierId: Int
    $tagIds: [Int]
    $after: String
    $first: Int
  ) {
    storeProducts(
      siteId: $siteId
      brandId: $brandId
      campaignId: $campaignId
      categoryId: $categoryId
      collectionId: $collectionId
      isFlash: $isFlash
      queryType: $queryType
      search: $search
      stoppageId: $stoppageId
      subCategoryId: $subCategoryId
      subSubCategoryId: $subSubCategoryId
      supplierId: $supplierId
      tagIds: $tagIds
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          id
          hid
          title(childId: $childId, childType: $childType)
          sku
          slug
          thumbnail
          price(
            childId: $childId
            childType: $childType
            percentage: $percentage
            isReseller: $isReseller
          )
          comparePrice(childId: $childId, childType: $childType)
          cost(childId: $childId, childType: $childType, isReseller: $isReseller)
          quantity(childId: $childId, childType: $childType)
          unit
          unitType
          currency
          isActive(childId: $childId, childType: $childType)
          isContinueSelling(childId: $childId, childType: $childType)
          isFlash(childId: $childId, childType: $childType)
          isPrivate(childId: $childId, childType: $childType)
          flashPrice(
            childId: $childId
            childType: $childType
            percentage: $percentage
            isReseller: $isReseller
            isBasePrice: $isBasePrice
          )
          priority
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
