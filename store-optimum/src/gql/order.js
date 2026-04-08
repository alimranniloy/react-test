import gql from "graphql-tag";
// STORE_ORDERS
export const STORE_ORDERS = gql`
  query (
    $siteId: Int!
    $search: String
    $customerId: Int
    $shopId: Int
    $status: Int
    $affiliateIsPaid: Boolean
    $resellerIsPaid: Boolean
    $referId: Int
    $from: DateTime
    $to: DateTime
    $after: String
    $first: Int
  ) {
    storeOrders(
      siteId: $siteId
      search: $search
      customerId: $customerId
      shopId: $shopId
      status: $status
      affiliateIsPaid: $affiliateIsPaid
      resellerIsPaid: $resellerIsPaid
      referId: $referId
      from: $from
      to: $to
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          createdAt
          currency
          customerAddress
          customerName
          customerNote
          customerPhone
          id
          isSettle
          orderId
          paid
          profit
          resellAmount
          status
          total
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
// STORE_ORDERS_FOR_REPORT
export const STORE_ORDERS_FOR_REPORT = gql`
  query (
    $siteId: Int!
    $search: String
    $customerId: Int
    $status: Int
    $affiliateIsPaid: Boolean
    $resellerIsPaid: Boolean
    $referId: Int
    $from: DateTime
    $to: DateTime
    $first: Int
    $after: String
  ) {
    storeOrders(
      siteId: $siteId
      search: $search
      customerId: $customerId
      status: $status
      affiliateIsPaid: $affiliateIsPaid
      resellerIsPaid: $resellerIsPaid
      referId: $referId
      from: $from
      to: $to
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          affiliateCommission
          cashbackBalance
          charge
          cost
          createdAt
          currency
          customerAddress
          customerName
          customerNote
          customerPhone
          discount
          id
          logisticsCharge
          logisticsExtraCharge
          netAmount
          orderId
          paid
          profit
          resellAmount
          resellerAdvanceCollect
          resellerCommission
          status
          total
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`; // STORE_SUPPLIER_ORDERS
export const STORE_SUPPLIER_ORDERS = gql`
  query (
    $siteId: Int!
    $supplierId: Int!
    $status: Int
    $after: String
    $first: Int
  ) {
    storeSupplierOrders(
      siteId: $siteId
      supplierId: $supplierId
      status: $status
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          id
          orderId
          status
          currency
          total
          customerName
          customerAddress
          createdAt
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
// STORE_ORDER_DETAILS
export const STORE_ORDER_DETAILS = gql`
  query ($siteId: Int!, $id: Int!) {
    storeOrder(siteId: $siteId, id: $id) {
      address
      affiliateCommission
      affiliateIsPaid
      cashbackBalance
      charge
      childHid
      childId
      cost
      createdAt
      currency
      customerAddress
      customerId
      customerName
      customerNote
      customerPhone
      deliveryTime
      discount
      discountName
      emiDuration
      emiInterest
      gatewayText
      grossAmount
      id
      isChargePaid
      isEmi
      isPaid
      isSettle
      isTransferred
      latitude
      logisticsCharge
      logisticsExtraCharge
      logisticsIsConfirmed
      logisticsIsPaid
      logisticsText
      logisticsUrl
      longitude
      netAmount
      orderId
      paid
      parentId
      paymentId
      paymentResellerId
      profit
      resellAmount
      resellerAdvanceCollect
      resellerCommission
      resellerIsPaid
      rewardPoints
      shopId
      siteId
      status
      statusCompleted
      total
      trackingId
      updatedAt
      userId
      vat
      vatAmount
      customer {
        avatar
        userId
        hid
        title
        phone
        address
      }
      events {
        createdAt
        eventType
        id
        note
      }
      pays {
        createdAt
        gatewayId
        id
        note
        payType
        paymentDate
        paymentId
        paymentNo
        paymentTitle
        total
      }
      lines {
        cost
        currency
        id
        image
        isActive
        productId
        productHid
        productName
        productSku
        quantity
        resellPrice
        source
        unit
        price
        unitType
        variant
        vat
      }
    }
  }
`;

// STORE_ORDER_BY_ORDER_ID
export const STORE_ORDER_BY_ORDER_ID = gql`
  query ($siteId: Int!, $orderId: String!) {
    storeOrderByOrderId(siteId: $siteId, orderId: $orderId) {
      address
      affiliateCommission
      affiliateIsPaid
      cashbackBalance
      charge
      childHid
      childId
      cost
      createdAt
      currency
      customerAddress
      customerId
      customerName
      customerNote
      customerPhone
      deliveryTime
      discount
      discountName
      emiDuration
      emiInterest
      gatewayText
      grossAmount
      id
      isChargePaid
      isEmi
      isPaid
      isSettle
      isTransferred
      latitude
      logisticsCharge
      logisticsExtraCharge
      logisticsIsConfirmed
      logisticsIsPaid
      logisticsText
      logisticsUrl
      longitude
      netAmount
      orderId
      paid
      parentId
      paymentId
      paymentResellerId
      profit
      resellAmount
      resellerAdvanceCollect
      resellerCommission
      resellerIsPaid
      rewardPoints
      status
      statusCompleted
      total
      trackingId
      updatedAt
      vat
      vatAmount
      customer {
        avatar
        domain
        userId
        hid
        title
        phone
        address
      }
      events {
        createdAt
        eventType
        id
        note
      }
      pays {
        createdAt
        gatewayId
        id
        note
        payType
        paymentDate
        paymentId
        paymentNo
        paymentTitle
        total
      }
      lines {
        cost
        currency
        id
        image
        isActive
        productId
        productHid
        productName
        productSku
        quantity
        resellPrice
        source
        unit
        price
        unitType
        variant
        vat
      }
    }
  }
`;

// STORE_ORDER_LINE_CHECK_LISTS
export const STORE_ORDER_LINE_CHECK_LISTS = gql`
  query ($siteId: Int!, $orders: Int!, $after: String) {
    storeOrderLineCheckLists(siteId: $siteId, orders: $orders, after: $after) {
      edges {
        node {
          cost
          id
          image
          orderIds
          orderHids
          productId
          productName
          productSku
          quantity
          resellPrice
          shopId
          source
          supplierId
          price
          variantId
          variant
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

// STORE_ORDER_LINE_SUPPLIER_CHECK_LISTS
export const STORE_ORDER_LINE_SUPPLIER_CHECK_LISTS = gql`
  query ($siteId: Int!, $orders: Int!, $after: String) {
    storeOrderLineSupplierCheckLists(
      siteId: $siteId
      orders: $orders
      after: $after
    ) {
      edges {
        node {
          supplierId
          supplier {
            address
            id
            logo
            phone
            street
            title
          }
          orders {
            cost
            id
            image
            orderIds
            orderHids
            productId
            productName
            productSku
            quantity
            resellPrice
            shopId
            source
            supplierId
            price
            variantId
            variant
          }
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
// STORE_ORDERS_INVOICE
export const STORE_ORDERS_INVOICE = gql`
  query ($siteId: Int!, $id: Int!) {
    storeOrder(siteId: $siteId, id: $id) {
      address
      createdAt
      currency
      customerAddress
      customerName
      customerNote
      customerPhone
      discount
      gatewayText
      id
      isPaid
      isTransferred
      logisticsCharge
      logisticsExtraCharge
      logisticsText
      orderId
      paid
      resellAmount
      resellerAdvanceCollect
      source
      total
      trackingId
      vat
      vatAmount
      customer {
        address
        avatar
        domain
        hid
        phone
        title
      }
      lines {
        cost
        currency
        id
        image
        isActive
        productId
        productHid
        productName
        productSku
        quantity
        resellPrice
        source
        unit
        price
        unitType
        variant
        vat
      }
    }
  }
`;

// SELF_STORE_ORDER_CREATE_BY_CUSTOMER
export const SELF_STORE_ORDER_CREATE_BY_CUSTOMER = gql`
  mutation selfStoreOrderCreateByCustomer(
    $userId: Int!
    $siteId: Int!
    $address: String!
    $affiliateCommission: Float!
    $browser: String
    $cashbackBalance: Float!
    $charge: Float!
    $cost: Float!
    $currency: String!
    $customerAddress: String!
    $customerId: Int!
    $customerName: String!
    $customerNote: String
    $customerPhone: Int!
    $deliveryTime: String
    $discount: Float!
    $discountName: String
    $emiDuration: Int!
    $emiInterest: Float!
    $gatewayText: String!
    $grossAmount: Float!
    $image: Upload
    $isEmi: Boolean!
    $isRenew: Boolean
    $latitude: Float!
    $logisticsCharge: Float!
    $logisticsExtraCharge: Float!
    $logisticsId: Int!
    $logisticsStoppageId: Int
    $logisticsText: String!
    $logisticsUrl: String
    $longitude: Float!
    $netAmount: Float!
    $otp: Int!
    $paid: Float!
    $parentId: Int
    $parentSiteId: Int
    $productId: Int
    $profit: Float!
    $referCode: String!
    $resellAmount: Float!
    $resellerAdvanceCollect: Float!
    $resellerCommission: Float!
    $rewardPoints: Float!
    $shopId: Int
    $source: String!
    $staffId: Int
    $subscription: String
    $subscriptionFee: Float
    $total: Float!
    $validTill: DateTime
    $vat: Float!
    $vatAmount: Float!
    $weight: Float!
    $products: [StoreOrderCartCreate!]
  ) {
    selfStoreOrderCreateByCustomer(
      userId: $userId
      siteId: $siteId
      customerId: $customerId
      data: {
        address: $address
        affiliateCommission: $affiliateCommission
        browser: $browser
        cashbackBalance: $cashbackBalance
        charge: $charge
        cost: $cost
        currency: $currency
        customerAddress: $customerAddress
        customerName: $customerName
        customerNote: $customerNote
        customerPhone: $customerPhone
        deliveryTime: $deliveryTime
        discount: $discount
        discountName: $discountName
        emiDuration: $emiDuration
        emiInterest: $emiInterest
        gatewayText: $gatewayText
        grossAmount: $grossAmount
        image: $image
        isEmi: $isEmi
        isRenew: $isRenew
        latitude: $latitude
        logisticsCharge: $logisticsCharge
        logisticsExtraCharge: $logisticsExtraCharge
        logisticsId: $logisticsId
        logisticsStoppageId: $logisticsStoppageId
        logisticsText: $logisticsText
        logisticsUrl: $logisticsUrl
        longitude: $longitude
        netAmount: $netAmount
        otp: $otp
        paid: $paid
        parentId: $parentId
        parentSiteId: $parentSiteId
        productId: $productId
        profit: $profit
        referCode: $referCode
        resellAmount: $resellAmount
        resellerAdvanceCollect: $resellerAdvanceCollect
        resellerCommission: $resellerCommission
        rewardPoints: $rewardPoints
        shopId: $shopId
        source: $source
        staffId: $staffId
        subscription: $subscription
        subscriptionFee: $subscriptionFee
        total: $total
        userId: $userId
        validTill: $validTill
        vat: $vat
        vatAmount: $vatAmount
        weight: $weight
      }
      products: $products
    ) {
      address
      affiliateCommission
      affiliateIsPaid
      cashbackBalance
      charge
      childHid
      childId
      cost
      createdAt
      currency
      customerAddress
      customerId
      customerName
      customerNote
      customerPhone
      deliveryTime
      discount
      discountName
      emiDuration
      emiInterest
      gatewayText
      grossAmount
      id
      image
      isChargePaid
      isEmi
      isPaid
      isSettle
      isTransferred
      latitude
      logisticsCharge
      logisticsCityId
      logisticsExtraCharge
      logisticsId
      logisticsIsConfirmed
      logisticsIsPaid
      logisticsStoppageId
      logisticsText
      logisticsUrl
      logisticsZoneId
      longitude
      netAmount
      orderId
      paid
      parentId
      paymentId
      paymentResellerId
      profit
      resellAmount
      resellerAdvanceCollect
      resellerCommission
      resellerIsPaid
      rewardPoints
      status
      statusCompleted
      total
      trackingId
      updatedAt
      vat
      vatAmount
      customer {
        avatar
        domain
        userId
        hid
        title
        phone
        address
      }
      events {
        createdAt
        eventType
        id
        note
      }
      lines {
        cost
        currency
        id
        image
        isActive
        productId
        productHid
        productName
        productSku
        quantity
        resellPrice
        source
        unit
        price
        unitType
        variant
        vat
      }
    }
  }
`;
// SELF_STORE_ORDER_CREATE_BY_GUEST
export const SELF_STORE_ORDER_CREATE_BY_GUEST = gql`
  mutation selfStoreOrderCreateByGuest(
    $siteId: Int!
    $address: String!
    $affiliateCommission: Float!
    $browser: String
    $cashbackBalance: Float!
    $charge: Float!
    $cost: Float!
    $currency: String!
    $customerAddress: String!
    $customerName: String!
    $customerNote: String
    $customerPhone: Int!
    $deliveryTime: String
    $discount: Float!
    $discountName: String
    $emiDuration: Int!
    $emiInterest: Float!
    $gatewayText: String!
    $grossAmount: Float!
    $image: Upload
    $isEmi: Boolean!
    $isRenew: Boolean
    $latitude: Float!
    $logisticsCharge: Float!
    $logisticsExtraCharge: Float!
    $logisticsId: Int!
    $logisticsStoppageId: Int
    $logisticsText: String!
    $logisticsUrl: String
    $longitude: Float!
    $netAmount: Float!
    $otp: Int!
    $paid: Float!
    $parentId: Int
    $parentSiteId: Int
    $productId: Int
    $profit: Float!
    $referCode: String!
    $resellAmount: Float!
    $resellerAdvanceCollect: Float!
    $resellerCommission: Float!
    $rewardPoints: Float!
    $shopId: Int
    $source: String!
    $staffId: Int
    $subscription: String
    $subscriptionFee: Float
    $total: Float!
    $validTill: DateTime
    $vat: Float!
    $vatAmount: Float!
    $weight: Float!
    $products: [StoreOrderCartCreate!]
  ) {
    selfStoreOrderCreateByGuest(
      siteId: $siteId
      data: {
        address: $address
        affiliateCommission: $affiliateCommission
        browser: $browser
        cashbackBalance: $cashbackBalance
        charge: $charge
        cost: $cost
        currency: $currency
        customerAddress: $customerAddress
        customerName: $customerName
        customerNote: $customerNote
        customerPhone: $customerPhone
        deliveryTime: $deliveryTime
        discount: $discount
        discountName: $discountName
        emiDuration: $emiDuration
        emiInterest: $emiInterest
        gatewayText: $gatewayText
        grossAmount: $grossAmount
        image: $image
        isEmi: $isEmi
        isRenew: $isRenew
        latitude: $latitude
        logisticsCharge: $logisticsCharge
        logisticsExtraCharge: $logisticsExtraCharge
        logisticsId: $logisticsId
        logisticsStoppageId: $logisticsStoppageId
        logisticsText: $logisticsText
        logisticsUrl: $logisticsUrl
        longitude: $longitude
        netAmount: $netAmount
        otp: $otp
        paid: $paid
        parentId: $parentId
        parentSiteId: $parentSiteId
        productId: $productId
        profit: $profit
        referCode: $referCode
        resellAmount: $resellAmount
        resellerAdvanceCollect: $resellerAdvanceCollect
        resellerCommission: $resellerCommission
        rewardPoints: $rewardPoints
        shopId: $shopId
        source: $source
        staffId: $staffId
        subscription: $subscription
        subscriptionFee: $subscriptionFee
        total: $total
        userId: 1
        validTill: $validTill
        vat: $vat
        vatAmount: $vatAmount
        weight: $weight
      }
      products: $products
    ) {
      address
      affiliateCommission
      affiliateIsPaid
      cashbackBalance
      charge
      childHid
      childId
      cost
      createdAt
      currency
      customerAddress
      customerId
      customerName
      customerNote
      customerPhone
      deliveryTime
      discount
      discountName
      emiDuration
      emiInterest
      gatewayText
      grossAmount
      id
      image
      isChargePaid
      isEmi
      isPaid
      isSettle
      isTransferred
      latitude
      logisticsCharge
      logisticsCityId
      logisticsExtraCharge
      logisticsId
      logisticsIsConfirmed
      logisticsIsPaid
      logisticsStoppageId
      logisticsText
      logisticsUrl
      logisticsZoneId
      longitude
      netAmount
      orderId
      paid
      parentId
      paymentId
      paymentResellerId
      profit
      resellAmount
      resellerAdvanceCollect
      resellerCommission
      resellerIsPaid
      rewardPoints
      status
      statusCompleted
      total
      trackingId
      updatedAt
      vat
      vatAmount
      customer {
        avatar
        domain
        userId
        hid
        title
        phone
        address
      }
      events {
        createdAt
        eventType
        id
        note
      }
      lines {
        cost
        currency
        id
        image
        isActive
        productId
        productHid
        productName
        productSku
        quantity
        resellPrice
        source
        unit
        price
        unitType
        variant
        vat
      }
    }
  }
`;

// SELF_STORE_ORDER_CREATE_BY_CHILD
export const SELF_STORE_ORDER_CREATE_BY_CHILD = gql`
  mutation selfStoreOrderCreateByChild(
    $userId: Int!
    $siteHid: String!
    $orderId: Int!
  ) {
    selfStoreOrderCreateByChild(
      userId: $userId
      siteHid: $siteHid
      orderId: $orderId
    ) {
      address
      affiliateCommission
      affiliateIsPaid
      cashbackBalance
      charge
      childHid
      childId
      cost
      createdAt
      currency
      customerAddress
      customerId
      customerName
      customerNote
      customerPhone
      deliveryTime
      discount
      discountName
      emiDuration
      emiInterest
      gatewayText
      grossAmount
      id
      isChargePaid
      isEmi
      isPaid
      isSettle
      isTransferred
      latitude
      logisticsCharge
      logisticsExtraCharge
      logisticsIsConfirmed
      logisticsIsPaid
      logisticsText
      logisticsUrl
      longitude
      netAmount
      orderId
      paid
      parentId
      paymentId
      paymentResellerId
      profit
      resellAmount
      resellerAdvanceCollect
      resellerCommission
      resellerIsPaid
      rewardPoints
      status
      statusCompleted
      total
      trackingId
      updatedAt
      vat
      vatAmount
      customer {
        avatar
        userId
        hid
        title
        phone
        address
      }
      events {
        createdAt
        eventType
        id
        note
      }
      pays {
        createdAt
        gatewayId
        id
        note
        payType
        paymentDate
        paymentId
        paymentNo
        paymentTitle
        total
      }
      lines {
        cost
        currency
        id
        image
        isActive
        productId
        productHid
        productName
        productSku
        quantity
        resellPrice
        source
        unit
        price
        unitType
        variant
        vat
      }
    }
  }
`;
// SELF_STORE_ORDER_CREATE_BY_TRANSFER
export const SELF_STORE_ORDER_CREATE_BY_TRANSFER = gql`
  mutation selfStoreOrderCreateByTransfer(
    $userId: Int!
    $siteId: Int!
    $orderId: Int!
  ) {
    selfStoreOrderCreateByTransfer(
      userId: $userId
      siteId: $siteId
      orderId: $orderId
    ) {
      address
      affiliateCommission
      affiliateIsPaid
      cashbackBalance
      charge
      childHid
      childId
      cost
      createdAt
      currency
      customerAddress
      customerId
      customerName
      customerNote
      customerPhone
      deliveryTime
      discount
      discountName
      emiDuration
      emiInterest
      gatewayText
      grossAmount
      id
      isChargePaid
      isEmi
      isPaid
      isSettle
      isTransferred
      latitude
      logisticsCharge
      logisticsExtraCharge
      logisticsIsConfirmed
      logisticsIsPaid
      logisticsText
      logisticsUrl
      longitude
      netAmount
      orderId
      paid
      parentId
      paymentId
      paymentResellerId
      profit
      resellAmount
      resellerAdvanceCollect
      resellerCommission
      resellerIsPaid
      rewardPoints
      status
      statusCompleted
      total
      trackingId
      updatedAt
      vat
      vatAmount
      customer {
        avatar
        userId
        hid
        title
        phone
        address
      }
      events {
        createdAt
        eventType
        id
        note
      }
      pays {
        createdAt
        gatewayId
        id
        note
        payType
        paymentDate
        paymentId
        paymentNo
        paymentTitle
        total
      }
      lines {
        cost
        currency
        id
        image
        isActive
        productId
        productHid
        productName
        productSku
        quantity
        resellPrice
        source
        unit
        price
        unitType
        variant
        vat
      }
    }
  }
`;
// SELF_STORE_ORDER_UPDATE
export const SELF_STORE_ORDER_UPDATE = gql`
  mutation selfStoreOrderUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $customerId: Int!
    $address: String
    $affiliateCommission: Float
    $affiliateIsPaid: Boolean
    $cost: Float!
    $customerAddress: String
    $customerName: String
    $customerNote: String
    $customerPhone: Int
    $deliveryTime: String
    $discount: Float!
    $discountName: String
    $emiDuration: Int
    $emiInterest: Float
    $gatewayText: String
    $grossAmount: Float!
    $paymentId: Int
    $paymentResellerId: Int
    $isEmi: Boolean
    $isPaid: Boolean
    $isSettle: Boolean
    $latitude: Float
    $logisticsCharge: Float!
    $logisticsExtraCharge: Float!
    $logisticsIsConfirmed: Boolean
    $logisticsIsPaid: Boolean
    $logisticsText: String
    $longitude: Float
    $netAmount: Float!
    $paid: Float!
    $parentId: Int
    $profit: Float!
    $resellAmount: Float
    $resellerAdvanceCollect: Float
    $resellerCommission: Float
    $resellerIsPaid: Boolean
    $rewardPoints: Float
    $source: String
    $status: Int
    $total: Float!
    $trackingId: String
    $vat: Float!
    $vatAmount: Float!
    $products: [StoreOrderCartUpdate!]
  ) {
    selfStoreOrderUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      customerId: $customerId
      data: {
        address: $address
        affiliateCommission: $affiliateCommission
        affiliateIsPaid: $affiliateIsPaid
        cost: $cost
        customerAddress: $customerAddress
        customerId: $customerId
        customerName: $customerName
        customerNote: $customerNote
        customerPhone: $customerPhone
        deliveryTime: $deliveryTime
        discount: $discount
        discountName: $discountName
        emiDuration: $emiDuration
        emiInterest: $emiInterest
        gatewayText: $gatewayText
        grossAmount: $grossAmount
        paymentId: $paymentId
        paymentResellerId: $paymentResellerId
        isEmi: $isEmi
        isPaid: $isPaid
        isSettle: $isSettle
        latitude: $latitude
        logisticsCharge: $logisticsCharge
        logisticsExtraCharge: $logisticsExtraCharge
        logisticsIsConfirmed: $logisticsIsConfirmed
        logisticsIsPaid: $logisticsIsPaid
        logisticsText: $logisticsText
        longitude: $longitude
        netAmount: $netAmount
        paid: $paid
        parentId: $parentId
        profit: $profit
        resellAmount: $resellAmount
        resellerAdvanceCollect: $resellerAdvanceCollect
        resellerCommission: $resellerCommission
        resellerIsPaid: $resellerIsPaid
        rewardPoints: $rewardPoints
        source: $source
        status: $status
        total: $total
        trackingId: $trackingId
        vat: $vat
        vatAmount: $vatAmount
      }
      products: $products
    ) {
      address
      affiliateCommission
      affiliateIsPaid
      cashbackBalance
      charge
      childHid
      childId
      cost
      createdAt
      currency
      customerAddress
      customerId
      customerName
      customerNote
      customerPhone
      deliveryTime
      discount
      discountName
      emiDuration
      emiInterest
      gatewayText
      grossAmount
      id
      isChargePaid
      isEmi
      isPaid
      isSettle
      isTransferred
      latitude
      logisticsCharge
      logisticsExtraCharge
      logisticsIsConfirmed
      logisticsIsPaid
      logisticsText
      logisticsUrl
      longitude
      netAmount
      orderId
      paid
      parentId
      paymentId
      paymentResellerId
      profit
      resellAmount
      resellerAdvanceCollect
      resellerCommission
      resellerIsPaid
      rewardPoints
      status
      statusCompleted
      total
      trackingId
      updatedAt
      vat
      vatAmount
      customer {
        avatar
        userId
        hid
        title
        phone
        address
      }
      events {
        createdAt
        eventType
        id
        note
      }
      pays {
        createdAt
        gatewayId
        id
        note
        payType
        paymentDate
        paymentId
        paymentNo
        paymentTitle
        total
      }
      lines {
        cost
        currency
        id
        image
        isActive
        productId
        productHid
        productName
        productSku
        quantity
        resellPrice
        source
        unit
        price
        unitType
        variant
        vat
      }
    }
  }
`;

// SELF_STORE_ORDER_LOGISTICS_PARCEL_CREATED_BY_MERCHANT
export const SELF_STORE_ORDER_LOGISTICS_PARCEL_CREATED_BY_MERCHANT = gql`
  mutation selfStoreOrderLogisticsParcelCreateByMerchant(
    $userId: Int!
    $orderId: Int!
  ) {
    selfStoreOrderLogisticsParcelCreateByMerchant(
      userId: $userId
      orderId: $orderId
    ) {
      id
    }
  }
`;
// SELF_STORE_ORDER_DELETE
export const SELF_STORE_ORDER_DELETE = gql`
  mutation selfStoreOrderDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfStoreOrderDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;
// SELF_STORE_ORDER_LINE_CREATE
export const SELF_STORE_ORDER_LINE_CREATE = gql`
  mutation selfStoreOrderLineCreate(
    $userId: Int!
    $siteId: Int!
    $orderId: Int!
    $customerId: Int!
    $address: String
    $affiliateCommission: Float
    $affiliateIsPaid: Boolean
    $cost: Float!
    $customerAddress: String
    $customerName: String
    $customerNote: String
    $customerPhone: Int
    $deliveryTime: String
    $discount: Float!
    $discountName: String
    $emiDuration: Int
    $emiInterest: Float
    $gatewayText: String
    $grossAmount: Float!
    $paymentId: Int
    $paymentResellerId: Int
    $isEmi: Boolean
    $isPaid: Boolean
    $isSettle: Boolean
    $latitude: Float
    $logisticsCharge: Float!
    $logisticsExtraCharge: Float!
    $logisticsIsConfirmed: Boolean
    $logisticsIsPaid: Boolean
    $logisticsText: String
    $longitude: Float
    $netAmount: Float!
    $paid: Float!
    $parentId: Int
    $profit: Float!
    $resellAmount: Float
    $resellerAdvanceCollect: Float
    $resellerCommission: Float
    $resellerIsPaid: Boolean
    $rewardPoints: Float
    $source: String
    $status: Int
    $total: Float!
    $trackingId: String
    $vat: Float!
    $vatAmount: Float!
    $productId: Int!
    $productPrice: Float!
    $productQuantity: Float!
    $productResellPrice: Float!
    $productShopId: Int
    $productVariant: String
    $productVariantId: Int
    $productVat: Float!
  ) {
    selfStoreOrderLineCreate(
      userId: $userId
      siteId: $siteId
      orderId: $orderId
      data: {
        id: $productId
        price: $productPrice
        quantity: $productQuantity
        resellPrice: $productResellPrice
        shopId: $productShopId
        variant: $productVariant
        variantId: $productVariantId
        vat: $productVat
      }
      orderData: {
        address: $address
        affiliateCommission: $affiliateCommission
        affiliateIsPaid: $affiliateIsPaid
        cost: $cost
        customerAddress: $customerAddress
        customerId: $customerId
        customerName: $customerName
        customerNote: $customerNote
        customerPhone: $customerPhone
        deliveryTime: $deliveryTime
        discount: $discount
        discountName: $discountName
        emiDuration: $emiDuration
        emiInterest: $emiInterest
        gatewayText: $gatewayText
        grossAmount: $grossAmount
        paymentId: $paymentId
        paymentResellerId: $paymentResellerId
        isEmi: $isEmi
        isPaid: $isPaid
        isSettle: $isSettle
        latitude: $latitude
        logisticsCharge: $logisticsCharge
        logisticsExtraCharge: $logisticsExtraCharge
        logisticsIsConfirmed: $logisticsIsConfirmed
        logisticsIsPaid: $logisticsIsPaid
        logisticsText: $logisticsText
        longitude: $longitude
        netAmount: $netAmount
        paid: $paid
        parentId: $parentId
        profit: $profit
        resellAmount: $resellAmount
        resellerAdvanceCollect: $resellerAdvanceCollect
        resellerCommission: $resellerCommission
        resellerIsPaid: $resellerIsPaid
        rewardPoints: $rewardPoints
        source: $source
        status: $status
        total: $total
        trackingId: $trackingId
        vat: $vat
        vatAmount: $vatAmount
      }
    ) {
      id
    }
  }
`;
// SELF_STORE_ORDER_LINE_UPDATE
export const SELF_STORE_ORDER_LINE_UPDATE = gql`
  mutation selfStoreOrderLineUpdate(
    $userId: Int!
    $siteId: Int!
    $orderId: Int!
    $id: Int!
    $affiliateCommission: Float!
    $affiliateIsPaid: Boolean!
    $customerAddress: String!
    $customerName: String!
    $customerNote: String
    $customerPhone: String!
    $deliveryTime: String
    $discount: Float!
    $discountName: String
    $gatewayText: String!
    $isPaid: Boolean!
    $paid: Float!
    $resellerCommission: Float!
    $resellerIsPaid: Boolean!
    $rewardPoints: Float!
    $logisticsCharge: Float!
    $logisticsText: String!
    $status: Int!
    $total: Float!
    $isActive: Boolean!
    $isShippingRequired: Boolean!
    $quantity: Int!
    $resellPrice: Float!
    $price: Float!
    $variant: String!
  ) {
    selfStoreOrderLineUpdate(
      userId: $userId
      siteId: $siteId
      orderId: $orderId
      id: $id
      data: {
        isActive: $isActive
        isShippingRequired: $isShippingRequired
        quantity: $quantity
        resellPrice: $resellPrice
        price: $price
        variant: $variant
      }
      orderData: {
        affiliateCommission: $affiliateCommission
        affiliateIsPaid: $affiliateIsPaid
        customerAddress: $customerAddress
        customerName: $customerName
        customerNote: $customerNote
        customerPhone: $customerPhone
        deliveryTime: $deliveryTime
        discount: $discount
        discountName: $discountName
        gatewayText: $gatewayText
        isPaid: $isPaid
        paid: $paid
        resellerCommission: $resellerCommission
        resellerIsPaid: $resellerIsPaid
        rewardPoints: $rewardPoints
        logisticsCharge: $logisticsCharge
        logisticsText: $logisticsText
        status: $status
        total: $total
      }
    ) {
      id
    }
  }
`;
// SELF_SITE_ORDER_EVENT_CREATE
export const SELF_SITE_ORDER_EVENT_CREATE = gql`
  mutation selfStoreOrderEventCreate(
    $userId: Int!
    $siteId: Int!
    $orderId: Int!
    $eventType: Int!
    $note: String!
    $status: Int!
  ) {
    selfStoreOrderEventCreate(
      userId: $userId
      siteId: $siteId
      orderId: $orderId
      eventType: $eventType
      note: $note
      status: $status
    ) {
      createdAt
      eventType
      id
      note
    }
  }
`;
// SELF_SITE_ORDER_EVENT_CREATE_BY_CUSTOMER
export const SELF_SITE_ORDER_EVENT_CREATE_BY_CUSTOMER = gql`
  mutation selfStoreOrderEventCreateByCustomer(
    $userId: Int!
    $siteId: Int!
    $orderId: Int!
    $eventType: Int!
    $note: String!
  ) {
    selfStoreOrderEventCreateByCustomer(
      userId: $userId
      siteId: $siteId
      orderId: $orderId
      eventType: $eventType
      note: $note
    ) {
      createdAt
      eventType
      id
      note
    }
  }
`;
// SELF_SITE_ORDERS_EVENT_CREATE
export const SELF_SITE_ORDERS_EVENT_CREATE = gql`
  mutation selfStoreOrdersEventCreate(
    $userId: Int!
    $siteId: Int!
    $orderIds: [Int]!
    $eventType: Int!
    $note: String!
    $status: Int!
  ) {
    selfStoreOrdersEventCreate(
      userId: $userId
      siteId: $siteId
      orderIds: $orderIds
      eventType: $eventType
      note: $note
      status: $status
    )
  }
`;

// STORE_ORDER_SUBSCRIPTION
export const STORE_ORDER_SUBSCRIPTION = gql`
  subscription storeOrder($channel: String!) {
    storeOrder(channel: $channel) {
      createdAt
      currency
      customerAddress
      customerName
      customerNote
      customerPhone
      id
      isSettle
      orderId
      paid
      profit
      resellAmount
      status
      total
      updatedAt
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE ORDERS
// ----------------------------------------------------------------------------------------------
// STORE_ORDER_PAYMENTS
export const STORE_ORDER_PAYMENTS = gql`
  query ($siteId: Int!, $customerId: Int, $after: String) {
    storeOrderPayments(
      siteId: $siteId
      customerId: $customerId
      after: $after
    ) {
      edges {
        node {
          createdAt
          customerId
          customerPhone
          customerTitle
          hid
          id
          invoiceId
          isPaid
          isSettle
          note
          orderIds
          paymentDate
          paymentId
          paymentNo
          paymentTitle
          status
          total
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
// STORE_ORDER_PAYMENT_DETAILS
export const STORE_ORDER_PAYMENT_DETAILS = gql`
  query ($siteId: Int!, $id: Int!) {
    storeOrderPayment(siteId: $siteId, id: $id) {
      createdAt
      customerId
      customerPhone
      customerTitle
      hid
      id
      invoiceId
      isPaid
      isSettle
      note
      orderIds
      orders {
        customerPhone
        customerTitle
        id
        logisticsCharge
        resellerCommission
        total
      }
      paymentDate
      paymentId
      paymentNo
      paymentTitle
      status
      total
      updatedAt
    }
  }
`;

// SELF_STORE_ORDER_PAYMENT_CREATE
export const SELF_STORE_ORDER_PAYMENT_CREATE = gql`
  mutation selfStoreOrderPaymentCreate(
    $userId: Int!
    $siteId: Int!
    $customerId: Int
    $queryType: String!
  ) {
    selfStoreOrderPaymentCreate(
      userId: $userId
      siteId: $siteId
      customerId: $customerId
      queryType: $queryType
    )
  }
`;
// SELF_STORE_ORDER_PAYMENT_UPDATE
export const SELF_STORE_ORDER_PAYMENT_UPDATE = gql`
  mutation selfStoreOrderPaymentUpdate(
    $userId: Int!
    $id: Int!
    $queryType: String!
    $invoiceId: Int
    $isPaid: Boolean
    $isSettle: Boolean
    $note: String
    $orderIds: [Int]
    $paymentDate: DateTime
    $paymentId: String
    $paymentNo: String
    $paymentTitle: String
    $status: Int
    $total: Float
  ) {
    selfStoreOrderPaymentUpdate(
      userId: $userId
      id: $id
      queryType: $queryType
      data: {
        invoiceId: $invoiceId
        isPaid: $isPaid
        isSettle: $isSettle
        note: $note
        orderIds: $orderIds
        paymentDate: $paymentDate
        paymentId: $paymentId
        paymentNo: $paymentNo
        paymentTitle: $paymentTitle
        status: $status
        total: $total
      }
    ) {
      id
    }
  }
`; // SELF_STORE_ORDER_PAYMENT_CREATE_INVOICE
export const SELF_STORE_ORDER_PAYMENT_CREATE_INVOICE = gql`
  mutation selfStoreOrderPaymentCreateInvoice(
    $userId: Int!
    $siteId: Int!
    $id: Int!
  ) {
    selfStoreOrderPaymentCreateInvoice(
      userId: $userId
      siteId: $siteId
      id: $id
    ) {
      id
      hid
    }
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        STORE PAYMENT
// ----------------------------------------------------------------------------------------------
// STORE_ORDER_PAYMENT_REQUEST_BY_BPAY
export const STORE_ORDER_PAYMENT_REQUEST_BY_BPAY = gql`
  mutation storeOrderPaymentRequestByBpay($siteId: Int!, $orderId: Int!) {
    storeOrderPaymentRequestByBpay(siteId: $siteId, orderId: $orderId)
  }
`;
// SELF_STORE_ORDER_PAYMENT_REQUEST_BY_CASHBACK
export const SELF_STORE_ORDER_PAYMENT_REQUEST_BY_CASHBACK = gql`
  mutation selfStoreOrderPaymentRequestByCashback(
    $userId: Int!
    $orderId: Int!
    $customerId: Int!
  ) {
    selfStoreOrderPaymentRequestByCashback(
      userId: $userId
      orderId: $orderId
      customerId: $customerId
    ) {
      createdAt
      eventType
      id
      note
    }
  }
`;
// STORE_ORDER_PAYMENT_REQUEST
export const STORE_ORDER_PAYMENT_REQUEST = gql`
  mutation storeOrderPaymentRequest(
    $siteId: Int!
    $gatewayId: Int!
    $amount: Float!
    $callBack: String
    $cancelUrl: String!
    $currency: String!
    $customerAddress: String
    $customerName: String!
    $customerPhone: String
    $emiDuration: Int!
    $emiInterest: Float!
    $failUrl: String!
    $isCardTransaction: Boolean!
    $isCodPayment: Boolean!
    $isEmi: Boolean!
    $merchantId: Int!
    $message: String
    $optionA: String
    $optionB: String
    $optionC: String
    $optionD: String
    $optionE: String
    $otherUrl: String
    $payeeSource: String!
    $paymentId: String
    $productInfo: String!
    $referenceId: String!
    $shipAddress: String
    $showRefundButton: Boolean!
    $successUrl: String!
    $transactionSource: String
    $transactionType: Int!
  ) {
    storeOrderPaymentRequest(
      siteId: $siteId
      gatewayId: $gatewayId
      data: {
        amount: $amount
        callBack: $callBack
        cancelUrl: $cancelUrl
        currency: $currency
        customerAddress: $customerAddress
        customerName: $customerName
        customerPhone: $customerPhone
        emiDuration: $emiDuration
        emiInterest: $emiInterest
        failUrl: $failUrl
        isCardTransaction: $isCardTransaction
        isCodPayment: $isCodPayment
        isEmi: $isEmi
        merchantId: $merchantId
        message: $message
        optionA: $optionA
        optionB: $optionB
        optionC: $optionC
        optionD: $optionD
        optionE: $optionE
        otherUrl: $otherUrl
        payeeSource: $payeeSource
        paymentId: $paymentId
        productInfo: $productInfo
        referenceId: $referenceId
        shipAddress: $shipAddress
        showRefundButton: $showRefundButton
        successUrl: $successUrl
        transactionSource: $transactionSource
        transactionType: $transactionType
      }
    ) {
      amount
      callBack
      cancelUrl
      currency
      customerName
      displayValue
      failUrl
      id
      isCaptured
      isPaid
      merchantId
      productInfo
      referenceId
      showRefundButton
      status
      successUrl
      transactionType
      transactionId
    }
  }
`;
// PAY_TRANSACTION_SUBSCRIPTION
export const PAY_TRANSACTION_SUBSCRIPTION = gql`
  subscription payTransaction($channel: String!) {
    payTransaction(channel: $channel) {
      amount
      callBack
      cancelUrl
      currency
      customerName
      displayValue
      failUrl
      id
      isCaptured
      isPaid
      merchantId
      productInfo
      referenceId
      showRefundButton
      status
      successUrl
      transactionType
      transactionId
    }
  }
`;
