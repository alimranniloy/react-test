import { gql } from "@apollo/client";

export const SELF_STORE_PRODUCT_CREATE = gql`
  mutation selfStoreProductCreate(
    $userId: Int!
    $siteId: Int!
    $title: String
    $slug: String
    $sku: String
    $price: Float
    $comparePrice: Float
    $discount: Float
    $cost: Float
    $quantity: Float
    $productType: Int
    $currency: String
    $description: String
    $html: JSON
    $image: Upload
    $images: JSON
    $extraImages: JSON
    $thumbnail: String
    $variants: JSON
    $features: JSON
    $wholesale: JSON
    $wholesalePrice: Float
    $wholesalePricePercentage: Float
    $minResellPrice: Float
    $maxResellPrice: Float
    $isActive: Boolean
    $isFeatured: Boolean
    $isFlash: Boolean
    $isNew: Boolean
    $isCod: Boolean
    $isPreorder: Boolean
    $isContinueSelling: Boolean
    $isPrivate: Boolean
    $isLanding: Boolean
    $isUnlisted: Boolean
    $isResell: Boolean
    $isVariant: Boolean
    $weight: Float
    $unit: Float
    $unitType: Int
    $categories: [Int]
    $subCategories: [Int]
    $subSubCategories: [Int]
    $brands: [Int]
    $authors: [Int]
    $tags: [Int]
    $supplierId: Int
    $preorderDelivery: DateTime
  ) {
    selfStoreProductCreate(
      userId: $userId
      siteId: $siteId
      data: {
        title: $title
        slug: $slug
        sku: $sku
        price: $price
        comparePrice: $comparePrice
        discount: $discount
        cost: $cost
        quantity: $quantity
        productType: $productType
        currency: $currency
        description: $description
        html: $html
        image: $image
        images: $images
        extraImages: $extraImages
        thumbnail: $thumbnail
        variants: $variants
        features: $features
        wholesale: $wholesale
        wholesalePrice: $wholesalePrice
        wholesalePricePercentage: $wholesalePricePercentage
        minResellPrice: $minResellPrice
        maxResellPrice: $maxResellPrice
        isActive: $isActive
        isFeatured: $isFeatured
        isFlash: $isFlash
        isNew: $isNew
        isCod: $isCod
        isPreorder: $isPreorder
        isContinueSelling: $isContinueSelling
        isPrivate: $isPrivate
        isLanding: $isLanding
        isUnlisted: $isUnlisted
        isResell: $isResell
        isVariant: $isVariant
        weight: $weight
        unit: $unit
        unitType: $unitType
        categories: $categories
        subCategories: $subCategories
        subSubCategories: $subSubCategories
        brands: $brands
        authors: $authors
        tags: $tags
        supplierId: $supplierId
        preorderDelivery: $preorderDelivery
      }
    ) {
      id
      hid
      title
      slug
      sku
      productType
      price
      comparePrice
      discount
      cost
      quantity
      isActive
      isFeatured
      isFlash
      isNew
      thumbnail
      features {
        id
        key
        value
      }
      extraImages {
        id
        image
      }
      updatedAt
    }
  }
`;

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
    $childProducts: JSON
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
    $isExclusive: Boolean
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
    $preorderDelivery: DateTime
    $price: Float
    $priority: Int
    $productType: Int
    $quantity: Int
    $requirements: JSON
    $rewardPoints: Float
    $salePrice: Float
    $schema: JSON
    $shopProducts: JSON
    $shops: [Int]
    $sku: String
    $shippingType: Int
    $slug: String
    $source: String
    $stoppages: [Int]
    $subCategories: [Int]
    $subCategory: JSON
    $subSubCategories: [Int]
    $subSubCategory: JSON
    $supplierId: Int
    $supplierTitle: String
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
        isExclusive: $isExclusive
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
        requirements: $requirements
        rewardPoints: $rewardPoints
        salePrice: $salePrice
        schema: $schema
        shopProducts: $shopProducts
        shops: $shops
        siteId: $siteId
        sku: $sku
        shippingType: $shippingType
        slug: $slug
        source: $source
        stoppages: $stoppages
        subCategories: $subCategories
        subCategory: $subCategory
        subSubCategories: $subSubCategories
        subSubCategory: $subSubCategory
        supplierId: $supplierId
        supplierTitle: $supplierTitle
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
      id
      hid
      title
      slug
      sku
      productType
      price
      comparePrice
      discount
      extraImages {
        id
        image
      }
      cost
      quantity
      isActive
      isFeatured
      isFlash
      isNew
      thumbnail
      features {
        id
        key
        value
      }
      updatedAt
    }
  }
`;

export const SELF_STORE_PRODUCT_UPDATE_STATUS = gql`
  mutation selfStoreProductUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $isActive: Boolean
  ) {
    selfStoreProductUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: { isActive: $isActive }
    ) {
      id
      isActive
    }
  }
`;

export const SELF_STORE_PRODUCT_DELETE = gql`
  mutation selfStoreProductDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreProductDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;

export const SELF_STORE_PRODUCT_UPDATE_FROM_COMPARE_PRICE_BY_PERCENTAGE = gql`
  mutation selfStoreProductUpdateFromComparePriceByPercentage(
    $userId: Int!
    $siteId: Int!
    $productIds: [Int!]!
    $percentage: Float!
    $percentageType: String!
    $categoryId: Int!
    $subCategoryId: Int!
    $subSubCategoryId: Int!
    $supplierId: Int!
    $brandId: Int!
    $shopId: Int!
    $tagIds: [Int]
    $authorId: Int!
  ) {
    selfStoreProductUpdateFromComparePriceByPercentage(
      userId: $userId
      siteId: $siteId
      productIds: $productIds
      percentage: $percentage
      percentageType: $percentageType
      categoryId: $categoryId
      subCategoryId: $subCategoryId
      subSubCategoryId: $subSubCategoryId
      supplierId: $supplierId
      brandId: $brandId
      shopId: $shopId
      tagIds: $tagIds
      authorId: $authorId
    ) {
      id
      title
    }
  }
`;
