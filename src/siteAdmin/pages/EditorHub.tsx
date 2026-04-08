import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  SparklesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { SITES } from "@/graphql/queries/site";
import { SITE_PAGES } from "@/graphql/queries/tools";
import { useAuthStore } from "@/store/useAuthStore";
import { mergeSiteSummaries, useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";

dayjs.extend(relativeTime);

const BUTTON_BASE =
  "inline-flex h-11 items-center justify-center gap-2 px-5 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
const PRIMARY_BUTTON = `${BUTTON_BASE} rounded-[10px] bg-[#116dff] text-white hover:bg-[#0056ff]`;
const SECONDARY_BUTTON = `${BUTTON_BASE} rounded-[10px] border border-[#d8dee8] bg-white text-[#4b5563] hover:bg-[#f7f9fc]`;
const TEXT_LINK_BUTTON = "text-[12px] font-medium text-[#4f7cff] transition hover:underline";

type SiteNode = {
  id: number;
  title: string;
  domain?: string | null;
  hostname?: string | null;
  favicon?: string | null;
  desktopLogo?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  isActive?: boolean | null;
};

type PageNode = {
  id: number;
  title?: string | null;
  slug?: string | null;
  isActive?: boolean | null;
};

function getDisplayDomain(site: SiteNode | null) {
  if (!site) return "No website selected";
  if (site.domain) return site.domain;
  if (site.hostname) return `${site.hostname}.site.bponi.com`;
  return "Connect domain";
}

function getPublicUrl(site: SiteNode | null) {
  if (!site) return null;
  if (site.domain) {
    return /^https?:\/\//i.test(site.domain) ? site.domain : `https://${site.domain}`;
  }
  if (site.hostname) {
    return `https://${site.hostname}.site.bponi.com`;
  }
  return null;
}

function PreviewThumb({
  site,
  size = "small",
}: {
  site: SiteNode | null;
  size?: "small" | "large";
}) {
  const [hasError, setHasError] = useState(false);
  const classes =
    size === "large"
      ? "h-[152px] w-[228px] rounded-[14px]"
      : "h-[64px] w-[96px] rounded-[10px]";

  if ((site?.desktopLogo || site?.favicon) && !hasError) {
    return (
      <div className={`relative overflow-hidden border border-[#dde3eb] bg-white ${classes}`}>
        <img
          src={String(site.desktopLogo || site.favicon)}
          alt={site?.title || "Site preview"}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden border border-[#dde3eb] bg-[linear-gradient(180deg,#ffffff_0%,#f7f4ff_52%,#e6ddff_100%)] ${classes}`}
    >
      <div className="absolute inset-x-0 top-0 h-6 bg-white/90" />
      <div className="absolute left-4 top-9 h-2.5 w-24 rounded bg-[#1f2430]" />
      <div className="absolute left-4 top-14 h-2 w-32 rounded bg-[#99a3b3]" />
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-[linear-gradient(90deg,#6d28d9_0%,#8b5cf6_42%,#ebe4ff_100%)]" />
      <div className="absolute bottom-4 left-4 h-8 w-10 rounded bg-white/70" />
      <div className="absolute bottom-5 left-16 h-3 w-20 rounded bg-white/65" />
    </div>
  );
}

function Surface({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden border border-[#dde3eb] bg-white" style={{ borderRadius: 12 }}>
      <div className="flex flex-col gap-4 border-b border-[#eef2f6] px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#1f2430]">{title}</h2>
          {subtitle ? <p className="mt-1 text-[12px] leading-6 text-[#7a8395]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium",
        active ? "bg-[#e8f7ee] text-[#197a39]" : "bg-[#f3f4f6] text-[#6b7280]",
      ].join(" ")}
      style={{ borderRadius: 999 }}
    >
      <span className={["h-1.5 w-1.5 rounded-full", active ? "bg-[#16a34a]" : "bg-[#9ca3af]"].join(" ")} />
      {active ? "Published" : "Draft"}
    </span>
  );
}

function MetricTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="min-h-[118px] border border-[#e5e9ef] bg-white px-5 py-4" style={{ borderRadius: 12 }}>
      <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#8c96a8]">{label}</div>
      <div className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#111827]">{value}</div>
      <div className="mt-2 text-[11px] leading-5 text-[#8c96a8]">{hint}</div>
    </div>
  );
}

function QuickActionRow({
  icon,
  title,
  description,
  action,
  primary,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  primary?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-start gap-4 border px-5 py-5",
        primary ? "border-[#cfe0ff] bg-[#f5f9ff]" : "border-[#e5e9ef] bg-white",
      ].join(" ")}
      style={{ borderRadius: 12 }}
    >
      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center",
          primary ? "bg-[#e8f1ff] text-[#116dff]" : "bg-[#f5f7fb] text-[#657084]",
        ].join(" ")}
        style={{ borderRadius: 12 }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold text-[#1f2430]">{title}</div>
        <div className="mt-1.5 text-[12px] leading-6 text-[#7a8395]">{description}</div>
        <div className="mt-4">{action}</div>
      </div>
    </div>
  );
}

export default function EditorHub() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const siteId = useSiteAdminStore((state) => state.siteId);
  const setSiteId = useSiteAdminStore((state) => state.setSiteId);
  const setSites = useSiteAdminStore((state) => state.setSites);
  const storedSites = useSiteAdminStore((state) => state.sites);

  const [search, setSearch] = useState("");

  const createdById = useMemo(() => {
    if (!user?.id) return null;
    return user.isStaff ? null : user.id;
  }, [user?.id, user?.isStaff]);

  const { data, loading, refetch } = useQuery(SITES, {
    variables: {
      createdById,
      siteType: "site",
      queryType: "latest",
      first: 24,
      after: null,
    },
    fetchPolicy: "network-only",
    skip: !user?.id,
  });

  const querySites = useMemo(() => {
    const edges: { node: SiteNode }[] = data?.sites?.edges ?? [];
    return edges.map((edge) => edge.node).filter(Boolean);
  }, [data?.sites?.edges]);

  const sites = useMemo(() => {
    return mergeSiteSummaries(storedSites as SiteNode[], querySites);
  }, [querySites, storedSites]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    setSites(mergeSiteSummaries(querySites, storedSites as SiteNode[]));
  }, [querySites, setSites, storedSites, user?.id]);

  useEffect(() => {
    if (siteId || !sites.length) return;
    setSiteId(sites[0].id);
  }, [setSiteId, siteId, sites]);

  const selectedSite = useMemo(() => {
    if (!siteId) return sites[0] ?? null;
    return sites.find((site) => site.id === siteId) ?? sites[0] ?? null;
  }, [siteId, sites]);

  const filteredSites = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sites;
    return sites.filter((site) => {
      const haystack = `${site.title} ${site.domain || ""} ${site.hostname || ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [search, sites]);

  const { data: pagesData } = useQuery(SITE_PAGES, {
    variables: {
      siteId: selectedSite?.id ?? 0,
      search: null,
      first: 20,
      after: null,
    },
    fetchPolicy: "network-only",
    skip: !selectedSite?.id,
  });

  const pages = useMemo(() => {
    const edges: { node: PageNode }[] = pagesData?.sitePages?.edges ?? [];
    return edges.map((edge) => edge.node).filter(Boolean);
  }, [pagesData?.sitePages?.edges]);

  const totalPages = pagesData?.sitePages?.total ?? pages.length;
  const livePages = pages.filter((page) => page.isActive !== false).length;
  const draftPages = pages.filter((page) => page.isActive === false).length;
  const connectedDomains = sites.filter((site) => Boolean(site.domain || site.hostname)).length;
  const publishedSites = sites.filter((site) => site.isActive !== false).length;
  const publicUrl = getPublicUrl(selectedSite);
  const recentPages = pages.slice(0, 5);

  const openStudio = (targetId: number) => {
    setSiteId(targetId);
    navigate(`/studio/?siteId=${targetId}`);
  };

  return (
    <main className="mx-auto max-w-[1300px] space-y-5 pb-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[25px] font-semibold tracking-[-0.03em] text-[#1f2430] sm:text-[32px]">
            Template Editor
          </h1>
          <p className="mt-2 max-w-[780px] text-[13px] leading-6 text-[#6b7280]">
            Choose a website, review its current template status, then open Studio to edit text, sections,
            styles and layout visually.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className={`${SECONDARY_BUTTON} min-w-[150px]`}
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh Sites
          </button>
          <button
            type="button"
            onClick={() => selectedSite && openStudio(selectedSite.id)}
            disabled={!selectedSite}
            className={`${PRIMARY_BUTTON} min-w-[150px]`}
          >
            <PencilSquareIcon className="h-4 w-4" />
            Edit Template
          </button>
        </div>
      </div>

      <section className="overflow-hidden border border-[#dde3eb] bg-white" style={{ borderRadius: 12 }}>
        <div className="flex flex-col gap-5 border-b border-[#eef2f6] px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#8c96a8]">Current Template Workspace</div>
            <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#1f2430]">
              {selectedSite?.title || "Select a website"}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#6d7686]">
              <StatusBadge active={selectedSite?.isActive !== false} />
              <span className="inline-flex items-center gap-1.5">
                <GlobeAltIcon className="h-4 w-4 text-[#98a1b2]" />
                {getDisplayDomain(selectedSite)}
              </span>
              {selectedSite?.updatedAt ? <span>Updated {dayjs(selectedSite.updatedAt).fromNow()}</span> : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => selectedSite && navigate(`/site/update/?id=${selectedSite.id}`)}
              disabled={!selectedSite}
              className={`${SECONDARY_BUTTON} min-w-[148px]`}
            >
              <Cog6ToothIcon className="h-4 w-4" />
              Site Settings
            </button>
            <button
              type="button"
              onClick={() => publicUrl && window.open(publicUrl, "_blank", "noopener,noreferrer")}
              disabled={!publicUrl}
              className={`${SECONDARY_BUTTON} min-w-[170px]`}
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              Open Live Preview
            </button>
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="p-6">
            <div className="grid gap-6 lg:grid-cols-[228px_minmax(0,1fr)]">
              <PreviewThumb site={selectedSite} size="large" />

              <div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <MetricTile label="Pages Ready" value={totalPages} hint="Pages connected to this site." />
                  <MetricTile label="Live Pages" value={livePages} hint="Published pages available now." />
                  <MetricTile label="Draft Pages" value={draftPages} hint="Pages still in draft state." />
                </div>

                <div className="mt-5 border border-[#e5e9ef] bg-[#f9fbff] px-5 py-5" style={{ borderRadius: 12 }}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#e8f1ff] text-[#116dff]">
                      <SparklesIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-[#1f2430]">Studio is where you make visual changes</div>
                      <div className="mt-1.5 text-[12px] leading-6 text-[#6b7280]">
                        This page is only for selecting the right website template. Once you open Studio, you can edit sections, text, images, styles and layout visually.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <span className="inline-flex items-center rounded-[10px] bg-[#f3f5f9] px-3.5 py-2 text-[11px] font-medium text-[#5f6778]">
                    {sites.length} websites in workspace
                  </span>
                  <span className="inline-flex items-center rounded-[10px] bg-[#f3f5f9] px-3.5 py-2 text-[11px] font-medium text-[#5f6778]">
                    {connectedDomains} connected domains
                  </span>
                  <span className="inline-flex items-center rounded-[10px] bg-[#f3f5f9] px-3.5 py-2 text-[11px] font-medium text-[#5f6778]">
                    {publishedSites} published websites
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className="border-t border-[#eef2f6] bg-[#fafbfe] p-6 xl:border-l xl:border-t-0">
            <div className="text-[15px] font-semibold text-[#1f2430]">Template Quick Actions</div>
            <div className="mt-5 space-y-4">
              <QuickActionRow
                icon={<PencilSquareIcon className="h-5 w-5" />}
                title="Open Studio"
                description="Edit the selected template visually with drag, style and section controls."
                primary
                action={
                  <button
                    type="button"
                    onClick={() => selectedSite && openStudio(selectedSite.id)}
                    disabled={!selectedSite}
                    className={`${PRIMARY_BUTTON} w-full`}
                  >
                    Edit Template
                  </button>
                }
              />

              <QuickActionRow
                icon={<Cog6ToothIcon className="h-5 w-5" />}
                title="Update site settings"
                description="Change site details, domain information and basic configuration before editing."
                action={
                  <button
                    type="button"
                    onClick={() => selectedSite && navigate(`/site/update/?id=${selectedSite.id}`)}
                    disabled={!selectedSite}
                    className={`${SECONDARY_BUTTON} w-full`}
                  >
                    Site Settings
                  </button>
                }
              />

              <QuickActionRow
                icon={<ArrowTopRightOnSquareIcon className="h-5 w-5" />}
                title="Open live website"
                description="Preview the currently connected public site in a new tab if a domain exists."
                action={
                  <button
                    type="button"
                    onClick={() => publicUrl && window.open(publicUrl, "_blank", "noopener,noreferrer")}
                    disabled={!publicUrl}
                    className={`${SECONDARY_BUTTON} w-full`}
                  >
                    Open Preview
                  </button>
                }
              />
            </div>
          </aside>
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Surface
          title="All Websites"
          subtitle="Select the website you want to edit, then open its template in Studio."
          action={
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
              <div className="relative min-w-[260px] md:w-[320px]">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search websites, domains or hostnames"
                  className="h-11 w-full rounded-[10px] border border-[#d8dee8] bg-white pl-11 pr-4 text-[13px] text-[#1f2430] outline-none transition focus:border-[#116dff]"
                />
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a1b2]" />
              </div>
              <div className="text-[12px] text-[#7a8395]">{filteredSites.length} results</div>
            </div>
          }
        >
          <div className="overflow-hidden border border-[#e5e9ef]" style={{ borderRadius: 12 }}>
            <div className="hidden grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_150px_190px] gap-4 border-b border-[#e5e9ef] bg-[#f8fafc] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8c96a8] xl:grid">
              <div>Website</div>
              <div>Domain</div>
              <div>Updated</div>
              <div className="text-right">Action</div>
            </div>

            {filteredSites.map((site) => {
              const isSelected = selectedSite?.id === site.id;
              return (
                <div
                  key={site.id}
                  className={[
                    "grid gap-5 border-b border-[#eef2f6] px-6 py-5 last:border-b-0 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_150px_190px] xl:items-center",
                    isSelected ? "bg-[#f8fbff]" : "bg-white",
                  ].join(" ")}
                >
                  <button type="button" onClick={() => setSiteId(site.id)} className="flex items-start gap-4 text-left">
                    <PreviewThumb site={site} />
                    <div className="min-w-0 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="truncate text-[15px] font-semibold text-[#1f2430]">{site.title}</div>
                        <StatusBadge active={site.isActive !== false} />
                        {isSelected ? (
                          <span className="inline-flex items-center rounded-[8px] bg-[#eef3ff] px-2.5 py-1 text-[10px] font-medium text-[#335dff]">
                            Selected
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#7a8395]">
                        <span className="inline-flex items-center gap-1.5">
                          <Squares2X2Icon className="h-3.5 w-3.5 text-[#98a1b2]" />
                          Template ready
                        </span>
                        {site.createdAt ? <span>Created {dayjs(site.createdAt).fromNow()}</span> : null}
                      </div>
                    </div>
                  </button>

                  <div className="min-w-0 text-[13px] text-[#4b5563]">
                    <div className="truncate">{getDisplayDomain(site)}</div>
                    {site.hostname ? (
                      <div className="mt-1 truncate text-[11px] text-[#94a3b8]">{site.hostname}.site.bponi.com</div>
                    ) : null}
                  </div>

                  <div className="text-[12px] leading-6 text-[#7a8395]">
                    {site.updatedAt ? `Updated ${dayjs(site.updatedAt).fromNow()}` : "Recently created"}
                  </div>

                  <div className="flex flex-col items-stretch gap-2 xl:items-stretch">
                    <button
                      type="button"
                      onClick={() => openStudio(site.id)}
                      className={`${PRIMARY_BUTTON} w-full px-4`}
                    >
                      Edit Template
                    </button>
                    <button
                      type="button"
                      onClick={() => setSiteId(site.id)}
                      className={`${SECONDARY_BUTTON} w-full px-4`}
                    >
                      {isSelected ? "Selected Site" : "Choose Site"}
                    </button>
                  </div>
                </div>
              );
            })}

            {!filteredSites.length ? (
              <div className="px-5 py-16 text-center text-[13px] text-[#7a8395]">No websites matched your search.</div>
            ) : null}
          </div>
        </Surface>

        <div className="space-y-4">
          <Surface
            title="Pages Ready To Edit"
            subtitle="These pages belong to the currently selected website."
            action={
              <button
                type="button"
                onClick={() => navigate("/page/")}
                className={TEXT_LINK_BUTTON}
              >
                View all pages
              </button>
            }
          >
            <div className="space-y-3.5">
              {recentPages.length ? (
                recentPages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-start justify-between gap-4 border border-[#e5e9ef] bg-white px-5 py-4"
                    style={{ borderRadius: 12 }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="h-4 w-4 text-[#97a1b2]" />
                        <div className="truncate text-[14px] font-semibold text-[#1f2430]">
                          {page.title || page.slug || `Page ${page.id}`}
                        </div>
                      </div>
                      <div className="mt-1 truncate pl-6 text-[11px] text-[#7a8395]">/{page.slug || "untitled-page"}</div>
                    </div>
                    <StatusBadge active={page.isActive !== false} />
                  </div>
                ))
              ) : (
                <div className="border border-dashed border-[#d5dbe5] bg-[#fbfcfe] px-5 py-7 text-center text-[12px] leading-6 text-[#7a8395]" style={{ borderRadius: 12 }}>
                  No pages are connected to this site yet.
                </div>
              )}
            </div>
          </Surface>

          <Surface title="Editing Notes" subtitle="Keep the workflow simple for non-technical users.">
            <div className="space-y-3.5">
              {[
                {
                  icon: <ClockIcon className="h-4 w-4" />,
                  title: "1. Select the correct website",
                  text: "Use the website list to choose which template you want to work on before opening Studio.",
                },
                {
                  icon: <PencilSquareIcon className="h-4 w-4" />,
                  title: "2. Open Studio to edit visually",
                  text: "Text, sections, styles and block layout changes happen inside Studio, not on this page.",
                },
                {
                  icon: <GlobeAltIcon className="h-4 w-4" />,
                  title: "3. Check the public preview",
                  text: "After saving in Studio, use the live preview button to review the public site result.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 border border-[#e5e9ef] bg-[#fbfcfe] px-5 py-4" style={{ borderRadius: 12 }}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#5f6b7b] ring-1 ring-[#e5e9ef]">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#1f2430]">{item.title}</div>
                    <div className="mt-1.5 text-[12px] leading-6 text-[#7a8395]">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>
    </main>
  );
}
