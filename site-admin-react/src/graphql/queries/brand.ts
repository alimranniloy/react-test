import { gql } from "@apollo/client";

export const STORE_BRAND = gql`
  query ($id: Int!) {
    storeBrand(id: $id) {
      categories
      subCategories
      id
      title
      description
      image
      isActive
      isHome
      isPrivate
      priority
      priorityHome
      queryType
      translation
      updatedAt
    }
  }
`;
