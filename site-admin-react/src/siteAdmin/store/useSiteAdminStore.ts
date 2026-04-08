import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apolloClient } from "@/graphql/apolloClient";
import { SITES } from "@/graphql/queries/site";
import { createSecurePersist } from "@/store/persist";

export type SiteSummary = {
  id: number;
  title: string;
  domain?: string | null;
  hostname?: string | null;
  favicon?: string | null;
  street?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  isActive?: boolean | null;
  [key: string]: unknown;
};

function areValuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return false;
    }

    return left.every((value, index) => areValuesEqual(value, right[index]));
  }

  if (
    left &&
    right &&
    typeof left === "object" &&
    typeof right === "object"
  ) {
    const leftRecord = left as Record<string, unknown>;
    const rightRecord = right as Record<string, unknown>;
    const leftKeys = Object.keys(leftRecord);
    const rightKeys = Object.keys(rightRecord);

    if (leftKeys.length !== rightKeys.length) {
      return false;
    }

    return leftKeys.every((key) => areValuesEqual(leftRecord[key], rightRecord[key]));
  }

  return false;
}

function areSiteSummariesEqual(current: SiteSummary[], incoming: SiteSummary[]) {
  if (current === incoming) {
    return true;
  }

  if (current.length !== incoming.length) {
    return false;
  }

  return current.every((site, index) => areValuesEqual(site, incoming[index]));
}

function mergeDefinedValues<T extends Record<string, unknown>>(current: T | undefined, incoming: T): T {
  const next = { ...(current ?? {}) } as Record<string, unknown>;
  Object.entries(incoming).forEach(([key, value]) => {
    if (value !== undefined) {
      next[key] = value;
    }
  });
  return next as T;
}

export function mergeSiteSummaries<T extends { id: number }>(preferred: T[], fallback: T[]): T[] {
  const seen = new Set<number>();
  const merged: T[] = [];

  preferred.forEach((site) => {
    if (!site?.id || seen.has(site.id)) return;
    const fallbackSite = fallback.find((entry) => entry.id === site.id);
    merged.push(mergeDefinedValues(fallbackSite, site));
    seen.add(site.id);
  });

  fallback.forEach((site) => {
    if (!site?.id || seen.has(site.id)) return;
    merged.push(site);
    seen.add(site.id);
  });

  return merged;
}

type SiteAdminState = {
  siteId: number | null;
  sites: SiteSummary[];
  loadingSites: boolean;
  setSiteId: (siteId: number | null) => void;
  setSites: (sites: SiteSummary[]) => void;
  upsertSite: (site: SiteSummary | null) => void;
  loadSites: (createdById: number | null, siteType: string) => Promise<SiteSummary[]>;
};

export const useSiteAdminStore = create<SiteAdminState>()(
  persist(
    (set) => ({
      siteId: null,
      sites: [],
      loadingSites: false,
      setSiteId: (siteId) => set({ siteId }),
      setSites: (sites) =>
        set((state) => {
          if (areSiteSummariesEqual(state.sites, sites)) {
            return state;
          }

          return { sites };
        }),
      upsertSite: (site) =>
        set((state) => {
          if (!site?.id) return state;
          const nextSites = mergeSiteSummaries([site], state.sites);

          if (areSiteSummariesEqual(state.sites, nextSites)) {
            return state;
          }

          return { sites: nextSites };
        }),
      loadSites: async (createdById, siteType) => {
        set({ loadingSites: true });
        try {
          const result = await apolloClient.query({
            query: SITES,
            variables: {
              createdById,
              siteType,
              queryType: "latest",
              first: 50,
              after: null
            },
            fetchPolicy: "network-only"
          });
          const sites =
            result.data?.sites?.edges?.map((edge: any) => edge?.node).filter(Boolean) ?? [];
          set((state) => {
            if (areSiteSummariesEqual(state.sites, sites)) {
              return state.loadingSites ? { loadingSites: false } : state;
            }

            return { sites, loadingSites: false };
          });
          return sites;
        } catch {
          set({ loadingSites: false });
          return [];
        }
      }
    }),
    createSecurePersist<SiteAdminState>("site-admin-react-site-admin", (state) => ({
      siteId: state.siteId,
      sites: state.sites
    }))
  )
);
