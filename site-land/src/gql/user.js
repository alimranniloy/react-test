import gql from "graphql-tag";
// USERS
export const USERS = gql`
  query (
    $search: String
    $referedId: Int
    $sourceId: Int
    $isActive: Boolean
    $followerId: Int
    $followingId: Int
    $first: Int
    $after: String
  ) {
    users(
      search: $search
      referedId: $referedId
      sourceId: $sourceId
      isActive: $isActive
      followerId: $followerId
      followingId: $followingId
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          address
          avatar
          cover
          dateJoined
          followers
          following
          id
          isActive
          isVerified
          name
          phone
          username
          topFollowers
          topFollowing
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`; // USER_DETAILS
export const USER_DETAILS = gql`
  query user($id: Int!) {
    user(id: $id) {
      address
      avatar
      bio
      birth
      country
      cover
      currency
      dateJoined
      email
      firstName
      followers
      following
      formattedAddress
      id
      isActive
      isStaff
      isVerified
      latitude
      longitude
      name
      phone
      pinnedFeed
      referCode
      referedCode
      topFollowers
      topFollowing
      totalFeed
      totalPhotos
      username
      website
    }
  }
`; // USER_DETAILS_BY_USERNAME
export const USER_DETAILS_BY_USERNAME = gql`
  query userByUsername($username: String!) {
    userByUsername(username: $username) {
      address
      avatar
      bio
      birth
      country
      cover
      currency
      dateJoined
      email
      firstName
      followers
      following
      formattedAddress
      id
      isActive
      isVerified
      isStaff
      latitude
      longitude
      name
      phone
      pinnedFeed
      referCode
      referedCode
      topFollowers
      topFollowing
      totalFeed
      totalPhotos
      username
      website
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
      username
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
      username
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

// SELF_USER_ADD_FOLLOWING
export const SELF_USER_ADD_FOLLOWING = gql`
  mutation selfUserAddFollowing($userId: Int!, $followerId: Int!) {
    selfUserAddFollowing(userId: $userId, followerId: $followerId) {
      id
    }
  }
`;

// SELF_USER_REMOVE_FOLLOWING
export const SELF_USER_REMOVE_FOLLOWING = gql`
  mutation selfUserRemoveFollowing($userId: Int!, $followerId: Int!) {
    selfUserRemoveFollowing(userId: $userId, followerId: $followerId) {
      id
    }
  }
`;
