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
          chargeMerchantDefined
          discount
          id
          note
          isActive
          logisticsAddress
          logisticsTitle
          companyId
          company {
            domain
            id
            logo
            street
            phone
          }
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
      chargeBase
      chargeFixed
      chargeMerchantDefined
      chargePerKg
      chargePerKm
      chargeSameArea
      chargeSameCity
      chargeSameCountry
      chargeSameSubCity
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
    $chargeMerchantDefined: Float
    $email: String
    $formattedAddress: String
    $isActive: Boolean
    $latitude: Float
    $logisticsTitle: String
    $longitude: Float
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
        chargeMerchantDefined: $chargeMerchantDefined
        email: $email
        formattedAddress: $formattedAddress
        isActive: $isActive
        latitude: $latitude
        logisticsTitle: $logisticsTitle
        longitude: $longitude
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
