import gql from "graphql-tag";
// USERS
export const USERS = gql`
  query (
    $search: String
    $referedId: Int
    $sourceId: Int
    $isActive: Boolean
    $referedById: Boolean
    $after: String
  ) {
    users(
      search: $search
      referedId: $referedId
      sourceId: $sourceId
      isActive: $isActive
      referedById: $referedById
      after: $after
    ) {
      total
      edges {
        node {
          address
          avatar
          dateJoined
          id
          isActive
          name
          phone
          referCode
          refereds {
            id
            parentId
            serial
            title
            userId
            sourceId
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
`; // USER_PREVIEW
export const USER_PREVIEW = gql`
  query user($id: Int!) {
    user(id: $id) {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isStaff
      isActive
      latitude
      longitude
      name
      phone
      referCode
      referedCode
      username
      loginDevice {
        active
        device
        id
        ip
        title
        ua
      }
    }
  }
`;
// SELF_USER_UPDATE_BY_SOURCE
export const SELF_USER_UPDATE_BY_SOURCE = gql`
  mutation selfUserUpdateBySource(
    $userId: Int!
    $id: Int!
    $isActive: Boolean
    $password: String
  ) {
    selfUserUpdateBySource(
      userId: $userId
      id: $id
      isActive: $isActive
      password: $password
    ) {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isStaff
      latitude
      longitude
      name
      phone
      referCode
      referedCode
      username
    }
  }
`;
// USER_UPDATE
export const USER_UPDATE = gql`
  mutation userUpdate(
    $userId: Int!
    $address: String
    $avatar: Upload
    $country: Int!
    $currency: String!
    $formattedAddress: String
    $latitude: Float
    $longitude: Float
    $name: String!
    $referedCode: String
  ) {
    userUpdate(
      userId: $userId
      data: {
        address: $address
        avatar: $avatar
        country: $country
        currency: $currency
        formattedAddress: $formattedAddress
        latitude: $latitude
        longitude: $longitude
        name: $name
        referedCode: $referedCode
      }
    ) {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isStaff
      latitude
      longitude
      name
      phone
      referCode
      referedCode
      username
    }
  }
`;
// USER_BY_PHONE
export const USER_BY_PHONE = gql`
  query ($phone: Int!) {
    userByPhone(phone: $phone) {
      id
      publicAddress
      publicFormattedAddress
      publicLatitude
      publicLongitude
      publicPhone
      publicTitle
    }
  }
`;

// SELF_USER_UPDATE_PUBLIC
export const SELF_USER_UPDATE_PUBLIC = gql`
  mutation selfUserUpdatePublic(
    $userId: Int!
    $id: Int!
    $publicAddress: String
    $publicFormattedAddress: String
    $publicLatitude: Float
    $publicLongitude: Float
    $publicPhone: Int
    $publicTitle: String
  ) {
    selfUserUpdatePublic(
      userId: $userId
      id: $id
      data: {
        publicAddress: $publicAddress
        publicFormattedAddress: $publicFormattedAddress
        publicLatitude: $publicLatitude
        publicLongitude: $publicLongitude
        publicPhone: $publicPhone
        publicTitle: $publicTitle
      }
    ) {
      id
      publicAddress
      publicFormattedAddress
      publicLatitude
      publicLongitude
      publicPhone
      publicTitle
    }
  }
`;

// USER_UPDATE_PUBLIC
export const USER_UPDATE_PUBLIC = gql`
  mutation userUpdatePublic(
    $id: Int!
    $publicAddress: String
    $publicFormattedAddress: String
    $publicLatitude: Float
    $publicLongitude: Float
    $publicPhone: Int
    $publicTitle: String
  ) {
    userUpdatePublic(
      id: $id
      data: {
        publicAddress: $publicAddress
        publicFormattedAddress: $publicFormattedAddress
        publicLatitude: $publicLatitude
        publicLongitude: $publicLongitude
        publicPhone: $publicPhone
        publicTitle: $publicTitle
      }
    ) {
      id
      publicAddress
      publicFormattedAddress
      publicLatitude
      publicLongitude
      publicPhone
      publicTitle
    }
  }
`;
