import gql from 'graphql-tag'
// STORE_STOPPAGES
export const STORE_STOPPAGES = gql`
  query(
    $siteId: [Int]!
    $search: String
    $isActive: Boolean
    $after: String
    $first: Int
    $childId: Int
  ) {
    storeStoppages(
      siteId: $siteId
      search: $search
      isActive: $isActive
      after: $after
      first: $first
    ) {
      total
      edges {
        node {
          address
          areaId
          charge(childId: $childId)
          cityId
          countryId
          id
          isActive(childId: $childId)
          latitude
          longitude
          stoppageType
          subCityId
          title(childId: $childId)
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`;// STORE_STOPPAGE_NEAREST
export const STORE_STOPPAGE_NEAREST = gql `
query($siteId: Int, $isActive: Boolean, $stoppageType: Int, $latitude: Float, $longitude: Float) {
  storeStoppageNearest(siteId: $siteId, isActive: $isActive, stoppageType: $stoppageType, latitude: $latitude, longitude: $longitude){
    address
    areaId
    charge
    cityId
    countryId
    id
    isActive
    latitude
    longitude
    stoppageType
    subCityId
    title
    updatedAt
  }
}
`;
// SELF_STORE_STOPPAGE_CREATE
export const SELF_STORE_STOPPAGE_CREATE = gql `
mutation selfStoreStoppageCreate(
  $userId: Int!
  $siteId: Int!
  $address: String!
  $areaId: Int
  $charge: Float!
  $cityId: Int
  $countryId: Int
  $formattedAddress: String!
  $isActive: Boolean!
  $latitude: Float!
  $longitude: Float!
  $stoppageType: Int!
  $subCityId: Int
  $title: String!
  $childData: JSON!
) {
  selfStoreStoppageCreate(
    userId: $userId
    siteId: $siteId
    data: {
      address: $address
      areaId: $areaId
      charge: $charge
      cityId: $cityId
      countryId: $countryId
      formattedAddress: $formattedAddress
      isActive: $isActive
      latitude: $latitude
      longitude: $longitude
      siteId: $siteId
      stoppageType: $stoppageType
      subCityId: $subCityId
      childData: $childData
      title: $title
    }
  ) {
    address
    areaId
    charge
    cityId
    countryId
    id
    isActive
    latitude
    longitude
    stoppageType
    subCityId
    title
    updatedAt
  }
}
`;
// SELF_STORE_STOPPAGE_UPDATE
export const SELF_STORE_STOPPAGE_UPDATE = gql `
mutation selfStoreStoppageUpdate(
  $userId: Int!
  $id: Int!
  $address: String
  $areaId: Int
  $charge: Float
  $cityId: Int
  $countryId: Int
  $formattedAddress: String
  $isActive: Boolean
  $latitude: Float
  $longitude: Float
  $stoppageType: Int
  $subCityId: Int
  $title: String
) {
  selfStoreStoppageUpdate(
    userId: $userId
    id: $id
    data: {
      address: $address
      areaId: $areaId
      charge: $charge
      cityId: $cityId
      countryId: $countryId
      formattedAddress: $formattedAddress
      isActive: $isActive
      latitude: $latitude
      longitude: $longitude
      stoppageType: $stoppageType
      subCityId: $subCityId
      title: $title
    }
  ) {
    address
    areaId
    charge
    cityId
    countryId
    id
    isActive
    latitude
    longitude
    stoppageType
    subCityId
    title
    updatedAt
  }
}
`;
// SELF_STORE_STOPPAGE_DELETE
export const SELF_STORE_STOPPAGE_DELETE = gql `
mutation selfStoreStoppageDelete($userId: Int!, $id: Int!) {
  selfStoreStoppageDelete(userId: $userId, id: $id)
}
`;