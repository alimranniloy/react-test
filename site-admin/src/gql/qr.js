import gql from 'graphql-tag'
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