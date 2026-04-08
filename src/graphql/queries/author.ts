import { gql } from "@apollo/client";

export const STORE_AUTHOR = gql`
  query ($id: Int!) {
    storeAuthor(id: $id) {
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
