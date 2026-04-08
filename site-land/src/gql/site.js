import gql from 'graphql-tag'
// SITES
export const SITES = gql`
  query ($parentId: Int!, $after: String, $first: Int) {
    sites(parentId: $parentId, first: $first, after: $after) {
      total
      edges {
        node {
          favicon
          createdAt
          domain
          hostname
          id
          isActive
          percentage
          phone
          street
          title
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
// SITE_IS_EXISTS
export const SITE_IS_EXISTS = gql `
query($hostname: String!) {
  siteSiteIsExists(hostname: $hostname) {
    exists
  }
}
`;
// SITE
export const SITE = gql`
  query ($domain: String!) {
    site(domain: $domain) {
      address
      androidApp
      affiliate {
        commission
        id
        serial
        title
      }
      affiliateCommission
      affiliateJoinCommission
      affiliateJoinFee
      affiliateJoinType
      affiliateType
      bpayMerchantId
      completedStep
      coverImage
      createdAt
      createdById
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      foot
      fraudTransactionLimit
      fraudWindowTime
      guide
      head
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
      itemLimit
      lastEvent
      lastPayment
      latitude
      locale
      longitude
      meta
      metaDescription
      metaTitle
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
      queryType
      sendSmsPerEvent
      sendSmsPerOrder
      siteInfo
      siteType
      social
      street
      subscription
      subscriptionFee
      theme
      threshold
      title
      tools
      version
      whiteLabel
      whiteLabelUrl
      withdraw
      createdBy {
        address
        avatar
        country
        currency
        email
        firstName
        id
        isStaff
        name
        phone
        username
      }
    }
  }
`;
// SELF_SITE
export const SELF_SITE = gql`
  query ($userId: Int!, $siteType: String!) {
    selfSite(userId: $userId, siteType: $siteType) {
      address
      androidApp
      affiliate {
        commission
        id
        serial
        title
      }
      affiliateCommission
      affiliateJoinCommission
      affiliateJoinFee
      affiliateJoinType
      affiliateType
      bpayMerchantId
      completedStep
      coverImage
      createdAt
      createdById
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      foot
      fraudTransactionLimit
      fraudWindowTime
      guide
      head
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
      itemLimit
      lastEvent
      lastPayment
      latitude
      locale
      longitude
      meta
      metaDescription
      metaTitle
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
      queryType
      sendSmsPerEvent
      sendSmsPerOrder
      siteInfo
      siteType
      social
      street
      subscription
      subscriptionFee
      theme
      threshold
      title
      tools
      version
      whiteLabel
      whiteLabelUrl
      withdraw
      createdBy {
        address
        avatar
        country
        currency
        email
        firstName
        id
        isStaff
        name
        phone
        username
      }
    }
  }
`;
// SITE_DETAILS
export const SITE_DETAILS = gql`
  query ($userId: Int!, $siteType: String!) {
    selfSite(userId: $userId, siteType: $siteType) {
      address
      androidApp
      affiliate {
        commission
        id
        serial
        title
      }
      affiliateCommission
      affiliateJoinCommission
      affiliateJoinFee
      affiliateJoinType
      affiliateType
      bpayMerchantId
      completedStep
      coverImage
      createdAt
      createdById
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      foot
      fraudTransactionLimit
      fraudWindowTime
      guide
      head
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
      itemLimit
      lastEvent
      lastPayment
      latitude
      locale
      longitude
      meta
      metaDescription
      metaTitle
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
      queryType
      sendSmsPerEvent
      sendSmsPerOrder
      siteInfo
      siteType
      social
      street
      subscription
      subscriptionFee
      theme
      threshold
      title
      tools
      version
      whiteLabel
      whiteLabelUrl
      withdraw
      createdBy {
        address
        avatar
        country
        currency
        email
        firstName
        id
        isStaff
        name
        phone
        username
      }
    }
  }
`;
// SITE_PREVIEW
export const SITE_PREVIEW = gql`
  query ($id: Int!) {
    siteById(id: $id) {
      address
      androidApp
      affiliate {
        commission
        id
        serial
        title
      }
      affiliateCommission
      affiliateJoinCommission
      affiliateJoinFee
      affiliateJoinType
      affiliateType
      bpayMerchantId
      completedStep
      coverImage
      createdAt
      createdById
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      foot
      fraudTransactionLimit
      fraudWindowTime
      guide
      head
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
      itemLimit
      lastEvent
      lastPayment
      latitude
      locale
      longitude
      meta
      metaDescription
      metaTitle
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
      queryType
      sendSmsPerEvent
      sendSmsPerOrder
      siteInfo
      siteType
      social
      street
      subscription
      subscriptionFee
      theme
      threshold
      title
      tools
      version
      whiteLabel
      whiteLabelUrl
      withdraw
      createdBy {
        address
        avatar
        country
        currency
        email
        firstName
        id
        isStaff
        name
        phone
        username
      }
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
      address
      androidApp
      affiliate {
        commission
        id
        serial
        title
      }
      affiliateCommission
      affiliateJoinCommission
      affiliateJoinFee
      affiliateJoinType
      affiliateType
      bpayMerchantId
      completedStep
      coverImage
      createdAt
      createdById
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      foot
      fraudTransactionLimit
      fraudWindowTime
      guide
      head
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
      itemLimit
      lastEvent
      lastPayment
      latitude
      locale
      longitude
      meta
      metaDescription
      metaTitle
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
      queryType
      sendSmsPerEvent
      sendSmsPerOrder
      siteInfo
      siteType
      social
      street
      subscription
      subscriptionFee
      theme
      threshold
      title
      tools
      version
      whiteLabel
      whiteLabelUrl
      withdraw
      createdBy {
        address
        avatar
        country
        currency
        email
        firstName
        id
        isStaff
        name
        phone
        username
      }
    }
  }
