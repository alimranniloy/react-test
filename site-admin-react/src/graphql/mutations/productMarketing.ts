import { gql } from "@apollo/client";

export const SELF_STORE_PRODUCT_ADD_NEW = gql`
  mutation selfStoreProductAddNew($userId: Int!, $productId: Int!) {
    selfStoreProductAddNew(userId: $userId, productId: $productId)
  }
`;

export const SELF_STORE_PRODUCT_REMOVE_NEW = gql`
  mutation selfStoreProductRemoveNew($userId: Int!, $productId: Int!) {
    selfStoreProductRemoveNew(userId: $userId, productId: $productId)
  }
`;

export const SELF_STORE_PRODUCT_ADD_FLASH = gql`
  mutation selfStoreProductAddFlash($userId: Int!, $productId: Int!) {
    selfStoreProductAddFlash(userId: $userId, productId: $productId)
  }
`;

export const SELF_STORE_PRODUCT_REMOVE_FLASH = gql`
  mutation selfStoreProductRemoveFlash($userId: Int!, $productId: Int!) {
    selfStoreProductRemoveFlash(userId: $userId, productId: $productId)
  }
`;
