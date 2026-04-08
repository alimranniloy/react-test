import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apolloClient } from "@/graphql/apolloClient";
import { SITE, SELF_SITE, SELF_SITE_UPDATE } from "@/graphql/queries/site";
import { createSecurePersist } from "@/store/persist";

export type Site = {
  id: number;
  title: string;
  domain?: string | null;
  hostname?: string | null;
  favicon?: string | null;
  desktopLogo?: string | null;
  phoneLogo?: string | null;
  currency?: string | null;
  completedStep?: number[] | null;
  isWhiteLabel?: boolean | null;
  isOtp?: boolean | null;
  notice?: string | null;
  theme?: string | null;
  schema?: unknown;
  guide?: string[] | null;
  [key: string]: unknown;
};

type SiteState = {
  site: Site | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setSite: (site: Site | null) => void;
  getSiteByDomain: (domain: string) => Promise<Site | null>;
  getSiteByUser: (userId: number, siteType: string) => Promise<Site | null>;
  updateSite: (userId: number, site: Partial<Site>) => Promise<Site | null>;
};

export const useSiteStore = create<SiteState>()(
  persist(
    (set) => ({
      site: null,
      loading: false,
      setLoading: (loading) => set({ loading }),
      setSite: (site) => set({ site }),
      getSiteByDomain: async (domain) => {
        set({ loading: true });
        try {
          const result = await apolloClient.query({
            query: SITE,
            variables: { domain },
            fetchPolicy: "network-only"
          });
          const site = result.data?.site ?? null;
          set({ site, loading: false });
          return site;
        } catch {
          set({ loading: false });
          return null;
        }
      },
      getSiteByUser: async (userId, siteType) => {
        set({ loading: true });
        try {
          const result = await apolloClient.query({
            query: SELF_SITE,
            variables: { userId, siteType },
            fetchPolicy: "network-only"
          });
          const site = result.data?.selfSite ?? null;
          set({ site, loading: false });
          return site;
        } catch {
          set({ loading: false });
          return null;
        }
      },
      updateSite: async (userId, site) => {
        if (!site?.id) return null;
        set({ loading: true });
        try {
          const result = await apolloClient.mutate({
            mutation: SELF_SITE_UPDATE,
            variables: { userId, siteId: site.id, address: site.address, title: site.title }
          });
          const updated = result.data?.selfSiteUpdate ?? null;
          set({ site: updated, loading: false });
          return updated;
        } catch {
          set({ loading: false });
          return null;
        }
      }
    }),
    createSecurePersist<SiteState>("site-admin-react-site", (state) => ({
      site: state.site
    }))
  )
);
