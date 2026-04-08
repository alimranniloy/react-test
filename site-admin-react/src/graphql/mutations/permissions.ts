import { gql } from "@apollo/client";

export const SELF_SITE_PERMISSION_CREATE = gql`
  mutation selfSitePermissionCreate(
    $isActive: Boolean!
    $permission: JSON!
    $title: String!
    $siteId: Int!
    $userId: Int!
  ) {
    selfSitePermissionCreate(
      userId: $userId
      data: { isActive: $isActive, permission: $permission, siteId: $siteId, title: $title }
    ) {
      id
      isActive
      permission
      siteId
      title
    }
  }
`;

export const SELF_SITE_PERMISSION_UPDATE = gql`
  mutation selfSitePermissionUpdate(
    $permissionId: Int!
    $userId: Int!
    $siteId: Int!
    $isActive: Boolean
    $permission: JSON
    $title: String
  ) {
    selfSitePermissionUpdate(
      permissionId: $permissionId
      userId: $userId
      siteId: $siteId
      data: { isActive: $isActive, permission: $permission, title: $title }
    ) {
      id
      isActive
      permission
      siteId
      title
    }
  }
`;

export const SELF_SITE_PERMISSION_DELETE = gql`
  mutation selfSitePermissionDelete($userId: Int!, $permissionId: Int!) {
    selfSitePermissionDelete(userId: $userId, permissionId: $permissionId)
  }
`;
