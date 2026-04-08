import { gql } from "@apollo/client";

export const SITE_COMPONENT_CATEGORIES = gql`
  query ($after: String, $first: Int) {
    siteComponentCategories(after: $after, first: $first) {
      total
      edges {
        node {
          description
          id
          isActive
          slug
          title
          priority
          updatedAt
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

export const SITE_COMPONENTS = gql`
  query ($after: String, $first: Int) {
    siteComponents(after: $after, first: $first) {
      total
      edges {
        node {
          categoryId
          description
          id
          image
          priority
          slug
          title
          updatedAt
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

export const SITE_COMPONENT = gql`
  query ($id: Int!) {
    siteComponent(id: $id) {
      categoryId
      component
      componentData
      description
      id
      image
      isActive
      priority
      settings
      slug
      title
      updatedAt
    }
  }
`;

