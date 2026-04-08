import gql from "graphql-tag";
// WEB_CONTENTS
export const WEB_CONTENTS = gql`
  query (
    $siteId: [Int]!
    $isFeatured: Boolean
    $search: String
    $queryType: String
    $categoryId: Int
    $subCategoryId: Int
    $subSubCategoryId: Int
    $tagId: Int
    $authorId: Int
    $after: String
    $first: Int
  ) {
    webContents(
      siteId: $siteId
      isActive: true
      isFeatured: $isFeatured
      search: $search
      queryType: $queryType
      categoryId: $categoryId
      subCategoryId: $subCategoryId
      subSubCategoryId: $subSubCategoryId
      tagId: $tagId
      authorId: $authorId
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          categories
          subCategories
          createdAt
          description
          hid
          id
          image
          isActive
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
// WEB_CONTENT_PREVIEW
export const WEB_CONTENT_PREVIEW = gql`
  query ($id: Int!) {
    webContent(id: $id) {
      authorId
      author {
        avatar
        description
        id
        title
      }
      description
      categories
      createdAt
      id
      isFeatured
      isActive
      hid
      html
      image
      subCategories
      subSubCategories
      tags
      isActive
      slug
      translation
      title
      updatedAt
      siteId
    }
  }
`;
// WEB_CONTENT_BY_HID
export const WEB_CONTENT_BY_HID = gql`
  query ($hid: String!) {
    webContentByHid(hid: $hid) {
      authorId
      description
      categories
      createdAt
      id
      isFeatured
      isActive
      hid
      html
      image
      subCategories
      subSubCategories
      tags
      isActive
      slug
      translation
      title
      updatedAt
      siteId
    }
  }
`;
