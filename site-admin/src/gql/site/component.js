import gql from "graphql-tag";
// SITE_COMPONENTS
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

// SITE_COMPONENT
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

// SELF_SITE_COMPONENT_CREATE
export const SELF_SITE_COMPONENT_CREATE = gql`
  mutation selfSiteComponentCreate(
    $userId: Int!
    $categoryId: Int!
    $component: String!
    $componentData: JSON!
    $description: String!
    $image: Upload!
    $isActive: Boolean
    $priority: Int!
    $settings: JSON!
    $slug: String!
    $title: String!
  ) {
    selfSiteComponentCreate(
      userId: $userId
      data: {
        categoryId: $categoryId
        component: $component
        componentData: $componentData
        description: $description
        image: $image
        isActive: $isActive
        priority: $priority
        settings: $settings
        slug: $slug
        title: $title
      }
    ) {
      id
    }
  }
`;

// SELF_SITE_COMPONENT_UPDATE
export const SELF_SITE_COMPONENT_UPDATE = gql`
  mutation selfSiteComponentUpdate(
    $userId: Int!
    $componentId: Int!
    $categoryId: Int
    $component: String
    $componentData: JSON
    $description: String
    $image: Upload
    $isActive: Boolean
    $priority: Int
    $settings: JSON
    $slug: String
    $title: String
  ) {
    selfSiteComponentUpdate(
      userId: $userId
      componentId: $componentId
      data: {
        categoryId: $categoryId
        component: $component
        componentData: $componentData
        description: $description
        image: $image
        isActive: $isActive
        priority: $priority
        settings: $settings
        slug: $slug
        title: $title
      }
    ) {
      id
    }
  }
`;

// SELF_SITE_COMPONENT_UPDATE
export const SELF_SITE_COMPONENT_DELETE = gql`
  mutation selfSiteComponentDelete($userId: Int!, $componentId: Int!) {
    selfSiteComponentDelete(userId: $userId, componentId: $componentId)
  }
`;
