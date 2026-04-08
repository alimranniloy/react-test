import { gql } from "@apollo/client";

export const SELF_LOGISTICS_MERCHANT_UPDATE = gql`
  mutation selfLogisticsMerchantUpdate(
    $userId: Int!
    $id: Int!
    $address: String
    $chargeBase: Int
    $chargeConditions: JSON
    $chargeFixed: Float
    $chargeMaximum: Float
    $chargeMerchantDefined: Float
    $chargeMinimum: Float
    $chargePerKg: Float
    $chargePerKm: Float
    $chargeSameArea: Float
    $chargeSameCity: Float
    $chargeSameCountry: Float
    $chargeSameSubCity: Float
    $credential: JSON
    $email: String
    $formattedAddress: String
    $isActive: Boolean
    $latitude: Float
    $logisticsAddress: String
    $logisticsTitle: String
    $longitude: Float
    $paymentNo: String
    $paymentTitle: String
    $phone: Int
    $street: String
    $thumbnail: Upload
    $title: String
  ) {
    selfLogisticsMerchantUpdate(
      userId: $userId
      id: $id
      data: {
        address: $address
        chargeBase: $chargeBase
        chargeConditions: $chargeConditions
        chargeFixed: $chargeFixed
        chargeMaximum: $chargeMaximum
        chargeMerchantDefined: $chargeMerchantDefined
        chargeMinimum: $chargeMinimum
        chargePerKg: $chargePerKg
        chargePerKm: $chargePerKm
        chargeSameArea: $chargeSameArea
        chargeSameCity: $chargeSameCity
        chargeSameCountry: $chargeSameCountry
        chargeSameSubCity: $chargeSameSubCity
        credential: $credential
        email: $email
        formattedAddress: $formattedAddress
        isActive: $isActive
        latitude: $latitude
        logisticsAddress: $logisticsAddress
        logisticsTitle: $logisticsTitle
        longitude: $longitude
        paymentNo: $paymentNo
        paymentTitle: $paymentTitle
        phone: $phone
        street: $street
        thumbnail: $thumbnail
        title: $title
      }
    ) {
      id
    }
  }
`;

export const SELF_LOGISTICS_MERCHANT_DELETE = gql`
  mutation selfLogisticsMerchantDelete($userId: Int!, $id: Int!) {
    selfLogisticsMerchantDelete(userId: $userId, id: $id)
  }
`;
