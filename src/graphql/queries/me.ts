import { gql } from "@apollo/client";

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
