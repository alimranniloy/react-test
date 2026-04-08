import { gql } from "@apollo/client";

export const KHATA_ACCOUNT_DATA = gql`
  query ($id: Int!) {
    khataAccountData(id: $id) {
      id
      data {
        totalPayable
        totalReceiveable
        totalIncome
        totalExpence
        payable
        receiveable
        income
        expence
      }
    }
  }
`;

export const KHATA_ACCOUNTS = gql`
  query (
    $createdById: Int
    $accountType: Int
    $search: String
    $userId: Int
    $min: Float
    $max: Float
    $queryType: String
    $isDeleted: Boolean
    $first: Int
    $after: String
  ) {
    khataAccounts(
      createdById: $createdById
      accountType: $accountType
      search: $search
      userId: $userId
      min: $min
      max: $max
      queryType: $queryType
      isDeleted: $isDeleted
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          accountType
          amount
          avatar
          budget
          createdById
          hid
          id
          phone
          title
          total
          updatedAt
          userId
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
