import * as React from 'react';

export type StudioPageItem = {
  id: number;
  title: string;
  slug: string;
};

export type StudioPageContextValue = {
  enabled: boolean;
  currentPageId: number | null;
  currentPageSlug: string | null;
  pages: StudioPageItem[];
  isLoading: boolean;
  isMutating: boolean;
  switchPage: (pageId: number | null) => void;
  createPage: (input: { title: string; slug: string }) => Promise<void>;
  deleteCurrentPage: () => Promise<void>;
};

const StudioPageContext = React.createContext<StudioPageContextValue | null>(null);

export const StudioPageContextProvider = StudioPageContext.Provider;

export const useMaybeStudioPageContext = () => React.useContext(StudioPageContext);

export const useStudioPageContext = () => {
  const value = useMaybeStudioPageContext();

  if (!value) {
    throw new Error('Studio page context not found');
  }

  return value;
};
