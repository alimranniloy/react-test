import { gql } from "@apollo/client";

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

export const SELF_SITE_COMPONENT_DELETE = gql`
  mutation selfSiteComponentDelete($userId: Int!, $componentId: Int!) {
    selfSiteComponentDelete(userId: $userId, componentId: $componentId)
  }
`;

