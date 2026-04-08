import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SELF_SITE_UPDATE } from "@/graphql/mutations/siteUpdate";
import { SITES, SITE_SCHEMA_DETAILS } from "@/graphql/queries/site";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";

dayjs.extend(relativeTime);

type SiteNode = {
  id: number;
  title?: string | null;
  domain?: string | null;
  hostname?: string | null;
  desktopLogo?: string | null;
  favicon?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  isActive?: boolean | null;
  schema?: unknown;
  head?: string | null;
  foot?: string | null;
  theme?: string | null;
  desktopTheme?: string | null;
  navigation?: unknown;
  tools?: unknown;
};

type ApplyStepKey = "validate" | "prepare" | "apply" | "complete";
type StepStatus = "pending" | "active" | "done" | "error";

type ApplyStep = {
  key: ApplyStepKey;
  title: string;
  description: string;
  status: StepStatus;
};

type StudioEntryState = {
  siteId: number;
  title?: string | null;
  schema?: unknown;
};

const STUDIO_ENTRY_KEY = "site-admin-react-studio-entry";

const BASE_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
const PRIMARY_BUTTON = `${BASE_BUTTON} bg-[#116dff] text-white hover:bg-[#0056ff]`;
const SECONDARY_BUTTON = `${BASE_BUTTON} border border-[#d8dee8] bg-white text-[#4b5563] hover:bg-[#f7f9fc]`;

function getDisplayDomain(site: SiteNode | null) {
  if (!site) return "No domain connected";
  if (site.domain) return site.domain;
  if (site.hostname) return `${site.hostname}.site.bponi.com`;
  return "No domain connected";
}

function getThemePreviewUrl(site: SiteNode | null) {
  if (!site) return null;
  if (site.hostname) return `https://${String(site.hostname)}.store.bponi.com`;
  if (site.domain) {
    return /^https?:\/\//i.test(site.domain) ? String(site.domain) : `https://${String(site.domain)}`;
  }
  return null;
}

function PreviewStrip({ site }: { site: SiteNode | null }) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = site?.desktopLogo || site?.favicon || null;

  if (imageSrc && !hasError) {
    return (
      <div className="relative h-[120px] w-[190px] overflow-hidden rounded-[10px] border border-[#dde3eb] bg-white">
        <img
          src={String(imageSrc)}
          alt={site?.title || "Theme preview"}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="relative h-[120px] w-[190px] overflow-hidden rounded-[10px] border border-[#dde3eb] bg-[linear-gradient(180deg,#ffffff_0%,#f5f2ff_54%,#e5dbff_100%)] p-4">
      <div className="h-3 w-20 rounded-full bg-white/90" />
      <div className="mt-8 text-[15px] font-semibold tracking-[-0.03em] text-[#1f2430]">{site?.title || "Theme"}</div>
      <div className="mt-2 h-2 w-24 rounded-full bg-[#97a2b3]/65" />
      <div className="mt-2 h-2 w-20 rounded-full bg-[#c0c8d5]/65" />
      <div className="absolute bottom-4 left-4 right-4 rounded-[10px] bg-white/75 p-3 backdrop-blur-sm">
        <div className="h-2 w-20 rounded-full bg-[#262b37]" />
        <div className="mt-2 h-2 w-full rounded-full bg-[#c9d1dc]" />
      </div>
    </div>
  );
}

function StepRow({ step, index }: { step: ApplyStep; index: number }) {
  const stateTone =
    step.status === "done"
      ? "text-[#166534]"
      : step.status === "active"
        ? "text-[#116dff]"
        : step.status === "error"
          ? "text-[#b42318]"
          : "text-[#667085]";

  return (
    <div className="flex items-start gap-4 border-b border-[#eef2f6] py-4 last:border-b-0">
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold",
          step.status === "done"
            ? "border-[#cde9d5] bg-[#eef9f1] text-[#166534]"
            : step.status === "active"
              ? "border-[#cfe0ff] bg-[#f4f8ff] text-[#116dff]"
              : step.status === "error"
                ? "border-[#f3c2c2] bg-[#fff5f5] text-[#b42318]"
                : "border-[#e5e9ef] bg-white text-[#667085]",
        ].join(" ")}
      >
        {step.status === "done" ? <CheckCircleIcon className="h-4.5 w-4.5" /> : index + 1}
      </div>
      <div className="min-w-0">
        <div className={`text-[14px] font-semibold ${stateTone}`}>{step.title}</div>
        <div className="mt-1 text-[12px] leading-6 text-[#7a8395]">{step.description}</div>
      </div>
    </div>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function persistStudioEntry(entry: StudioEntryState) {
  try {
    window.sessionStorage.setItem(STUDIO_ENTRY_KEY, JSON.stringify(entry));
  } catch {
    // ignore sessionStorage failures
  }
}

