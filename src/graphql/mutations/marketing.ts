import { gql } from "@apollo/client";

export const SELF_STORE_CAMPAIGN_CREATE = gql`
  mutation selfStoreCampaignCreate(
    $userId: Int!
    $siteId: Int!
    $description: String!
    $cover: Upload
    $endAt: DateTime!
    $image: Upload!
    $isActive: Boolean!
    $isHome: Boolean!
    $isPrivate: Boolean!
    $priority: Int!
    $priorityHome: Int!
    $queryType: String!
    $title: String!
    $translation: String!
  ) {
    selfStoreCampaignCreate(
      userId: $userId
      siteId: $siteId
      data: {
        description: $description
        cover: $cover
        endAt: $endAt
        image: $image
        isActive: $isActive
        isHome: $isHome
        isPrivate: $isPrivate
        priority: $priority
        priorityHome: $priorityHome
        queryType: $queryType
        title: $title
        translation: $translation
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_CAMPAIGN_UPDATE = gql`
  mutation selfStoreCampaignUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $cover: Upload
    $description: String
    $endAt: DateTime
    $image: Upload
    $isActive: Boolean
    $isHome: Boolean
    $isPrivate: Boolean
    $priority: Int
    $priorityHome: Int
    $queryType: String
    $title: String
    $translation: String
  ) {
    selfStoreCampaignUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        cover: $cover
        description: $description
        endAt: $endAt
        image: $image
        isActive: $isActive
        isHome: $isHome
        isPrivate: $isPrivate
        priority: $priority
        priorityHome: $priorityHome
        queryType: $queryType
        title: $title
        translation: $translation
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_CAMPAIGN_DELETE = gql`
  mutation selfStoreCampaignDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreCampaignDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;

export const SELF_STORE_COLLECTION_CREATE = gql`
  mutation selfStoreCollectionCreate(
    $userId: Int!
    $siteId: Int!
    $description: String!
    $cover: Upload
    $image: Upload!
    $isActive: Boolean!
    $isExternal: Boolean!
    $isHome: Boolean!
    $isPrivate: Boolean!
    $priority: Int!
    $priorityHome: Int!
    $queryType: String!
    $title: String!
    $translation: String!
    $url: String!
  ) {
    selfStoreCollectionCreate(
      userId: $userId
      siteId: $siteId
      data: {
        description: $description
        cover: $cover
        image: $image
        isActive: $isActive
        isExternal: $isExternal
        isHome: $isHome
        isPrivate: $isPrivate
        priority: $priority
        priorityHome: $priorityHome
        queryType: $queryType
        title: $title
        translation: $translation
        url: $url
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_COLLECTION_UPDATE = gql`
  mutation selfStoreCollectionUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $cover: Upload
    $description: String
    $image: Upload
    $isActive: Boolean
    $isExternal: Boolean
    $isHome: Boolean!
    $isPrivate: Boolean
    $priority: Int
    $priorityHome: Int
    $queryType: String
    $title: String
    $translation: String
    $url: String
  ) {
    selfStoreCollectionUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        cover: $cover
        description: $description
        image: $image
        isActive: $isActive
        isExternal: $isExternal
        isHome: $isHome
        isPrivate: $isPrivate
        priority: $priority
        priorityHome: $priorityHome
        queryType: $queryType
        title: $title
        translation: $translation
        url: $url
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_COLLECTION_DELETE = gql`
  mutation selfStoreCollectionDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreCollectionDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;

export const SELF_STORE_VOUCHER_CREATE = gql`
  mutation selfStoreVoucherCreate(
    $userId: Int!
    $siteId: Int!
    $applyOn: Boolean!
    $applyOncePerCustomer: Boolean!
    $code: String!
    $collectionId: Int
    $currency: String!
    $description: String!
    $discount: Float!
    $endDate: DateTime
    $html: JSON!
    $isActive: Boolean!
    $isAuto: Boolean!
    $isPublic: Boolean!
    $maxDiscount: Float
    $minQuantity: Int!
    $minSpent: Float!
    $products: [Int]
    $title: String!
    $translation: String!
    $usageLimit: Int!
    $voucherType: Int!
  ) {
    selfStoreVoucherCreate(
      userId: $userId
      siteId: $siteId
      data: {
        applyOn: $applyOn
        applyOncePerCustomer: $applyOncePerCustomer
        code: $code
        collectionId: $collectionId
        currency: $currency
        description: $description
        discount: $discount
        endDate: $endDate
        html: $html
        isActive: $isActive
        isAuto: $isAuto
        isPublic: $isPublic
        maxDiscount: $maxDiscount
        minQuantity: $minQuantity
        minSpent: $minSpent
        products: $products
        title: $title
        translation: $translation
        usageLimit: $usageLimit
        voucherType: $voucherType
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_VOUCHER_UPDATE = gql`
  mutation selfStoreVoucherUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $applyOn: Boolean
    $applyOncePerCustomer: Boolean
    $code: String
    $currency: String
    $description: String
    $endDate: DateTime
    $discount: Float
    $html: JSON
    $isActive: Boolean
    $isAuto: Boolean
    $isPublic: Boolean
    $maxDiscount: Float
    $minQuantity: Int
    $minSpent: Float
    $products: [Int]
    $title: String
    $translation: String
    $usageLimit: Int
    $voucherType: Int
  ) {
    selfStoreVoucherUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        applyOn: $applyOn
        applyOncePerCustomer: $applyOncePerCustomer
        code: $code
        currency: $currency
        description: $description
        endDate: $endDate
        discount: $discount
        html: $html
        isActive: $isActive
        isAuto: $isAuto
        isPublic: $isPublic
        maxDiscount: $maxDiscount
        minQuantity: $minQuantity
        minSpent: $minSpent
        products: $products
        title: $title
        translation: $translation
        usageLimit: $usageLimit
        voucherType: $voucherType
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_VOUCHER_DELETE = gql`
  mutation selfStoreVoucherDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreVoucherDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;

export const SELF_SITE_SLIDER_CREATE = gql`
  mutation selfSiteSliderCreate(
    $userId: Int!
    $siteId: Int!
    $body: String!
    $cover: Upload!
    $isActive: Boolean!
    $isExternal: Boolean!
    $isPhone: Boolean!
    $isPrivate: Boolean!
    $priority: Int!
    $title: String!
    $url: String!
  ) {
    selfSiteSliderCreate(
      userId: $userId
      siteId: $siteId
      data: {
        body: $body
        cover: $cover
        isActive: $isActive
        isExternal: $isExternal
        isPhone: $isPhone
        isPrivate: $isPrivate
        priority: $priority
        title: $title
        url: $url
      }
    ) {
      id
    }
  }
`;

export const SELF_SITE_SLIDER_UPDATE = gql`
  mutation selfSiteSliderUpdate(
    $userId: Int!
    $id: Int!
    $title: String
    $body: String
    $cover: Upload
    $url: String
    $isActive: Boolean
    $isExternal: Boolean
    $isPhone: Boolean
    $priority: Int
    $isPrivate: Boolean
  ) {
    selfSiteSliderUpdate(
      userId: $userId
      id: $id
      data: {
        title: $title
        body: $body
        cover: $cover
        url: $url
        isActive: $isActive
        isExternal: $isExternal
        isPhone: $isPhone
        isPrivate: $isPrivate
        priority: $priority
      }
    ) {
      id
    }
  }
`;

export const SELF_SITE_SLIDER_DELETE = gql`
  mutation selfSiteSliderDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfSiteSliderDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;

export const SELF_STORE_FEATURE_CREATE = gql`
  mutation selfStoreFeatureCreate(
    $userId: Int!
    $feature: JSON!
    $isActive: Boolean!
    $keyword: String!
    $priority: Int!
    $title: String!
  ) {
    selfStoreFeatureCreate(
      userId: $userId
      data: {
        createdById: $userId
        feature: $feature
        isActive: $isActive
        keyword: $keyword
        priority: $priority
        title: $title
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_FEATURE_UPDATE = gql`
  mutation selfStoreFeatureUpdate(
    $userId: Int!
    $id: Int!
    $feature: JSON
    $isActive: Boolean
    $keyword: String
    $priority: Int
    $title: String
  ) {
    selfStoreFeatureUpdate(
      userId: $userId
      id: $id
      data: {
        feature: $feature
        isActive: $isActive
        keyword: $keyword
        priority: $priority
        title: $title
      }
    ) {
      id
    }
  }
`;

export const SELF_STORE_FEATURE_DELETE = gql`
  mutation selfStoreFeatureDelete($userId: Int!, $id: Int!) {
    selfStoreFeatureDelete(userId: $userId, id: $id)
  }
`;

export const BLOG_POST_CREATE = gql`
  mutation selfSiteBlogPostCreate($userId: Int!, $data: BlogPostCreate!) {
    selfSiteBlogPostCreate(userId: $userId, data: $data) {
      id
    }
  }
`;

export const BLOG_POST_UPDATE = gql`
  mutation selfSiteBlogPostUpdate($userId: Int!, $siteId: Int!, $id: Int!, $data: BlogPostUpdate!) {
    selfSiteBlogPostUpdate(userId: $userId, siteId: $siteId, id: $id, data: $data) {
      id
    }
  }
`;

export const BLOG_POST_DELETE = gql`
  mutation selfSiteBlogPostDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfSiteBlogPostDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;

export const SELF_SITE_NOTIFICATION_CREATE = gql`
  mutation selfSiteNotificationCreate(
    $userId: Int!
    $siteId: Int!
    $body: String!
    $data: String!
    $isPublic: Boolean!
    $isUnread: Boolean!
    $level: Int!
    $title: String!
  ) {
    selfSiteNotificationCreate(
      userId: $userId
      siteId: $siteId
      data: {
        body: $body
        data: $data
        isPublic: $isPublic
        isUnread: $isUnread
        level: $level
        title: $title
      }
    ) {
      id
    }
  }
`;

export const SELF_SITE_NOTIFICATION_UPDATE = gql`
  mutation selfSiteNotificationUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $body: String
    $data: String
    $isPublic: Boolean
    $isUnread: Boolean
    $level: Int
    $title: String
  ) {
    selfSiteNotificationUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        body: $body
        data: $data
        isPublic: $isPublic
        isUnread: $isUnread
        level: $level
        title: $title
      }
    ) {
      id
    }
  }
`;

export const SELF_SITE_NOTIFICATION_DELETE = gql`
  mutation selfSiteNotificationDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfSiteNotificationDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;

export const SELF_HOME_NOTIFICATION_CREATE = gql`
  mutation selfHomeNotificationCreate($userId: Int!, $body: String!, $title: String!, $topic: String!) {
    selfHomeNotificationCreate(
      userId: $userId
      message: { topic: $topic, notification: { body: $body, title: $title } }
    )
  }
`;
