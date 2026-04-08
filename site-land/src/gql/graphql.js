import gql from "graphql-tag";
// ----------------------------------------------------------------------------------------------
//                                        SITE
// ----------------------------------------------------------------------------------------------
// SITE
export const SITE = gql`
  query ($domain: String!) {
    site(domain: $domain) {
      androidApp
      bpayMerchantId
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      guide
      hostname
      id
      industry
      isActive
      isFraudCheck
      isGuest
      isGuide
      isOtp
      isPaid
      isPublic
      isWhiteLabel
      lastEvent
      latitude
      locale
      longitude
      meta
      metaDescription
      navigation
      notice
      parent {
        id
        isActive
        isFixed
        parentId
        percentage
        title
        userId
      }
      parents
      percentage
      phone
      phoneLogo
      siteInfo
      siteType
      social
      street
      subscription
      title
      version
      whiteLabel
      whiteLabelUrl
      withdraw
      createdById
      createdBy {
        avatar
        id
        name
      }
    }
  }
`;
// SITE_SLIDERS
export const SITE_SLIDERS = gql`
  query (
    $siteId: [Int]!
    $isPhone: Boolean
    $childId: Int
    $isPrivate: Boolean
    $after: String
    $first: Int
  ) {
    siteSliders(
      siteId: $siteId
      isPhone: $isPhone
      isActive: true
      isPrivate: $isPrivate
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          cover(childId: $childId)
          id
          isActive(childId: $childId)
          isPhone
          priority
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
// SITE_FEEDS
export const SITE_FEEDS = gql`
  query (
    $siteId: Int!
    $userId: Int
    $isActive: Boolean!
    $isAnnouncement: Boolean!
    $first: Int
    $after: String
  ) {
    siteFeeds(
      siteId: $siteId
      userId: $userId
      isActive: $isActive
      isAnnouncement: $isAnnouncement
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          description
          id
          image
          replyCount
          user {
            name
            avatar
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
// SITE_FEED
export const SITE_FEED = gql`
  query ($feedId: Int!) {
    siteFeed(feedId: $feedId) {
      description
      id
      image
      replyCount
      user {
        name
        avatar
      }
      updatedAt
    }
  }
`;
// SITE_FEED_CREATE
export const SITE_FEED_CREATE = gql`
  mutation selfSiteFeedCreate(
    $siteId: Int!
    $userId: Int!
    $description: String!
    $image: Upload
    $isActive: Boolean!
    $isAnnouncement: Boolean!
  ) {
    selfSiteFeedCreate(
      siteId: $siteId
      userId: $userId
      data: {
        description: $description
        image: $image
        isActive: $isActive
        isAnnouncement: $isAnnouncement
      }
    ) {
      description
      id
      image
      replyCount
      user {
        name
        avatar
      }
      updatedAt
    }
  }
`;
// SITE_FEED_UPDATE_REPORT_STATUS
export const SITE_FEED_UPDATE_REPORT_STATUS = gql`
  mutation selfSiteFeedUpdateReportStatus(
    $siteId: Int!
    $userId: Int!
    $id: Int!
    $reportStatus: Int!
  ) {
    selfSiteFeedUpdateReportStatus(
      siteId: $siteId
      userId: $userId
      id: $id
      reportStatus: $reportStatus
    ) {
      id
    }
  }
`;
// SITE_FEED_DELETE
export const SITE_FEED_DELETE = gql`
  mutation selfSiteFeedDelete($feedId: Int!) {
    selfSiteFeedDelete(feedId: $feedId)
  }
`;
// SITE_FEED_REPLIES
export const SITE_FEED_REPLIES = gql`
  query ($feedId: Int!, $first: Int, $after: String) {
    siteFeedReplies(feedId: $feedId, first: $first, after: $after) {
      total
      edges {
        node {
          description
          id
          image
          user {
            avatar
            name
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
// SITE_FEED_REPLY_CREATE
export const SITE_FEED_REPLY_CREATE = gql`
  mutation selfSiteFeedReplyCreate(
    $feedId: Int!
    $description: String!
    $image: Upload
    $status: Int!
  ) {
    selfSiteFeedReplyCreate(
      feedId: $feedId
      data: { description: $description, image: $image, status: $status }
    ) {
      description
      image
      id
    }
  }
`;

// SITE_NOTIFICATIONS
export const SITE_NOTIFICATIONS = gql`
  query ($siteId: Int!, $isPublic: Boolean!, $first: Int, $after: String) {
    siteNotifications(
      siteId: $siteId
      isPublic: $isPublic
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          body
          createdAt
          id
          level
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
// SITE_NOTIFICATION_SUBSCRIPTION
export const SITE_NOTIFICATION_SUBSCRIPTION = gql`
  subscription siteNotification($channel: String!, $recipientId: Int) {
    siteNotification(channel: $channel, recipientId: $recipientId) {
      body
      data
      id
      level
      title
    }
  }
`;
// SELF_SITE
export const SELF_SITE = gql`
  query ($userId: Int!, $siteType: String!) {
    selfSite(userId: $userId, siteType: $siteType) {
      androidApp
      bpayMerchantId
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      guide
      hostname
      id
      industry
      isActive
      isGuest
      isGuide
      isOtp
      isPaid
      isPublic
      isWhiteLabel
      lastEvent
      latitude
      locale
      longitude
      meta
      metaDescription
      navigation
      parent {
        id
        isActive
        isFixed
        parentId
        percentage
        title
        userId
      }
      parents
      percentage
      phone
      phoneLogo
      siteInfo
      siteType
      social
      street
      subscription
      title
      version
      whiteLabel
      whiteLabelUrl
    }
  }
`;
// STORE_STORE
export const STORE_STORE = gql`
  query storeStore($id: Int!, $from: DateTime, $to: DateTime) {
    storeStore(id: $id) {
      currency
      id
      data(from: $from, to: $to) {
        affiliateCommission
        cancelled
        charges
        confirmed
        delivered
        expectedProfit
        items
        netSale
        onTheWay
        orders
        packaging
        paidAffiliateCommission
        paidResellerCommission
        payableAffiliateCommission
        payableResellerCommission
        pending
        placed
        profit
        rejected
        resellerCommission
        returned
        sale
        shipment
        station
        totalAffiliateCommission
        transaction
      }
      lastPayment
      threshold
      title
      totalPaid
    }
  }
`;
// SITE_DETAILS
export const SITE_DETAILS = gql`
  query ($userId: Int!, $siteType: String!) {
    selfSite(userId: $userId, siteType: $siteType) {
      androidApp
      bpayMerchantId
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      guide
      hostname
      id
      isActive
      isGuest
      isGuide
      isOtp
      isPaid
      isPublic
      isWhiteLabel
      lastEvent
      latitude
      locale
      longitude
      meta
      metaDescription
      navigation
      parent {
        id
        isActive
        isFixed
        parentId
        percentage
        title
        userId
      }
      parents
      percentage
      phone
      phoneLogo
      siteInfo
      siteType
      social
      street
      subscription
      title
      version
      whiteLabel
      whiteLabelUrl
    }
  }
`;

// SITE_IS_EXISTS
export const SITE_IS_EXISTS = gql`
  query ($hostname: String!) {
    siteSiteIsExists(hostname: $hostname) {
      exists
    }
  }
`;
// SITE_IS_VERSION_CHANGED
export const SITE_IS_VERSION_CHANGED = gql`
  query ($siteId: Int!, $version: Float!) {
    siteSiteIsVersionChanged(siteId: $siteId, version: $version) {
      exists
    }
  }
`;
// SELF_SITE_CREATE
export const SELF_SITE_CREATE = gql`
  mutation selfSiteCreate(
    $userId: Int!
    $address: String!
    $country: Int!
    $currency: String!
    $desktopTheme: String!
    $domain: String!
    $email: String
    $footer: JSON
    $guide: JSON
    $hostname: String!
    $industry: Int!
    $latitude: Float!
    $longitude: Float!
    $memberTemplate: JSON
    $meta: JSON
    $navigation: JSON
    $note: String!
    $phone: Int
    $referCode: String!
    $siteInfo: String!
    $siteType: String!
    $social: JSON
    $street: String
    $theme: String!
    $title: String!
  ) {
    selfSiteCreate(
      userId: $userId
      data: {
        address: $address
        country: $country
        currency: $currency
        desktopTheme: $desktopTheme
        domain: $domain
        email: $email
        footer: $footer
        guide: $guide
        hostname: $hostname
        industry: $industry
        latitude: $latitude
        longitude: $longitude
        memberTemplate: $memberTemplate
        meta: $meta
        navigation: $navigation
        note: $note
        phone: $phone
        referCode: $referCode
        siteInfo: $siteInfo
        siteType: $siteType
        social: $social
        street: $street
        theme: $theme
        title: $title
      }
    ) {
      androidApp
      bpayMerchantId
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      guide
      hostname
      id
      isActive
      isGuest
      isGuide
      isOtp
      isPaid
      isPublic
      isWhiteLabel
      lastEvent
      latitude
      locale
      longitude
      meta
      metaDescription
      navigation
      parent {
        id
        isActive
        isFixed
        parentId
        percentage
        title
        userId
      }
      parents
      percentage
      phone
      phoneLogo
      siteInfo
      siteType
      social
      street
      subscription
      title
      version
      whiteLabel
      whiteLabelUrl
    }
  }
`;
// SELF_SITE_UPDATE
export const SELF_SITE_UPDATE = gql`
  mutation selfSiteUpdate(
    $userId: Int!
    $siteId: Int!
    $address: String
    $completedStep: Int
    $coverImage: Upload
    $currency: String
    $desktopLogo: Upload
    $desktopTheme: String
    $domain: String
    $email: String
    $favicon: Upload
    $foot: String
    $head: String
    $industry: Int
    $isGuest: Boolean
    $isGuide: Boolean
    $isOtp: Boolean
    $isPublic: Boolean
    $lastEvent: DateTime
    $latitude: Float
    $locale: String
    $longitude: Float
    $meta: JSON
    $metaDescription: String
    $metaTitle: String
    $navigation: JSON
    $parent: JSON
    $parents: [Int]
    $percentage: Float
    $phone: Int
    $phoneLogo: Upload
    $sendSmsPerEvent: Boolean
    $sendSmsPerOrder: Boolean
    $social: JSON
    $street: String
    $theme: String
    $title: String
  ) {
    selfSiteUpdate(
      userId: $userId
      siteId: $siteId
      data: {
        address: $address
        completedStep: $completedStep
        coverImage: $coverImage
        currency: $currency
        desktopLogo: $desktopLogo
        desktopTheme: $desktopTheme
        domain: $domain
        email: $email
        favicon: $favicon
        foot: $foot
        head: $head
        industry: $industry
        isGuest: $isGuest
        isGuide: $isGuide
        isOtp: $isOtp
        isPublic: $isPublic
        lastEvent: $lastEvent
        latitude: $latitude
        locale: $locale
        longitude: $longitude
        meta: $meta
        metaDescription: $metaDescription
        metaTitle: $metaTitle
        navigation: $navigation
        parent: $parent
        parents: $parents
        percentage: $percentage
        phone: $phone
        phoneLogo: $phoneLogo
        sendSmsPerEvent: $sendSmsPerEvent
        sendSmsPerOrder: $sendSmsPerOrder
        social: $social
        street: $street
        theme: $theme
        title: $title
      }
    ) {
      androidApp
      bpayMerchantId
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      guide
      hostname
      id
      isActive
      isGuest
      isGuide
      isOtp
      isPaid
      isPublic
      isWhiteLabel
      lastEvent
      latitude
      locale
      longitude
      meta
      metaDescription
      navigation
      parent {
        id
        isActive
        isFixed
        parentId
        percentage
        title
        userId
      }
      parents
      percentage
      phone
      phoneLogo
      siteInfo
      siteType
      social
      street
      subscription
      title
      version
      whiteLabel
      whiteLabelUrl
    }
  }
`;
// LOGISTICS_COMPANIES
export const LOGISTICS_COMPANIES = gql`
  query ($isActive: Boolean!, $search: String, $after: String) {
    logisticsCompanies(isActive: $isActive, search: $search, after: $after) {
      total
      edges {
        node {
          domain
          id
          isActive
          isPaid
          logo
          street
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
// LOGISTICS_MERCHANTS
export const LOGISTICS_MERCHANTS = gql`
  query ($userId: Int!, $search: String, $first: Int, $after: String) {
    logisticsMerchants(
      userId: $userId
      isActive: true
      search: $search
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          chargeBase
          chargeMerchantDefined
          id
          logisticsAddress
          logisticsTitle
          note
          companyId
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
// LOGISTICS_ORDER_DELIVERY_CHARGE_CALCULATE
export const LOGISTICS_ORDER_DELIVERY_CHARGE_CALCULATE = gql`
  mutation logisticsParcelDeliveryChargeCalculate(
    $companyId: Int!
    $merchantId: Int!
    $startLatitude: Float!
    $startLongitude: Float!
    $endLatitude: Float!
    $endLongitude: Float!
    $weight: Float!
  ) {
    logisticsParcelDeliveryChargeCalculate(
      companyId: $companyId
      merchantId: $merchantId
      startLatitude: $startLatitude
      startLongitude: $startLongitude
      endLatitude: $endLatitude
      endLongitude: $endLongitude
      weight: $weight
    )
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        LOGISTICS MERCHANT
// ----------------------------------------------------------------------------------------------
// SELF_LOGISTICS_MERCHANT
export const SELF_LOGISTICS_MERCHANT = gql`
  query ($userId: Int!, $companyId: Int!) {
    selfLogisticsMerchant(userId: $userId, companyId: $companyId) {
      address
      balance
      chargeBase
      chargeFixed
      chargeMerchantDefined
      chargePerKg
      chargePerKm
      chargeSameArea
      chargeSameCity
      chargeSameCountry
      chargeSameSubCity
      codCharge
      createdAt
      discount
      email
      formattedAddress
      id
      isActive
      isPrepaid
      isVerified
      lastPayment
      latitude
      longitude
      note
      parcelsCancelled
      parcelsConfirmed
      parcelsDelivered
      parcelsInTransit
      parcelsNew
      parcelsPickedUp
      parcelsReadyForPick
      parcelsRejected
      parcelsReturned
      parcelsShipping
      parcelsTotal
      phone
      pickupAddress {
        address
        areaId
        cityId
        countryId
        id
        isActive
        latitude
        longitude
        stoppageType
        subCityId
        title
      }
      street
      thumbnail
      title
      totalCollected
      totalPaid
      totalProcessing
      userId
    }
  }
`;
// // SELF_LOGISTICS_MERCHANT_UPDATE
export const SELF_LOGISTICS_MERCHANT_UPDATE = gql`
  mutation selfLogisticsMerchantUpdate(
    $userId: Int!
    $id: Int!
    $address: String
    $chargeBase: Int
    $chargeMerchantDefined: Float
    $email: String
    $formattedAddress: String
    $isActive: Boolean
    $latitude: Float
    $logisticsTitle: String
    $longitude: Float
    $phone: Int
    $street: String
    $thumbnail: Upload
    $title: String
  ) {
    selfLogisticsMerchantUpdate(
      userId: $userId
      id: $id
      data: {
        address: $address
        chargeBase: $chargeBase
        chargeMerchantDefined: $chargeMerchantDefined
        email: $email
        formattedAddress: $formattedAddress
        isActive: $isActive
        latitude: $latitude
        logisticsTitle: $logisticsTitle
        longitude: $longitude
        phone: $phone
        street: $street
        thumbnail: $thumbnail
        title: $title
      }
    ) {
      id
    }
  }
`;

// // SELF_STORE_ORDER_LOGISTICS_ORDER_PLACE
export const SELF_STORE_ORDER_LOGISTICS_ORDER_PLACE = gql`
  mutation selfStoreOrderLogisticsOrderPlace(
    $userId: Int!
    $siteId: Int!
    $orderId: Int!
  ) {
    selfStoreOrderLogisticsOrderPlace(
      userId: $userId
      siteId: $siteId
      orderId: $orderId
    ) {
      id
      logisticsIsConfirmed
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        LOGISTICS CUSTOMER
// ----------------------------------------------------------------------------------------------
// USER_BY_PHONE
export const USER_BY_PHONE = gql`
  query ($phone: Int!) {
    userByPhone(phone: $phone) {
      id
      publicAddress
      publicFormattedAddress
      publicLatitude
      publicLongitude
      publicPhone
      publicTitle
    }
  }
`;

// SELF_USER_UPDATE_PUBLIC
export const SELF_USER_UPDATE_PUBLIC = gql`
  mutation selfUserUpdatePublic(
    $userId: Int!
    $id: Int!
    $publicAddress: String
    $publicFormattedAddress: String
    $publicLatitude: Float
    $publicLongitude: Float
    $publicPhone: Int
    $publicTitle: String
  ) {
    selfUserUpdatePublic(
      userId: $userId
      id: $id
      data: {
        publicAddress: $publicAddress
        publicFormattedAddress: $publicFormattedAddress
        publicLatitude: $publicLatitude
        publicLongitude: $publicLongitude
        publicPhone: $publicPhone
        publicTitle: $publicTitle
      }
    ) {
      id
      publicAddress
      publicFormattedAddress
      publicLatitude
      publicLongitude
      publicPhone
      publicTitle
    }
  }
`;

// USER_UPDATE_PUBLIC
export const USER_UPDATE_PUBLIC = gql`
  mutation userUpdatePublic(
    $id: Int!
    $publicAddress: String
    $publicFormattedAddress: String
    $publicLatitude: Float
    $publicLongitude: Float
    $publicPhone: Int
    $publicTitle: String
  ) {
    userUpdatePublic(
      id: $id
      data: {
        publicAddress: $publicAddress
        publicFormattedAddress: $publicFormattedAddress
        publicLatitude: $publicLatitude
        publicLongitude: $publicLongitude
        publicPhone: $publicPhone
        publicTitle: $publicTitle
      }
    ) {
      id
      publicAddress
      publicFormattedAddress
      publicLatitude
      publicLongitude
      publicPhone
      publicTitle
    }
  }
`;

// ----------------------------------------------------------------------------------------------
//                                        STORE CAMPAIGNS
// ----------------------------------------------------------------------------------------------
// STORE_CAMPAIGNS
export const STORE_CAMPAIGNS = gql`
  query ($siteId: [Int]!, $isPrivate: Boolean, $after: String, $first: Int) {
    storeCampaigns(
      siteId: $siteId
      isActive: true
      isPrivate: $isPrivate
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          endAt
          hid
          id
          isActive
          image
          slug
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
// STORE_CAMPAIGNS_DETAILS
export const STORE_CAMPAIGNS_DETAILS = gql`
  query ($hid: String!) {
    storeCampaignByHid(hid: $hid) {
      description
      endAt
      hid
      id
      image
      slug
      title
    }
  }
`;
// STORE_VOUCHERS
export const STORE_VOUCHERS = gql`
  query ($siteId: Int!, $first: Int, $after: String) {
    storeVouchers(
      siteId: $siteId
      isActive: true
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          code
          discount
          endDate
          id
          image
          minSpent
          startDate
          title
          voucherType
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
// STORE_VOUCHERS_DETAILS
export const STORE_VOUCHERS_DETAILS = gql`
  query ($siteId: Int!, $hid: String!) {
    storeVoucherByHid(siteId: $siteId, hid: $hid) {
      code
      description
      discount
      endDate
      hid
      id
      isDiscountFixed
      minSpent
      startDate
      title
    }
  }
`;
// SELF_STORE_VOUCHER_CHECK_BY_CODE
export const SELF_STORE_VOUCHER_CHECK_BY_CODE = gql`
  query (
    $siteId: Int!
    $userId: Int!
    $code: String!
    $quantity: Int!
    $total: Float!
    $delivery: Float!
    $products: String!
  ) {
    selfStoreVoucherCheckByCode(
      siteId: $siteId
      userId: $userId
      code: $code
      quantity: $quantity
      total: $total
      delivery: $delivery
      products: $products
    ) {
      discount
      message
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE COLLECTIONS
// ----------------------------------------------------------------------------------------------
// STORE_COLLECTIONS
export const STORE_COLLECTIONS = gql`
  query ($siteId: [Int]!, $isPrivate: Boolean, $after: String, $first: Int) {
    storeCollections(
      siteId: $siteId
      isActive: true
      isPrivate: $isPrivate
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          hid
          id
          image
          isActive
          slug
          title
          translation
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
// STORE_COLLECTIONS_DETAILS
export const STORE_COLLECTIONS_DETAILS = gql`
  query ($hid: String!) {
    storeCollectionByHid(hid: $hid) {
      description
      hid
      id
      image
      slug
      title
      translation
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE PRODUCTS
// ----------------------------------------------------------------------------------------------
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
    $after: String
    $first: Int
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
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          affiliateCommission(childId: $childId, childType: $childType)
          cashback(childId: $childId, childType: $childType)
          comparePrice(childId: $childId, childType: $childType)
          currency
          deliveryCharge(childId: $childId, childType: $childType)
          discount(childId: $childId, childType: $childType)
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
          isNegotiable(childId: $childId, childType: $childType)
          isVariant(childId: $childId, childType: $childType)
          maxOrder
          maxResellPrice
          minOrder
          price(
            childId: $childId
            childType: $childType
            percentage: $percentage
          )
          quantity(childId: $childId, childType: $childType)
          rewardPoints(childId: $childId, childType: $childType)
          sku
          slug
          thumbnail
          title(childId: $childId, childType: $childType)
          translation(childId: $childId, childType: $childType)
          unit
          unitType
          vat
          weight
          wholesale {
            id
            maxOrder
            minOrder
            price
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
// STORE_PRODUCT_DETAILS
export const STORE_PRODUCT_DETAILS = gql`
  query (
    $hid: String!
    $childId: Int
    $childType: Int
    $isReseller: Boolean
    $isBasePrice: Boolean
    $percentage: JSON
  ) {
    storeProductByHid(hid: $hid) {
      affiliateCommission
      barcode
      brands
      cashback
      categories
      comparePrice
      currency
      deliveryCharge
      deliveryTime
      description
      discount
      emiDuration
      emiInterest
      emiPrice
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
      flashPrice(childId: $childId, percentage: $percentage)
      hid
      html
      id
      image
      images {
        id
        image
      }
      isActive
      isCod
      isContinueSelling
      isEmi
      isFlash
      isNegotiable
      isOneTime
      isResell
      isVariant
      maxOrder
      maxResellPrice
      metaDescription
      minOrder
      price(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
        isBasePrice: $isBasePrice
      )
      quantity
      rewardPoints
      childProducts {
        cost
        flashPrice
        price
        quantity
        siteId
        siteType
        sold
      }
      sku
      slug
      subCategories
      tags
      thumbnail
      title
      translation
      unit
      unitType
      vat
      variants {
        comparePrice
        cost
        currency
        emiPrice
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
      }
      weight
      wholesale {
        id
        maxOrder
        minOrder
        price
      }
    }
  }
`;
// STORE_PRODUCT_DETAILS_BY_ID
export const STORE_PRODUCT_DETAILS_BY_ID = gql`
  query (
    $id: Int!
    $childId: Int
    $childType: Int
    $isReseller: Boolean
    $isBasePrice: Boolean
    $percentage: JSON
  ) {
    storeProduct(id: $id) {
      affiliateCommission
      barcode
      brands
      cashback
      categories
      comparePrice
      currency
      deliveryCharge
      deliveryTime
      description
      discount
      emiDuration
      emiInterest
      emiPrice
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
      flashPrice(childId: $childId, percentage: $percentage)
      hid
      html
      id
      image
      images {
        id
        image
      }
      isActive
      isCod
      isContinueSelling
      isEmi
      isFlash
      isNegotiable
      isOneTime
      isResell
      isVariant
      maxOrder
      maxResellPrice
      metaDescription
      minOrder
      price(
        childId: $childId
        childType: $childType
        percentage: $percentage
        isReseller: $isReseller
        isBasePrice: $isBasePrice
      )
      quantity
      rewardPoints
      childProducts {
        cost
        flashPrice
        price
        quantity
        siteId
        siteType
        sold
      }
      sku
      slug
      subCategories
      tags
      thumbnail
      title
      translation
      unit
      unitType
      vat
      variants {
        comparePrice
        cost
        currency
        emiPrice
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
      }
      weight
      wholesale {
        id
        maxOrder
        minOrder
        price
      }
    }
  }
`;
// STORE_CUSTOMER_FAVORITE_PRODUCTS
export const STORE_CUSTOMER_FAVORITE_PRODUCTS = gql`
  query ($customerId: Int!, $first: Int, $after: String) {
    storeCustomerFavoriteProducts(
      customerId: $customerId
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          affiliateCommission
          cashback
          comparePrice
          currency
          deliveryCharge
          discount
          hid
          id
          isActive
          isContinueSelling
          isOneTime
          isNegotiable
          isVariant
          maxOrder
          maxResellPrice
          minOrder
          price
          quantity
          rewardPoints
          sku
          slug
          thumbnail
          title
          translation
          unit
          unitType
          vat
          weight
          wholesale {
            id
            maxOrder
            minOrder
            price
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
// STORE_PRODUCT_CREATE_BY_RESELLER
export const STORE_PRODUCT_CREATE_BY_RESELLER = gql`
  mutation selfStoreProductCreate(
    $userId: Int!
    $siteId: Int!
    $childId: Int!
    $price: Float!
    $source: String!
  ) {
    selfStoreProductCreateByReseller(
      userId: $userId
      siteId: $siteId
      childId: $childId
      price: $price
      source: $source
    ) {
      hid
      id
      slug
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
        siteType: $siteType
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
      cost(childId: $childId, childType: $childType, isReseller: $isReseller)
      comparePrice
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
      isOneTime
      isNegotiable
      isVariant
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
      quantity
      rewardPoints
      sku
      slug
      thumbnail
      title
      translation
      unit
      unitType
      vat
      weight
      vat
    }
  }
`;
// SELF_STORE_PRODUCT_DELETE_BY_CHILD
export const SELF_STORE_PRODUCT_DELETE_BY_CHILD = gql`
  mutation selfStoreProductDeleteByReseller(
    $userId: Int!
    $siteId: Int!
    $productId: Int!
  ) {
    selfStoreProductDeleteByReseller(
      userId: $userId
      siteId: $siteId
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
// STORE_CUSTOMER_CREATE_USER_ID
export const STORE_CUSTOMER_CREATE_USER_ID = gql`
  mutation storeCustomerCreateUserId(
    $siteId: Int!
    $title: String!
    $phone: Int!
  ) {
    storeCustomerCreateUserId(siteId: $siteId, title: $title, phone: $phone) {
      address
      formattedAddress
      id
      latitude
      longitude
      phone
      title
    }
  }
`;

// STORE_CUSTOMER_ADD_CART
export const STORE_CUSTOMER_ADD_CART = gql`
  mutation storeCustomerAddCart(
    $customerId: Int!
    $id: Int!
    $price: Float!
    $quantity: Float!
    $resellPrice: Float!
    $shopId: Int
    $title: String!
  ) {
    storeCustomerAddCart(
      customerId: $customerId
      data: {
        id: $id
        price: $price
        quantity: $quantity
        resellPrice: $resellPrice
        shopId: $shopId
        title: $title
      }
    )
  }
`;
// STORE_CUSTOMER_REMOVE_CART
export const STORE_CUSTOMER_REMOVE_CART = gql`
  mutation storeCustomerRemoveCart(
    $customerId: Int!
    $id: Int!
    $price: Float!
    $quantity: Float!
    $resellPrice: Float!
    $shopId: Int
    $title: String!
  ) {
    storeCustomerRemoveCart(
      customerId: $customerId
      data: {
        id: $id
        price: $price
        quantity: $quantity
        resellPrice: $resellPrice
        shopId: $shopId
        title: $title
      }
    )
  }
`;
// STORE_CUSTOMER_ADD_BILLING_ADDRESS
export const STORE_CUSTOMER_ADD_BILLING_ADDRESS = gql`
  mutation storeCustomerAddBillingAddress(
    $customerId: Int!
    $id: Int!
    $address: String!
    $formattedAddress: String!
    $latitude: Float!
    $longitude: Float!
  ) {
    storeCustomerAddBillingAddress(
      customerId: $customerId
      data: {
        address: $address
        formattedAddress: $formattedAddress
        id: $id
        latitude: $latitude
        longitude: $longitude
      }
    )
  }
`;
// STORE_CUSTOMER_REMOVE_BILLING_ADDRESS
export const STORE_CUSTOMER_REMOVE_BILLING_ADDRESS = gql`
  mutation storeCustomerRemoveBillingAddress(
    $customerId: Int!
    $id: Int!
    $address: String!
    $formattedAddress: String!
    $latitude: Float!
    $longitude: Float!
  ) {
    storeCustomerRemoveBillingAddress(
      customerId: $customerId
      data: {
        address: $address
        formattedAddress: $formattedAddress
        id: $id
        latitude: $latitude
        longitude: $longitude
      }
    )
  }
`;
// STORE_CUSTOMER_ADD_SHIPPING_ADDRESS
export const STORE_CUSTOMER_ADD_SHIPPING_ADDRESS = gql`
  mutation storeCustomerAddShippingAddress(
    $customerId: Int!
    $id: Int!
    $address: String!
    $formattedAddress: String!
    $latitude: Float!
    $longitude: Float!
  ) {
    storeCustomerAddShippingAddress(
      customerId: $customerId
      data: {
        address: $address
        formattedAddress: $formattedAddress
        id: $id
        latitude: $latitude
        longitude: $longitude
      }
    )
  }
`;
// STORE_CUSTOMER_REMOVE_SHIPPING_ADDRESS
export const STORE_CUSTOMER_REMOVE_SHIPPING_ADDRESS = gql`
  mutation storeCustomerRemoveShippingAddress(
    $customerId: Int!
    $id: Int!
    $address: String!
    $formattedAddress: String!
    $latitude: Float!
    $longitude: Float!
  ) {
    storeCustomerRemoveShippingAddress(
      customerId: $customerId
      data: {
        address: $address
        formattedAddress: $formattedAddress
        id: $id
        latitude: $latitude
        longitude: $longitude
      }
    )
  }
`;

// STORE_CUSTOMER_BLOCKED_PRODUCT
export const STORE_CUSTOMER_BLOCKED_PRODUCT = gql`
  query ($customerId: Int!, $productId: Int!, $oneTimeOnly: Boolean!) {
    storeCustomerBlockedProduct(
      customerId: $customerId
      productId: $productId
      oneTimeOnly: $oneTimeOnly
    )
  }
`;

// ----------------------------------------------------------------------------------------------
//                                        STORE STOPPAGES
// ----------------------------------------------------------------------------------------------
// STORE_STOPPAGES
export const STORE_STOPPAGES = gql`
  query (
    $siteId: [Int]
    $childId: Int
    $search: String
    $isActive: Boolean
    $after: String
    $first: Int
  ) {
    storeStoppages(
      siteId: $siteId
      search: $search
      isActive: $isActive
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          address
          areaId
          charge(childId: $childId)
          cityId
          countryId
          id
          isActive(childId: $childId)
          latitude
          longitude
          stoppageType
          subCityId
          title(childId: $childId)
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
// ----------------------------------------------------------------------------------------------
//                                        STORE BRANDS
// ----------------------------------------------------------------------------------------------
// STORE_BRANDS
export const STORE_BRANDS = gql`
  query (
    $siteId: [Int]!
    $childId: Int
    $search: String
    $isPrivate: Boolean
    $after: String
    $first: Int
  ) {
    storeBrands(
      siteId: $siteId
      search: $search
      isPrivate: $isPrivate
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          categories
          hid
          id
          image(childId: $childId)
          isActive(childId: $childId)
          priority
          slug
          subCategories
          title
          translation
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
// STORE_BRAND_DETAILS
export const STORE_BRAND_DETAILS = gql`
  query ($hid: String!) {
    storeBrandByHid(hid: $hid) {
      id
      hid
      image
      priority
      slug
      title
      translation
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE TAGS
// ----------------------------------------------------------------------------------------------
// STORE_TAGS
export const STORE_TAGS = gql`
  query (
    $siteId: [Int]!
    $search: String
    $isPrivate: Boolean
    $after: String
    $first: Int
  ) {
    storeTags(
      siteId: $siteId
      search: $search
      isPrivate: $isPrivate
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          hid
          id
          isActive
          slug
          title
          translation
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
// STORE_TAG_DETAILS
export const STORE_TAG_DETAILS = gql`
  query ($hid: String!) {
    storeTagByHid(hid: $hid) {
      id
      hid
      slug
      title
      translation
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE CATEGORIES
// ----------------------------------------------------------------------------------------------
// STORE_CATEGORIES
export const STORE_CATEGORIES = gql`
  query (
    $siteId: [Int]!
    $childId: Int
    $search: String
    $isPrivate: Boolean
    $after: String
    $first: Int
    $isActive: Boolean
  ) {
    storeCategories(
      siteId: $siteId
      search: $search
      isActive: $isActive
      isPrivate: $isPrivate
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          cover
          external
          hid
          id
          image(childId: $childId)
          isActive(childId: $childId)
          isExternal
          priority
          slug
          title
          translation
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
// STORE_CATEGORY_DETAILS
export const STORE_CATEGORY_DETAILS = gql`
  query ($hid: String!, $isActive: Boolean) {
    storeCategoryByHid(hid: $hid) {
      cover
      external
      hid
      id
      image
      slug
      title
      isExternal
      translation
      subCategories(isActive: $isActive) {
        cover
        id
        image
        priority
        slug
        hid
        title
        translation
      }
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE SUB_CATEGORY
// ----------------------------------------------------------------------------------------------
// STORE_SUB_CATEGORIES
export const STORE_SUB_CATEGORIES = gql`
  query (
    $siteId: [Int]!
    $categoryId: Int
    $isPrivate: Boolean
    $first: Int
    $after: String
  ) {
    storeSubCategories(
      siteId: $siteId
      categoryId: $categoryId
      isPrivate: $isPrivate
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          categoryId
          cover
          hid
          id
          image
          isActive
          priority
          slug
          title
          translation
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
// STORE_SUB_CATEGORY_DETAILS
export const STORE_SUB_CATEGORY_DETAILS = gql`
  query ($hid: String!) {
    storeSubCategoryByHid(hid: $hid) {
      categoryId
      cover
      hid
      id
      image
      priority
      slug
      title
      translation
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        SUB CATEGORY
// ----------------------------------------------------------------------------------------------
// STORE_SUB_SUB_CATEGORIES
export const STORE_SUB_SUB_CATEGORIES = gql`
  query (
    $siteId: [Int]!
    $categoryId: Int
    $subCategoryId: Int
    $isPrivate: Boolean
    $first: Int
    $after: String
  ) {
    storeSubSubCategories(
      siteId: $siteId
      categoryId: $categoryId
      subCategoryId: $subCategoryId
      isPrivate: $isPrivate
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          categoryId
          cover
          hid
          id
          image
          isActive
          priority
          slug
          subCategoryId
          title
          translation
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
// STORE_SUB_SUB_CATEGORY_DETAILS
export const STORE_SUB_SUB_CATEGORY_DETAILS = gql`
  query ($hid: String!) {
    storeSubSubCategoryByHid(hid: $hid) {
      categoryId
      cover
      description
      id
      image
      priority
      subCategoryId
      title
      translation
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE PAGE
// ----------------------------------------------------------------------------------------------
// SITE_PAGE_DETAILS
export const SITE_PAGE_DETAILS = gql`
  query ($siteId: Int!, $slug: String!) {
    sitePageBySlug(siteId: $siteId, slug: $slug) {
      description
      html
      id
      slug
      title
      updatedAt
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE SHOPS
// ----------------------------------------------------------------------------------------------
// STORE_SHOPS
export const STORE_SHOPS = gql`
  query (
    $siteId: Int!
    $search: String
    $isActive: Boolean
    $brandId: Int
    $categoryId: Int
    $subCategoryId: Int
    $shopType: Int
    $latitude: Float
    $longitude: Float
    $after: String
    $first: Int
  ) {
    storeShops(
      siteId: $siteId
      search: $search
      isActive: $isActive
      brandId: $brandId
      categoryId: $categoryId
      subCategoryId: $subCategoryId
      shopType: $shopType
      latitude: $latitude
      longitude: $longitude
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          address
          cover
          followers
          hid
          id
          latitude
          logo
          longitude
          slug
          title
          street
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
// STORE_SHOP_DETAILS
export const STORE_SHOP_DETAILS = gql`
  query ($siteId: Int!, $hid: String!) {
    storeShopByHid(siteId: $siteId, hid: $hid) {
      address
      brands
      categories
      country
      cover
      description
      email
      features
      followers
      hid
      id
      isActive
      isPublic
      isVerified
      lastPayment
      latitude
      logo
      longitude
      note
      phone
      products
      sale
      shopType
      siteId
      slogan
      slug
      street
      subCategories
      thumbnail
      title
      transaction
      translation
      userId
    }
  }
`;
//
// ----------------------------------------------------------------------------------------------
//                                        STORE CUSTOMER
// ----------------------------------------------------------------------------------------------
// SELF_STORE_CUSTOMER

export const SELF_STORE_CUSTOMER = gql`
query selfStoreCustomer($userId: Int!, $siteId: Int!, $isActive: Boolean, $isAffiliate: Boolean, $isReseller: Boolean, $isWholesale: Boolean) {
  selfStoreCustomer(userId: $userId, siteId: $siteId, isActive: $isActive, isAffiliate: $isAffiliate, isReseller: $isReseller, isWholesale: $isWholesale) {
      userId: $userId
      siteId: $siteId
      isActive: $isActive
      isAffiliate: $isAffiliate
      isReseller: $isReseller
      isWholesale: $isWholesale
    ) {
      address
      avatar
      billingAddress {
        address
        formattedAddress
        id
        latitude
        longitude
      }
      blockProducts
      domain
      favorite
      formattedAddress
      id
isActive
      isAffiliate
      isAffiliateCommission
      isAffiliateJoin
      isReseller
      isWholesale
      latitude
      longitude
      ordersCancelled
      ordersConfirmed
      ordersDelivered
      ordersOnTheWay
      ordersPackaging
      ordersPending
      ordersPlaced
      ordersRejected
      ordersReturned
      ordersShipment
      ordersStation
      ordersTotal
      paymentNo
      paymentTitle
      pendingBalance
      pendingCashbackBalance
      pendingGiftCardBalance
      pendingProfit
      pendingPurchase
      pendingRewardPoints
      phone
      referCode
      referId
      resellPaid
      resellPayable
      resellProcessing
      resellTotal
      shippingAddress {
        address
        formattedAddress
        id
        latitude
        longitude
      }
      title
      totalBalance
      totalCashbackBalance
      totalGiftCardBalance
      totalPaid
      totalProfit
      totalPurchase
      totalReturnCharge
      totalRewardPoints
  }
}
`;
// SELF_STORE_CUSTOMER_UPDATE
export const SELF_STORE_CUSTOMER_UPDATE = gql`
mutation selfStoreCustomerUpdateByCustomer(
  $userId: Int!
  $customerId: Int!
  $address: String
  $avatar: Upload
  $billingAddress: String
  $domain: String
  $formattedAddress: String
  $isReseller: Boolean
  $latitude: Float
  $longitude: Float
  $paymentNo: String
  $paymentTitle: String
  $phone: Int
  $referCode: String
  $shippingAddress: String
  $title: String
) {
  selfStoreCustomerUpdateByCustomer(
    userId: $userId
    customerId: $customerId
    data: {
      address: $address
      avatar: $avatar
      billingAddress: $billingAddress
      domain: $domain
      formattedAddress: $formattedAddress
      isReseller: $isReseller
      latitude: $latitude
      longitude: $longitude
      paymentNo: $paymentNo
      paymentTitle: $paymentTitle
      phone: $phone
      referCode: $referCode
      shippingAddress: $shippingAddress
      title: $title
    }
  ) {
      userId: $userId
      siteId: $siteId
      isActive: $isActive
      isAffiliate: $isAffiliate
      isReseller: $isReseller
      isWholesale: $isWholesale
    ) {
      address
      avatar
      billingAddress {
        address
        formattedAddress
        id
        latitude
        longitude
      }
      blockProducts
      domain
      favorite
      formattedAddress
      id
isActive
      isAffiliate
      isAffiliateCommission
      isAffiliateJoin
      isReseller
      isWholesale
      latitude
      longitude
      ordersCancelled
      ordersConfirmed
      ordersDelivered
      ordersOnTheWay
      ordersPackaging
      ordersPending
      ordersPlaced
      ordersRejected
      ordersReturned
      ordersShipment
      ordersStation
      ordersTotal
      paymentNo
      paymentTitle
      pendingBalance
      pendingCashbackBalance
      pendingGiftCardBalance
      pendingProfit
      pendingPurchase
      pendingRewardPoints
      phone
      referCode
      referId
      resellPaid
      resellPayable
      resellProcessing
      resellTotal
      shippingAddress {
        address
        formattedAddress
        id
        latitude
        longitude
      }
      title
      totalBalance
      totalCashbackBalance
      totalGiftCardBalance
      totalPaid
      totalProfit
      totalPurchase
      totalReturnCharge
      totalRewardPoints
  }
}
`;
// STORE_CUSTOMER_ADD_FAVORITE
export const STORE_CUSTOMER_ADD_FAVORITE = gql`
  mutation selfStoreCustomerAddFavorite(
    $userId: Int!
    $customerId: Int!
    $productId: Int!
  ) {
    selfStoreCustomerAddFavorite(
      userId: $userId
      customerId: $customerId
      productId: $productId
    )
  }
`;
// STORE_CUSTOMER_REMOVE_FAVORITE
export const STORE_CUSTOMER_REMOVE_FAVORITE = gql`
  mutation selfStoreCustomerRemoveFavorite(
    $userId: Int!
    $customerId: Int!
    $productId: Int!
  ) {
    selfStoreCustomerRemoveFavorite(
      userId: $userId
      customerId: $customerId
      productId: $productId
    )
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
// SELF_SITE_REMOVE_CATEGORY
export const SELF_SITE_REMOVE_CATEGORY = gql`
  mutation selfSiteRemoveCategory(
    $userId: Int!
    $siteId: Int!
    $categoryId: Int!
  ) {
    selfSiteRemoveCategory(
      userId: $userId
      siteId: $siteId
      categoryId: $categoryId
    ) {
      id
    }
  }
`;
// SELF_SITE_REMOVE_SUB_CATEGORY
export const SELF_SITE_REMOVE_SUB_CATEGORY = gql`
  mutation selfSiteRemoveSubCategory(
    $userId: Int!
    $siteId: Int!
    $subCategoryId: Int!
  ) {
    selfSiteRemoveSubCategory(
      userId: $userId
      siteId: $siteId
      subCategoryId: $subCategoryId
    ) {
      id
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        CUSTOMER
// ----------------------------------------------------------------------------------------------
// STORE_CUSTOMERS
export const STORE_CUSTOMERS = gql`
  query (
    $siteId: Int!
    $search: String
    $from: DateTime
    $to: DateTime
    $queryType: String
    $after: String
    $first: Int
  ) {
    storeCustomers(
      siteId: $siteId
      search: $search
      from: $from
      to: $to
      queryType: $queryType
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          avatar
          cartCount
          createdAt
          currency
          id
          nid
          ordersTotal
          phone
          resellTotal
          address
          title
          totalProfit
          totalPurchase
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
// STORE_CUSTOMER_DETAILS
export const STORE_CUSTOMER_DETAILS = gql`
  query ($siteId: Int!, $id: Int!) {
    storeCustomer(siteId: $siteId, id: $id) {
      address
      avatar
      billingAddress {
        address
        formattedAddress
        id
        latitude
        longitude
      }
      createdAt
      currency
      cartProducts {
        id
        price
        quantity
        resellPrice
        title
        variant
        variantId
      }
      favorite
      formattedAddress
      id
      isActive
      isAffiliate
      isWholesale
      latitude
      longitude
      nid
      note
      ordersCancelled
      ordersConfirmed
      ordersDelivered
      ordersOnTheWay
      ordersPackaging
      ordersPending
      ordersPlaced
      ordersRejected
      ordersReturned
      ordersShipment
      ordersStation
      ordersTotal
      pendingBalance
      pendingCashbackBalance
      pendingGiftCardBalance
      pendingProfit
      pendingPurchase
      pendingRewardPoints
      phone
      referCode
      referId
      resellPaid
      resellProcessing
      resellTotal
      shippingAddress {
        address
        formattedAddress
        id
        latitude
        longitude
      }
      siteId
      tags
      title
      totalBalance
      totalCashbackBalance
      totalGiftCardBalance
      totalPaid
      totalProfit
      totalPurchase
      totalReturnCharge
      totalRewardPoints
      updatedAt
      userId
    }
  }
`;
// SELF_STORE_CUSTOMER_UPDATE_BY_ADMIN
export const SELF_STORE_CUSTOMER_UPDATE_BY_ADMIN = gql`
  mutation selfStoreCustomerUpdateByAdmin(
    $userId: Int!
    $siteId: Int!
    $customerId: Int!
    $address: String
    $formattedAddress: String
    $isActive: Boolean
    $isAffiliate: Boolean
    $isWholesale: Boolean
    $title: String
  ) {
    selfStoreCustomerUpdateByAdmin(
      userId: $userId
      siteId: $siteId
      customerId: $customerId
      data: {
        address: $address
        formattedAddress: $formattedAddress
        isActive: $isActive
        isAffiliate: $isAffiliate
        isWholesale: $isWholesale
        title: $title
      }
    ) {
      id
    }
  }
`;

// ----------------------------------------------------------------------------------------------
//                                        GATEWAY
// ----------------------------------------------------------------------------------------------
// STORE_GATEWAYS
export const STORE_GATEWAYS = gql`
  query ($siteId: Int!, $isActive: Boolean, $after: String, $first: Int) {
    storeGateways(
      siteId: $siteId
      isActive: $isActive
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          fee
          gatewayType
          heighlight
          id
          isActive
          isManual
          note
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
// STORE_GATEWAY_DETAILS
export const STORE_GATEWAY_DETAILS = gql`
  query ($siteId: Int!, $id: Int!) {
    storeGateway(siteId: $siteId, id: $id) {
      fee
      gatewayType
      heighlight
      id
      isActive
      isManual
      note
      title
      updatedAt
    }
  }
`;
// SELF_STORE_GATEWAY_CREATE
export const SELF_STORE_GATEWAY_CREATE = gql`
  mutation selfStoreGatewayCreate(
    $userId: Int!
    $siteId: Int!
    $credential: JSON!
    $fee: Float!
    $gatewayType: Int!
    $heighlight: String
    $isActive: Boolean!
    $isManual: Boolean!
    $note: String!
    $title: String!
  ) {
    selfStoreGatewayCreate(
      userId: $userId
      siteId: $siteId
      data: {
        credential: $credential
        fee: $fee
        gatewayType: $gatewayType
        heighlight: $heighlight
        title: $title
        note: $note
        isActive: $isActive
        isManual: $isManual
      }
    ) {
      id
    }
  }
`;
// SELF_STORE_GATEWAY_UPDATE
export const SELF_STORE_GATEWAY_UPDATE = gql`
  mutation selfStoreGatewayUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $fee: Float!
    $gatewayType: Int!
    $heighlight: String
    $isActive: Boolean!
    $isManual: Boolean!
    $note: String!
    $title: String!
  ) {
    selfStoreGatewayUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        fee: $fee
        gatewayType: $gatewayType
        heighlight: $heighlight
        title: $title
        note: $note
        isActive: $isActive
        isManual: $isManual
      }
    ) {
      id
    }
  }
`;
// SELF_STORE_GATEWAY_DELETE
export const SELF_STORE_GATEWAY_DELETE = gql`
  mutation selfStoreGatewayDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreGatewayDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE ORDERS
// ----------------------------------------------------------------------------------------------
// STORE_ORDERS
export const STORE_ORDERS = gql`
  query (
    $siteId: Int!
    $customerId: Int
    $search: String
    $status: Int
    $referId: Int
    $affiliateIsPaid: Boolean
    $first: Int
    $after: String
  ) {
    storeOrders(
      siteId: $siteId
      customerId: $customerId
      search: $search
      status: $status
      referId: $referId
      affiliateIsPaid: $affiliateIsPaid
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          createdAt
          currency
          customerAddress
          customerName
          customerPhone
          id
          logisticsCharge
          orderId
          paid
          status
          total
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
`; // STORE_SHOP_ORDERS
export const STORE_SHOP_ORDERS = gql`
  query (
    $siteId: Int!
    $shopId: Int
    $status: Int
    $search: String
    $first: Int
    $after: String
  ) {
    storeShopOrders(
      siteId: $siteId
      shopId: $shopId
      status: $status
      search: $search
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          createdAt
          currency
          customerAddress
          customerName
          customerPhone
          id
          logisticsCharge
          orderId
          paid
          status
          total
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
// STORE_ORDER_DETAILS
export const STORE_ORDER_DETAILS = gql`
  query ($siteId: Int!, $id: Int!) {
    storeOrder(siteId: $siteId, id: $id) {
      address
      affiliateCommission
      affiliateIsPaid
      cashbackBalance
      charge
      childHid
      childId
      cost
      createdAt
      currency
      customerAddress
      customerId
      customerName
      customerNote
      customerPhone
      deliveryTime
      discount
      discountName
      emiDuration
      emiInterest
      gatewayText
      grossAmount
      id
      isChargePaid
      isEmi
      isPaid
      isSettle
      isTransferred
      latitude
      logisticsCharge
      logisticsExtraCharge
      logisticsIsConfirmed
      logisticsIsPaid
      logisticsText
      logisticsUrl
      longitude
      netAmount
      orderId
      paid
      childId
      paymentId
      paymentResellerId
      profit
      resellAmount
      resellerAdvanceCollect
      resellerCommission
      resellerIsPaid
      rewardPoints
      siteId
      status
      statusCompleted
      total
      trackingId
      updatedAt
      vat
      vatAmount
      customer {
        avatar
        userId
        hid
        title
        phone
        address
      }
      events {
        createdAt
        eventType
        id
        note
      }
      pays {
        createdAt
        gatewayId
        id
        note
        payType
        paymentDate
        paymentId
        paymentNo
        paymentTitle
        total
      }
      lines {
        cost
        currency
        id
        image
        isActive
        productId
        productHid
        productName
        productSku
        quantity
        resellPrice
        source
        unit
        price
        unitType
        variant
        vat
      }
    }
  }
`;
// STORE_ORDER_DETAILS_BY_ORDER_ID
export const STORE_ORDER_DETAILS_BY_ORDER_ID = gql`
  query ($siteId: Int!, $orderId: String!) {
    storeOrderByOrderId(siteId: $siteId, orderId: $orderId) {
      address
      affiliateCommission
      affiliateIsPaid
      cashbackBalance
      charge
      childHid
      childId
      cost
      createdAt
      currency
      customerAddress
      customerId
      customerName
      customerNote
      customerPhone
      deliveryTime
      discount
      discountName
      emiDuration
      emiInterest
      gatewayText
      grossAmount
      id
      isChargePaid
      isEmi
      isPaid
      isSettle
      isTransferred
      latitude
      logisticsCharge
      logisticsExtraCharge
      logisticsIsConfirmed
      logisticsIsPaid
      logisticsText
      logisticsUrl
      longitude
      netAmount
      orderId
      paid
      childId
      paymentId
      paymentResellerId
      profit
      resellAmount
      resellerAdvanceCollect
      resellerCommission
      resellerIsPaid
      rewardPoints
      siteId
      status
      statusCompleted
      total
      trackingId
      updatedAt
      vat
      vatAmount
      customer {
        avatar
        userId
        hid
        title
        phone
        address
      }
      events {
        createdAt
        eventType
        id
        note
      }
      pays {
        createdAt
        gatewayId
        id
        note
        payType
        paymentDate
        paymentId
        paymentNo
        paymentTitle
        total
      }
      lines {
        cost
        currency
        id
        image
        isActive
        productId
        productHid
        productName
        productSku
        quantity
        resellPrice
        source
        unit
        price
        unitType
        variant
        vat
      }
    }
  }
`;
// SELF_STORE_ORDER_CREATE_BY_CUSTOMER
export const SELF_STORE_ORDER_CREATE_BY_CUSTOMER = gql`
  mutation selfStoreOrderCreateByCustomer(
    $userId: Int!
    $siteId: Int!
    $address: String!
    $affiliateCommission: Float!
    $cashbackBalance: Float!
    $charge: Float!
    $cost: Float!
    $currency: String!
    $customerAddress: String!
    $customerId: Int!
    $customerName: String!
    $customerNote: String
    $customerPhone: Int!
    $deliveryTime: String
    $discount: Float!
    $discountName: String
    $emiDuration: Int!
    $emiInterest: Float!
    $gatewayText: String!
    $grossAmount: Float!
    $isEmi: Boolean!
    $latitude: Float!
    $logisticsCharge: Float!
    $logisticsExtraCharge: Float!
    $companyId: Int!
    $logisticsText: String!
    $longitude: Float!
    $netAmount: Float!
    $otp: Int!
    $paid: Float!
    $parentSiteId: Int
    $profit: Float!
    $referCode: String!
    $resellAmount: Float!
    $resellerAdvanceCollect: Float!
    $resellerCommission: Float!
    $rewardPoints: Float!
    $source: String!
    $total: Float!
    $vat: Float!
    $vatAmount: Float!
    $weight: Float!
    $products: [StoreOrderCartCreate!]
  ) {
    selfStoreOrderCreateByCustomer(
      userId: $userId
      siteId: $siteId
      customerId: $customerId
      data: {
        address: $address
        affiliateCommission: $affiliateCommission
        cashbackBalance: $cashbackBalance
        charge: $charge
        cost: $cost
        currency: $currency
        customerAddress: $customerAddress
        customerName: $customerName
        customerNote: $customerNote
        customerPhone: $customerPhone
        deliveryTime: $deliveryTime
        discount: $discount
        discountName: $discountName
        emiDuration: $emiDuration
        emiInterest: $emiInterest
        gatewayText: $gatewayText
        grossAmount: $grossAmount
        isEmi: $isEmi
        latitude: $latitude
        logisticsCharge: $logisticsCharge
        logisticsExtraCharge: $logisticsExtraCharge
        logisticsId: $companyId
        logisticsText: $logisticsText
        longitude: $longitude
        netAmount: $netAmount
        otp: $otp
        paid: $paid
        parentSiteId: $parentSiteId
        profit: $profit
        referCode: $referCode
        resellAmount: $resellAmount
        resellerAdvanceCollect: $resellerAdvanceCollect
        resellerCommission: $resellerCommission
        rewardPoints: $rewardPoints
        source: $source
        total: $total
        vat: $vat
        vatAmount: $vatAmount
        userId: $userId
        weight: $weight
      }
      products: $products
    ) {
      currency
      id
      orderId
      total
      lines {
        currency
        productHid
        productName
        quantity
        price
      }
    }
  }
`;
// SELF_STORE_ORDER_CREATE_BY_GUEST
export const SELF_STORE_ORDER_CREATE_BY_GUEST = gql`
  mutation selfStoreOrderCreateByGuest(
    $siteId: Int!
    $address: String!
    $affiliateCommission: Float!
    $cashbackBalance: Float!
    $charge: Float!
    $cost: Float!
    $currency: String!
    $customerAddress: String!
    $customerName: String!
    $customerNote: String
    $customerPhone: Int!
    $deliveryTime: String
    $discount: Float!
    $discountName: String
    $emiDuration: Int!
    $emiInterest: Float!
    $gatewayText: String!
    $grossAmount: Float!
    $isEmi: Boolean!
    $latitude: Float!
    $logisticsCharge: Float!
    $logisticsExtraCharge: Float!
    $companyId: Int!
    $logisticsText: String!
    $longitude: Float!
    $netAmount: Float!
    $otp: Int!
    $paid: Float!
    $parentSiteId: Int
    $profit: Float!
    $referCode: String!
    $resellAmount: Float!
    $resellerAdvanceCollect: Float!
    $resellerCommission: Float!
    $rewardPoints: Float!
    $source: String!
    $total: Float!
    $vat: Float!
    $vatAmount: Float!
    $weight: Float!
    $products: [StoreOrderCartCreate!]
  ) {
    selfStoreOrderCreateByGuest(
      siteId: $siteId
      data: {
        address: $address
        affiliateCommission: $affiliateCommission
        cashbackBalance: $cashbackBalance
        charge: $charge
        cost: $cost
        currency: $currency
        customerAddress: $customerAddress
        customerName: $customerName
        customerNote: $customerNote
        customerPhone: $customerPhone
        deliveryTime: $deliveryTime
        discount: $discount
        discountName: $discountName
        emiDuration: $emiDuration
        emiInterest: $emiInterest
        gatewayText: $gatewayText
        grossAmount: $grossAmount
        isEmi: $isEmi
        latitude: $latitude
        logisticsCharge: $logisticsCharge
        logisticsExtraCharge: $logisticsExtraCharge
        logisticsId: $companyId
        logisticsText: $logisticsText
        longitude: $longitude
        netAmount: $netAmount
        otp: $otp
        paid: $paid
        parentSiteId: $parentSiteId
        profit: $profit
        referCode: $referCode
        resellAmount: $resellAmount
        resellerAdvanceCollect: $resellerAdvanceCollect
        resellerCommission: $resellerCommission
        rewardPoints: $rewardPoints
        source: $source
        total: $total
        vat: $vat
        vatAmount: $vatAmount
        userId: 1
        weight: $weight
      }
      products: $products
    ) {
      currency
      id
      orderId
      total
      lines {
        currency
        productHid
        productName
        quantity
        price
      }
    }
  }
`;
// SELF_STORE_ORDER_EVENT_CREATE
export const SELF_STORE_ORDER_EVENT_CREATE_BY_CUSTOMER = gql`
  mutation selfStoreOrderEventCreateByCustomer(
    $userId: Int!
    $siteId: Int!
    $orderId: Int!
    $eventType: Int!
    $note: String!
  ) {
    selfStoreOrderEventCreateByCustomer(
      userId: $userId
      siteId: $siteId
      orderId: $orderId
      eventType: $eventType
      note: $note
    ) {
      createdAt
      eventType
      id
      note
    }
  }
`;
// STORE_ORDER_SUBSCRIPTION
export const STORE_ORDER_SUBSCRIPTION = gql`
  subscription storeOrder($channel: String!) {
    storeOrder(channel: $channel) {
      createdAt
      currency
      customerAddress
      customerName
      customerNote
      customerPhone
      id
      isSettle
      orderId
      paid
      profit
      resellAmount
      status
      total
      updatedAt
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE PAYMENT
// ----------------------------------------------------------------------------------------------
// STORE_ORDER_PAYMENT_REQUEST_BY_BPAY
export const STORE_ORDER_PAYMENT_REQUEST_BY_BPAY = gql`
  mutation storeOrderPaymentRequestByBpay($siteId: Int!, $orderId: Int!) {
    storeOrderPaymentRequestByBpay(siteId: $siteId, orderId: $orderId)
  }
`;
// SELF_STORE_ORDER_PAYMENT_REQUEST_BY_CASHBACK
export const SELF_STORE_ORDER_PAYMENT_REQUEST_BY_CASHBACK = gql`
  mutation selfStoreOrderPaymentRequestByCashback(
    $userId: Int!
    $orderId: Int!
    $customerId: Int!
  ) {
    selfStoreOrderPaymentRequestByCashback(
      userId: $userId
      orderId: $orderId
      customerId: $customerId
    ) {
      createdAt
      eventType
      id
      note
    }
  }
`;
// STORE_ORDER_PAYMENT_REQUEST
export const STORE_ORDER_PAYMENT_REQUEST = gql`
  mutation storeOrderPaymentRequest(
    $siteId: Int!
    $gatewayId: Int!
    $amount: Float!
    $callBack: String
    $cancelUrl: String!
    $currency: String!
    $customerAddress: String
    $customerName: String!
    $customerPhone: String
    $emiDuration: Int!
    $emiInterest: Float!
    $failUrl: String!
    $isCardTransaction: Boolean!
    $isCodPayment: Boolean!
    $isEmi: Boolean!
    $merchantId: Int!
    $message: String
    $optionA: String
    $optionB: String
    $optionC: String
    $optionD: String
    $optionE: String
    $otherUrl: String
    $payeeSource: String!
    $paymentId: String
    $productInfo: String!
    $referenceId: String!
    $shipAddress: String
    $showRefundButton: Boolean!
    $successUrl: String!
    $transactionSource: String
    $transactionType: Int!
  ) {
    storeOrderPaymentRequest(
      siteId: $siteId
      gatewayId: $gatewayId
      data: {
        amount: $amount
        callBack: $callBack
        cancelUrl: $cancelUrl
        currency: $currency
        customerAddress: $customerAddress
        customerName: $customerName
        customerPhone: $customerPhone
        emiDuration: $emiDuration
        emiInterest: $emiInterest
        failUrl: $failUrl
        isCardTransaction: $isCardTransaction
        isCodPayment: $isCodPayment
        isEmi: $isEmi
        merchantId: $merchantId
        message: $message
        optionA: $optionA
        optionB: $optionB
        optionC: $optionC
        optionD: $optionD
        optionE: $optionE
        otherUrl: $otherUrl
        payeeSource: $payeeSource
        paymentId: $paymentId
        productInfo: $productInfo
        referenceId: $referenceId
        shipAddress: $shipAddress
        showRefundButton: $showRefundButton
        successUrl: $successUrl
        transactionSource: $transactionSource
        transactionType: $transactionType
      }
    ) {
      amount
      callBack
      cancelUrl
      currency
      customerName
      displayValue
      failUrl
      id
      isCaptured
      isPaid
      merchantId
      productInfo
      referenceId
      showRefundButton
      status
      successUrl
      transactionType
    }
  }
`;
// PAY_TRANSACTION_SUBSCRIPTION
export const PAY_TRANSACTION_SUBSCRIPTION = gql`
  subscription payTransaction($channel: String!) {
    payTransaction(channel: $channel) {
      amount
      callBack
      cancelUrl
      currency
      customerName
      displayValue
      failUrl
      id
      isCaptured
      isPaid
      merchantId
      productInfo
      referenceId
      showRefundButton
      status
      successUrl
      transactionType
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE_ORDER_PAYMENTS
// ----------------------------------------------------------------------------------------------
// STORE_ORDER_PAYMENTS
export const STORE_ORDER_PAYMENTS = gql`
  query ($siteId: Int!, $customerId: Int, $after: String) {
    storeOrderPayments(
      siteId: $siteId
      customerId: $customerId
      after: $after
    ) {
      total
      edges {
        node {
          createdAt
          customerId
          customerPhone
          customerTitle
          hid
          id
          isPaid
          status
          total
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
// STORE_ORDER_PAYMENT_DETAILS
export const STORE_ORDER_PAYMENT_DETAILS = gql`
  query ($siteId: Int!, $id: Int!) {
    storeOrderPayment(siteId: $siteId, id: $id) {
      createdAt
      customerId
      customerPhone
      customerTitle
      hid
      id
      invoiceId
      isPaid
      isSettle
      note
      orderIds
      orders {
        customerPhone
        customerTitle
        id
        logisticsCharge
        resellerCommission
        total
      }
      paymentDate
      paymentId
      paymentNo
      paymentTitle
      siteId
      status
      total
      updatedAt
    }
  }
`;

// SELF_STORE_ORDER_PAYMENT_CREATE
export const SELF_STORE_ORDER_PAYMENT_CREATE = gql`
  mutation selfStoreOrderPaymentCreate(
    $userId: Int!
    $siteId: Int!
    $customerId: Int!
    $queryType: String!
  ) {
    selfStoreOrderPaymentCreate(
      userId: $userId
      siteId: $siteId
      customerId: $customerId
      queryType: $queryType
    )
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        SITE_FEEDBACKS
// ----------------------------------------------------------------------------------------------
// SITE_FEEDBACKS
export const SITE_FEEDBACKS = gql`
  query (
    $siteId: Int!
    $userId: Int
    $status: Int
    $priority: Int
    $search: String
    $after: String
    $first: Int
  ) {
    siteFeedbacks(
      siteId: $siteId
      userId: $userId
      status: $status
      priority: $priority
      search: $search
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          body
          contact
          id
          name
          priority
          source
          hid
          status
          title
          updatedAt
          createdAt
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

// SELF_SITE_FEEDBACK_CREATE
export const SELF_SITE_FEEDBACK_CREATE = gql`
  mutation selfSiteFeedbackCreate(
    $userId: Int!
    $siteId: Int!
    $body: String!
    $contact: String!
    $image: Upload
    $name: String!
    $priority: Int!
    $source: String!
    $status: Int!
    $title: String!
  ) {
    selfSiteFeedbackCreate(
      userId: $userId
      data: {
        body: $body
        contact: $contact
        image: $image
        name: $name
        priority: $priority
        siteId: $siteId
        source: $source
        status: $status
        title: $title
      }
    ) {
      id
    }
  }
`;
// SELF_SITE_FEEDBACK_UPDATE
export const SELF_SITE_FEEDBACK_UPDATE = gql`
  mutation selfSiteFeedbackUpdate(
    $userId: Int!
    $feedbackId: Int!
    $body: String!
    $contact: String!
    $image: Upload
    $name: String!
    $priority: Int!
    $source: String!
    $status: Int!
    $title: String!
  ) {
    selfSiteFeedbackUpdate(
      userId: $userId
      feedbackId: $feedbackId
      data: {
        body: $body
        contact: $contact
        image: $image
        name: $name
        priority: $priority
        source: $source
        status: $status
        title: $title
      }
    ) {
      id
    }
  }
`;

// SELF_SITE_FEEDBACK_DELETE
export const SELF_SITE_FEEDBACK_DELETE = gql`
  mutation selfSiteFeedbackDelete($userId: Int!, $feedbackId: Int!) {
    selfSiteFeedbackDelete(userId: $userId, feedbackId: $feedbackId)
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        USER ME
// ----------------------------------------------------------------------------------------------
// ME
export const ME = gql`
  query {
    me {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isStaff
      latitude
      longitude
      name
      phone
      referCode
      referedCode
      username
    }
  }
`;
// ME_DETAILS
export const ME_DETAILS = gql`
  query {
    me {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isStaff
      latitude
      longitude
      name
      phone
      referCode
      referedCode
      username
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        USER AUTH
// ----------------------------------------------------------------------------------------------
// USER_PHONE_INFO
export const USER_PHONE_INFO = gql`
  query ($countryCode: String!, $phone: String!) {
    userPhoneInfo(countryCode: $countryCode, phone: $phone) {
      isValid
      phone
    }
  }
`;
// USER_UPDATE
export const USER_UPDATE = gql`
  mutation userUpdate(
    $userId: Int!
    $address: String
    $avatar: Upload
    $country: Int!
    $currency: String!
    $formattedAddress: String
    $latitude: Float
    $longitude: Float
    $name: String!
    $referedCode: String
  ) {
    userUpdate(
      userId: $userId
      data: {
        address: $address
        avatar: $avatar
        country: $country
        currency: $currency
        formattedAddress: $formattedAddress
        latitude: $latitude
        longitude: $longitude
        name: $name
        referedCode: $referedCode
      }
    ) {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isStaff
      latitude
      longitude
      name
      phone
      referCode
      referedCode
      username
    }
  }
`;
// ------------------------- Shop ----------------------
// SELF_STORE_SHOP
export const SELF_STORE_SHOP = gql`
  query ($userId: Int!, $siteId: Int!) {
    selfStoreShop(userId: $userId, siteId: $siteId) {
      address
      brands
      categories
      cover
      description
      due
      email
      expectedSale
      features
      fee
      followers
      hid
      id
      isActive
      isPublic
      isVerified
      lastPayment
      latitude
      logo
      longitude
      note
      ordersCancelled
      ordersConfirmed
      ordersDelivered
      ordersOnTheWay
      ordersPackaging
      ordersPending
      ordersPlaced
      ordersRejected
      ordersReturned
      ordersShipment
      ordersStation
      ordersTotal
      paid
      payable
      phone
      priority
      products
      sale
      shopType
      slogan
      slug
      street
      subCategories
      thumbnail
      title
      transaction
      translation
    }
  }
`;
// SELF_STORE_SHOP_CREATE
export const SELF_STORE_SHOP_CREATE = gql`
  mutation selfStoreShopCreate(
    $userId: Int!
    $siteId: Int!
    $address: String
    $brands: [Int]!
    $categories: [Int]!
    $country: Int!
    $cover: Upload
    $description: String!
    $email: String
    $features: String!
    $latitude: Float!
    $logo: Upload
    $longitude: Float!
    $phone: Int
    $shopType: Int!
    $slogan: String
    $slug: String!
    $street: String
    $thumbnail: Upload
    $title: String!
    $subCategories: [Int]!
    $translation: String!
  ) {
    selfStoreShopCreate(
      userId: $userId
      siteId: $siteId
      data: {
        address: $address
        brands: $brands
        categories: $categories
        country: $country
        cover: $cover
        description: $description
        email: $email
        features: $features
        latitude: $latitude
        logo: $logo
        longitude: $longitude
        phone: $phone
        slogan: $slogan
        shopType: $shopType
        subCategories: $subCategories
        slug: $slug
        street: $street
        thumbnail: $thumbnail
        title: $title
        translation: $translation
      }
    ) {
      address
      brands
      categories
      cover
      description
      due
      email
      expectedSale
      features
      fee
      followers
      hid
      id
      isActive
      isPublic
      isVerified
      lastPayment
      latitude
      logo
      longitude
      note
      ordersCancelled
      ordersConfirmed
      ordersDelivered
      ordersOnTheWay
      ordersPackaging
      ordersPending
      ordersPlaced
      ordersRejected
      ordersReturned
      ordersShipment
      ordersStation
      ordersTotal
      paid
      payable
      phone
      priority
      products
      sale
      shopType
      slogan
      slug
      street
      subCategories
      thumbnail
      title
      transaction
      translation
    }
  }
`;
// SELF_STORE_SHOP_UPDATE
export const SELF_STORE_SHOP_UPDATE = gql`
  mutation selfStoreShopUpdate(
    $userId: Int!
    $id: Int!
    $address: String
    $cover: Upload
    $description: String!
    $email: String
    $features: String!
    $logo: Upload
    $phone: Int
    $slogan: String
    $slug: String!
    $street: String
    $thumbnail: Upload
    $tinCertificate: String
    $title: String!
    $tradeLicense: String
  ) {
    selfStoreShopUpdate(
      userId: $userId
      id: $id
      data: {
        address: $address
        cover: $cover
        description: $description
        email: $email
        features: $features
        logo: $logo
        phone: $phone
        slogan: $slogan
        slug: $slug
        street: $street
        thumbnail: $thumbnail
        tinCertificate: $tinCertificate
        title: $title
        tradeLicense: $tradeLicense
      }
    ) {
      address
      brands
      categories
      cover
      description
      due
      email
      expectedSale
      features
      fee
      followers
      hid
      id
      isActive
      isPublic
      isVerified
      lastPayment
      latitude
      logo
      longitude
      note
      ordersCancelled
      ordersConfirmed
      ordersDelivered
      ordersOnTheWay
      ordersPackaging
      ordersPending
      ordersPlaced
      ordersRejected
      ordersReturned
      ordersShipment
      ordersStation
      ordersTotal
      paid
      payable
      phone
      priority
      products
      sale
      shopType
      slogan
      slug
      street
      subCategories
      thumbnail
      title
      transaction
      translation
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        HOME QRCODE
// ----------------------------------------------------------------------------------------------
// HOME_QRCODE
export const HOME_QRCODE = gql`
  query ($data: String!) {
    homeQrcode(data: $data)
  }
`;
// HOME_LOCATION_SUGGESTION
export const HOME_LOCATION_SUGGESTION = gql`
  query ($place: String!, $sessionToken: String!) {
    homeLocationSuggestion(place: $place, sessionToken: $sessionToken) {
      description
      placeId
    }
  }
`;
// HOME_LOCATION_PLACE
export const HOME_LOCATION_PLACE = gql`
  query ($placeId: String!, $sessionToken: String!) {
    homeLocationPlace(placeId: $placeId, sessionToken: $sessionToken) {
      address
      latitude
      longitude
    }
  }
`;
// ------------------------- Affiliate ----------------------
// SELF_AFFILIATE_ACCOUNT
export const SELF_AFFILIATE_ACCOUNT = gql`
  query ($userId: Int!) {
    selfAffiliateAccount(userId: $userId) {
      audienceSize
      billAddress
      billingAddress
      id
      isActive
      phone
      primarilySource
      refer
      strategy
    }
  }
`;
// SELF_AFFILIATE_ACCOUNT_CREATE
export const SELF_AFFILIATE_ACCOUNT_CREATE = gql`
  mutation selfAffiliateAccountCreate(
    $userId: Int!
    $accountType: Int!
    $additionalPhone: String!
    $audienceSize: Int!
    $billAddress: String!
    $billingAddress: String!
    $phone: Int!
    $primarilyChannel: Int!
    $primarilySource: String
    $referedCode: String!
    $strategy: String!
  ) {
    selfAffiliateAccountCreate(
      userId: $userId
      data: {
        accountType: $accountType
        additionalPhone: $additionalPhone
        audienceSize: $audienceSize
        billAddress: $billAddress
        billingAddress: $billingAddress
        phone: $phone
        primarilyChannel: $primarilyChannel
        primarilySource: $primarilySource
        referedCode: $referedCode
        strategy: $strategy
      }
    ) {
      accountType
      isActive
      additionalPhone
      billAddress
      billingAddress
      id
      phone
      primarilyChannel
      primarilySource
      referedCode
      strategy
      updatedAt
    }
  }
`;

// ------------------------------------------------------------------
// LOGIN
export const LOGIN = gql`
  mutation login($id: Int!, $password: String!, $parentId: Int) {
    login(id: $id, password: $password, parentId: $parentId) {
      message
      token
    }
  }
`;
// LOGIN_BY_OTP
export const LOGIN_BY_OTP = gql`
  mutation loginByOtp($id: Int!, $otp: Int!) {
    loginByOtp(id: $id, otp: $otp)
  }
`;
// JOIN
export const JOIN = gql`
  mutation join(
    $country: Int!
    $currency: String!
    $firstName: String!
    $language: String!
    $lastName: String!
    $name: String!
    $password: String!
    $phone: Int!
    $referedCode: String
    $source: String
    $username: String!
    $sourceId: Int
  ) {
    join(
      data: {
        country: $country
        currency: $currency
        firstName: $firstName
        language: $language
        lastName: $lastName
        name: $name
        password: $password
        phone: $phone
        referedCode: $referedCode
        source: $source
        username: $username
      }
      sourceId: $sourceId
    ) {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isStaff
      isActive
      latitude
      longitude
      name
      phone
      referCode
      referedCode
      username
    }
  }
`;
// USER_IS_UNIQUE_EMAIL
export const USER_IS_UNIQUE_EMAIL = gql`
  query ($email: String!) {
    userIsUniqueEmail(email: $email)
  }
`;
// USER_IS_UNIQUE_PHONE
export const USER_IS_UNIQUE_PHONE = gql`
  query ($phone: Int!) {
    userIsUniquePhone(phone: $phone)
  }
`;
// USER_CHECK
export const USER_CHECK = gql`
  query ($data: String!) {
    userCheck(data: $data) {
      email
      id
      isActive
      phone
      referCode
    }
  }
`;
// USER_BY_HID
export const USER_BY_HID = gql`
  query ($hid: String!) {
    userByHid(hid: $hid) {
      email
      phone
      isActive
      referCode
    }
  }
`;
// USER_INFO
export const USER_INFO = gql`
  query ($countryCode: String!) {
    userInfo(countryCode: $countryCode) {
      country
      countryCode
      countryName
      currency
      language
    }
  }
`;
// USER_PASSWORD_UPDATE
export const USER_PASSWORD_UPDATE = gql`
  mutation userPasswordUpdate($id: Int!, $old: String!, $new: String!) {
    userPasswordUpdate(data: { id: $id, old: $old, new: $new }) {
      id
    }
  }
`;
// USER_OTP_PASSWORD_UPDATE
export const USER_OTP_PASSWORD_UPDATE = gql`
  mutation userOtpPasswordUpdate(
    $id: Int!
    $email: String!
    $otp: Int!
    $new: String!
  ) {
    userOtpPasswordUpdate(
      id: $id
      data: { email: $email, otp: $otp, new: $new }
    ) {
      id
    }
  }
`;
// USER_ACTIVE_UPDATE
export const USER_ACTIVE_UPDATE = gql`
  mutation userActiveUpdate($id: Int!, $otp: Int!) {
    userActiveUpdate(id: $id, otp: $otp) {
      id
      isActive
    }
  }
`;
// USER_OTP_UPDATE
export const USER_OTP_UPDATE = gql`
  mutation userOtpUpdate($id: Int!, $source: String!, $sourceId: Int) {
    userOtpUpdate(id: $id, source: $source, sourceId: $sourceId) {
      id
      isActive
    }
  }
`;
