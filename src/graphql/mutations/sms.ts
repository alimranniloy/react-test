import { gql } from "@apollo/client";

export const SELF_SMS_ACCOUNT_CREATE = gql`
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
      id
      name
      phone
      currency
      isActive
      isPaid
    }
  }
`;

export const SELF_SMS_ACCOUNT_UPDATE = gql`
  mutation selfSmsAccountUpdate(
    $userId: Int!
    $accountId: Int!
    $accountType: Int
    $address: String
    $avatar: String
    $balance: Float
    $country: Int
    $chagre: Float
    $credential: JSON
    $credit: Float
    $currency: String
    $isThirdParty: Boolean
    $name: String
    $phone: Int
    $thirdPartyName: String
  ) {
    selfSmsAccountUpdate(
      userId: $userId
      accountId: $accountId
      data: {
        accountType: $accountType
        address: $address
        avatar: $avatar
        balance: $balance
        country: $country
        chagre: $chagre
        credential: $credential
        credit: $credit
        currency: $currency
        isThirdParty: $isThirdParty
        name: $name
        phone: $phone
        thirdPartyName: $thirdPartyName
        userId: $userId
      }
    ) {
      id
      name
      phone
      currency
      isActive
      isPaid
    }
  }
`;

export const SMS_MESSAGE_CREATE = gql`
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
      data: {
        accountId: $accountId
        channel: $channel
        charge: $charge
        count: $count
        currency: $currency
        message: $message
        phone: $phone
        senderId: $senderId
      }
    ) {
      id
      phone
      message
      status
      updatedAt
    }
  }
`;