`;
// SELF_SITE_UPDATE
export const SELF_SITE_UPDATE = gql`
  mutation selfSiteUpdate(
    $userId: Int!
    $siteId: Int!
    $address: String
    $affiliate: JSON
    $affiliateCommission: Float
    $affiliateJoinCommission: Float
    $affiliateJoinFee: Float
    $affiliateJoinType: Int
    $affiliateType: Int
    $completedStep: Int
    $coverImage: Upload
    $currency: String
    $desktopLogo: Upload
    $desktopTheme: String
    $domain: String
    $email: String
    $favicon: Upload
    $foot: String
    $fraudTransactionLimit: Int
    $fraudWindowTime: Int
    $guide: JSON
    $head: String
    $industry: Int
    $isFraudCheck: Boolean
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
    $notice: String
    $parent: JSON
    $parents: [Int]
    $percentage: Float
    $phone: Int
    $phoneLogo: Upload
    $queryType: String
    $sendSmsPerEvent: Boolean
    $sendSmsPerOrder: Boolean
    $social: JSON
    $street: String
    $theme: String
    $title: String
    $tools: JSON
  ) {
    selfSiteUpdate(
      userId: $userId
      siteId: $siteId
      data: {
        address: $address
        affiliate: $affiliate
        affiliateCommission: $affiliateCommission
        affiliateJoinCommission: $affiliateJoinCommission
        affiliateJoinFee: $affiliateJoinFee
        affiliateJoinType: $affiliateJoinType
        affiliateType: $affiliateType
        completedStep: $completedStep
        coverImage: $coverImage
        currency: $currency
        desktopLogo: $desktopLogo
        desktopTheme: $desktopTheme
        domain: $domain
        email: $email
        favicon: $favicon
        foot: $foot
        fraudTransactionLimit: $fraudTransactionLimit
        fraudWindowTime: $fraudWindowTime
        guide: $guide
        head: $head
        industry: $industry
        isFraudCheck: $isFraudCheck
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
        notice: $notice
        parent: $parent
        parents: $parents
        percentage: $percentage
        phone: $phone
        phoneLogo: $phoneLogo
        queryType: $queryType
        sendSmsPerEvent: $sendSmsPerEvent
        sendSmsPerOrder: $sendSmsPerOrder
        social: $social
        street: $street
        theme: $theme
        title: $title
        tools: $tools
      }
    ) {
      address
      androidApp
      affiliate {
        commission
        id
        serial
        title
      }
      affiliateCommission
      affiliateJoinCommission
      affiliateJoinFee
      affiliateJoinType
      affiliateType
      bpayMerchantId
      completedStep
      coverImage
      createdAt
      createdById
      currency
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      foot
      fraudTransactionLimit
      fraudWindowTime
      guide
      head
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
      itemLimit
      lastEvent
      lastPayment
      latitude
      locale
      longitude
      meta
      metaDescription
      metaTitle
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
      queryType
      sendSmsPerEvent
      sendSmsPerOrder
      siteInfo
      siteType
      social
      street
      subscription
      subscriptionFee
      theme
      threshold
      title
      tools
      version
      whiteLabel
      whiteLabelUrl
      withdraw
      createdBy {
        address
        avatar
        country
        currency
        email
        firstName
        id
        isStaff
        name
        phone
        username
      }
    }
  }
`;

// SELF_SITE_PARENT_UPDATE
export const SELF_SITE_PARENT_UPDATE = gql`
mutation selfSiteParentUpdate(
  $userId: Int!
  $parentId: Int!
  $siteId: Int!
  $parent: JSON!
) {
  selfSiteParentUpdate(
    userId: $userId
    parentId: $parentId
    siteId: $siteId
    parent: $parent
  ) {
    id
    createdById
  }
}

`;
// SITE_NOTIFICATION_SUBSCRIPTION
export const SITE_NOTIFICATION_SUBSCRIPTION = gql `
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