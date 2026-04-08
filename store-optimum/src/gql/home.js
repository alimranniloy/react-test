import gql from 'graphql-tag'
// HOME_BARCODE_READER
export const HOME_BARCODE_READER = gql`
  mutation homeBarcodeRead($image: Upload!) {
    homeBarcodeRead(image: $image)
  }
`;