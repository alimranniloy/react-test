import gql from "graphql-tag";
// LOGISTICS_COMPANIES
export const LOGISTICS_COMPANIES = gql`
  query ($isActive: Boolean!, $search: String, $after: String) {
    logisticsCompanies(isActive: $isActive, search: $search, after: $after) {
      total
      edges {
        node {
          domain
          id
          isActive
          isPaid
          logo
          street
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
// LOGISTICS_MERCHANTS
export const LOGISTICS_MERCHANTS = gql`
  query ($userId: Int, $search: String, $isActive: Boolean, $after: String) {
    logisticsMerchants(
      userId: $userId
      search: $search
      isActive: $isActive
      after: $after
    ) {
      total
      edges {
        node {
          balance
          chargeBase
          chargeFixed
          chargeMaximum
          chargeMerchantDefined
          chargeMinimum
          chargePerKg
          chargePerKm
          chargeSameArea
          chargeSameCity
          chargeSameCountry
          chargeSameSubCity
          discount
          id
          isActive
          logisticsAddress
          logisticsTitle
          companyId
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

// LOGISTICS_MERCHANT_PREVIEW
export const LOGISTICS_MERCHANT_PREVIEW = gql`
  query ($companyId: Int!, $id: Int!) {
    logisticsMerchant(companyId: $companyId, id: $id) {
      address
      balance
      chargeBase
      chargeConditions {
        charge
        id
        maxPurchase
        maxWeight
        minPurchase
        minWeight
      }
      chargeFixed
      chargeMaximum
      chargeMerchantDefined
      chargeMinimum
      chargePerKg
      chargePerKm
      chargeSameArea
      chargeSameCity
      chargeSameCountry
      chargeSameSubCity
      credential
      discount
      email
      formattedAddress
      id
      isActive
      latitude
      logisticsAddress
      logisticsTitle
      longitude
      paymentNo
      paymentTitle
      phone
      street
      thumbnail
      companyId
      company {
        domain
        id
        isActive
        isPaid
        logo
        street
        title
        updatedAt
      }
      title
      updatedAt
    }
  }
`;
// LOGISTICS_ORDER_DELIVERY_CHARGE_CALCULATE
export const LOGISTICS_ORDER_DELIVERY_CHARGE_CALCULATE = gql`
  mutation logisticsParcelDeliveryChargeCalculate(
    $companyId: Int!
    $merchantId: Int!
    $startLatitude: Float!
    $startLongitude: Float!
    $endLatitude: Float!
    $endLongitude: Float!
    $weight: Float!
  ) {
    logisticsOrderDeliveryChargeCalculate(
      companyId: $companyId
      merchantId: $merchantId
      startLatitude: $startLatitude
      startLongitude: $startLongitude
      endLatitude: $endLatitude
      endLongitude: $endLongitude
      weight: $weight
    )
  }
`;

// LOGISTICS_PARCEL_DELIVERY_CHARGE_CALCULATE
export const LOGISTICS_PARCEL_DELIVERY_CHARGE_CALCULATE = gql`
  mutation logisticsParcelDeliveryChargeCalculate(
    $companyId: Int!
    $merchantId: Int!
    $startLatitude: Float!
    $startLongitude: Float!
    $endLatitude: Float!
    $endLongitude: Float!
    $weight: Float!
    $routeId: Int
    $stoppageType: Int
    $startStoppageId: Int
    $endStoppageId: Int
    $purchase: Float
  ) {
    logisticsParcelDeliveryChargeCalculate(
      companyId: $companyId
      merchantId: $merchantId
      startLatitude: $startLatitude
      startLongitude: $startLongitude
      endLatitude: $endLatitude
      endLongitude: $endLongitude
      weight: $weight
      routeId: $routeId
      stoppageType: $stoppageType
      startStoppageId: $startStoppageId
      endStoppageId: $endStoppageId
      purchase: $purchase
    )
  }
`;
// ----------------------------------------------------------------------------------------------
//                                        LOGISTICS MERCHANT
// ----------------------------------------------------------------------------------------------
// SELF_LOGISTICS_MERCHANT
export const SELF_LOGISTICS_MERCHANT = gql`
  query ($userId: Int!, $companyId: Int!) {
    selfLogisticsMerchant(userId: $userId, companyId: $companyId) {
      address
      balance
      chargeConditions {
        charge
        id
        maxPurchase
        maxWeight
        minPurchase
        minWeight
      }
      chargeBase
      chargeFixed
      chargeMerchantDefined
      chargePerKg
      chargePerKm
      chargeSameArea
      chargeSameCity
      chargeSameCountry
      chargeSameSubCity
      credential
      codCharge
      createdAt
      discount
      email
      formattedAddress
      id
      isActive
      isPrepaid
      isVerified
      lastPayment
      latitude
      longitude
      note
      parcelsCancelled
      parcelsConfirmed
      parcelsDelivered
      parcelsInTransit
      parcelsNew
      parcelsPickedUp
      parcelsReadyForPick
      parcelsRejected
      parcelsReturned
      parcelsShipping
      parcelsTotal
      phone
      pickupAddress {
        address
        areaId
        cityId
        countryId
        id
        isActive
        latitude
        longitude
        stoppageType
        subCityId
        title
      }
      street
      thumbnail
      title
      totalCollected
      totalPaid
      totalProcessing
      userId
    }
  }
`;
// // SELF_LOGISTICS_MERCHANT_UPDATE
export const SELF_LOGISTICS_MERCHANT_UPDATE = gql`
  mutation selfLogisticsMerchantUpdate(
    $userId: Int!
    $id: Int!
    $address: String
    $chargeBase: Int
    $chargeConditions: JSON
    $chargeFixed: Float
    $chargeMaximum: Float
    $chargeMerchantDefined: Float
    $chargeMinimum: Float
    $chargePerKg: Float
    $chargePerKm: Float
    $chargeSameArea: Float
    $chargeSameCity: Float
    $chargeSameCountry: Float
    $chargeSameSubCity: Float
    $credential: JSON
    $email: String
    $formattedAddress: String
    $isActive: Boolean
    $latitude: Float
    $logisticsAddress: String
    $logisticsTitle: String
    $longitude: Float
    $paymentNo: String
    $paymentTitle: String
    $phone: Int
    $street: String
    $thumbnail: Upload
    $title: String
  ) {
    selfLogisticsMerchantUpdate(
      userId: $userId
      id: $id
      data: {
        address: $address
        chargeBase: $chargeBase
        chargeConditions: $chargeConditions
        chargeFixed: $chargeFixed
        chargeMaximum: $chargeMaximum
        chargeMerchantDefined: $chargeMerchantDefined
        chargeMinimum: $chargeMinimum
        chargePerKg: $chargePerKg
        chargePerKm: $chargePerKm
        chargeSameArea: $chargeSameArea
        chargeSameCity: $chargeSameCity
        chargeSameCountry: $chargeSameCountry
        chargeSameSubCity: $chargeSameSubCity
        credential: $credential
        email: $email
        formattedAddress: $formattedAddress
        isActive: $isActive
        latitude: $latitude
        logisticsAddress: $logisticsAddress
        logisticsTitle: $logisticsTitle
        longitude: $longitude
        paymentNo: $paymentNo
        paymentTitle: $paymentTitle
        phone: $phone
        street: $street
        thumbnail: $thumbnail
        title: $title
      }
    ) {
      id
    }
  }
`;

// // SELF_STORE_ORDER_LOGISTICS_ORDER_PLACE
export const SELF_STORE_ORDER_LOGISTICS_ORDER_PLACE = gql`
  mutation selfStoreOrderLogisticsOrderPlace(
    $userId: Int!
    $siteId: Int!
    $orderId: Int!
  ) {
    selfStoreOrderLogisticsOrderPlace(
      userId: $userId
      siteId: $siteId
      orderId: $orderId
    ) {
      id
      logisticsIsConfirmed
    }
  }
`;

// LOGISTICS_STOPPAGES
export const LOGISTICS_STOPPAGES = gql`
  query ($companyId: Int, $isActive: Boolean!, $after: String, $first: Int) {
    logisticsStoppages(
      companyId: $companyId
      isActive: $isActive
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          address
          areaId
          charge
          cityId
          countryId
          id
          isActive
          latitude
          longitude
          postCode
          stoppageType
          subCityId
          thirdPartyAreaId
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
