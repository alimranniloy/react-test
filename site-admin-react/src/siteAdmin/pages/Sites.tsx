import { useEffect, useMemo, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as t from "@rekajs/types";
import {
  ArrowPathIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { SELF_SITE_CREATE } from "@/graphql/mutations/site";
import { SELF_SITE_PAGE_CREATE } from "@/graphql/mutations/page";
import { SELF_SITE_UPDATE } from "@/graphql/mutations/siteUpdate";
import { SITES, SITE_SCHEMA_DETAILS } from "@/graphql/queries/site";
import { SITE_PAGES } from "@/graphql/queries/tools";
import { useAuthStore } from "@/store/useAuthStore";
import { mergeSiteSummaries, useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";
import { createApiPluginMeta } from "@/siteAdmin/utils/apiPluginKeys";

dayjs.extend(relativeTime);

const STUDIO_ENTRY_KEY = "site-admin-react-studio-entry";

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function clearPersistedStudioEntryForTheme(themeId: number) {
  if (typeof window === "undefined") {
    return;
  }

  const entry = safeJsonParse<{
    themeId?: number | null;
    entityType?: "site" | "theme";
  }>(window.sessionStorage.getItem(STUDIO_ENTRY_KEY));

  if (entry?.entityType === "theme" && entry.themeId === themeId) {
    window.sessionStorage.removeItem(STUDIO_ENTRY_KEY);
  }
}

type SitesEdgeNode = {
  id: number;
  title: string;
  domain?: string | null;
  hostname?: string | null;
  favicon?: string | null;
  street?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  isActive?: boolean | null;
  isPublic?: boolean | null;
  isTheme?: boolean | null;
  siteType?: string | null;
  parent?: {
    id: number;
    title?: string | null;
  } | null;
};

type PageNode = {
  id: number;
  slug?: string | null;
  title?: string | null;
  updatedAt?: string | null;
  isActive?: boolean | null;
};

type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  href: string;
  actionLabel: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function createBlankThemeSchema() {
  return t.state({
    extensions: {},
    program: t.program({
      globals: [],
      components: [
        t.rekaComponent({
          name: "App",
          props: [],
          state: [],
          template: t.tagTemplate({
            tag: "div",
            props: {
              className: t.literal({
                value: "min-h-screen bg-white"
              })
            },
            children: []
          })
        })
      ]
    })
  });
}

function getDisplayDomain(site: SitesEdgeNode) {
  return site.domain || site.hostname || "Connect domain";
}

function Surface({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className="border border-[#dde3eb] bg-white"
      style={{ borderRadius: 10 }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#eef2f6] px-5 py-4 md:px-6">
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#1f2430]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[12px] leading-5 text-[#7a8395]">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function StripDivider() {
  return <div className="hidden h-3 w-px bg-[#e5e9ef] md:block" />;
}

function MetricBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="border border-[#e2e7ef] bg-white px-5 py-4"
      style={{ borderRadius: 8 }}
    >
      <div className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#8c96a8]">
        {label}
      </div>
      <div className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-[#111827]">
        {value}
      </div>
    </div>
  );
}

export default function Sites() {
  const apolloClient = useApolloClient();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);
  const setSiteId = useSiteAdminStore((s) => s.setSiteId);
  const siteId = useSiteAdminStore((s) => s.siteId);
  const setSites = useSiteAdminStore((s) => s.setSites);
  const storedSites = useSiteAdminStore((s) => s.sites);

  const [first] = useState(12);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSlug, setDraftSlug] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftEditorOpen, setDraftEditorOpen] = useState(false);
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  const [themeTitle, setThemeTitle] = useState("");
  const [themeLinkedSiteId, setThemeLinkedSiteId] = useState<number | null>(null);
  const [openingThemeId, setOpeningThemeId] = useState<number | null>(null);
  const [deletingThemeId, setDeletingThemeId] = useState<number | null>(null);
  const [confirmDeleteThemeId, setConfirmDeleteThemeId] = useState<number | null>(null);

  const createdById = useMemo(() => {
    if (!user?.id) return null;
    return user.isStaff ? null : user.id;
  }, [user?.id, user?.isStaff]);

  const welcomeName = useMemo(() => {
    const raw = user?.name?.trim();
    return raw || "Creator";
  }, [user?.name]);

  const { data, loading, error, refetch, fetchMore } = useQuery(SITES, {
    variables: {
      createdById,
      siteType: "site",
      queryType: "latest",
      first,
      after: null,
    },
    fetchPolicy: "network-only",
    skip: !user?.id,
  });

  const {
    data: themesData,
    loading: themesLoading,
    refetch: refetchThemes,
  } = useQuery(SITES, {
    variables: {
      createdById,
      siteType: "theme",
      queryType: "latest",
      first: 12,
      after: null,
    },
    fetchPolicy: "network-only",
    skip: !user?.id,
  });

  const querySites = useMemo(() => {
    const siteEdges: { node: SitesEdgeNode }[] = data?.sites?.edges ?? [];
    return siteEdges.map((edge) => edge.node).filter(Boolean);
  }, [data?.sites?.edges]);

  const sites = useMemo(() => {
    return mergeSiteSummaries(storedSites as SitesEdgeNode[], querySites);
  }, [querySites, storedSites]);

  const privateThemes = useMemo(() => {
    const themeEdges: { node: SitesEdgeNode }[] = themesData?.sites?.edges ?? [];
    return themeEdges.map((edge) => edge.node).filter(Boolean).filter((theme) => theme.isActive !== false);
  }, [themesData?.sites?.edges]);

  const pageInfo = data?.sites?.pageInfo;

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    setSites(mergeSiteSummaries(querySites, storedSites as SitesEdgeNode[]));
  }, [querySites, setSites, storedSites, user?.id]);

  useEffect(() => {
    if (siteId || !sites.length) return;
    setSiteId(sites[0].id);
  }, [setSiteId, siteId, sites]);

  const selectedSite = useMemo(() => {
    if (!siteId) return sites[0] ?? null;
    return sites.find((site) => site.id === siteId) ?? sites[0] ?? null;
  }, [siteId, sites]);

  const { data: pagesData, loading: pagesLoading, refetch: refetchPages } = useQuery(
    SITE_PAGES,
    {
      variables: {
        siteId: selectedSite?.id ?? 0,
        search: null,
        first: 8,
        after: null,
      },
      fetchPolicy: "network-only",
      skip: !selectedSite?.id,
    }
  );

  const pageEdges: { node: PageNode }[] = pagesData?.sitePages?.edges ?? [];
  const recentPages = pageEdges.map((edge) => edge.node).filter(Boolean);
  const pageTotal = pagesData?.sitePages?.total ?? recentPages.length;
  const draftCount = recentPages.filter((page) => page.isActive === false).length;
  const activeSiteCount = sites.filter((site) => site.isActive !== false).length;

  const activityItems = useMemo<ActivityItem[]>(() => {
    const siteItems = sites.slice(0, 3).map((site) => ({
      id: `site-${site.id}`,
      title: site.title,
      subtitle: getDisplayDomain(site),
      meta: site.updatedAt ? dayjs(site.updatedAt).fromNow() : "Recently",
      href: `/studio/?siteId=${site.id}`,
      actionLabel: "Edit Template",
    }));

    const pageItems = recentPages.slice(0, 3).map((page) => ({
      id: `page-${page.id}`,
      title: page.title || "Untitled page",
      subtitle: `/${page.slug || "draft-page"}`,
      meta: page.updatedAt ? dayjs(page.updatedAt).fromNow() : "Recently",
      href: selectedSite ? `/page/update/?id=${page.id}&siteId=${selectedSite.id}` : "/page/",
      actionLabel: "Open Page",
    }));

    return [...pageItems, ...siteItems].slice(0, 5);
  }, [recentPages, selectedSite, sites]);

  const activityRows = activityItems.slice(0, 2);

  const [createPage, { loading: savingDraft }] = useMutation(SELF_SITE_PAGE_CREATE, {
    onCompleted: async (result) => {
      const pageId = Number(result?.selfSitePageCreate?.id ?? 0);

      addToast({
        kind: "success",
        title: "Draft saved",
        subTitle: "Your new page draft is ready for editing.",
      });

      setDraftTitle("");
      setDraftSlug("");
      setDraftDescription("");
      await refetchPages();

      if (pageId && selectedSite?.id) {
        navigate(`/page/update/?id=${pageId}&siteId=${selectedSite.id}`);
      }
    },
    onError: (mutationError) => {
      addToast({
        kind: "error",
        title: "Draft save failed",
        subTitle: mutationError.message,
      });
    },
  });

  const [createThemeSite, { loading: creatingTheme }] = useMutation(SELF_SITE_CREATE, {
    onError: (mutationError) => {
      addToast({
        kind: "error",
        title: "New theme",
        subTitle: mutationError.message,
      });
    },
  });

  const [updateThemeSite] = useMutation(SELF_SITE_UPDATE);

  const persistStudioEntry = (entry: {
    siteId?: number | null;
    themeId?: number | null;
    title?: string | null;
    schema?: unknown;
    entityType?: "site" | "theme";
    promptOnSave?: boolean;
  }) => {
    try {
      window.sessionStorage.setItem(STUDIO_ENTRY_KEY, JSON.stringify(entry));
    } catch {
      // ignore sessionStorage failures
    }
  };

  const handleLoadMoreSites = async () => {
    const endCursor = pageInfo?.endCursor;
    if (!endCursor) return;

    await fetchMore({
      variables: {
        createdById,
        siteType: "site",
        queryType: "latest",
        first,
        after: endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const prevEdges = prev?.sites?.edges ?? [];
        const nextEdges = fetchMoreResult?.sites?.edges ?? [];
        const nextPageInfo = fetchMoreResult?.sites?.pageInfo ?? prev?.sites?.pageInfo;

        return {
          ...prev,
          sites: {
            ...prev.sites,
            edges: [...prevEdges, ...nextEdges],
            pageInfo: nextPageInfo,
          },
        };
      },
    });
  };

  const handleDraftTitleChange = (value: string) => {
    setDraftTitle(value);
    setDraftSlug(slugify(value));
  };

  const handleSaveDraft = async () => {
    if (!user?.id || !selectedSite?.id) {
      addToast({
        kind: "error",
        title: "Select a website",
        subTitle: "Choose a website first before saving a page draft.",
      });
      return;
    }

    const title = draftTitle.trim();
    const slug = slugify(draftSlug || draftTitle);
    const description = draftDescription.trim();

    if (title.length < 3) {
      addToast({
        kind: "error",
        title: "Title too short",
        subTitle: "Page title needs at least 3 characters.",
      });
      return;
    }

    if (!slug) {
      addToast({
        kind: "error",
        title: "Slug missing",
        subTitle: "Please enter a valid page slug.",
      });
      return;
    }

    await createPage({
      variables: {
        userId: user.id,
        siteId: selectedSite.id,
        description,
        html: {},
        index: "noindex",
        isActive: false,
        isExcludedFromSitemap: true,
        isFooterHidden: false,
        isNavHidden: false,
        metaDescription: description,
        metaKeywords: "draft",
        metaTitle: title,
        schema: {},
        slug,
        title,
      },
    });
  };

  const handleCreateTheme = async () => {
    if (!user?.id) {
      return;
    }

    const title = themeTitle.trim();

    if (title.length < 3) {
      addToast({
        kind: "error",
        title: "Theme name too short",
        subTitle: "Theme name needs at least 3 characters.",
      });
      return;
    }

    const blankSchema = JSON.parse(JSON.stringify(createBlankThemeSchema()));
    const slugBase = slugify(title) || "private-theme";
    const uniqueSuffix = Date.now().toString(36).slice(-6);
    const hostname = `${slugBase.slice(0, 32)}-${uniqueSuffix}`.replace(/^-+|-+$/g, "");
    const domain = `${hostname}.theme.local`;
    const linkedThemeSiteId = themeLinkedSiteId ?? selectedSite?.id ?? sites[0]?.id ?? null;

    const createResult = await createThemeSite({
      variables: {
        userId: user.id,
        address: "",
        country: Number(user.country ?? 0),
        currency: String(user.currency ?? "BDT"),
        desktopTheme: "app",
        domain,
        email: user.email ?? null,
        footer: null,
        guide: null,
        hostname,
        industry: Number(
          (selectedSite as { industry?: number | null } | null)?.industry ?? 0
        ),
        latitude: Number(user.latitude ?? 0),
        longitude: Number(user.longitude ?? 0),
        memberTemplate: null,
        meta: {
          apiPlugin: createApiPluginMeta(),
        },
        navigation: {},
        note: typeof window !== "undefined" ? window.location.host : "site-admin-react",
        phone: user.phone ?? null,
        referCode: "theme",
        schema: blankSchema,
        siteInfo: "private-theme",
        siteType: "theme",
        social: null,
        street: null,
        theme: "app",
        title,
      },
    });

    const createdTheme = createResult.data?.selfSiteCreate as SitesEdgeNode | null | undefined;

    if (!createdTheme?.id) {
      return;
    }

    try {
      await updateThemeSite({
        variables: {
          userId: user.id,
          siteId: createdTheme.id,
          title,
          schema: blankSchema,
          isActive: true,
          siteType: "theme",
          isTheme: true,
          isPublic: false,
          parents: linkedThemeSiteId ? [linkedThemeSiteId] : [],
        },
      });
    } catch (mutationError) {
      addToast({
        kind: "error",
        title: "Theme setup",
        subTitle:
          mutationError instanceof Error ? mutationError.message : "Could not prepare this private theme.",
      });
      return;
    }

    addToast({
      kind: "success",
      title: "Private theme created",
      subTitle: "Studio opened with a blank theme workspace.",
    });

    setThemeEditorOpen(false);
    setThemeTitle("");
    await refetchThemes();

    navigate(`/studio/?themeId=${createdTheme.id}`, {
      state: {
        themeId: createdTheme.id,
        title,
        schema: blankSchema,
        entityType: "theme",
        promptOnSave: true,
      },
    });
  };

  const handleOpenPrivateThemeStudio = async (theme: SitesEdgeNode) => {
    setOpeningThemeId(theme.id);

    try {
      const persistedEntry = safeJsonParse<{
        themeId?: number | null;
        title?: string | null;
        schema?: unknown;
        entityType?: "site" | "theme";
      }>(typeof window !== "undefined" ? window.sessionStorage.getItem(STUDIO_ENTRY_KEY) : null);

      const result = await apolloClient.query({
        query: SITE_SCHEMA_DETAILS,
        variables: { id: theme.id },
        fetchPolicy: "no-cache",
      });

      const themeDetails = result.data?.siteById ?? null;
      const persistedThemeSchema =
        persistedEntry?.entityType === "theme" && persistedEntry?.themeId === theme.id
          ? persistedEntry?.schema
          : null;
      const studioEntry = {
        themeId: theme.id,
        title: themeDetails?.title ?? theme.title ?? "Theme",
        schema: persistedThemeSchema ?? themeDetails?.schema ?? null,
        entityType: "theme" as const,
      };

      persistStudioEntry(studioEntry);
      navigate(`/studio/?themeId=${theme.id}`, {
        state: studioEntry,
      });
    } catch (mutationError) {
      addToast({
        kind: "error",
        title: "Open Studio",
        subTitle:
          mutationError instanceof Error ? mutationError.message : "Could not open this theme in Studio.",
      });
    } finally {
      setOpeningThemeId(null);
    }
  };

  const handleDeletePrivateTheme = async (theme: SitesEdgeNode) => {
    if (!user?.id) return;
    if (confirmDeleteThemeId !== theme.id) {
      setConfirmDeleteThemeId(theme.id);
      return;
    }

    setDeletingThemeId(theme.id);

    try {
      await updateThemeSite({
        variables: {
          userId: user.id,
          siteId: theme.id,
          isActive: false,
          isTheme: true,
          isPublic: false,
          siteType: "theme",
          parents: [],
          schema: null,
          head: null,
          foot: null,
          navigation: null,
          tools: null,
        },
      });

      clearPersistedStudioEntryForTheme(theme.id);

      addToast({
        kind: "success",
        title: "Theme deleted",
        subTitle: "The private theme was removed, unlinked, and its Studio draft was cleared.",
      });
      setConfirmDeleteThemeId(null);
      await refetchThemes();
    } catch {
      addToast({
        kind: "error",
        title: "Delete theme",
        subTitle: "Could not delete this private theme right now.",
      });
    } finally {
      setDeletingThemeId(null);
    }
  };

  return (
    <main className="space-y-4 pb-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-[#1f2430] sm:text-[28px]">
          Welcome back, {welcomeName}
        </h1>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center bg-white text-[#7f8aa0] shadow-[0_1px_1px_rgba(15,23,42,0.04)]"
            style={{ borderRadius: 999 }}
          >
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate(selectedSite ? `/site/update/?id=${selectedSite.id}` : "/site/")}
            className="inline-flex items-center gap-2 bg-white px-3.5 py-2 text-[12px] font-semibold text-[#4f7cff] shadow-[0_1px_1px_rgba(15,23,42,0.04)]"
            style={{ borderRadius: 999 }}
          >
            <span className="inline-block h-1.5 w-1.5 bg-[#4f7cff]" style={{ borderRadius: 999 }} />
            Design Site
          </button>
        </div>
      </div>

      <section
        className="flex flex-wrap items-center gap-x-3 gap-y-2 border border-[#dde3eb] bg-white px-5 py-3 text-[12px] text-[#6d7686]"
        style={{ borderRadius: 10 }}
      >
        <span className="font-medium text-[#1f2430]">Free plan</span>
        <button type="button" className="font-medium text-[#7f39fb] hover:underline">
          Compare Plans
        </button>
        <StripDivider />
        <span className="truncate text-[#98a1b2]">
          {selectedSite ? getDisplayDomain(selectedSite) : "https://your-domain.com"}
        </span>
        <button
          type="button"
          className="font-medium text-[#7f39fb] hover:underline"
          onClick={() => {
            if (selectedSite) navigate(`/site/update/?id=${selectedSite.id}`);
          }}
        >
          Connect Domain
        </button>
        <StripDivider />
        <span>No business email</span>
        <button type="button" className="font-medium text-[#7f39fb] hover:underline">
          Connect
        </button>
        <StripDivider />
        <span>{draftCount} open drafts</span>
        <button type="button" className="font-medium text-[#7f39fb] hover:underline">
          Get compliant
        </button>
        <div className="ml-auto flex items-center gap-1 text-[#6d7686]">
          <PencilSquareIcon className="h-3.5 w-3.5" />
          <button
            type="button"
            className="font-medium hover:text-[#1f2430]"
            onClick={() => {
              if (selectedSite) navigate(`/site/update/?id=${selectedSite.id}`);
            }}
          >
            Edit Business Info
          </button>
        </div>
      </section>

      <Surface
        title="Analytics"
        action={
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="text-[12px] font-medium text-[#4f7cff] hover:underline disabled:opacity-60"
          >
            View Your Site Analytics
          </button>
        }
      >
        <p className="text-[12px] leading-6 text-[#7a8395]">
          Your key stats will appear here once your site is published:
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <MetricBox label="Site sessions" value={sites.length || "-"} />
          <MetricBox label="Total sales" value={selectedSite ? pageTotal : "-"} />
        </div>
      </Surface>

      <Surface
        title="Private Themes"
        subtitle="Your own reusable theme workspaces stay private here. Create a blank theme, keep it linked to a website, then open Studio when you want to design."
        action={
          <button
            type="button"
            onClick={() => setThemeEditorOpen((open) => !open)}
            className="text-[12px] font-medium text-[#4f7cff] hover:underline"
          >
            {themeEditorOpen ? "Hide Theme Creator" : "New Theme"}
          </button>
        }
      >
        {themeEditorOpen ? (
          <div
            className="mb-5 grid gap-4 border border-[#e2e7ef] bg-[#fbfcfe] p-4 lg:grid-cols-[minmax(0,1fr)_220px_160px]"
            style={{ borderRadius: 10 }}
          >
            <div>
              <div className="text-[12px] font-medium text-[#1f2430]">Theme name</div>
              <input
                value={themeTitle}
                onChange={(event) => setThemeTitle(event.target.value)}
                placeholder="Enter private theme name"
                className="mt-2 h-11 w-full border border-[#d8dee8] bg-white px-3.5 text-[13px] text-[#1f2430] outline-none transition focus:border-[#116dff]"
                style={{ borderRadius: 8 }}
              />
            </div>

            <div>
                <div className="text-[12px] font-medium text-[#1f2430]">Linked website</div>
              <select
                value={themeLinkedSiteId ?? selectedSite?.id ?? sites[0]?.id ?? ""}
                onChange={(event) => setThemeLinkedSiteId(Number(event.target.value) || null)}
                className="mt-2 h-11 w-full border border-[#d8dee8] bg-white px-3.5 text-[13px] text-[#1f2430] outline-none transition focus:border-[#116dff]"
                style={{ borderRadius: 8 }}
              >
                <option value="">No linked website</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleCreateTheme}
                disabled={creatingTheme}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#116dff] px-4 text-[13px] font-semibold text-white transition hover:bg-[#0056ff] disabled:opacity-60"
              >
                {creatingTheme ? "Opening Studio..." : "Save & Open Studio"}
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-3">
          {privateThemes.map((theme) => (
            <div
              key={theme.id}
              className="border border-[#e2e7ef] bg-white p-4"
              style={{ borderRadius: 10 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-[#1f2430]">
                    {theme.title || "Untitled Theme"}
                  </div>
                  <div className="mt-1 text-[12px] text-[#7a8395]">
                    {theme.parent?.title ? `Linked to ${theme.parent.title}` : "No website linked yet"}
                  </div>
                </div>
                <span
                  className="inline-flex items-center rounded-full border border-[#d8dee8] bg-[#f7f9fc] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6d7686]"
                >
                  Private
                </span>
              </div>

              <div className="mt-4 rounded-[10px] border border-[#eef2f6] bg-[#fcfdff] p-4">
                <div className="text-[11px] uppercase tracking-[0.06em] text-[#8c96a8]">Theme Workspace</div>
                <div className="mt-2 text-[13px] leading-6 text-[#6d7686]">
                  Last updated {theme.updatedAt ? dayjs(theme.updatedAt).fromNow() : "recently"}.
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => handleOpenPrivateThemeStudio(theme)}
                  disabled={openingThemeId === theme.id}
                  className="flex h-9 items-center justify-center rounded-[9px] bg-[#116dff] px-2.5 text-[11px] font-semibold text-white transition hover:bg-[#0056ff] disabled:opacity-60"
                >
                  {openingThemeId === theme.id ? "Opening..." : "Open Studio"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/theme/apply/?themeId=${theme.id}`)}
                  className="flex h-9 items-center justify-center rounded-[9px] border border-[#d8dee8] bg-white px-2.5 text-[11px] font-semibold text-[#4b5563] transition hover:bg-[#f7f9fc]"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/site/update/?id=${theme.id}`)}
                  className="flex h-9 items-center justify-center rounded-[9px] border border-[#d8dee8] bg-white px-2.5 text-[11px] font-semibold text-[#4b5563] transition hover:bg-[#f7f9fc]"
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePrivateTheme(theme)}
                  disabled={deletingThemeId === theme.id}
                  className={[
                    "flex h-9 items-center justify-center gap-1.5 rounded-[9px] border px-2.5 text-[11px] font-semibold transition disabled:opacity-60",
                    confirmDeleteThemeId === theme.id
                      ? "border-rose-300 bg-rose-600 text-white hover:bg-rose-700"
                      : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
                  ].join(" ")}
                >
                  <TrashIcon className="h-4 w-4" />
                  {deletingThemeId === theme.id
                    ? "Deleting..."
                    : confirmDeleteThemeId === theme.id
                      ? "Confirm Delete"
                      : "Delete"}
                </button>
              </div>
              {confirmDeleteThemeId === theme.id && deletingThemeId !== theme.id ? (
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteThemeId(null)}
                    className="text-[11px] font-medium text-[#7a8395] hover:text-[#1f2430]"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {!themesLoading && privateThemes.length === 0 ? (
          <div className="mt-4 rounded-[10px] border border-dashed border-[#d8dee8] bg-[#fbfcfe] px-5 py-8 text-center text-[13px] text-[#7a8395]">
            No private themes yet. Click `New Theme` to open a blank Studio theme workspace.
          </div>
        ) : null}
      </Surface>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
        <Surface title="Activity feed" subtitle="Your most recent updates.">
          <div
            className="overflow-hidden border border-[#eef2f6] bg-white"
            style={{ borderRadius: 10 }}
          >
            <div
              className="flex min-h-[220px] flex-col items-center justify-center bg-[#fcfdff] px-8 py-8 text-center"
            >
              <div className="text-[21px] font-semibold tracking-[-0.02em] text-[#1f2430]">
                {activityItems.length ? "Your workspace is active" : "No recent activity to show"}
              </div>
              <p className="mt-3 max-w-[420px] text-[13px] leading-6 text-[#7a8395]">
                {activityItems.length
                  ? "Recent site and page updates are ready below. Continue setup or open your latest work."
                  : "Finish setting up your site to see the latest updates."}
              </p>
              <button
                type="button"
                onClick={() => navigate(selectedSite ? "/page/" : "/create/")}
                className="mt-5 rounded-full bg-[#116dff] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0056ff]"
              >
                Continue Setup
              </button>
            </div>

            <div className="border-t border-[#eef2f6] bg-white">
              {activityRows.length ? (
                activityRows.map((item, index) => (
                  <div
                    key={item.id}
                    className={[
                      "flex items-center justify-between gap-4 px-5 py-4",
                      index !== activityRows.length - 1 ? "border-b border-[#eef2f6]" : "",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className="mt-1 h-2.5 w-2.5 shrink-0 bg-[#7f39fb]"
                        style={{ borderRadius: 999 }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-[14px] font-medium text-[#1f2430]">
                          {item.title}
                        </div>
                        <div className="mt-1 truncate text-[12px] text-[#7a8395]">
                          {item.subtitle}
                        </div>
                        <div className="mt-1 text-[11px] text-[#a0a8b8] sm:hidden">
                          {item.meta}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-4 text-[12px]">
                      <span className="hidden text-[#98a1b2] sm:inline">{item.meta}</span>
                      <button
                        type="button"
                        onClick={() => navigate(item.href)}
                        className="font-medium text-[#4f7cff] hover:underline"
                      >
                        {item.actionLabel}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-[12px] text-[#8c96a8]">
                  Activity rows will appear here after your first update.
                </div>
              )}
            </div>
          </div>
        </Surface>

        <Surface
          title="Suggested for you"
          subtitle="Personalized for what you need."
          action={
            <Link to="/page/" className="text-[12px] font-medium text-[#4f7cff] hover:underline">
              View All
            </Link>
          }
        >
          <div className="border border-[#e8edf4] bg-[#fcfdff] p-4" style={{ borderRadius: 10 }}>
            <div className="flex items-start gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#eef4ff] text-[14px] font-semibold text-[#1f2430]"
                style={{ borderRadius: 8 }}
              >
                {selectedSite?.title?.trim().charAt(0).toUpperCase() || "S"}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[#1f2430]">
                  {selectedSite ? selectedSite.title : "Select a website"}
                </div>
                <div className="mt-1 text-[12px] leading-6 text-[#7a8395]">
                  {selectedSite
                    ? `Create a draft page for ${selectedSite.title} or open business settings.`
                    : "Choose a website to unlock draft creation and business controls."}
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSite ? (
                <button
                  type="button"
                  onClick={() => navigate(`/studio/?siteId=${selectedSite.id}`)}
                  className="rounded-full bg-[#116dff] px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-[#0056ff]"
                >
                  Edit Template
                </button>
              ) : null}
              {selectedSite ? (
                <button
                  type="button"
                  onClick={() => navigate(`/site/update/?id=${selectedSite.id}`)}
                  className="rounded-full border border-[#b6c7f5] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#4f7cff] transition hover:bg-[#f3f7ff]"
                >
                  Edit Business Info
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setDraftEditorOpen((open) => !open)}
                className="rounded-full border border-[#d8dee8] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#4b5563] transition hover:bg-[#f7f9fc]"
              >
                {draftEditorOpen ? "Hide Draft" : "New Page Draft"}
              </button>
            </div>
          </div>

          {draftEditorOpen ? (
            <div className="mt-4 space-y-3.5">
              <select
                value={selectedSite?.id ?? ""}
                onChange={(event) => setSiteId(Number(event.target.value) || null)}
                className="h-10 w-full border border-[#d8dee8] bg-white px-3.5 text-[13px] text-[#1f2430] outline-none transition focus:border-[#116dff]"
                style={{ borderRadius: 8 }}
              >
                <option value="">Select website</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.title}
                  </option>
                ))}
              </select>

              <input
                value={draftTitle}
                onChange={(event) => handleDraftTitleChange(event.target.value)}
                placeholder="Page title"
                className="h-10 w-full border border-[#d8dee8] bg-white px-3.5 text-[13px] text-[#1f2430] outline-none transition focus:border-[#116dff]"
                style={{ borderRadius: 8 }}
              />

              <input
                value={draftSlug}
                onChange={(event) => setDraftSlug(slugify(event.target.value))}
                placeholder="page-slug"
                className="h-10 w-full border border-[#d8dee8] bg-white px-3.5 text-[13px] text-[#1f2430] outline-none transition focus:border-[#116dff]"
                style={{ borderRadius: 8 }}
              />

              <textarea
                value={draftDescription}
                onChange={(event) => setDraftDescription(event.target.value)}
                placeholder="Add notes for this draft"
                className="min-h-[96px] w-full resize-none border border-[#d8dee8] bg-white px-3.5 py-3 text-[13px] text-[#1f2430] outline-none transition focus:border-[#116dff]"
                style={{ borderRadius: 8 }}
              />

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft || !sites.length}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#116dff] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0056ff] disabled:opacity-60"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
                {savingDraft ? "Saving Draft..." : "Save Draft"}
              </button>
            </div>
          ) : null}
        </Surface>
      </div>

      {error ? (
        <div
          className="border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700"
          style={{ borderRadius: 8 }}
        >
          {String(error.message)}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#7a8395]">
        <span>{activeSiteCount} active websites</span>
        <span className="h-1 w-1 bg-[#c5cad5]" style={{ borderRadius: 999 }} />
        <span>{draftCount} draft pages</span>
        {pageInfo?.endCursor ? (
          <>
            <span className="h-1 w-1 bg-[#c5cad5]" style={{ borderRadius: 999 }} />
            <button
              type="button"
              onClick={handleLoadMoreSites}
              disabled={loading}
              className="font-medium text-[#4f7cff] hover:underline disabled:opacity-60"
            >
              Load More Updates
            </button>
          </>
        ) : null}
        {pagesLoading ? (
          <div className="flex items-center gap-2 text-[11px] text-[#7a8395]">
            <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
            Loading recent page data...
          </div>
        ) : null}
      </div>
    </main>
  );
}
