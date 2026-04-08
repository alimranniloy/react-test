import { gql } from "@apollo/client";

export const STORE_PRODUCTS = gql`
  query (
    $siteId: [Int]!
    $search: String
    $isActive: Boolean
    $isLanding: Boolean
    $isNew: Boolean
    $isFlash: Boolean
    $isFeatured: Boolean
    $categoryId: Int
    $subCategoryId: Int
    $subSubCategoryId: Int
    $brandId: Int
    $authorId: Int
    $tagIds: [Int]
    $supplierId: Int
    $campaignId: Int
    $collectionId: Int
    $productType: Int
    $childId: Int
    $childType: Int
    $percentage: JSON
    $isReseller: Boolean
    $isBasePrice: Boolean
    $after: String
    $first: Int
  ) {
    storeProducts(
      siteId: $siteId
      search: $search
      isActive: $isActive
      isLanding: $isLanding
      isNew: $isNew
      isFlash: $isFlash
      isFeatured: $isFeatured
      categoryId: $categoryId
      subCategoryId: $subCategoryId
      subSubCategoryId: $subSubCategoryId
      brandId: $brandId
      authorId: $authorId
      tagIds: $tagIds
      supplierId: $supplierId
      campaignId: $campaignId
      collectionId: $collectionId
      productType: $productType
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          id
          hid
          title(childId: $childId, childType: $childType)
          translation(childId: $childId, childType: $childType)
          slug
          sku
          productType
          quantity(childId: $childId, childType: $childType)
          price(
            childId: $childId
            childType: $childType
            percentage: $percentage
          )
          comparePrice(childId: $childId, childType: $childType)
          discount(childId: $childId, childType: $childType)
          flashPrice(
            childId: $childId
            childType: $childType
            percentage: $percentage
            isReseller: $isReseller
            isBasePrice: $isBasePrice
          )
          cost(
            childId: $childId
            childType: $childType
            isReseller: $isReseller
          )
          isActive(childId: $childId, childType: $childType)
          isFeatured
          isFlash
          isNew
          thumbnail
          sold
          updatedAt
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

export const STORE_PRODUCT_PREVIEW = gql`
  query ($id: Int!) {
    storeProduct(id: $id) {
      id
      image
      thumbnail
      isLanding
      schema
      siteId
      slug
      title
      hid
      site {
        id
        title
        domain
      }
    }
  }
`;

export const STORE_PRODUCT = gql`
  query (
    $id: Int!
    $childId: Int
    $childType: Int
    $percentage: JSON
    $isReseller: Boolean
    $isBasePrice: Boolean
  ) {
    storeProduct(id: $id) {
      affiliateCommission(childId: $childId)
      affiliateCommissionPercentage(childId: $childId)
      author {
        id
        title
      }
      authors
      barcode
      brand {
        id
        title
      }
      brands
      campaign {
        id
        title
      }
      campaigns
      campaignSites
      cashback(childId: $childId)
      category {
        id
        title
      }
      categories
      childProducts {
        flashPrice
        cost
        price
        quantity
        siteId
        siteType
        sold
      }
      collection {
        id
        title
      }
      collections
      deliveryCharge(childId: $childId)
      deliveryTime(childId: $childId)
      discount(childId: $childId)
      currency
      emiDuration(childId: $childId)
      emiInterest(childId: $childId)
      emiPrice(childId: $childId)
      extraImages {
        id
        image
      }
      faq {
        id
        key
        value
      }
      features {
        id
        key
        value
      }
      image
      id
      hid
      siteId
      title(childId: $childId)
      translation(childId: $childId)
      slug
      sku
      productType
      priority
      quantity(childId: $childId)
      price(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
        isBasePrice: $isBasePrice
      )
      comparePrice(childId: $childId)
      flashPrice(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
        isBasePrice: $isBasePrice
      )
      salePrice(childId: $childId, percentage: $percentage)
      cost(childId: $childId, childType: $childType, isReseller: $isReseller)
      isActive(childId: $childId)
      isEmi(childId: $childId)
      isExclusive
      isFeatured(childId: $childId)
      isFlash(childId: $childId)
      isNew(childId: $childId)
      isCod(childId: $childId)
      isOneTime(childId: $childId)
      isPreorder
      isContinueSelling(childId: $childId)
      isNegotiable(childId: $childId)
      isPrivate(childId: $childId)
      isResell(childId: $childId)
      isTrack(childId: $childId)
      isWarranty(childId: $childId)
      description(childId: $childId)
      html
      images {
        id
        image
      }
      thumbnail
      file
      fileType
      keyword
      maxOrder
      minOrder
      minResellPrice(childId: $childId, percentage: $percentage)
      maxResellPrice(childId: $childId, percentage: $percentage)
      metaDescription(childId: $childId)
      metaTitle(childId: $childId)
      note {
        file
        fileType
        genre
        id
        image
        isFree
        subTitle
        title
        url
      }
      parentId
      preorderDelivery
      requirements {
        id
        key
        value
      }
      rewardPoints(childId: $childId)
      schema
      shippingType
      shop {
        id
        title
      }
      shops
      source
      stoppages
      tags
      unitType
      validFor(childId: $childId)
      vat(childId: $childId)
      videoUrl
      warranty
      wholesale {
        id
        maxOrder
        minOrder
        price
      }
      wholesalePrice(childId: $childId, percentage: $percentage)
      wholesalePricePercentage(childId: $childId, percentage: $percentage)
      variants {
        id
        price
        cost
        comparePrice
        quantity
        priority
        imageIndex
        title
        wholesalePrice
        weight
        variant {
          key
          value
        }
      }
      weight
      unit
      isLanding
      isUnlisted
      isVariant(childId: $childId)
      sold(childId: $childId)
      supplierId
      supplierTitle
      createdAt
      updatedAt
    }
  }
`;
