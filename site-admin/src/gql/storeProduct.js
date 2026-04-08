import gql from "graphql-tag";
// STORE_PRODUCTS
export const STORE_PRODUCTS = gql`
  query (
    $siteId: [Int]!
    $authorId: Int
    $brandId: Int
    $campaignId: Int
    $categoryId: Int
    $childId: Int
    $childType: Int
    $collectionId: Int
    $isActive: Boolean
    $isFlash: Boolean
    $isFeatured: Boolean
    $isOneTime: Boolean
    $percentage: JSON
    $queryType: String
    $search: String
    $shopId: Int
    $stoppageId: Int
    $subCategoryId: Int
    $subSubCategoryId: Int
    $supplierId: Int
    $tagIds: [Int]
    $productType: Int
    $isPrivate: Boolean
    $isLanding: Boolean
    $after: String
    $first: Int
    $limit: Int
  ) {
    storeProducts(
      siteId: $siteId
      authorId: $authorId
      brandId: $brandId
      campaignId: $campaignId
      categoryId: $categoryId
      collectionId: $collectionId
      isActive: $isActive
      isFlash: $isFlash
      isFeatured: $isFeatured
      isOneTime: $isOneTime
      queryType: $queryType
      search: $search
      shopId: $shopId
      stoppageId: $stoppageId
      subCategoryId: $subCategoryId
      subSubCategoryId: $subSubCategoryId
      supplierId: $supplierId
      tagIds: $tagIds
      productType: $productType
      isPrivate: $isPrivate
      isLanding: $isLanding
      after: $after
      first: $first
      limit: $limit
    ) {
      total
      edges {
        node {
          affiliateCommission
          authors
          barcode
          brands
          campaigns
          cashback(childId: $childId, childType: $childType)
          categories
          collections
          comparePrice(childId: $childId, childType: $childType)
          currency
          cost(
            childId: $childId
            childType: $childType
            isReseller: $isReseller
          )
          createdAt
          currency
          deliveryCharge(childId: $childId, childType: $childType)
          discount(childId: $childId, childType: $childType)
          emiDuration
          emiInterest
          emiPrice
          features {
            key
            value
          }
          flashPrice(
            childId: $childId
            childType: $childType
            percentage: $percentage
            isReseller: $isReseller
            isBasePrice: $isBasePrice
          )
          hid
          id
          isActive(childId: $childId, childType: $childType)
          isContinueSelling(childId: $childId, childType: $childType)
          isFlash(childId: $childId, childType: $childType)
          isOneTime(childId: $childId, childType: $childType)
          isPrivate(childId: $childId, childType: $childType)
          maxOrder
          maxResellPrice
          minResellPrice
          minOrder
          price(
            childId: $childId
            childType: $childType
            percentage: $percentage
          )
          priority
          productType
          quantity(childId: $childId, childType: $childType)
          rewardPoints(childId: $childId, childType: $childType)
          siteId
          sku
          slug
          subCategories
          subSubCategories
          tags
          thumbnail
          title(childId: $childId, childType: $childType)
          translation(childId: $childId, childType: $childType)
          unit
          unitType
          variants {
            comparePrice
            cost
            currency
            id
            imageIndex
            price
            priority
            quantity
            title
            variant {
              key
              value
            }
            weight
            wholesalePrice
          }
          updatedAt
          updatedById
          vat
          weight
          wholesale {
            id
            maxOrder
            minOrder
            price
          }
          wholesalePrice(childId: $childId, percentage: $percentage)
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

// STORE_PRODUCT_SEARCHS
export const STORE_PRODUCT_SEARCHS = gql`
  query (
    $siteId: [Int]!
    $childId: Int
    $childType: Int
    $percentage: JSON
    $isReseller: Boolean
    $isBasePrice: Boolean
    $after: String
    $first: Int
  ) {
    storeProducts(siteId: $siteId, after: $after, first: $first) {
      total
      edges {
        node {
          barcode
          hid
          id
          price(
            childId: $childId
            childType: $childType
            percentage: $percentage
          )
          sku
          thumbnail
          slug
          title(childId: $childId, childType: $childType)
          translation(childId: $childId, childType: $childType)
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
// STORE_PRODUCTS_FOR_POS
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
    $limit: Int
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
      limit: $limit
    ) {
      total
      edges {
        node {
          comparePrice(childId: $childId, childType: $childType)
          cost(
            childId: $childId
            childType: $childType
            isReseller: $isReseller
          )
          createdAt
          currency
          flashPrice(
            childId: $childId
            childType: $childType
            percentage: $percentage
            isReseller: $isReseller
            isBasePrice: $isBasePrice
          )
          hid
          id
          isActive(childId: $childId, childType: $childType)
          isContinueSelling(childId: $childId, childType: $childType)
          isFlash(childId: $childId, childType: $childType)
          isPrivate(childId: $childId, childType: $childType)
          price(
            childId: $childId
            childType: $childType
            percentage: $percentage
          )
          priority
          quantity(childId: $childId, childType: $childType)
          siteId
          sku
          slug
          thumbnail
          title(childId: $childId, childType: $childType)
          unit
          unitType
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

// STORE_PRODUCTS_FLASH
export const STORE_PRODUCTS_FLASH = gql`
  query (
    $siteId: [Int]!
    $brandId: Int
    $campaignId: Int
    $categoryId: Int
    $collectionId: Int
    $queryType: String
    $search: String
    $subCategoryId: Int
    $subSubCategoryId: Int
    $tagIds: [Int]
    $isFlash: Boolean
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
      brandId: $brandId
      campaignId: $campaignId
      categoryId: $categoryId
      collectionId: $collectionId
      queryType: $queryType
      search: $search
      subCategoryId: $subCategoryId
      subSubCategoryId: $subSubCategoryId
      tagIds: $tagIds
      isFlash: $isFlash
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          cost(
            childId: $childId
            childType: $childType
            isReseller: $isReseller
          )
          currency
          flashPrice(childId: $childId, percentage: $percentage)
          id
          isFlash
          price(
            childId: $childId
            childType: $childType
            percentage: $percentage
            isReseller: $isReseller
            isBasePrice: $isBasePrice
          )
          priority
          quantity
          sku
          siteId
          slug
          thumbnail
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
// STORE_PRODUCT_PREVIEW
export const STORE_PRODUCT_PREVIEW = gql`
  query ($id: Int!) {
    storeProduct(id: $id) {
      id
      image
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
// SELF_STORE_PRODUCT_UPDATE
export const SELF_STORE_PRODUCT_UPDATE = gql`
  mutation selfStoreProductUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $affiliateCommission: Float
    $affiliateCommissionPercentage: Float
    $author: JSON
    $authors: [Int]
    $barcode: String
    $brand: JSON
    $brands: [Int]
    $campaign: JSON
    $campaigns: [Int]
    $campaignSites: [Int]
    $cashback: Float
    $categories: [Int]
    $category: JSON
    $childId: Int
    $childProducts: JSON
    $childType: Int
    $collection: JSON
    $collections: [Int]
    $comparePrice: Float
    $cost: Float
    $currency: String
    $deliveryCharge: Float
    $deliveryTime: Int
    $description: String
    $discount: Float
    $emiDuration: Int
    $emiInterest: Float
    $emiPrice: Float
    $extraImages: JSON
    $faq: JSON
    $features: JSON
    $file: String
    $fileType: String
    $flashPrice: Float
    $html: JSON
    $image: Upload
    $images: JSON
    $isActive: Boolean
    $isCod: Boolean
    $isContinueSelling: Boolean
    $isEmi: Boolean
    $isFeatured: Boolean
    $isFlash: Boolean
    $isLanding: Boolean
    $isNegotiable: Boolean
    $isNew: Boolean
    $isOneTime: Boolean
    $isPreorder: Boolean
    $isPrivate: Boolean
    $isResell: Boolean
    $isTrack: Boolean
    $isUnlisted: Boolean
    $isVariant: Boolean
    $isWarranty: Boolean
    $keyword: String
    $maxOrder: Int
    $maxResellPrice: Float
    $metaDescription: String
    $metaTitle: String
    $minOrder: Int
    $minResellPrice: Float
    $note: JSON
    $parentId: Int
    $percentage: JSON
    $preorderDelivery: DateTime
    $price: Float
    $priority: Int
    $productType: Int
    $quantity: Int
    $requirement: JSON
    $rewardPoints: Float
    $salePrice: Float
    $schema: JSON
    $shopProducts: JSON
    $shops: [Int]
    $sku: String
    $slug: String
    $source: String
    $stoppages: [Int]
    $subCategories: [Int]
    $subCategory: JSON
    $subSubCategories: [Int]
    $subSubCategory: JSON
    $supplierId: Int
    $tags: [Int]
    $title: String
    $translation: String
    $unit: Float
    $unitType: Int
    $validFor: Int
    $variants: JSON
    $vat: Float
    $videoUrl: String
    $warranty: Int
    $weight: Float
    $wholesale: JSON
    $wholesalePrice: Float
    $wholesalePricePercentage: Float
  ) {
    selfStoreProductUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        affiliateCommission: $affiliateCommission
        affiliateCommissionPercentage: $affiliateCommissionPercentage
        author: $author
        authors: $authors
        barcode: $barcode
        brand: $brand
        brands: $brands
        campaign: $campaign
        campaigns: $campaigns
        campaignSites: $campaignSites
        cashback: $cashback
        categories: $categories
        category: $category
        childProducts: $childProducts
        collections: $collections
        collection: $collection
        comparePrice: $comparePrice
        cost: $cost
        currency: $currency
        deliveryCharge: $deliveryCharge
        deliveryTime: $deliveryTime
        description: $description
        discount: $discount
        emiDuration: $emiDuration
        emiInterest: $emiInterest
        emiPrice: $emiPrice
        extraImages: $extraImages
        faq: $faq
        features: $features
        file: $file
        fileType: $fileType
        flashPrice: $flashPrice
        html: $html
        image: $image
        images: $images
        isActive: $isActive
        isCod: $isCod
        isContinueSelling: $isContinueSelling
        isEmi: $isEmi
        isFeatured: $isFeatured
        isFlash: $isFlash
        isLanding: $isLanding
        isNegotiable: $isNegotiable
        isNew: $isNew
        isOneTime: $isOneTime
        isPreorder: $isPreorder
        isPrivate: $isPrivate
        isResell: $isResell
        isTrack: $isTrack
        isUnlisted: $isUnlisted
        isVariant: $isVariant
        isWarranty: $isWarranty
        keyword: $keyword
        maxOrder: $maxOrder
        maxResellPrice: $maxResellPrice
        metaDescription: $metaDescription
        metaTitle: $metaTitle
        minOrder: $minOrder
        minResellPrice: $minResellPrice
        note: $note
        parentId: $parentId
        preorderDelivery: $preorderDelivery
        price: $price
        priority: $priority
        productType: $productType
        quantity: $quantity
        requirement: $requirement
        rewardPoints: $rewardPoints
        salePrice: $salePrice
        schema: $schema
        shopProducts: $shopProducts
        shops: $shops
        siteId: $siteId
        sku: $sku
        slug: $slug
        source: $source
        stoppages: $stoppages
        subCategories: $subCategories
        subCategory: $subCategory
        subSubCategories: $subSubCategories
        subSubCategory: $subSubCategory
        supplierId: $supplierId
        tags: $tags
        title: $title
        translation: $translation
        unit: $unit
        unitType: $unitType
        validFor: $validFor
        variants: $variants
        vat: $vat
        videoUrl: $videoUrl
        warranty: $warranty
        weight: $weight
        wholesale: $wholesale
        wholesalePrice: $wholesalePrice
        wholesalePricePercentage: $wholesalePricePercentage
      }
    ) {
      affiliateCommission
      cashback
      comparePrice
      campaignSites
      cost(childId: $childId, childType: $childType, isReseller: $isReseller)
      createdById
      currency
      deliveryCharge
      discount
      flashPrice(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
        isBasePrice: $isBasePrice
      )
      hid
      id
      isActive
      isContinueSelling
      isFlash
      isNegotiable
      isOneTime
      isVariant
      maxOrder
      maxResellPrice
      minOrder
      minResellPrice
      price(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
        isBasePrice: $isBasePrice
      )
      quantity
      rewardPoints
      siteId
      sku
      slug
      thumbnail
      title
      translation
      unit
      unitType
      vat
      videoUrl
      weight
    }
  }
`;
