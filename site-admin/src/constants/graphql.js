import gql from 'graphql-tag'
// ----------------------------------------------------------------------------------------------
//                                        SITE
// ----------------------------------------------------------------------------------------------
// SITE_SITES
export const SITE_SITES = gql `
query($createdById: Int, $isPortfolio: String, $search: String,  $after: String) {
  sites(createdById: $createdById, isPortfolio: $isPortfolio, search: $search, first: 15, after: $after){
    edges{
      node{
        createdAt
        domain
        hostname
        id
        isActive
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
// SITE_BY_HOSTNAME
export const SITE_BY_HOSTNAME = gql `
query($domain: String!) {
  site(domain: $domain) {
    activeFontClassname
    address
    colorClassname
    coverImage
    currency
    desktopLogo
    domain
    favicon
    foot
    footer
    head
    hostname
    id
    index
    industry
    isPublic
    locale
    meta
    metaDescription
    metaTitle
    navigation
    phoneLogo
    schema
    social
    street
    theme
    title
  }
}
`; // SELF_SITE_CREATE
export const SELF_SITE_CREATE = gql `
mutation selfSiteCreate(
  $userId: Int!
  $address: String!
  $country: Int!
  $currency: String!
  $desktopTheme: String!
  $domain: String!
  $email: String
  $footer: JSON!
  $guide: JSON!
  $hostname: String!
  $industry: Int!
  $isPortfolio: Boolean
  $latitude: Float!
  $longitude: Float!
  $meta: JSON!
  $navigation: JSON!
  $note: String!
  $phone: Int
  $referCode: String!
  $schema: JSON!
  $siteInfo: String!
  $siteType: String!
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
      isPortfolio: $isPortfolio
      latitude: $latitude
      longitude: $longitude
      meta: $meta
      navigation: $navigation
      note: $note
      phone: $phone
      referCode: $referCode
      schema: $schema
      siteInfo: $siteInfo
      siteType: $siteType
      street: $street
      theme: $theme
      title: $title
    }
  ) {
    address
    completedStep
    createdAt
    currency
    desktopLogo
    desktopTheme
    domain
    email
    favicon
    fee
    hid
    hostname
    id
    isActive
    isPaid
    itemLimit
    lastEvent
    lastPayment
    latitude
    locale
    longitude
    metaDescription
    percentage
    phone
    siteInfo
    street
    subscription
    theme
    threshold
    title
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
export const SELF_SITE_UPDATE = gql `
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
  $isPublic: Boolean
  $lastEvent: DateTime
  $latitude: Float
  $locale: String
  $longitude: Float
  $meta: String
  $metaDescription: String
  $metaTitle: String
  $navigation: String
  $percentage: Float
  $phone: Int
  $phoneLogo: Upload
  $sendSmsPerEvent: Boolean
  $sendSmsPerOrder: Boolean
  $social: String
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
      isPublic: $isPublic
      lastEvent: $lastEvent
      latitude: $latitude
      locale: $locale
      longitude: $longitude
      meta: $meta
      metaDescription: $metaDescription
      metaTitle: $metaTitle
      navigation: $navigation
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
    address
    completedStep
    createdAt
    currency
    desktopLogo
    desktopTheme
    domain
    email
    favicon
    fee
    hid
    hostname
    id
    isActive
    isPaid
    itemLimit
    lastEvent
    lastPayment
    latitude
    locale
    longitude
    metaDescription
    percentage
    phone
    siteInfo
    street
    subscription
    theme
    threshold
    title
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
// SELF_SITE_UPDATE_INDEX
export const SELF_SITE_UPDATE_INDEX = gql `
mutation selfSiteUpdateIndex(
  $userId: Int!
  $siteId: Int!
  $footer: JSON
  $html: Upload
  $navigation: JSON
  $schema: JSON
) {
  selfSiteUpdateIndex(
    userId: $userId
    siteId: $siteId
    data: {
      footer: $footer
      navigation: $navigation
      schema: $schema
    }
    html: $html
  ) {
    footer
    id
    index
    navigation
    schema
  }
}
`;
// ----------------------------------------------------------------------------------------------
//                                        STAFF
// ----------------------------------------------------------------------------------------------
// SITE_STAFFS
export const SITE_STAFFS = gql `
query($siteId: Int, $staffType: Int, $search: String,  $after: String) {
  siteStaffs(siteId: $siteId, staffType: $staffType, search: $search, first: 15, after: $after){
    edges{
      node{
        id
        isActive
        phone
        staffType
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
// SITE_STAFF_PREVIEW
export const SITE_STAFF_PREVIEW = gql `
  query siteStaff($siteId: Int!, $id: Int!, $from: DateTime, $to: DateTime){
    siteStaff(siteId: $siteId, id: $id) {
      currency
      description
      due
      id
      isActive
      netAmount
      paid
      permission
      phone
      staffType
      title
      totalAmount
      userId
      data(from: $from, to: $to){
        affiliateCommission
        bought
        cancelled
        confirmed
        delivered
        onTheWay
        orders
        packaging
        paid
        paidAffiliateCommission
        payableAffiliateCommission
        pending
        placed
        rejected
        returnCharge
        returned
        shipment
        station
        totalAffiliateCommission
        transaction
      }
      user {
        id
        referCode
      }
  }
}
`;

// SELF_SITE_STAFF_CREATE_BY_ADMIN
export const SELF_SITE_STAFF_CREATE_BY_ADMIN = gql `
mutation selfSiteStaffCreateByAdmin(
  $userId: Int!
  $siteId: Int!
  $currency: String!
  $description: String!
  $due: Float!
  $isActive: Boolean!
  $netAmount: Float!
  $paid: Float!
  $permission: String!
  $phone: Int!
  $staffType: Int!
  $title: String!
  $totalAmount: Float!
) {
  selfSiteStaffCreateByAdmin(
    userId: $userId
    siteId: $siteId
    data: {
      currency: $currency
      description: $description
      due: $due
      isActive: $isActive
      netAmount: $netAmount
      paid: $paid
      permission: $permission
      phone: $phone
      siteId: $siteId
      staffType: $staffType
      title: $title
      totalAmount: $totalAmount
      userId: $userId
    }
  ) {
    id
    isActive
    phone
    staffType
    title
    updatedAt
  }
}
`;
// SELF_SITE_STAFF_UPDATE
export const SELF_SITE_STAFF_UPDATE = gql `
mutation selfSiteStaffUpdate(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $currency: String
  $description: String
  $due: Float
  $isActive: Boolean
  $netAmount: Float
  $paid: Float
  $permission: String
  $phone: Int
  $staffType: Int
  $title: String
  $totalAmount: Float
) {
  selfSiteStaffUpdate(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      currency: $currency
      description: $description
      due: $due
      isActive: $isActive
      netAmount: $netAmount
      paid: $paid
      permission: $permission
      phone: $phone
      staffType: $staffType
      title: $title
      totalAmount: $totalAmount
    }
  ) {
    id
    isActive
    phone
    staffType
    title
    updatedAt
  }
}
`;
// SELF_SITE_STAFF_DELETE
export const SELF_SITE_STAFF_DELETE = gql `
mutation selfSiteStaffDelete($userId: Int!, $id: Int!) {
  selfSiteStaffDelete(userId: $userId, id: $id)
}
`;
// ----------------------------------------------------------------------------------------------
//                                        SITE_FEEDBACKS
// ----------------------------------------------------------------------------------------------
// SITE_FEEDBACKS
export const SITE_FEEDBACKS = gql `
query($siteId: Int!, $userId: Int, $status: Int, $priority: Int, $search: String, $after: String) {
  siteFeedbacks(siteId: $siteId, userId: $userId, status: $status, priority: $priority, search: $search, first: 15, after: $after) {
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
export const SELF_SITE_FEEDBACK_CREATE = gql `
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
export const SELF_SITE_FEEDBACK_UPDATE = gql `
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
export const SELF_SITE_FEEDBACK_DELETE = gql `
mutation selfSiteFeedbackDelete(
  $userId: Int!
  $feedbackId: Int!
) {
  selfSiteFeedbackDelete(
    userId: $userId
    feedbackId: $feedbackId
  )
}
`;
// ----------------------------------------------------------------------------------------------
//                                        PAGE
// ----------------------------------------------------------------------------------------------
// SITE_PAGES
export const SITE_PAGES = gql `
query($siteId: Int!, $search: String, $after: String) {
  sitePages(
    siteId: $siteId
    search: $search
    first: 15
    after: $after
  ) {
      total
      edges {
      node {
        id
        isActive
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
// SITE_PAGE_PREVIEW
export const SITE_PAGE_PREVIEW = gql `
query($siteId: Int!, $id: Int!) {
  sitePage(siteId: $siteId, id: $id) {
    description
    html
    id
    isActive
    slug
    title
  }
}
`;
// SELF_SITE_PAGE_CREATE
export const SELF_SITE_PAGE_CREATE = gql `
mutation selfSitePageCreate(
  $userId: Int!
  $siteId: Int!
  $description: String!
  $html: String!
  $isActive: Boolean!
  $slug: String!
  $title: String!
) {
  selfSitePageCreate(
    userId: $userId
    siteId: $siteId
    data: {
      description: $description
      html: $html
      isActive: $isActive
      slug: $slug
      title: $title
    }
  ) {
    id
  }
}
`;
// SELF_SITE_PAGE_UPDATE
export const SELF_SITE_PAGE_UPDATE = gql `
mutation selfSitePageUpdate(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $description: String!
  $html: String!
  $isActive: Boolean!
  $slug: String!
  $title: String!
) {
  selfSitePageUpdate(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      description: $description
      html: $html
      isActive: $isActive
      slug: $slug
      title: $title
    }
  ) {
    id
  }
}
`;
// SELF_SITE_PAGE_DELETE
export const SELF_SITE_PAGE_DELETE = gql `
mutation selfSitePageDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfSitePageDelete(userId: $userId, siteId: $siteId, id: $id) 
}
`;
// ----------------------------------------------------------------------------------------------
//                                        SITE_TEMPLATES
// ----------------------------------------------------------------------------------------------
// SITE_TEMPLATES
export const SITE_TEMPLATES = gql `
query($isActive: Boolean,  $after: String) {
  siteTemplates(isActive: $isActive, first: 15, after: $after){
    edges{
      node{
        footer
        id
        image
        navigation
        priority
        schema
        slug
        tags
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
query($after: String, $first: Int) {
  siteComponents(after: $after, first: $first) {
      total
      edges {
      node {
        category
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
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
}

`;
// ----------------------------------------------------------------------------------------------
//                                        FILE
// ----------------------------------------------------------------------------------------------
// FILE_FILES
export const FILE_FILES = gql `
query($userId: Int!, $queryType: String, $after: String) {
  fileFiles(
    userId: $userId
    queryType: $queryType
    after: $after
    first: 15
  ) {
      total
      edges {
      node {
        id
        title
        updatedAt
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
// FILE_FILE_PREVIEW
export const FILE_FILE_PREVIEW = gql `
query($id: Int!) {
  fileFile(id: $id) {
    id
    title
    updatedAt
    url
  }
}
`;
// SELF_FILE_FILE_CREATE
export const SELF_FILE_FILE_CREATE = gql`
  mutation selfFileFileCreate(
    $userId: Int!
    $file: Upload
    $mimeType: String!
    $size: Float!
    $title: String!
    $url: String!
  ) {
    selfFileFileCreate(
      userId: $userId
      data: {
        file: $file
        mimeType: $mimeType
        size: $size
        title: $title
        url: $url
      }
    ) {
    id
  }
}
`;
// SELF_FILE_FILE_UPDATE
export const SELF_FILE_FILE_UPDATE = gql `
mutation selfFileFileUpdate(
  $userId: Int!
  $id: Int!
  $mimeType: String
  $title: String
  $url: Upload
) {
  selfFileFileUpdate(
    userId: $userId
    id: $id
    data: {
      mimeType: $mimeType
      title: $title
      url: $url
    }
  ) {
    id
  }
}
`;
// SELF_FILE_FILE_DELETE
export const SELF_FILE_FILE_DELETE = gql `
mutation selfFileFileDelete($userId: Int!, $id: Int!) {
  selfFileFileDelete(userId: $userId, id: $id) 
}
`;

// ----------------------------------------------------------------------------------------------
//                                        HOME
// ----------------------------------------------------------------------------------------------
// HOME_ANNOUNCEMENTS
export const HOME_ANNOUNCEMENTS = gql `
query($appId: Int!, $search: String, $first: Int, $after: String){
  homeAnnouncements(appId: $appId, search: $search, first: $first, after: $after){
      total
      edges {
      node {
        id
        summary
        tag
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

// HOME_ANNOUNCEMENT_PREVIEW
export const HOME_ANNOUNCEMENT_PREVIEW = gql `
query($id: Int) {
  homeAnnouncement(id: $id) {
    appId
    html
    id
    image
    isActive
    isPinned
    summary
    tag
    title
    updatedAt
  }
}
`;
// ----------------------------------------------------------------------------------------------
//                                        USER ME
// ----------------------------------------------------------------------------------------------
// ME
export const ME = gql `
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
export const ME_DETAILS = gql `
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
export const USER_PHONE_INFO = gql `
query($countryCode: String!, $phone: String!){
  userPhoneInfo(countryCode: $countryCode, phone: $phone){
    isValid
    phone
  }
}
`;
// USER_PASSWORD_UPDATE
export const USER_PASSWORD_UPDATE = gql `
mutation userPasswordUpdate($email: String!, $old: String!, $new: String!) {
  userPasswordUpdate(data: { email: $email, old: $old, new: $new }) {
    id
  }
}
`;
// USER_UPDATE
export const USER_UPDATE = gql `
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
// USERS
export const USERS = gql `
  query($referedId: Int!, $after: String) {
    users(referedId: $referedId, after: $after){
      total
      edges {
        node{
          address
          avatar
          dateJoined
          id
          isActive
          name
          phone
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
//                                        HOME QRCODE
// ----------------------------------------------------------------------------------------------
// HOME_QRCODE
export const HOME_QRCODE = gql `
query($data: String!){
  homeQrcode(data: $data)
}
`;
// HOME_LOCATION_SUGGESTION
export const HOME_LOCATION_SUGGESTION = gql `
query($place: String!, $sessionToken: String!){
  homeLocationSuggestion(place: $place, sessionToken: $sessionToken) {
    description
    placeId
  }
}
`;
// HOME_LOCATION_PLACE
export const HOME_LOCATION_PLACE = gql `
query($placeId: String!, $sessionToken: String!){
  homeLocationPlace(placeId: $placeId, sessionToken: $sessionToken){
    address
    latitude
    longitude
  }
}
`;
// ----------------------------------------------------------------------------------------------
//                                        SHORT_URL_URLS
// ----------------------------------------------------------------------------------------------
// SHORT_URL_URLS
export const SHORT_URL_URLS = gql `
query($userId: Int!, $after: String) {
  shortUrlUrls(userId: $userId, first: 15, after: $after) {
      total
      edges {
      node {
        createdAt
        hid
        id
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

// SELF_SHORT_URL_URL_CREATE
export const SELF_SHORT_URL_URL_CREATE = gql `
mutation selfShortUrlUrlCreate(
  $userId: Int!
  $title: String!
  $url: String!
) {
  selfShortUrlUrlCreate(
    userId: $userId
    data: {
      title: $title
      url: $url
    }
  ) {
    createdAt
    hid
    id
    title
    url
  }
}
`;


// SELF_SHORT_URL_URL_UPDATE
export const SELF_SHORT_URL_URL_UPDATE = gql `
mutation selfShortUrlUrlUpdate(
  $userId: Int!
  $urlId: Int!
  $title: String
  $url: String
) {
  selfShortUrlUrlUpdate(
    userId: $userId
    urlId: $urlId
    data: {
      title: $title
      url: $url
    }
  ) {
    createdAt
    hid
    id
    title
    url
  }
}
`;
// SELF_SHORT_URL_URL_DELETE
export const SELF_SHORT_URL_URL_DELETE = gql `
mutation selfShortUrlUrlDelete(
  $userId: Int!
  $urlId: Int!
) {
  selfShortUrlUrlDelete(
    userId: $userId
    urlId: $urlId
  )
}
`;
// ----------------------------------------------------------------------------------------------
//                                        HOME_FEEDBACKS
// ----------------------------------------------------------------------------------------------
// HOME_FEEDBACKS
export const HOME_FEEDBACKS = gql `
query($userId: Int!, $status: Int, $priority: Int, $search: String, $after: String) {
  homeFeedbacks(userId: $userId, status: $status, priority: $priority, search: $search, first: 15, after: $after) {
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

// SELF_HOME_FEEDBACK_CREATE
export const SELF_HOME_FEEDBACK_CREATE = gql `
mutation selfHomeFeedbackCreate(
  $userId: Int!
  $body: String!
  $contact: String!
  $image: Upload
  $name: String!
  $priority: Int!
  $source: String!
  $status: Int!
  $title: String!
) {
  selfHomeFeedbackCreate(
    userId: $userId
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
// SELF_HOME_FEEDBACK_UPDATE
export const SELF_HOME_FEEDBACK_UPDATE = gql `
mutation selfHomeFeedbackUpdate(
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
  selfHomeFeedbackUpdate(
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

// SELF_HOME_FEEDBACK_DELETE
export const SELF_HOME_FEEDBACK_DELETE = gql `
mutation selfHomeFeedbackDelete(
  $userId: Int!
  $feedbackId: Int!
) {
  selfHomeFeedbackDelete(
    userId: $userId
    feedbackId: $feedbackId
  )
}
`;
// ----------------------------------------------------------------------------------------------
//                                        USER CUSTOMER
// ----------------------------------------------------------------------------------------------

// USER_BY_PHONE
export const USER_BY_PHONE = gql `
query($phone: Int!) {
  userByPhone(phone: $phone) {
    id
    publicAddress
    publicFormattedAddress
    publicLatitude
    publicLongitude
    publicPhone
    publicTitle
  }
}`;

// SELF_USER_UPDATE_PUBLIC
export const SELF_USER_UPDATE_PUBLIC = gql `
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
}`;