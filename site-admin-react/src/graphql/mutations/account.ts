import { gql } from "@apollo/client";

export const SELF_KHATA_ACCOUNT_CREATE = gql`
  mutation selfKhataAccountCreate(
    $userId: Int!
    $accountType: Int!
    $address: String!
    $avatar: Upload
    $budget: Float!
    $currency: String!
    $phone: Int
    $tags: String
    $title: String!
    $total: Float!
  ) {
    selfKhataAccountCreate(
      userId: $userId
      data: {
        accountType: $accountType
        address: $address
        avatar: $avatar
        budget: $budget
        currency: $currency
        phone: $phone
        tags: $tags
        title: $title
        total: $total
        userId: $userId
      }
    ) {
      id
    }
  }
`;

export const SELF_KHATA_ACCOUNT_CREATE_BULK = gql`
  mutation selfKhataAccountCreateBulk($userId: Int!, $data: [KhataAccountContact!]) {
    selfKhataAccountCreateBulk(userId: $userId, data: $data) {
      id
    }
  }
`;
