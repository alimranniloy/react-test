import gql from "graphql-tag";
// ------------------------------------------------------------------
// ME
export const ME = gql`
  query {
    me {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isActive
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
// ME_DETAILS
export const ME_DETAILS = gql`
  query {
    me {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isActive
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
// SELF_LOGIN
export const SELF_LOGIN = gql`
  mutation selfLogin($userId: Int!) {
    selfLogin(userId: $userId)
  }
`;
// SELF_LOGOUT
export const SELF_LOGOUT = gql`
  mutation selfLogout($userId: Int!) {
    selfLogout(userId: $userId)
  }
`;
// USER_PHONE_INFO
export const USER_PHONE_INFO = gql`
  query ($countryCode: String!, $phone: String!) {
    userPhoneInfo(countryCode: $countryCode, phone: $phone) {
      isValid
      phone
    }
  }
`;
// SELF_USER_UPDATE
export const SELF_USER_UPDATE = gql`
  mutation selfUserUpdate(
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
    selfUserUpdate(
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
      isActive
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

// SELF_USER_UPDATE_PHONE
export const SELF_USER_UPDATE_PHONE = gql`
  mutation selfUserUpdatePhone($userId: Int!, $phone: Int!) {
    selfUserUpdatePhone(userId: $userId, phone: $phone) {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isActive
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
// USERS
export const USERS = gql`
  query ($referedId: Int!, $after: String) {
    users(referedId: $referedId, after: $after) {
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

// LOGIN
export const LOGIN = gql`
  mutation login($id: Int!, $password: String!, $parentId: Int) {
    login(id: $id, password: $password, parentId: $parentId) {
      message
      token
    }
  }
`;
// LOGIN_BY_OTP
export const LOGIN_BY_OTP = gql`
  mutation loginByOtp($id: Int!, $otp: Int!) {
    loginByOtp(id: $id, otp: $otp)
  }
`;
// JOIN
export const JOIN = gql`
  mutation join(
    $country: Int!
    $currency: String!
    $firstName: String!
    $language: String!
    $lastName: String!
    $name: String!
    $password: String!
    $phone: Int!
    $referedCode: String
    $source: String
    $username: String!
    $sourceId: Int
    $parentId: Int
  ) {
    join(
      data: {
        country: $country
        currency: $currency
        firstName: $firstName
        language: $language
        lastName: $lastName
        name: $name
        password: $password
        phone: $phone
        referedCode: $referedCode
        source: $source
        sourceId: $sourceId
        username: $username
      }
      sourceId: $sourceId
      parentId: $parentId
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
      isActive
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
// USER_IS_UNIQUE_EMAIL
export const USER_IS_UNIQUE_EMAIL = gql`
  query ($email: String!) {
    userIsUniqueEmail(email: $email)
  }
`;
// USER_IS_UNIQUE_PHONE
export const USER_IS_UNIQUE_PHONE = gql`
  query ($phone: Int!) {
    userIsUniquePhone(phone: $phone)
  }
`;
// USER_CHECK
export const USER_CHECK = gql`
  query ($data: String!, $parentId: Int) {
    userCheck(data: $data, parentId: $parentId) {
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
    }
  }
`;
// USER_BY_HID
export const USER_BY_HID = gql`
  query ($hid: String!) {
    userByHid(hid: $hid) {
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
    }
  }
`;
// USER_INFO
export const USER_INFO = gql`
  query ($countryCode: String!) {
    userInfo(countryCode: $countryCode) {
      country
      countryCode
      countryName
      currency
      language
    }
  }
`;
// USER_PASSWORD_UPDATE
export const USER_PASSWORD_UPDATE = gql`
  mutation userPasswordUpdate(
    $id: Int!
    $email: String!
    $old: String!
    $new: String!
    $parentId: Int
  ) {
    userPasswordUpdate(
      id: $id
      data: { email: $email, new: $new, old: $old }
      parentId: $parentId
    ) {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isActive
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
// USER_OTP_PASSWORD_UPDATE
export const USER_OTP_PASSWORD_UPDATE = gql`
  mutation userOtpPasswordUpdate(
    $id: Int!
    $email: String!
    $otp: Int!
    $new: String!
    $parentId: Int
  ) {
    userOtpPasswordUpdate(
      id: $id
      data: { email: $email, otp: $otp, new: $new }
      parentId: $parentId
    ) {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isActive
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
// USER_ACTIVE_UPDATE
export const USER_ACTIVE_UPDATE = gql`
  mutation userActiveUpdate($id: Int!, $otp: Int!) {
    userActiveUpdate(id: $id, otp: $otp) {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isActive
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
// USER_OTP_UPDATE
export const USER_OTP_UPDATE = gql`
  mutation userOtpUpdate($id: Int!, $source: String!, $sourceId: Int) {
    userOtpUpdate(id: $id, source: $source, sourceId: $sourceId) {
      address
      avatar
      country
      currency
      email
      firstName
      formattedAddress
      id
      isActive
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
// SELF_USER_TOKEN
export const SELF_USER_TOKEN = gql`
  mutation selfUserToken($userId: Int!, $days: Int!) {
    selfUserToken(userId: $userId, days: $days)
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
