export const DEFAULT_PAGE_SIZE = 15;

type PageInfo = {
  hasNextPage?: boolean | null;
  endCursor?: string | null;
};

type NextPageVariablesArgs = {
  baseVariables: Record<string, unknown>;
  pageInfo?: PageInfo | null;
  currentCount: number;
  pageSize?: number;
};

export function nextPageVariables({
  baseVariables,
  pageInfo,
  currentCount,
  pageSize = DEFAULT_PAGE_SIZE
}: NextPageVariablesArgs): Record<string, unknown> {
  if (pageInfo?.hasNextPage && pageInfo.endCursor) {
    return {
      ...baseVariables,
      first: pageSize,
      after: pageInfo.endCursor
    };
  }

  return {
    ...baseVariables,
    first: pageSize,
    offset: currentCount
  };
}
