import { gql } from "@apollo/client";

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
          isPublic
          isTheme
          percentage
          phone
          siteType
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

export const SITE_IS_EXISTS = gql`
  query ($hostname: String!) {
    siteSiteIsExists(hostname: $hostname) {
      exists
    }
  }
`;

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
      isThirdParty
      itemLimit
      kanban
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
        authorId
        id
        isActive
        isAuto
        isFixed
        parentId
        percentage
        publisherId
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
      foot
      head
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
      locale
      currency
      meta
      notice
      social
      navigation
      tools
      isOtp
      isGuest
      isPublic
      isActive
      isFraudCheck
      fraudTransactionLimit
      fraudWindowTime
      isTheme
      parent {
        id
        title
      }
      parents
    }
  }
`;

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
      isThirdParty
      itemLimit
      kanban
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
        authorId
        id
        isActive
        isAuto
        isFixed
        parentId
        percentage
        publisherId
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

export const SELF_SITE_UPDATE = gql`
  mutation selfSiteUpdate(
    $userId: Int!
    $siteId: Int!
    $address: String
    $title: String
    $completedStep: [Int]
    $head: String
    $foot: String
    $pixel: String
    $token: String
    $theme: String
    $desktopTheme: String
    $metaTitle: String
    $metaDescription: String
    $email: String
    $phone: String
    $street: String
    $locale: String
    $currency: String
    $notice: String
    $favicon: String
    $desktopLogo: String
    $phoneLogo: String
    $coverImage: String
    $isOtp: Boolean
    $isGuest: Boolean
    $isPublic: Boolean
    $isActive: Boolean
    $isFraudCheck: Boolean
    $fraudTransactionLimit: Float
    $fraudWindowTime: Int
    $sendSmsPerEvent: Int
    $sendSmsPerOrder: Int
    $navigation: JSON
    $social: JSON
    $tools: JSON
    $domain: String
    $hostname: String
  ) {
    selfSiteUpdate(
      userId: $userId
      siteId: $siteId
      data: {
        address: $address
        title: $title
        completedStep: $completedStep
        head: $head
        foot: $foot
        pixel: $pixel
        token: $token
        theme: $theme
        desktopTheme: $desktopTheme
        metaTitle: $metaTitle
        metaDescription: $metaDescription
        email: $email
        phone: $phone
        street: $street
        locale: $locale
        currency: $currency
        notice: $notice
        favicon: $favicon
        desktopLogo: $desktopLogo
        phoneLogo: $phoneLogo
        coverImage: $coverImage
        isOtp: $isOtp
        isGuest: $isGuest
        isPublic: $isPublic
        isActive: $isActive
        isFraudCheck: $isFraudCheck
        fraudTransactionLimit: $fraudTransactionLimit
        fraudWindowTime: $fraudWindowTime
        sendSmsPerEvent: $sendSmsPerEvent
        sendSmsPerOrder: $sendSmsPerOrder
        navigation: $navigation
        social: $social
        tools: $tools
        domain: $domain
        hostname: $hostname
      }
    ) {
      id
      title
      address
      completedStep
      domain
      hostname
      favicon
      desktopLogo
      phoneLogo
      isWhiteLabel
      isOtp
      isActive
    }
  }
`;
