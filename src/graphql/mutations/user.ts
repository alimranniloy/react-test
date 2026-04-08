import { gql } from "@apollo/client";

export const SELF_USER_UPDATE_BY_SOURCE = gql`
  mutation selfUserUpdateBySource($userId: Int!, $id: Int!, $isActive: Boolean, $password: String) {
    selfUserUpdateBySource(userId: $userId, id: $id, isActive: $isActive, password: $password) {
      id
      isActive
      name
      phone
    }
  }
`;
