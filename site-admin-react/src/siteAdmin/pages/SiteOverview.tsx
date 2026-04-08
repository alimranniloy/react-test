import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { SITES } from "@/graphql/queries/site";
import { SITE_PAGES } from "@/graphql/queries/tools";
import { useAuthStore } from "@/store/useAuthStore";
import { mergeSiteSummaries, useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";

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
  isActive?: boolean | null;
  slug?: string | null;
  title?: string | null;
};

function getDisplayDomain(site: SiteNode | null) {
  if (!site) return "No website selected";
  if (site.domain) return site.domain;
  if (site.hostname) return `${site.hostname}.site.bponi.com`;
  return "Connect domain";
}

function PreviewThumb({ site }: { site: SiteNode | null }) {
  if (site?.desktopLogo || site?.favicon) {
    return (
      <div className="relative h-[76px] w-[120px] overflow-hidden border border-[#dde3eb] bg-white" style={{ borderRadius: 8 }}>
        <img
          src={String(site.desktopLogo || site.favicon)}
          alt={site?.title || "Site preview"}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="relative h-[76px] w-[120px] overflow-hidden border border-[#dde3eb] bg-[linear-gradient(180deg,#ffffff_0%,#f6f3ff_52%,#e7dbff_100%)]"
      style={{ borderRadius: 8 }}
    >
      <div className="absolute inset-x-0 top-0 h-4 bg-white/85" />
      <div className="absolute left-3 top-6 h-2 w-12 rounded bg-[#262b37]" />
      <div className="absolute left-3 top-10 h-1.5 w-16 rounded bg-[#8f98aa]" />
      <div className="absolute bottom-0 left-0 right-0 h-7 bg-[linear-gradient(90deg,#7c3aed_0%,#a78bfa_48%,#ede9fe_100%)]" />
      <div className="absolute bottom-2 left-2 h-5 w-7 rounded bg-white/70" />
      <div className="absolute bottom-2 left-11 h-3 w-10 rounded bg-white/60" />
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
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[#dde3eb] bg-white" style={{ borderRadius: 10 }}>
      <div className="flex items-start justify-between gap-3 border-b border-[#eef2f6] px-5 py-4 md:px-6">
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#1f2430]">{title}</h2>
          {subtitle ? <p className="mt-1 text-[12px] leading-5 text-[#7a8395]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function StatusChip({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium",
        active ? "bg-[#e8f7ee] text-[#197a39]" : "bg-[#f3f4f6] text-[#6b7280]",
      ].join(" ")}
      style={{ borderRadius: 999 }}
    >
      <span className={[
        "h-1.5 w-1.5 rounded-full",
        active ? "bg-[#16a34a]" : "bg-[#9ca3af]",
      ].join(" ")} />
      {active ? "Published" : "Not Published"}
    </span>
  );
}

export default function SiteOverview() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const siteId = useSiteAdminStore((state) => state.siteId);
  const setSiteId = useSiteAdminStore((state) => state.setSiteId);
  const setSites = useSiteAdminStore((state) => state.setSites);
  const storedSites = useSiteAdminStore((state) => state.sites);

  const createdById = useMemo(() => {
    if (!user?.id) return null;
    return user.isStaff ? null : user.id;
  }, [user?.id, user?.isStaff]);

  const { data, loading, refetch } = useQuery(SITES, {
    variables: {
      createdById,
      siteType: "site",
      queryType: "latest",
      first: 18,
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

  const { data: pagesData } = useQuery(SITE_PAGES, {
    variables: {
      siteId: selectedSite?.id ?? 0,
      search: null,
      first: 30,
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
  const missingSignals = [!selectedSite?.domain, !selectedSite?.hostname, livePages === 0].filter(Boolean).length;

  return (
    <main className="space-y-4 pb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-[#1f2430] sm:text-[30px]">
            Website Overview
          </h1>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            Manage your websites, domains, SEO and previews from one place.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-[#d8dee8] bg-white px-4 py-2 text-[12px] font-semibold text-[#4b5563] transition hover:bg-[#f7f9fc] disabled:opacity-60"
          >
            Site Actions
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => selectedSite && navigate(`/studio/?siteId=${selectedSite.id}`)}
            className="inline-flex items-center gap-2 rounded-full bg-[#116dff] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#0056ff]"
          >
            Edit Template
          </button>
        </div>
      </div>

      <section className="border border-[#dde3eb] bg-white px-5 py-4 md:px-6" style={{ borderRadius: 10 }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <PreviewThumb site={selectedSite} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[18px] font-semibold text-[#1f2430]">
                  {selectedSite?.title || "My Website"}
                </h2>
                <StatusChip active={selectedSite?.isActive !== false} />
                <span className="inline-flex items-center rounded-full bg-[#eef3ff] px-2.5 py-1 text-[11px] font-medium text-[#335dff]">
                  {sites.length} sites in workspace
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-[#6d7686]">
                <span className="font-medium text-[#1f2430]">Free plan</span>
                <button type="button" className="font-medium text-[#7f39fb] hover:underline">
                  Compare Plans
                </button>
                <span className="hidden h-3 w-px bg-[#e5e9ef] md:block" />
                <span className="truncate text-[#98a1b2]">{getDisplayDomain(selectedSite)}</span>
                <button
                  type="button"
                  className="font-medium text-[#7f39fb] hover:underline"
                  onClick={() => selectedSite && navigate(`/site/update/?id=${selectedSite.id}`)}
                >
                  Connect Domain
                </button>
                <span className="hidden h-3 w-px bg-[#e5e9ef] md:block" />
                <span>{selectedSite?.hostname ? `${selectedSite.hostname}.site.bponi.com` : "No hosted link yet"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => selectedSite && navigate(`/studio/?siteId=${selectedSite.id}`)}
              className="rounded-full bg-[#116dff] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#0056ff]"
            >
              Edit Template
            </button>
            <button
              type="button"
              onClick={() => selectedSite && navigate(`/site/update/?id=${selectedSite.id}`)}
              className="inline-flex items-center gap-2 text-[12px] font-medium text-[#4f7cff] hover:underline"
            >
              <Cog6ToothIcon className="h-4 w-4" />
              Site Settings
            </button>
          </div>
        </div>
      </section>

      <Surface title="Get your site found in search results" subtitle="Follow your personalized SEO checklist to start getting more traffic to your site from search engines like Google.">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[13px] leading-6 text-[#6b7280]">
              <span>{sites.length} websites connected</span>
              <span className="h-1 w-1 rounded-full bg-[#c4cad6]" />
              <span>{totalPages} total pages</span>
              <span className="h-1 w-1 rounded-full bg-[#c4cad6]" />
              <span>{livePages} live pages</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/theme/")}
                className="rounded-full border border-[#b6c7f5] bg-white px-4 py-2 text-[12px] font-semibold text-[#4f7cff] transition hover:bg-[#f3f7ff]"
              >
                Go to SEO Checklist
              </button>
              <button
                type="button"
                onClick={() => navigate("/page/")}
                className="rounded-full border border-[#d8dee8] bg-white px-4 py-2 text-[12px] font-semibold text-[#4b5563] transition hover:bg-[#f7f9fc]"
              >
                Go to SEO Dashboard
              </button>
            </div>
          </div>

          <div className="border border-[#e5e9ef] bg-[#fcfdff] p-3" style={{ borderRadius: 12 }}>
            <div className="flex items-center justify-between border border-[#e8edf4] bg-white px-3 py-2" style={{ borderRadius: 10 }}>
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="h-4 w-4 text-[#34a853]" />
                <div className="h-1.5 w-28 rounded bg-[#e5e7eb]" />
              </div>
              <MagnifyingGlassIcon className="h-4 w-4 text-[#9aa3b2]" />
            </div>
            <div className="mt-3 border border-[#e8edf4] bg-white p-3" style={{ borderRadius: 10 }}>
              <div className="text-[10px] text-[#7b8495]">{getDisplayDomain(selectedSite)}</div>
              <div className="mt-2 text-[18px] font-semibold leading-6 text-[#3455db]">
                Home | {selectedSite?.title || "My Website"}
              </div>
              <div className="mt-3 h-2 rounded bg-[#e5e7eb]" />
              <div className="mt-2 h-2 w-[80%] rounded bg-[#e5e7eb]" />
              <div className="mt-2 h-2 w-[55%] rounded bg-[#e5e7eb]" />
            </div>
          </div>
        </div>
      </Surface>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Surface title="Site Performance" subtitle="Monitor the performance of your site and ensure a smooth user experience for visitors.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-[#e5e9ef] bg-white p-4" style={{ borderRadius: 10 }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[14px] font-semibold text-[#1f2430]">How many websites you have</div>
                  <p className="mt-1 text-[12px] leading-5 text-[#6b7280]">
                    See how many sites are connected to your current workspace.
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3ff] text-[#4f7cff]">
                  <SignalIcon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">{sites.length}</div>
              <button type="button" onClick={() => navigate("/")} className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[#4f7cff] hover:underline">
                View workspace
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="border border-[#e5e9ef] bg-white p-4" style={{ borderRadius: 10 }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[14px] font-semibold text-[#1f2430]">Pages on this site</div>
                  <p className="mt-1 text-[12px] leading-5 text-[#6b7280]">
                    Track live pages, drafts and publishing readiness for the selected site.
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3ff] text-[#4f7cff]">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 flex items-end gap-5">
                <div>
                  <div className="text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">{livePages}</div>
                  <div className="text-[11px] text-[#7b8495]">Live pages</div>
                </div>
                <div>
                  <div className="text-[20px] font-semibold tracking-[-0.02em] text-[#111827]">{draftPages}</div>
                  <div className="text-[11px] text-[#7b8495]">Draft pages</div>
                </div>
              </div>
              <button type="button" onClick={() => navigate("/page/")} className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[#4f7cff] hover:underline">
                Manage pages
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </Surface>

        <Surface title="Accessibility" subtitle="Help people with disabilities use your site.">
          <div className="border border-[#e5e9ef] bg-white p-4" style={{ borderRadius: 10 }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[14px] font-semibold text-[#1f2430]">Make your site accessible</div>
                <p className="mt-1 text-[12px] leading-5 text-[#6b7280]">
                  Scan your site to find issues in domain, publishing and public visibility.
                </p>
              </div>
              <div className={[
                "flex h-10 w-10 items-center justify-center rounded-full",
                missingSignals > 0 ? "bg-[#fff1f0] text-[#ef4444]" : "bg-[#e8f7ee] text-[#16a34a]",
              ].join(" ")}>
                {missingSignals > 0 ? <ExclamationTriangleIcon className="h-5 w-5" /> : <ShieldCheckIcon className="h-5 w-5" />}
              </div>
            </div>
            <div className="mt-5 text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">{missingSignals}</div>
            <div className="mt-1 text-[11px] text-[#7b8495]">
              {missingSignals > 0 ? "Signals need attention" : "No major issues detected"}
            </div>
            <button
              type="button"
              onClick={() => selectedSite && navigate(`/site/update/?id=${selectedSite.id}`)}
              className="mt-4 rounded-full border border-[#b6c7f5] bg-white px-4 py-2 text-[12px] font-semibold text-[#4f7cff] transition hover:bg-[#f3f7ff]"
            >
              Fix Issues
            </button>
          </div>
        </Surface>
      </div>

      <Surface title="All Websites" subtitle="Every website in your workspace is listed here with a direct Edit Template action.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sites.map((site) => (
            <div key={site.id} className="border border-[#e5e9ef] bg-white p-4" style={{ borderRadius: 10 }}>
              <PreviewThumb site={site} />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-[#1f2430]">{site.title}</div>
                  <div className="mt-1 truncate text-[12px] text-[#7a8395]">{getDisplayDomain(site)}</div>
                </div>
                <span
                  className={[
                    "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-medium",
                    site.isActive !== false ? "bg-[#e8f7ee] text-[#197a39]" : "bg-[#f3f4f6] text-[#6b7280]",
                  ].join(" ")}
                >
                  {site.isActive !== false ? "Published" : "Draft"}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/studio/?siteId=${site.id}`)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#116dff] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#0056ff]"
                >
                  Edit Template
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/site/update/?id=${site.id}`)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8dee8] bg-white text-[#4b5563] transition hover:bg-[#f7f9fc]"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </main>
  );
}
