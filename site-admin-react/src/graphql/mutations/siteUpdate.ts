import { gql } from "@apollo/client";

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
    $hostname: String
    $industry: Int
    $isActive: Boolean
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
        hostname: $hostname
        industry: $industry
        isActive: $isActive
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
      title
      domain
      hostname
      favicon
      desktopLogo
      phoneLogo
      metaTitle
      metaDescription
      address
      street
      email
      phone
      schema
    }
  }
`;
