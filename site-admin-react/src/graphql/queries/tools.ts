import { gql } from "@apollo/client";

export const SITE_LOGS = gql`
  query ($siteId: Int!, $topic: String, $topicId: Int, $after: String, $first: Int) {
    siteLogs(siteId: $siteId, topic: $topic, topicId: $topicId, first: $first, after: $after) {
      total
      edges {
        node {
          createdAt
          createdById
          id
          newValue
          note
          oldValue
          topic
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

export const STORE_GATEWAYS = gql`
  query ($siteId: Int!, $after: String, $first: Int, $isActive: Boolean) {
    storeGateways(siteId: $siteId, first: $first, after: $after, isActive: $isActive) {
      total
      edges {
        node {
          discount
          fee
          gatewayType
          id
          isActive
          isDiscount
          isFreeLogistics
          isManual
          isSandbox
          note
          priority
          title
          logo
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

export const STORE_GATEWAY = gql`
  query ($siteId: Int!, $id: Int!) {
    storeGateway(siteId: $siteId, id: $id) {
      discount
      fee
      gatewayType
      heighlight
      id
      isActive
      isDiscount
      isFreeLogistics
      isManual
      isSandbox
      note
      priority
      title
      updatedAt
      credential
      logo
      paymentProviderId
    }
  }
`;

export const LOGISTICS_MERCHANTS = gql`
  query ($userId: Int, $search: String, $isActive: Boolean, $after: String) {
    logisticsMerchants(userId: $userId, search: $search, isActive: $isActive, after: $after) {
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

export const LOGISTICS_COMPANIES = gql`
  query ($isActive: Boolean!, $isThirdParty: Boolean, $search: String, $queryType: String, $after: String) {
    logisticsCompanies(isActive: $isActive, isThirdParty: $isThirdParty, search: $search, queryType: $queryType, after: $after) {
      total
      edges {
        node {
          credentials
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

export const LOGISTICS_MERCHANT = gql`
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
        credentials
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

export const SELF_LOGISTICS_MERCHANT = gql`
  query ($userId: Int!, $companyId: Int!) {
    selfLogisticsMerchant(userId: $userId, companyId: $companyId) {
      id
    }
  }
`;

export const SITE_PAGES = gql`
  query ($siteId: Int!, $search: String, $after: String, $first: Int) {
    sitePages(siteId: $siteId, search: $search, first: $first, after: $after) {
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

export const SITE_PERMISSIONS = gql`
  query ($siteId: Int!, $after: String, $first: Int) {
    sitePermissions(siteId: $siteId, first: $first, after: $after) {
      total
      edges {
        node {
          id
          isActive
          permission
          siteId
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

export const SITE_PERMISSION = gql`
  query ($siteId: Int!, $id: Int!) {
    sitePermission(siteId: $siteId, id: $id) {
      id
      isActive
      permission
      siteId
      title
    }
  }
`;

export const FILE_FILES = gql`
  query ($userId: Int!, $queryType: String, $search: String, $after: String, $first: Int, $limit: Int) {
    fileFiles(userId: $userId, queryType: $queryType, search: $search, after: $after, first: $first, limit: $limit) {
      total
      edges {
        node {
          id
          isSecure
          size
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

export const FILE_FILE = gql`
  query ($id: Int!) {
    fileFile(id: $id) {
      id
      size
      title
      updatedAt
      url
      mimeType
    }
  }
`;
