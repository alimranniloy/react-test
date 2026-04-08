import gql from "graphql-tag";
// SITES
export const SITES = gql`
  query (
    $siteType: String
    $createdById: Int
    $parentId: Int
    $queryType: String
    $isVerified: Boolean
    $industry: Int
    $after: String
    $first: Int
  ) {
    sites(
      siteType: $siteType
      createdById: $createdById
      parentId: $parentId
      queryType: $queryType
      isVerified: $isVerified
      industry: $industry
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          country
          createdAt
          currency
          desktopLogo
          domain
          favicon
          hostname
          id
          industry
          isActive
          percentage
          phone
          street
          title
          updatedAt
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
export const SITE_IS_EXISTS = gql`
  query ($hostname: String!) {
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
      schema
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
      createdById
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
// SITE_DETAILS
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
      schema
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
    }
  }
`;

// SITE_SCHEMA_DETAILS
export const SITE_SCHEMA_DETAILS = gql`
  query ($id: Int!) {
    siteById(id: $id) {
      address
      coverImage
      createdAt
      createdById
      desktopLogo
      desktopTheme
      domain
      email
      favicon
      hostname
      id
      metaDescription
      metaTitle
      phone
      phoneLogo
      schema
      siteInfo
      siteType
      street
      theme
      title
      version
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
    $schema: JSON
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
        schema: $schema
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
    $isTheme: Boolean
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
    $schema: JSON
    $sendSmsPerEvent: Boolean
    $sendSmsPerOrder: Boolean
    $social: JSON
    $street: String
    $siteInfo: String
    $siteType: String
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
        isTheme: $isTheme
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
        schema: $schema
        siteInfo: $siteInfo
        siteType: $siteType
        sendSmsPerEvent: $sendSmsPerEvent
        sendSmsPerOrder: $sendSmsPerOrder
        social: $social
        street: $street
        theme: $theme
        title: $title
        tools: $tools
      }
    ) {
      id
      createdById
      title
      schema
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

  // ----------------------------------------------------------------------------------------------
  //                                        SITE_COMPONENT_CATEGORIES
  // ----------------------------------------------------------------------------------------------
// SITE_COMPONENT_CATEGORIES
export const SITE_COMPONENT_CATEGORIES = gql`
  query ($after: String, $first: Int) {
    siteComponentCategories(after: $after, first: $first) {
      total
      edges {
        node {
          description
          id
          isActive
          slug
          title
          priority
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

// ----------------------------------------------------------------------------------------------
//                                        SITE_COMPONENTS
// ----------------------------------------------------------------------------------------------
// SITE_COMPONENTS
export const SITE_COMPONENTS = gql`
  query ($after: String, $first: Int) {
    siteComponents(after: $after, first: $first) {
      total
      edges {
        node {
          categoryId
          description
          id
          image
          priority
          slug
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

// SITE_COMPONENT
export const SITE_COMPONENT = gql`
  query ($id: Int!) {
    siteComponent(id: $id) {
      categoryId
      component
      componentData
      description
      id
      image
      isActive
      priority
      settings
      slug
      title
      updatedAt
    }
  }
`;

// SELF_SITE_COMPONENT_CREATE
export const SELF_SITE_COMPONENT_CREATE = gql`
  mutation selfSiteComponentCreate(
    $userId: Int!
    $categoryId: Int!
    $component: String!
    $componentData: JSON!
    $description: String!
    $image: Upload!
    $isActive: Boolean
    $priority: Int!
    $settings: JSON!
    $slug: String!
    $title: String!
  ) {
    selfSiteComponentCreate(
      userId: $userId
      data: {
        categoryId: $categoryId
        component: $component
        componentData: $componentData
        description: $description
        image: $image
        isActive: $isActive
        priority: $priority
        settings: $settings
        slug: $slug
        title: $title
      }
    ) {
      id
    }
  }
`;

// SELF_SITE_COMPONENT_UPDATE
export const SELF_SITE_COMPONENT_UPDATE = gql`
  mutation selfSiteComponentUpdate(
    $userId: Int!
    $componentId: Int!
    $categoryId: Int
    $component: String
    $componentData: JSON
    $description: String
    $image: Upload
    $isActive: Boolean
    $priority: Int
    $settings: JSON
    $slug: String
    $title: String
  ) {
    selfSiteComponentUpdate(
      userId: $userId
      componentId: $componentId
      data: {
        categoryId: $categoryId
        component: $component
        componentData: $componentData
        description: $description
        image: $image
        isActive: $isActive
        priority: $priority
        settings: $settings
        slug: $slug
        title: $title
      }
    ) {
      id
    }
  }
`;

// SELF_SITE_COMPONENT_UPDATE
export const SELF_SITE_COMPONENT_DELETE = gql`
  mutation selfSiteComponentDelete($userId: Int!, $componentId: Int!) {
    selfSiteComponentDelete(userId: $userId, componentId: $componentId)
  }
`;
