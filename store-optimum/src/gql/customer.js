import gql from "graphql-tag";
// STORE_CUSTOMERS
export const STORE_CUSTOMERS = gql`
  query (
    $siteId: Int!
    $search: String
    $from: DateTime
    $to: DateTime
    $isActive: Boolean
    $isReseller: Boolean
    $isAffiliate: Boolean
    $isWholesale: Boolean
    $queryType: String
    $after: String
    $first: Int
  ) {
    storeCustomers(
      siteId: $siteId
      search: $search
      from: $from
      to: $to
      isActive: $isActive
      isReseller: $isReseller
      isAffiliate: $isAffiliate
      isWholesale: $isWholesale
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
          isActive
          nid
          ordersTotal
          phone
          resellPaid
          resellProcessing
          resellTotal
          resellPayable
          address
          title
          totalProfit
          totalPurchase
          updatedAt
          userId
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
  query ($id: Int!) {
    storeCustomer(id: $id) {
      affiliatePaid
      affiliateProcessing
      affiliateTotal
      affiliatePayable
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
      createdAt
      currency
      customerType
      customerTypes
      cartProducts {
        id
        price
        quantity
        resellPrice
        title
        variant
        variantId
      }
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
      resellProcessing
      resellTotal
      resellPayable
      tags
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
// SELF_STORE_CUSTOMER

export const SELF_STORE_CUSTOMER = gql`
  query selfStoreCustomer(
    $userId: Int!
    $siteId: Int!
    $isActive: Boolean
    $isAffiliate: Boolean
    $isReseller: Boolean
    $isWholesale: Boolean
    $customerType: Int
    $customerTypes: [Int]
  ) {
    selfStoreCustomer(
      userId: $userId
      siteId: $siteId
      isActive: $isActive
      isAffiliate: $isAffiliate
      isReseller: $isReseller
      isWholesale: $isWholesale
      customerType: $customerType
      customerTypes: $customerTypes
    ) {
      affiliatePaid
      affiliateProcessing
      affiliateTotal
      affiliatePayable
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
      createdAt
      currency
      customerType
      customerTypes
      cartProducts {
        id
        price
        quantity
        resellPrice
        title
        variant
        variantId
      }
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
      resellProcessing
      resellTotal
      resellPayable
      tags
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
// SELF_STORE_CUSTOMER_UPDATE
export const SELF_STORE_CUSTOMER_UPDATE = gql`
  mutation selfStoreCustomerUpdateByCustomer(
    $userId: Int!
    $customerId: Int!
    $customerType: Int
    $customerTypes: [Int]
    $address: String
    $avatar: Upload
    $billingAddress: String
    $domain: String
    $formattedAddress: String
    $isActive: Boolean
    $isAffiliate: Boolean
    $isReseller: Boolean
    $latitude: Float
    $longitude: Float
    $note: JSON
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
        customerType: $customerType
        customerTypes: $customerTypes
        domain: $domain
        formattedAddress: $formattedAddress
        isActive: $isActive
        isAffiliate: $isAffiliate
        isReseller: $isReseller
        latitude: $latitude
        longitude: $longitude
        note: $note
        paymentNo: $paymentNo
        paymentTitle: $paymentTitle
        phone: $phone
        referCode: $referCode
        shippingAddress: $shippingAddress
        title: $title
      }
    ) {
      affiliatePaid
      affiliateProcessing
      affiliateTotal
      affiliatePayable
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
      createdAt
      currency
      customerType
      customerTypes
      cartProducts {
        id
        price
        quantity
        resellPrice
        title
        variant
        variantId
      }
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
      resellProcessing
      resellTotal
      resellPayable
      tags
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

// SELF_STORE_CUSTOMER_UPDATE_BY_ADMIN
export const SELF_STORE_CUSTOMER_UPDATE_BY_ADMIN = gql`
  mutation selfStoreCustomerUpdateByAdmin(
    $userId: Int!
    $siteId: Int!
    $customerId: Int!
    $address: String
    $domain: String
    $formattedAddress: String
    $isActive: Boolean
    $isAffiliate: Boolean
    $isReseller: Boolean
    $isWholesale: Boolean
    $paymentTitle: String
    $paymentNo: String
    $tags: String
    $title: String
  ) {
    selfStoreCustomerUpdateByAdmin(
      userId: $userId
      siteId: $siteId
      customerId: $customerId
      data: {
        address: $address
        domain: $domain
        formattedAddress: $formattedAddress
        isActive: $isActive
        isAffiliate: $isAffiliate
        isReseller: $isReseller
        isWholesale: $isWholesale
        paymentTitle: $paymentTitle
        paymentNo: $paymentNo
        tags: $tags
        title: $title
      }
    ) {
      affiliatePaid
      affiliateProcessing
      affiliateTotal
      affiliatePayable
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
      createdAt
      currency
      customerType
      customerTypes
      cartProducts {
        id
        price
        quantity
        resellPrice
        title
        variant
        variantId
      }
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
      resellProcessing
      resellTotal
      resellPayable
      tags
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
      userId
    }
  }
`;
