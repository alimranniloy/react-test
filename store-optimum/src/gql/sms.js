import gql from 'graphql-tag'
// SELF_SMS_ACCOUNT
export const SELF_SMS_ACCOUNT = gql `
query($userId: Int!) {
  selfSmsAccount(userId: $userId) {
    address
    avatar
    balance
    charge
    credit
    currency
    id
    isActive
    isPaid
    name
    phone
  }
}
`;

// SELF_SMS_ACCOUNT_CREATE
export const SELF_SMS_ACCOUNT_CREATE = gql `
mutation selfSmsAccountCreate(
  $userId: Int!
  $accountType: Int!
  $address: String
  $avatar: String!
  $country: Int!
  $currency: String!
  $name: String!
  $phone: Int
) {
  selfSmsAccountCreate(
    userId: $userId
    data: {
      accountType: $accountType
      address: $address
      avatar: $avatar
      country: $country
      currency: $currency
      name: $name
      phone: $phone
      userId: $userId
    }
  ) {
    address
    avatar
    currency
    id
    isActive
    isPaid
    name
    phone
  }
}

`;
// SMS_MESSAGES
export const SMS_MESSAGES = gql `
query($userId: Int!, $phone: Int, $after: String) {
  smsMessages(userId: $userId, phone: $phone, after: $after) {
      total
      edges {
      node {
        charge
        count
        id
        message
        phone
        status
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
`; // SELF_SMS_MESSAGES
export const SELF_SMS_MESSAGES = gql `
query($userId: Int!, $phone: Int, $after: String) {
  selfSmsMessages(userId: $userId, phone: $phone, after: $after) {
      total
      edges {
      node {
        charge
        count
        id
        message
        phone
        status
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
// SMS_MESSAGE_CREATE
export const SMS_MESSAGE_CREATE = gql `
mutation selfSmsMessageCreate(
  $userId: Int!
  $accountId: Int!
  $channel: String!
  $charge: Float!
  $count: Int!
  $currency: String!
  $message: String!
  $phone: Int!
  $senderId: Int!
) {
  selfSmsMessageCreate(
    userId: $userId
    channel: $channel
    data: { accountId: $accountId, channel: $channel, charge: $charge, count: $count, currency: $currency, message: $message, phone: $phone, senderId: $senderId }
  ) {
    charge
    count
    id
    message
    phone
    status
    updatedAt
  }
}

`;
// SMS_MESSAGE_UPDATE
export const SMS_MESSAGE_UPDATE = gql `
mutation selfSmsMessageUpdate(
  $userId: Int!
  $messageId: Int!
  $channel: String!
  $charge: Float!
  $count: Int!
  $currency: String!
  $status: Int!
) {
  selfSmsMessageUpdate(
    userId: $userId
    messageId: $messageId
    data: { channel: $channel, charge: $charge, count: $count, currency: $currency, status: $status}
  ) {
    charge
    count
    id
    message
    phone
    status
    updatedAt
  }
}

`;
// STAFF_SMS_MESSAGE_UPDATE
export const STAFF_SMS_MESSAGE_UPDATE = gql `
mutation staffSmsMessageUpdate(
  $userId: Int!
  $messageId: Int!
  $channel: String!
  $status: Int!
) {
  staffSmsMessageUpdate(
    userId: $userId
    messageId: $messageId
    channel: $channel
    status: $status
  ) {
    charge
    count
    id
    message
    phone
    status
    updatedAt
  }
}

`;
// SMS_MESSAGE_SUBSCRIPTION
export const SMS_MESSAGE_SUBSCRIPTION = gql `
subscription smsMessage(
  $channel: String!
) {
  smsMessage(
    channel: $channel
  ) {
    charge
    count
    id
    message
    phone
    status
    updatedAt
  }
}
`;