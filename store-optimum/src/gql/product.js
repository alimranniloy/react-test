import gql from "graphql-tag";
// STORE_PRODUCTS
export const STORE_PRODUCTS = gql`
  query (
    $siteId: [Int]!
    $brandId: Int
    $campaignId: Int
    $categoryId: Int
    $collectionId: Int
    $isFeatured: Boolean
    $isFlash: Boolean
    $isNew: Boolean
    $isPrivate: Boolean
    $childId: Int
    $childType: Int
    $percentage: JSON
    $isReseller: Boolean
    $isBasePrice: Boolean
    $queryType: String
    $search: String
    $subCategoryId: Int
    $subSubCategoryId: Int
    $tagIds: [Int]
    $shopId: Int
    $stoppageId: Int
    $productType: Int
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
      isActive: true
      isFeatured: $isFeatured
      isFlash: $isFlash
      isNew: $isNew
      isPrivate: $isPrivate
      queryType: $queryType
      search: $search
      subCategoryId: $subCategoryId
      subSubCategoryId: $subSubCategoryId
      tagIds: $tagIds
      shopId: $shopId
      stoppageId: $stoppageId
      productType: $productType
      after: $after
      first: $first
      limit: $limit
    ) {
      total
      edges {
        node {
          affiliateCommission(childId: $childId, childType: $childType)
          brands
          cashback(childId: $childId, childType: $childType)
          comparePrice(childId: $childId, childType: $childType)
          currency
          deliveryCharge(childId: $childId, childType: $childType)
          discount(childId: $childId, childType: $childType)
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
          images {
            id
            image
          }
          isActive(childId: $childId, childType: $childType)
          isContinueSelling(childId: $childId, childType: $childType)
          isFlash(childId: $childId, childType: $childType)
          isOneTime(childId: $childId, childType: $childType)
          isNegotiable(childId: $childId, childType: $childType)
          isVariant(childId: $childId, childType: $childType)
          maxOrder
          maxResellPrice
          minResellPrice
          minOrder
          price(
            childId: $childId
            childType: $childType
            percentage: $percentage
            isReseller: $isReseller
            isBasePrice: $isBasePrice
          )
          productType
          quantity(childId: $childId, childType: $childType)
          rating
          ratingTotal
          rewardPoints(childId: $childId, childType: $childType)
          siteId
          sku
          slug
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
    $isActive: Boolean
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
      isActive: $isActive
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          barcode
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
          price(
            childId: $childId
            childType: $childType
            percentage: $percentage
            isReseller: $isReseller
            isBasePrice: $isBasePrice
          )
          productType
          sku
          thumbnail
          slug
          title(childId: $childId, childType: $childType)
          translation(childId: $childId, childType: $childType)
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
    $isReseller: Boolean
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
          comparePrice(childId: $childId, childType: $childType)
          cost(
            childId: $childId
            childType: $childType
            percentage: $percentage
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
            isReseller: $isReseller
            isBasePrice: $isBasePrice
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

// STORE_CUSTOMER_FAVORITE_PRODUCTS
export const STORE_CUSTOMER_FAVORITE_PRODUCTS = gql`
  query (
    $customerId: Int!
    $childId: Int
    $childType: Int
    $percentage: JSON
    $isReseller: Boolean
    $isBasePrice: Boolean
    $first: Int
    $after: String
  ) {
    storeCustomerFavoriteProducts(
      customerId: $customerId
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          affiliateCommission(childId: $childId, childType: $childType)
          brands
          cashback(childId: $childId, childType: $childType)
          comparePrice(childId: $childId, childType: $childType)
          currency
          deliveryCharge(childId: $childId, childType: $childType)
          discount(childId: $childId, childType: $childType)
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
          images {
            id
            image
          }
          isActive(childId: $childId, childType: $childType)
          isContinueSelling(childId: $childId, childType: $childType)
          isFlash(childId: $childId, childType: $childType)
          isOneTime(childId: $childId, childType: $childType)
          isNegotiable(childId: $childId, childType: $childType)
          isVariant(childId: $childId, childType: $childType)
          maxOrder
          maxResellPrice
          minResellPrice
          minOrder
          price(
            childId: $childId
            childType: $childType
            percentage: $percentage
            isReseller: $isReseller
            isBasePrice: $isBasePrice
          )
          productType
          quantity(childId: $childId, childType: $childType)
          rewardPoints(childId: $childId, childType: $childType)
          sku
          slug
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
    $isReseller: Boolean
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
            percentage: $percentage
            isReseller: $isReseller
          )
          currency
          flashPrice(
            childId: $childId
            percentage: $percentage
            isReseller: $isReseller
          )
          id
          isFlash
          price(
            childId: $childId
            percentage: $percentage
            isReseller: $isReseller
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
// STORE_PRODUCT_DETAILS
export const STORE_PRODUCT_DETAILS = gql`
  query (
    $id: Int!
    $childId: Int
    $childType: Int
    $percentage: JSON
    $isReseller: Boolean
    $isBasePrice: Boolean
  ) {
    storeProduct(id: $id) {
      affiliateCommission(childId: $childId, childType: $childType)
      affiliateCommissionPercentage(childId: $childId, childType: $childType)
      authors
      barcode
      brands
      campaigns
      cashback(childId: $childId, childType: $childType)
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
      collections
      comparePrice(childId: $childId, childType: $childType)
      cost(childId: $childId, childType: $childType, isReseller: $isReseller)
      createdAt
      createdById
      currency
      deliveryCharge(childId: $childId, childType: $childType)
      deliveryTime(childId: $childId, childType: $childType)
      description(childId: $childId, childType: $childType)
      discount(childId: $childId, childType: $childType)
      emiDuration(childId: $childId, childType: $childType)
      emiInterest(childId: $childId, childType: $childType)
      emiPrice(childId: $childId, childType: $childType)
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
      file
      fileType
      flashPrice(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
        isBasePrice: $isBasePrice
      )
      html
      id
      hid
      image
      images {
        id
        image
      }
      isActive
      isCod
      isContinueSelling
      isEmi
      isFeatured
      isFlash
      isNegotiable
      isNew
      isOneTime
      isPrivate
      isResell
      isTrack
      isVariant
      isWarranty
      keyword
      maxOrder
      maxResellPrice
      minResellPrice
      metaDescription(childId: $childId, childType: $childType)
      metaTitle(childId: $childId, childType: $childType)
      minOrder
      note {
        genre
        id
        image
        isFree
        title
        url
      }
      parentId
      price(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
        isBasePrice: $isBasePrice
      )
      priority
      productType
      quantity(childId: $childId, childType: $childType)
      requirements {
        id
        key
        value
      }
      rewardPoints(childId: $childId, childType: $childType)
      salePrice(childId: $childId, childType: $childType)
      shops
      siteId
      sku
      slug
      sold(childId: $childId, childType: $childType)
      source
      stoppages
      subCategories
      subSubCategories
      supplierId
      tags
      thumbnail
      title(childId: $childId, childType: $childType)
      translation(childId: $childId, childType: $childType)
      unit
      unitType
      updatedAt
      updatedById
      validFor(childId: $childId, childType: $childType)
      vat(childId: $childId, childType: $childType)
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
      vouchers
      warranty
      weight
      wholesale {
        id
        maxOrder
        minOrder
        price
      }
      wholesalePrice(childId: $childId, percentage: $percentage)
      wholesalePricePercentage(childId: $childId, percentage: $percentage)
    }
  }
`;
// STORE_PRODUCT_BY_HID
export const STORE_PRODUCT_BY_HID = gql`
  query (
    $hid: String!
    $childId: Int
    $childType: Int
    $percentage: JSON
    $isReseller: Boolean
    $isBasePrice: Boolean
  ) {
    storeProductByHid(hid: $hid) {
      affiliateCommission(childId: $childId, childType: $childType)
      affiliateCommissionPercentage(childId: $childId, childType: $childType)
      authors
      barcode
      brands
      campaigns
      cashback(childId: $childId, childType: $childType)
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
      collections
      comparePrice(childId: $childId, childType: $childType)
      cost(childId: $childId, childType: $childType, isReseller: $isReseller)
      createdAt
      createdById
      currency
      deliveryCharge(childId: $childId, childType: $childType)
      deliveryTime(childId: $childId, childType: $childType)
      description(childId: $childId, childType: $childType)
      discount(childId: $childId, childType: $childType)
      emiDuration(childId: $childId, childType: $childType)
      emiInterest(childId: $childId, childType: $childType)
      emiPrice(childId: $childId, childType: $childType)
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
      file
      fileType
      flashPrice(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
        isBasePrice: $isBasePrice
      )
      html
      id
      hid
      image
      images {
        id
        image
      }
      isActive
      isCod
      isContinueSelling
      isEmi
      isFeatured
      isFlash
      isNegotiable
      isNew
      isOneTime
      isPrivate
      isResell
      isTrack
      isVariant
      isWarranty
      keyword
      maxOrder
      maxResellPrice
      minResellPrice
      metaDescription(childId: $childId, childType: $childType)
      metaTitle(childId: $childId, childType: $childType)
      minOrder
      note {
        genre
        id
        image
        isFree
        title
        url
      }
      parentId
      price(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
        isBasePrice: $isBasePrice
      )
      priority
      productType
      quantity(childId: $childId, childType: $childType)
      requirements {
        id
        key
        value
      }
      rewardPoints(childId: $childId, childType: $childType)
      salePrice(childId: $childId, childType: $childType)
      shops
      siteId
      sku
      slug
      sold(childId: $childId, childType: $childType)
      source
      stoppages
      subCategories
      subSubCategories
      supplierId
      tags
      thumbnail
      title(childId: $childId, childType: $childType)
      translation(childId: $childId, childType: $childType)
      unit
      unitType
      updatedAt
      updatedById
      validFor(childId: $childId, childType: $childType)
      vat(childId: $childId, childType: $childType)
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
      vouchers
      warranty
      weight
      wholesale {
        id
        maxOrder
        minOrder
        price
      }
      wholesalePrice(childId: $childId, percentage: $percentage)
      wholesalePricePercentage(childId: $childId, percentage: $percentage)
    }
  }
`;
// STORE_PRODUCT_BY_BARCODE
export const STORE_PRODUCT_BY_BARCODE = gql`
  query ($siteId: Int!, $barcode: String!) {
    storeProductByBarcode(siteId: $siteId, barcode: $barcode) {
      affiliateCommission
      barcode
      cashback
      cost
      currency
      id
      isContinueSelling
      maxOrder
      maxResellPrice
      price
      quantity
      rewardPoints
      sku
      slug
      thumbnail
      title
      unit
      unitType
    }
  }
`;
// SELF_STORE_PRODUCT_CREATE
export const SELF_STORE_PRODUCT_CREATE = gql`
  mutation selfStoreProductCreate(
    $userId: Int!
    $siteId: Int!
    $affiliateCommission: Float
    $affiliateCommissionPercentage: Float
    $barcode: String
    $brands: [Int]
    $campaigns: [Int]
    $cashback: Float
    $categories: [Int]
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
    $faq: JSON
    $features: JSON
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
    $isNegotiable: Boolean
    $isNew: Boolean
    $isOneTime: Boolean
    $isPrivate: Boolean
    $isResell: Boolean
    $isTrack: Boolean
    $isVariant: Boolean
    $isWarranty: Boolean
    $keyword: String
    $maxOrder: Int
    $maxResellPrice: Float
    $minResellPrice: Float
    $metaDescription: String
    $metaTitle: String
    $minOrder: Int
    $note: JSON
    $price: Float
    $priority: Int
    $productType: Int
    $quantity: Float
    $requirements: JSON
    $childProducts: JSON
    $rewardPoints: Float
    $shopProducts: JSON
    $shops: [Int]
    $salePrice: Float
    $sku: String
    $slug: String
    $sold: Int
    $source: String
    $stoppages: [Int]
    $subCategories: [Int]
    $subSubCategories: [Int]
    $supplierId: Int
    $tags: [Int]
    $title: String
    $translation: String
    $unit: Float
    $unitType: Int
    $validFor: Int
    $variants: JSON
    $vat: Float
    $warranty: DateTime
    $vouchers: [Int]
    $weight: Float
    $wholesale: JSON
    $wholesalePrice: Float
    $wholesalePricePercentage: Float
  ) {
    selfStoreProductCreate(
      userId: $userId
      siteId: $siteId
      data: {
        affiliateCommission: $affiliateCommission
        affiliateCommissionPercentage: $affiliateCommissionPercentage
        barcode: $barcode
        brands: $brands
        campaigns: $campaigns
        cashback: $cashback
        categories: $categories
        collections: $collections
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
        faq: $faq
        features: $features
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
        isNegotiable: $isNegotiable
        isNew: $isNew
        isOneTime: $isOneTime
        isPrivate: $isPrivate
        isResell: $isResell
        isTrack: $isTrack
        isVariant: $isVariant
        isWarranty: $isWarranty
        keyword: $keyword
        maxOrder: $maxOrder
        maxResellPrice: $maxResellPrice
        minResellPrice: $minResellPrice
        metaDescription: $metaDescription
        metaTitle: $metaTitle
        minOrder: $minOrder
        note: $note
        price: $price
        childProducts: $childProducts
        priority: $priority
        productType: $productType
        quantity: $quantity
        siteId: $siteId
        requirements: $requirements
        rewardPoints: $rewardPoints
        shopProducts: $shopProducts
        shops: $shops
        salePrice: $salePrice
        sku: $sku
        sold: $sold
        slug: $slug
        source: $source
        stoppages: $stoppages
        subCategories: $subCategories
        subSubCategories: $subSubCategories
        supplierId: $supplierId
        title: $title
        translation: $translation
        tags: $tags
        unit: $unit
        unitType: $unitType
        validFor: $validFor
        variants: $variants
        vat: $vat
        vouchers: $vouchers
        warranty: $warranty
        weight: $weight
        wholesale: $wholesale
        wholesalePrice: $wholesalePrice
        wholesalePricePercentage: $wholesalePricePercentage
      }
    ) {
      brands
      campaigns
      collections
      categories
      cost
      currency
      flashPrice
      hid
      id
      isActive
      isContinueSelling
      isFlash
      isPrivate
      price
      priority
      quantity
      sku
      slug
      subCategories
      subSubCategories
      thumbnail
      title
      unit
      unitType
      updatedAt
      updatedById
    }
  }
`;
// STORE_PRODUCT_CREATE_BY_CHILD
export const STORE_PRODUCT_CREATE_BY_CHILD = gql`
  mutation selfStoreProductCreateByChild(
    $userId: Int!
    $siteId: Int!
    $childId: Int!
    $price: Float!
    $source: String!
  ) {
    selfStoreProductCreateByChild(
      userId: $userId
      siteId: $siteId
      childId: $childId
      price: $price
      source: $source
    ) {
      brands
      campaigns
      collections
      categories
      cost
      currency
      flashPrice
      hid
      id
      isActive
      isContinueSelling
      isFlash
      isPrivate
      price
      priority
      quantity
      sku
      slug
      subCategories
      subSubCategories
      thumbnail
      title
      unit
      unitType
      updatedAt
      updatedById
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
    $barcode: String
    $brands: [Int]
    $campaigns: [Int]
    $cashback: Float
    $categories: [Int]
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
    $faq: JSON
    $features: JSON
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
    $isNegotiable: Boolean
    $isNew: Boolean
    $isOneTime: Boolean
    $isPrivate: Boolean
    $isResell: Boolean
    $isTrack: Boolean
    $isVariant: Boolean
    $isWarranty: Boolean
    $keyword: String
    $maxOrder: Int
    $maxResellPrice: Float
    $minResellPrice: Float
    $metaDescription: String
    $metaTitle: String
    $minOrder: Int
    $note: JSON
    $price: Float
    $priority: Int
    $productType: Int
    $quantity: Int
    $requirement: JSON
    $childProducts: JSON
    $rewardPoints: Float
    $salePrice: Float
    $shopProducts: JSON
    $sku: String
    $slug: String
    $source: String
    $stoppages: [Int]
    $subCategories: [Int]
    $subSubCategories: [Int]
    $supplierId: Int
    $tags: [Int]
    $title: String
    $translation: String
    $unit: Float
    $unitType: Int
    $validFor: Int
    $variants: JSON
    $vat: Float
    $warranty: DateTime
    $weight: Float
    $wholesale: JSON
    $wholesalePrice: Float
    $wholesalePricePercentage: Float
    $childId: Int
    $childType: Int
    $percentage: JSON
    $isReseller: Boolean
    $isBasePrice: Boolean
  ) {
    selfStoreProductUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        affiliateCommission: $affiliateCommission
        affiliateCommissionPercentage: $affiliateCommissionPercentage
        barcode: $barcode
        brands: $brands
        campaigns: $campaigns
        cashback: $cashback
        categories: $categories
        collections: $collections
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
        faq: $faq
        features: $features
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
        isNegotiable: $isNegotiable
        isNew: $isNew
        isOneTime: $isOneTime
        isPrivate: $isPrivate
        isResell: $isResell
        isTrack: $isTrack
        isVariant: $isVariant
        isWarranty: $isWarranty
        keyword: $keyword
        maxOrder: $maxOrder
        maxResellPrice: $maxResellPrice
        minResellPrice: $minResellPrice
        metaDescription: $metaDescription
        metaTitle: $metaTitle
        minOrder: $minOrder
        note: $note
        price: $price
        priority: $priority
        productType: $productType
        quantity: $quantity
        requirement: $requirement
        childProducts: $childProducts
        rewardPoints: $rewardPoints
        salePrice: $salePrice
        shopProducts: $shopProducts
        sku: $sku
        slug: $slug
        source: $source
        stoppages: $stoppages
        subCategories: $subCategories
        subSubCategories: $subSubCategories
        supplierId: $supplierId
        tags: $tags
        title: $title
        translation: $translation
        unit: $unit
        unitType: $unitType
        validFor: $validFor
        variants: $variants
        vat: $vat
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
      cost(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
      )
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
      vat
      weight
    }
  }
`;
// SELF_STORE_PRODUCT_UPDATE_BY_CHILD
export const SELF_STORE_PRODUCT_UPDATE_BY_CHILD = gql`
  mutation selfStoreProductUpdateByChild(
    $userId: Int!
    $siteId: Int!
    $siteType: Int!
    $productId: Int!
    $affiliateCommission: Float!
    $affiliateCommissionPercentage: Float!
    $cashback: Float!
    $comparePrice: Float!
    $cost: Float!
    $deliveryCharge: Float!
    $deliveryTime: Int!
    $description: String!
    $discount: Float!
    $emiDuration: Int!
    $emiInterest: Float!
    $emiPrice: Float!
    $flashPrice: Float!
    $metaDescription: String!
    $metaTitle: String!
    $price: Float!
    $quantity: Int!
    $rewardPoints: Float!
    $salePrice: Float!
    $sold: Float!
    $title: String!
    $translation: String!
    $validFor: Int!
    $vat: Float!
    $wholesalePrice: Float!
    $wholesalePricePercentage: Float!
    $childId: Int
    $childType: Int
    $percentage: JSON
    $isReseller: Boolean
    $isBasePrice: Boolean
  ) {
    selfStoreProductUpdateByChild(
      userId: $userId
      siteId: $siteId
      siteType: $siteType
      productId: $productId
      data: {
        affiliateCommission: $affiliateCommission
        affiliateCommissionPercentage: $affiliateCommissionPercentage
        cashback: $cashback
        comparePrice: $comparePrice
        cost: $cost
        deliveryCharge: $deliveryCharge
        deliveryTime: $deliveryTime
        description: $description
        discount: $discount
        emiDuration: $emiDuration
        emiInterest: $emiInterest
        emiPrice: $emiPrice
        flashPrice: $flashPrice
        metaDescription: $metaDescription
        metaTitle: $metaTitle
        price: $price
        quantity: $quantity
        rewardPoints: $rewardPoints
        salePrice: $salePrice
        siteId: $siteId
        sold: $sold
        title: $title
        translation: $translation
        validFor: $validFor
        vat: $vat
        wholesalePrice: $wholesalePrice
        wholesalePricePercentage: $wholesalePricePercentage
      }
    ) {
      affiliateCommission
      cashback
      comparePrice
      cost(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
      )
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
      vat
      weight
    }
  }
`;
// SELF_STORE_PRODUCT_DELETE_BY_CHILD
export const SELF_STORE_PRODUCT_DELETE_BY_CHILD = gql`
  mutation selfStoreProductDeleteByChild(
    $userId: Int!
    $siteId: Int!
    $siteType: Int!
    $productId: Int!
  ) {
    selfStoreProductDeleteByChild(
      userId: $userId
      siteId: $siteId
      siteType: $siteType
      productId: $productId
    ) {
      brands
      campaigns
      collections
      categories
      cost
      currency
      flashPrice
      hid
      id
      isActive
      isContinueSelling
      isFlash
      isPrivate
      price
      priority
      quantity
      sku
      slug
      subCategories
      subSubCategories
      thumbnail
      title
      unit
      unitType
      updatedAt
    }
  }
`;
// SELF_STORE_PRODUCT_UPDATE_BY_STORE
export const SELF_STORE_PRODUCT_UPDATE_BY_STORE = gql`
  mutation selfStoreProductUpdateByStore(
    $userId: Int!
    $siteId: Int!
    $productId: Int!
    $cost: Float!
    $flashPrice: Float!
    $price: Float!
    $quantity: Float!
    $sold: Float!
  ) {
    selfStoreProductUpdateByStore(
      userId: $userId
      siteId: $siteId
      productId: $productId
      cost: $cost
      flashPrice: $flashPrice
      price: $price
      quantity: $quantity
      sold: $sold
    ) {
      brands
      campaigns
      collections
      categories
      cost
      currency
      flashPrice
      hid
      id
      isActive
      isContinueSelling
      isFlash
      isPrivate
      price
      priority
      quantity
      sku
      slug
      subCategories
      subSubCategories
      thumbnail
      title
      unit
      unitType
      updatedAt
    }
  }
`;

// SELF_STORE_PRODUCT_SEARCH_UPDATE
export const SELF_STORE_PRODUCT_SEARCH_UPDATE = gql`
  mutation selfStoreProductSearchUpdate($userId: Int!, $siteId: Int!) {
    selfStoreProductSearchUpdate(userId: $userId, siteId: $siteId)
  }
`;
// SELF_STORE_PRODUCT_DELETE_BY_STORE
export const SELF_STORE_PRODUCT_DELETE_BY_STORE = gql`
  mutation selfStoreProductDeleteByStore(
    $userId: Int!
    $siteId: Int!
    $productId: Int!
  ) {
    selfStoreProductDeleteByStore(
      userId: $userId
      siteId: $siteId
      productId: $productId
    ) {
      cost
      currency
      flashPrice
      id
      isActive
      isFlash
      price
      priority
      quantity
      sku
      slug
      thumbnail
      title
    }
  }
`;
// SELF_STORE_PRODUCT_DELETE
export const SELF_STORE_PRODUCT_DELETE = gql`
  mutation selfStoreProductDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreProductDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;

// SELF_STORE_PRODUCT_ADD_CATEGORY
export const SELF_STORE_PRODUCT_ADD_CATEGORY = gql`
  mutation selfStoreProductAddCategory(
    $userId: Int!
    $productId: Int!
    $categoryId: Int!
  ) {
    selfStoreProductAddCategory(
      userId: $userId
      productId: $productId
      categoryId: $categoryId
    )
  }
`; // SELF_STORE_PRODUCT_REMOVE_CATEGORY
export const SELF_STORE_PRODUCT_REMOVE_CATEGORY = gql`
  mutation selfStoreProductRemoveCategory(
    $userId: Int!
    $productId: Int!
    $categoryId: Int!
  ) {
    selfStoreProductRemoveCategory(
      userId: $userId
      productId: $productId
      categoryId: $categoryId
    )
  }
`; // SELF_STORE_PRODUCT_ADD_SUB_CATEGORY
export const SELF_STORE_PRODUCT_ADD_SUB_CATEGORY = gql`
  mutation selfStoreProductAddSubCategory(
    $userId: Int!
    $productId: Int!
    $subCategoryId: Int!
  ) {
    selfStoreProductAddSubCategory(
      userId: $userId
      productId: $productId
      subCategoryId: $subCategoryId
    )
  }
`; // SELF_STORE_PRODUCT_REMOVE_SUB_CATEGORY
export const SELF_STORE_PRODUCT_REMOVE_SUB_CATEGORY = gql`
  mutation selfStoreProductRemoveSubCategory(
    $userId: Int!
    $productId: Int!
    $subCategoryId: Int!
  ) {
    selfStoreProductRemoveSubCategory(
      userId: $userId
      productId: $productId
      subCategoryId: $subCategoryId
    )
  }
`; // SELF_STORE_PRODUCT_ADD_SUB_SUB_CATEGORY
export const SELF_STORE_PRODUCT_ADD_SUB_SUB_CATEGORY = gql`
  mutation selfStoreProductAddSubSubCategory(
    $userId: Int!
    $productId: Int!
    $subSubCategoryId: Int!
  ) {
    selfStoreProductAddSubSubCategory(
      userId: $userId
      productId: $productId
      subSubCategoryId: $subSubCategoryId
    )
  }
`; // SELF_STORE_PRODUCT_REMOVE_SUB_SUB_CATEGORY
export const SELF_STORE_PRODUCT_REMOVE_SUB_SUB_CATEGORY = gql`
  mutation selfStoreProductRemoveSubSubCategory(
    $userId: Int!
    $productId: Int!
    $subSubCategoryId: Int!
  ) {
    selfStoreProductRemoveSubSubCategory(
      userId: $userId
      productId: $productId
      subSubCategoryId: $subSubCategoryId
    )
  }
`; // SELF_STORE_PRODUCT_ADD_BRAND
export const SELF_STORE_PRODUCT_ADD_BRAND = gql`
  mutation selfStoreProductAddBrand(
    $userId: Int!
    $productId: Int!
    $brandId: Int!
  ) {
    selfStoreProductAddBrand(
      userId: $userId
      productId: $productId
      brandId: $brandId
    )
  }
`; // SELF_STORE_PRODUCT_REMOVE_BRAND
export const SELF_STORE_PRODUCT_REMOVE_BRAND = gql`
  mutation selfStoreProductRemoveBrand(
    $userId: Int!
    $productId: Int!
    $brandId: Int!
  ) {
    selfStoreProductRemoveBrand(
      userId: $userId
      productId: $productId
      brandId: $brandId
    )
  }
`;
// SELF_STORE_CAMPAIGN_ADD_PRODUCTS
export const SELF_STORE_CAMPAIGN_ADD_PRODUCTS = gql`
  mutation selfStoreCampaignAddProducts(
    $userId: Int!
    $campaignId: Int!
    $productId: Int!
  ) {
    selfStoreCampaignAddProducts(
      userId: $userId
      campaignId: $campaignId
      productId: $productId
    )
  }
`;
// SELF_STORE_CAMPAIGN_REMOVE_PRODUCTS
export const SELF_STORE_CAMPAIGN_REMOVE_PRODUCTS = gql`
  mutation selfStoreCampaignRemoveProducts(
    $userId: Int!
    $campaignId: Int!
    $productId: Int!
  ) {
    selfStoreCampaignRemoveProducts(
      userId: $userId
      campaignId: $campaignId
      productId: $productId
    )
  }
`;
// SELF_STORE_BRAND_ADD_PRODUCTS
export const SELF_STORE_BRAND_ADD_PRODUCTS = gql`
  mutation selfStoreBrandAddProducts(
    $userId: Int!
    $brandId: Int!
    $productId: Int!
  ) {
    selfStoreBrandAddProducts(
      userId: $userId
      brandId: $brandId
      productId: $productId
    )
  }
`;
// SELF_STORE_BRAND_REMOVE_PRODUCTS
export const SELF_STORE_BRAND_REMOVE_PRODUCTS = gql`
  mutation selfStoreBrandRemoveProducts(
    $userId: Int!
    $brandId: Int!
    $productId: Int!
  ) {
    selfStoreBrandRemoveProducts(
      userId: $userId
      brandId: $brandId
      productId: $productId
    )
  }
`;
// SELF_STORE_COLLECTION_ADD_PRODUCTS
export const SELF_STORE_COLLECTION_ADD_PRODUCTS = gql`
  mutation selfStoreCollectionAddProducts(
    $userId: Int!
    $collectionId: Int!
    $productId: Int!
  ) {
    selfStoreCollectionAddProducts(
      userId: $userId
      collectionId: $collectionId
      productId: $productId
    )
  }
`;
// SELF_STORE_COLLECTION_REMOVE_PRODUCTS
export const SELF_STORE_COLLECTION_REMOVE_PRODUCTS = gql`
  mutation selfStoreCollectionRemoveProducts(
    $userId: Int!
    $collectionId: Int!
    $productId: Int!
  ) {
    selfStoreCollectionRemoveProducts(
      userId: $userId
      collectionId: $collectionId
      productId: $productId
    )
  }
`;
