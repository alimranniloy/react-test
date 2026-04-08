import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($id: Int!, $password: String!, $parentId: Int) {
    login(id: $id, password: $password, parentId: $parentId) {
      message
      token
    }
  }
`;

export const LOGIN_BY_OTP = gql`
  mutation loginByOtp($id: Int!, $otp: Int!) {
    loginByOtp(id: $id, otp: $otp)
  }
`;

export const USER_ACTIVE_UPDATE = gql`
  mutation userActiveUpdate($id: Int!, $otp: Int!) {
    userActiveUpdate(id: $id, otp: $otp) {
      id
      isActive
    }
  }
`;

export const USER_OTP_UPDATE = gql`
  mutation userOtpUpdate($id: Int!, $source: String!, $sourceId: Int) {
    userOtpUpdate(id: $id, source: $source, sourceId: $sourceId) {
      id
      isActive
      phone
    }
  }
`;
