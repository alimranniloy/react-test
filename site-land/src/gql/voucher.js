import gql from 'graphql-tag'
// STORE_VOUCHERS
export const STORE_VOUCHERS = gql`
  query ($siteId: Int!, $after: String) {
    storeVouchers(siteId: $siteId, after: $after) {
      total
      edges {
        node {
          code
          currency
          discount
          endDate
          html
          id
          isActive
          isAuto
          isPublic
          title
          usageLimit
          used
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
// STORE_VOUCHER_DETAILS
export const STORE_VOUCHER_DETAILS = gql`
  query ($siteId: Int!, $id: Int!) {
    storeVoucher(siteId: $siteId, id: $id) {
      applyOn
      applyOncePerCustomer
      code
      currency
      description
      discount
      endDate
      html
      id
      isActive
      isAuto
      isPublic
      minQuantity
      minSpent
      title
      usageLimit
      used
      voucherType
    }
  }
`;
// SELF_STORE_VOUCHER_CHECK_BY_CODE
export const SELF_STORE_VOUCHER_CHECK_BY_CODE = gql`
  query (
    $siteId: Int!
    $userId: Int!
    $code: String!
    $quantity: Float!
    $total: Float!
    $delivery: Float!
    $products: JSON!
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
// SELF_STORE_VOUCHER_CREATE
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
    $html: JSON!
    $isActive: Boolean!
    $isAuto: Boolean!
    $isPublic: Boolean!
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
        html: $html
        isActive: $isActive
        isAuto: $isAuto
        isPublic: $isPublic
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
// SELF_STORE_VOUCHER_UPDATE
export const SELF_STORE_VOUCHER_UPDATE = gql `
mutation selfStoreVoucherUpdate(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $applyOn: Boolean
  $applyOncePerCustomer: Boolean
  $code: String
  $currency: String
  $description: String
  $discount: Float
  $html: JSON
  $isActive: Boolean
  $isAuto: Boolean
  $isPublic: Boolean
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
      discount: $discount
      html: $html
      isActive: $isActive
      isAuto: $isAuto
      isPublic: $isPublic
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
// SELF_STORE_VOUCHER_DELETE
export const SELF_STORE_VOUCHER_DELETE = gql `
mutation selfStoreVoucherDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfStoreVoucherDelete(userId: $userId, siteId: $siteId, id: $id) 
}
`;