export default function ThemeApply() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const addToast = useToastStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);
  const setSiteId = useSiteAdminStore((s) => s.setSiteId);

  const [selectedTargetSiteId, setSelectedTargetSiteId] = useState<number | null>(null);
  const [siteSearch, setSiteSearch] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSiteId, setAppliedSiteId] = useState<number | null>(null);
  const [steps, setSteps] = useState<ApplyStep[]>([
    {
      key: "validate",
      title: "Validate theme package",
      description: "Check that the theme contains a valid schema and transferable visual settings.",
      status: "pending",
    },
    {
      key: "prepare",
      title: "Prepare destination website",
      description: "Confirm which website should receive the theme while keeping its domain and identity.",
      status: "pending",
    },
    {
      key: "apply",
      title: "Apply theme",
      description: "Copy schema, theme settings, head, foot, navigation and tools into the selected website.",
      status: "pending",
    },
    {
      key: "complete",
      title: "Complete and open editor",
      description: "Finish the process and make the selected website ready for Studio editing.",
      status: "pending",
    },
  ]);

  const themeId = useMemo(() => {
    const raw = params.get("themeId") ?? params.get("id");
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  }, [params]);

  const createdById = useMemo(() => {
    if (!user?.id) return null;
    return user.isStaff ? null : user.id;
  }, [user?.id, user?.isStaff]);

  const { data: themeData, loading: themeLoading, error: themeError } = useQuery(SITE_SCHEMA_DETAILS, {
    variables: { id: themeId ?? 0 },
    fetchPolicy: "network-only",
    skip: !themeId,
  });

  const { data: sitesData, loading: sitesLoading } = useQuery(SITES, {
    variables: {
      createdById,
      siteType: "site",
      queryType: "latest",
      first: 40,
      after: null,
    },
    fetchPolicy: "network-only",
    skip: !user?.id,
  });

  const theme = themeData?.siteById ?? null;
  const allSites = useMemo(() => {
    const edges: { node: SiteNode }[] = sitesData?.sites?.edges ?? [];
    return edges.map((edge) => edge.node).filter(Boolean).filter((site) => site.id !== themeId);
  }, [sitesData?.sites?.edges, themeId]);

  const filteredSites = useMemo(() => {
    const term = siteSearch.trim().toLowerCase();
    if (!term) return allSites;
    return allSites.filter((site) => {
      const haystack = `${site.title || ""} ${site.domain || ""} ${site.hostname || ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [allSites, siteSearch]);

  const selectedTargetSite = useMemo(
    () => allSites.find((site) => site.id === selectedTargetSiteId) ?? null,
    [allSites, selectedTargetSiteId]
  );

  const [applyThemeMutation] = useMutation(SELF_SITE_UPDATE, {
    onError: (err) => {
      addToast({ kind: "error", title: "Theme apply", subTitle: err.message });
    },
  });

  const updateStep = (key: ApplyStepKey, status: StepStatus) => {
    setSteps((current) => current.map((step) => (step.key === key ? { ...step, status } : step)));
  };

  const handleApply = async () => {
    if (!user?.id || !theme?.id || !selectedTargetSite?.id || isApplying) return;
    if (!theme.schema) {
      addToast({ kind: "error", title: "Theme apply", subTitle: "This theme does not contain a schema." });
      updateStep("validate", "error");
      return;
    }

    setIsApplying(true);
    setAppliedSiteId(null);
    setSteps((current) => current.map((step) => ({ ...step, status: "pending" })));

    try {
      const appliedSchema = JSON.parse(JSON.stringify(theme.schema ?? {}));

      updateStep("validate", "active");
      await wait(250);
      updateStep("validate", "done");

      updateStep("prepare", "active");
      await wait(250);
      updateStep("prepare", "done");

      updateStep("apply", "active");
      await applyThemeMutation({
        variables: {
          userId: user.id,
          siteId: selectedTargetSite.id,
          schema: appliedSchema,
          head: theme.head ?? null,
          foot: theme.foot ?? null,
          theme: theme.theme ?? null,
          desktopTheme: theme.desktopTheme ?? null,
          navigation: theme.navigation ?? null,
          tools: theme.tools ?? null,
        },
      });
      updateStep("apply", "done");

      updateStep("complete", "active");
      setSiteId(selectedTargetSite.id);
      persistStudioEntry({
        siteId: selectedTargetSite.id,
        title: selectedTargetSite.title ?? null,
        schema: appliedSchema,
      });
      setAppliedSiteId(selectedTargetSite.id);
      await wait(250);
      updateStep("complete", "done");
      addToast({
        kind: "success",
        title: "Theme applied",
        subTitle: `${theme.title || "Theme"} was applied to ${selectedTargetSite.title || "selected site"}.`,
      });
    } catch {
      setSteps((current) => current.map((step) => (step.status === "active" ? { ...step, status: "error" } : step)));
    } finally {
      setIsApplying(false);
    }
  };

  const themePreviewUrl = getThemePreviewUrl(theme);
  const appliedStudioEntry = useMemo<StudioEntryState | null>(() => {
    if (!appliedSiteId || !theme?.schema) return null;
    return {
      siteId: appliedSiteId,
      title: selectedTargetSite?.title ?? null,
      schema: JSON.parse(JSON.stringify(theme.schema)),
    };
  }, [appliedSiteId, selectedTargetSite?.title, theme?.schema]);

  return (
    <main className="space-y-5 pb-16">
      <section className="border border-[#dde3eb] bg-white px-6 py-6" style={{ borderRadius: 10 }}>
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#6b7280]">
          <Link to="/theme/" className="inline-flex items-center gap-2 font-medium text-[#4f7cff] hover:underline">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to themes
          </Link>
          <span className="text-[#c2c8d3]">/</span>
          <span>Theme apply</span>
        </div>

        <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <PreviewStrip site={theme} />
            <div className="max-w-[780px]">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#8c96a8]">Apply Theme To Existing Site</div>
              <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-[#1f2430] sm:text-[36px]">
                {theme?.title || "Theme"}
              </h1>
              <p className="mt-3 text-[14px] leading-7 text-[#6b7280]">
                Select which website should receive this theme. The site keeps its own title, domain and identity,
                while the visual template layer is replaced with the selected theme package.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            {themePreviewUrl ? (
              <button
                type="button"
                onClick={() => window.open(themePreviewUrl, "_blank", "noopener,noreferrer")}
                className={SECONDARY_BUTTON}
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                Open Theme Preview
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => navigate(`/theme/update/?id=${themeId}`)}
              className={SECONDARY_BUTTON}
            >
              <PaintBrushIcon className="h-4 w-4" />
              Theme Details
            </button>
          </div>
        </div>
      </section>

      <section className="border border-[#dde3eb] bg-white px-6 py-5" style={{ borderRadius: 10 }}>
        <div className="text-[17px] font-semibold text-[#1f2430]">What will be copied</div>
        <div className="mt-2 text-[12px] leading-6 text-[#7a8395]">
          This apply flow only changes the theme layer. The destination website stays the same website.
        </div>
        <div className="mt-4 grid gap-x-6 gap-y-2 lg:grid-cols-2">
          {[
            "Full layout schema and page structure",
            "Theme and desktop theme settings",
            "Head and foot code",
            "Navigation and tools configuration",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 py-1.5">
              <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#16a34a]" />
              <div className="text-[13px] leading-6 text-[#4b5563]">{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-[#dde3eb] bg-white" style={{ borderRadius: 10 }}>
        <div className="border-b border-[#eef2f6] px-6 py-5">
          <div className="text-[17px] font-semibold text-[#1f2430]">Select destination website</div>
          <div className="mt-1 text-[12px] leading-6 text-[#7a8395]">
            Choose one website below. After selection, the theme can be applied directly.
          </div>
          <div className="mt-4 max-w-[360px]">
            <input
              value={siteSearch}
              onChange={(event) => setSiteSearch(event.target.value)}
              placeholder="Search websites by name or domain"
              className="h-11 w-full rounded-[10px] border border-[#d8dee8] bg-white px-4 text-[13px] text-[#1f2430] outline-none transition focus:border-[#116dff]"
            />
          </div>
        </div>

        <div className="px-6 py-2">
          {(themeLoading || sitesLoading) ? (
            <div className="py-10 text-center text-[13px] text-[#7a8395]">Loading theme and websites...</div>
          ) : null}

          {themeError ? (
            <div className="py-6 text-[13px] text-[#b42318]">{String(themeError.message)}</div>
          ) : null}

          {!themeLoading && !sitesLoading ? (
            <>
              <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_160px_170px] gap-4 border-b border-[#e5e9ef] py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8c96a8] xl:grid">
                <div>Website</div>
                <div>Domain</div>
                <div>Updated</div>
                <div className="text-right">Select</div>
              </div>

              {filteredSites.map((site) => {
                const isSelected = selectedTargetSiteId === site.id;
                return (
                  <div
                    key={site.id}
                    className={[
                      "grid gap-4 border-b border-[#eef2f6] py-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_160px_170px] xl:items-center",
                      isSelected ? "bg-[#f8fbff]" : "bg-white",
                    ].join(" ")}
                  >
                    <button type="button" onClick={() => setSelectedTargetSiteId(site.id)} className="flex items-start gap-4 text-left">
                      <PreviewStrip site={site} />
                      <div className="min-w-0 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="truncate text-[15px] font-semibold text-[#1f2430]">{site.title || "Untitled site"}</div>
                          {isSelected ? (
                            <span className="inline-flex items-center rounded-[8px] bg-[#116dff] px-2.5 py-1 text-[10px] font-medium text-white">
                              Selected
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#7a8395]">
                          <span className="inline-flex items-center gap-1.5">
                            <GlobeAltIcon className="h-4 w-4 text-[#98a1b2]" />
                            {getDisplayDomain(site)}
                          </span>
                          {site.createdAt ? <span>Created {dayjs(site.createdAt).fromNow()}</span> : null}
                        </div>
                      </div>
                    </button>

                    <div className="text-[13px] text-[#4b5563] xl:block">
                      <div className="truncate">{getDisplayDomain(site)}</div>
                      {site.hostname ? (
                        <div className="mt-1 truncate text-[11px] text-[#94a3b8]">{site.hostname}.site.bponi.com</div>
                      ) : null}
                    </div>

                    <div className="text-[12px] text-[#7a8395]">
                      {site.updatedAt ? `Updated ${dayjs(site.updatedAt).fromNow()}` : "Recently created"}
                    </div>

                    <div className="flex justify-start xl:justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedTargetSiteId(site.id)}
                        className={isSelected ? PRIMARY_BUTTON : SECONDARY_BUTTON}
                      >
                        {isSelected ? "Selected" : "Select Site"}
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {!filteredSites.length ? (
                <div className="py-10 text-center text-[13px] text-[#7a8395]">No destination website matched your search.</div>
              ) : null}
            </>
          ) : null}
        </div>
      </section>

      <section className="border border-[#dde3eb] bg-white px-6 py-5" style={{ borderRadius: 10 }}>
        <div className="text-[17px] font-semibold text-[#1f2430]">Apply progress</div>
        <div className="mt-4">
          {steps.map((step, index) => (
            <StepRow key={step.key} step={step} index={index} />
          ))}
        </div>
      </section>

      <section className="border border-[#dde3eb] bg-white px-6 py-5" style={{ borderRadius: 10 }}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-[17px] font-semibold text-[#1f2430]">Selected destination</div>
            {selectedTargetSite ? (
              <div className="mt-2 text-[13px] leading-7 text-[#4b5563]">
                <span className="font-semibold text-[#1f2430]">{selectedTargetSite.title || "Selected site"}</span>
                <span className="mx-2 text-[#c2c8d3]">•</span>
                <span>{getDisplayDomain(selectedTargetSite)}</span>
                {selectedTargetSite.updatedAt ? (
                  <>
                    <span className="mx-2 text-[#c2c8d3]">•</span>
                    <span>Updated {dayjs(selectedTargetSite.updatedAt).fromNow()}</span>
                  </>
                ) : null}
              </div>
            ) : (
              <div className="mt-2 text-[13px] leading-7 text-[#7a8395]">Select a website first.</div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleApply}
              disabled={!selectedTargetSite || isApplying || !theme?.id}
              className={PRIMARY_BUTTON}
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
              {isApplying ? "Applying Theme..." : "Apply Theme To This Site"}
            </button>
            {appliedSiteId ? (
              <button
                type="button"
                onClick={() => {
                  if (appliedStudioEntry) {
                    persistStudioEntry(appliedStudioEntry);
                  }
                  navigate(`/studio/?siteId=${appliedSiteId}`, {
                    state: appliedStudioEntry,
                  });
                }}
                className={SECONDARY_BUTTON}
              >
                <PaintBrushIcon className="h-4 w-4" />
                Open Studio
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {appliedSiteId ? (
        <section className="border border-[#cde9d5] bg-[#f3fbf5] px-6 py-5" style={{ borderRadius: 10 }}>
          <div className="flex items-start gap-3">
            <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#16a34a]" />
            <div>
              <div className="text-[15px] font-semibold text-[#1f2430]">Theme applied successfully</div>
              <div className="mt-1 text-[13px] leading-6 text-[#5f6778]">
                The selected website now uses this theme package. Continue to Studio if you want to fine-tune the layout.
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
