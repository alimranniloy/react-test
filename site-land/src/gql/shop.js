import gql from 'graphql-tag'
// STORE_SHOPS
export const STORE_SHOPS = gql `
query($siteId: Int, $isActive: Boolean, $search: String, $after: String, $first: Int) {
  storeShops(siteId: $siteId, isActive: $isActive, search: $search, first: $first, after: $after){
    edges{
      node{
        address
        createdAt
        fee
        hid
        id
        isActive
        logo
        note
        ordersTotal
        phone
        products
        slug
        street
        title
        transaction
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
}`;
// STORE_SHOP_DETAILS
export const STORE_SHOP_DETAILS = gql `
  query storeShop($siteId: Int!, $id: Int!){
    storeShop(siteId: $siteId, id: $id) {
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
// STORE_SHOP_DETAILS_BY_HID
export const STORE_SHOP_DETAILS_BY_HID = gql`
  query storeShopByHid($siteId: Int!, $hid: String!) {
    storeShopByHid(siteId: $siteId, hid: $hid) {
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
// SELF_STORE_SHOP_PRODUCT_UPDATE_BY_ADMIN
export const SELF_STORE_SHOP_PRODUCT_UPDATE_BY_ADMIN = gql `
mutation selfStoreShopProductUpdateByAdmin(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $isActive: Boolean!
) {
  selfStoreShopProductUpdateByAdmin(
    userId: $userId
    siteId: $siteId
    id: $id
    isActive: $isActive
  ) {
    id
    isActive
  }
}
  `;
// SELF_STORE_SHOP_UPDATE_BY_ADMIN
export const SELF_STORE_SHOP_UPDATE_BY_ADMIN = gql `
mutation selfStoreShopUpdateByAdmin(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $address: String
  $country: Int
  $cover: Upload
  $description: String
  $due: Float
  $email: String
  $features: String
  $fee: Float
  $isActive: Boolean
  $isPublic: Boolean
  $isVerified: Boolean
  $logo: Upload
  $note: String
  $phone: Int
  $priority: Int
  $slogan: String
  $slug: String
  $street: String
  $thumbnail: Upload
  $title: String
  $paid: Float
) {
  selfStoreShopUpdateByAdmin(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      address: $address
      country: $country
      cover: $cover
      description: $description
      due: $due
      email: $email
      features: $features
      fee: $fee
      isActive: $isActive
      isPublic: $isPublic
      isVerified: $isVerified
      logo: $logo
      note: $note
      phone: $phone
      priority: $priority
      slogan: $slogan
      slug: $slug
      street: $street
      thumbnail: $thumbnail
      title: $title
      paid: $paid
    }
  ) {
    id
  }
}
`;
// SELF_STORE_SHOP_DELETE
export const SELF_STORE_SHOP_DELETE = gql `
   mutation selfStoreShopDelete($userId: Int!, $id: Int!) {
    selfStoreShopDelete(userId: $userId, id: $id) 
   }
   `;