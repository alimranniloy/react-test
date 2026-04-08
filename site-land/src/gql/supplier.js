import gql from 'graphql-tag'
// STORE_SUPPLIERS
export const STORE_SUPPLIERS = gql `
query($siteId: Int, $isActive: Boolean, $first: Int, $after: String) {
  storeSuppliers(siteId: $siteId, isActive: $isActive, first: $first, after: $after){
    edges{
      node{
        address
        due
        id
        isActive
        logo
        ordersTotal
        paid
        payable
        phone
        products
        sale
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
}  
  `;

// STORE_SUPPLIER_DETAILS
export const STORE_SUPPLIER_DETAILS = gql `
query storeSupplier($siteId: Int!, $id: Int!){
  storeSupplier(siteId: $siteId, id: $id) {
    address
    createdAt
    createdById
    description
    due
    email
    expectedSale
    features
    id
    isActive
    isVerified
    lastPayment
    logo
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
    products
    sale
    siteId
    street
    title
    transaction
    translation
    userId
  }
}
`;
// SELF_STORE_SUPPLIER_CREATE_BY_ADMIN
export const SELF_STORE_SUPPLIER_CREATE_BY_ADMIN = gql `
mutation selfStoreSupplierCreateByAdmin(
  $userId: Int!
  $siteId: Int!
  $address: String
  $description: String!
  $email: String
  $features: JSON!
  $logo: Upload
  $phone: Int!
  $street: String
  $title: String!
) {
  selfStoreSupplierCreateByAdmin(
    userId: $userId
    siteId: $siteId
    data: {
      address: $address
      description: $description
      email: $email
      features: $features
      logo: $logo
      phone: $phone
      street: $street
      title: $title
      translation: $title
      userId: $userId
    }
  ) {
    id
    isActive
    phone
    title
    updatedAt
  }
}
`;
// SELF_STORE_SUPPLIER_UPDATE_BY_ADMIN
export const SELF_STORE_SUPPLIER_UPDATE_BY_ADMIN = gql `
mutation selfStoreSupplierUpdateByAdmin(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $address: String
  $description: String
  $dueAmount: Float
  $email: String
  $features: JSON
  $isActive: Boolean
  $isVerified: Boolean
  $logo: Upload
  $netAmount: Float
  $note: String
  $phone: Int
  $street: String
  $title: String
  $totalAmount: Float
  $totalPaid: Float
) {
  selfStoreSupplierUpdateByAdmin(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      address: $address
      description: $description
      dueAmount: $dueAmount
      email: $email
      features: $features
      isActive: $isActive
      isVerified: $isVerified
      logo: $logo
      netAmount: $netAmount
      note: $note
      phone: $phone
      street: $street
      title: $title
      totalAmount: $totalAmount
      totalPaid: $totalPaid
    }
  ) {
    id
  }
}
`;
// SELF_STORE_SUPPLIER_DELETE
export const SELF_STORE_SUPPLIER_DELETE = gql `
mutation selfStoreSupplierDelete($userId: Int!, $id: Int!) {
  selfStoreSupplierDelete(userId: $userId, id: $id)
}
`;
