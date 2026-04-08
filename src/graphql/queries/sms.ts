import { gql } from "@apollo/client";

export const SELF_SMS_ACCOUNT = gql`
  query ($userId: Int!) {
    selfSmsAccount(userId: $userId) {
      accountType
      address
      avatar
      balance
      charge
      credential
      credit
      currency
      id
      isActive
      isPaid
      isThirdParty
      name
      phone
      thirdPartyName
    }
  }
`;

export const SELF_SMS_MESSAGES = gql`
  query ($userId: Int!, $phone: Int, $after: String, $first: Int) {
    selfSmsMessages(userId: $userId, phone: $phone, after: $after, first: $first) {
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
