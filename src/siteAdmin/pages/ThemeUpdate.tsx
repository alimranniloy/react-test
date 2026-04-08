import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  LinkIcon,
  PaintBrushIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SITE_SCHEMA_DETAILS } from "@/graphql/queries/site";

type ThemeSite = {
  id: number;
  title?: string | null;
  hostname?: string | null;
  domain?: string | null;
  desktopLogo?: string | null;
  favicon?: string | null;
  schema?: unknown;
  head?: string | null;
  foot?: string | null;
  navigation?: unknown;
  tools?: unknown;
  updatedAt?: string | null;
};

const BASE_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
const PRIMARY_BUTTON = `${BASE_BUTTON} bg-[#116dff] text-white hover:bg-[#0056ff]`;
const SECONDARY_BUTTON = `${BASE_BUTTON} border border-[#d8dee8] bg-white text-[#4b5563] hover:bg-[#f7f9fc]`;

function getPreviewUrl(theme: ThemeSite | null) {
  if (!theme) return null;
  if (theme.hostname) return `https://${String(theme.hostname)}.store.bponi.com`;
  if (theme.domain) return /^https?:\/\//i.test(theme.domain) ? String(theme.domain) : `https://${String(theme.domain)}`;
  return null;
}

function ThemePreviewTile({ theme }: { theme: ThemeSite | null }) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = theme?.desktopLogo || theme?.favicon || null;

  if (imageSrc && !hasError) {
    return (
      <div className="relative h-[190px] w-full overflow-hidden rounded-[16px] border border-[#dde3eb] bg-white">
        <img
          src={String(imageSrc)}
          alt={theme?.title || "Theme preview"}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="relative h-[190px] w-full overflow-hidden rounded-[16px] border border-[#dde3eb] bg-[linear-gradient(180deg,#ffffff_0%,#f5f2ff_54%,#e4dbff_100%)] p-5">
      <div className="h-4 w-24 rounded-full bg-white/90" />
      <div className="mt-12 text-[22px] font-semibold tracking-[-0.04em] text-[#1f2430]">{theme?.title || "Theme"}</div>
      <div className="mt-3 h-2.5 w-36 rounded-full bg-[#97a2b3]/65" />
      <div className="mt-2 h-2.5 w-28 rounded-full bg-[#c0c8d5]/65" />
      <div className="absolute bottom-5 left-5 right-5 rounded-[14px] bg-white/75 p-4 backdrop-blur-sm">
        <div className="h-3 w-24 rounded-full bg-[#272b38]" />
        <div className="mt-3 h-2.5 w-full rounded-full bg-[#c9d1dc]" />
        <div className="mt-2 h-2.5 w-[82%] rounded-full bg-[#d8dee7]" />
        <div className="mt-4 flex gap-2">
          <div className="h-9 w-24 rounded-[10px] bg-[#116dff]" />
          <div className="h-9 w-24 rounded-[10px] bg-white" />
        </div>
      </div>
    </div>
  );
}

export default function ThemeUpdate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [width, setWidth] = useState<string>("100%");

  const themeId = useMemo(() => {
    const raw = params.get("id");
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  }, [params]);

  const { data, loading, error } = useQuery(SITE_SCHEMA_DETAILS, {
    variables: { id: themeId ?? 0 },
    fetchPolicy: "network-only",
    skip: !themeId,
  });

  const theme = data?.siteById ?? null;
  const previewUrl = useMemo(() => getPreviewUrl(theme), [theme]);
  const includesCount = [theme?.schema, theme?.head, theme?.foot, theme?.navigation, theme?.tools].filter(Boolean).length;

  return (
    <main className="mx-auto max-w-[1320px] space-y-5 pb-16">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden border border-[#dde3eb] bg-white p-6" style={{ borderRadius: 14 }}>
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#6b7280]">
            <Link to="/theme/" className="inline-flex items-center gap-2 font-medium text-[#4f7cff] hover:underline">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to theme library
            </Link>
            <span className="text-[#c2c8d3]">/</span>
            <span>Theme details</span>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <ThemePreviewTile theme={theme} />

            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#8c96a8]">Theme overview</div>
              <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-[#1f2430] sm:text-[36px]">
                {theme?.title || "Loading theme"}
              </h1>
              <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-[#6b7280]">
                Review the preview first, then clone this theme into one of your existing websites through a guided step-by-step flow.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-[12px] border border-[#e5e9ef] bg-[#f7f9fc] px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.06em] text-[#8c96a8]">Ready Modules</div>
                  <div className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#111827]">{includesCount}</div>
                </div>
                <div className="rounded-[12px] border border-[#e5e9ef] bg-[#f7f9fc] px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.06em] text-[#8c96a8]">Preview Link</div>
                  <div className="mt-2 text-[14px] font-semibold text-[#111827]">{previewUrl ? "Available" : "Unavailable"}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => theme?.id && navigate(`/theme/apply/?themeId=${theme.id}`)}
                  disabled={!theme?.id}
                  className={PRIMARY_BUTTON}
                >
                  <PaintBrushIcon className="h-4 w-4" />
                  Clone To Site
                </button>
                {previewUrl ? (
                  <button
                    type="button"
                    onClick={() => window.open(previewUrl, "_blank", "noopener,noreferrer")}
                    className={SECONDARY_BUTTON}
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    Open Full Preview
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <aside className="overflow-hidden border border-[#dde3eb] bg-white p-6" style={{ borderRadius: 14 }}>
          <div className="text-[15px] font-semibold text-[#1f2430]">What this theme includes</div>
          <div className="mt-4 space-y-3">
            {[
              { title: "Layout schema", description: "Sections, blocks and page structure used by the theme." },
              { title: "Head and foot code", description: "Custom preview/head setup that belongs to this theme." },
              { title: "Navigation and tools", description: "Theme-level site navigation and utility configuration." },
              { title: "Guided apply flow", description: "Choose an existing site before anything is updated." },
            ].map((item) => (
              <div key={item.title} className="rounded-[12px] border border-[#e5e9ef] bg-[#fbfcfe] px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#116dff] ring-1 ring-[#e5e9ef]">
                    <CheckCircleIcon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1f2430]">{item.title}</div>
                    <div className="mt-1 text-[12px] leading-6 text-[#6b7280]">{item.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[12px] border border-[#e5e9ef] bg-[#f7f9fc] p-4">
            <div className="text-[13px] font-semibold text-[#1f2430]">Clone target stays intact</div>
            <div className="mt-2 text-[12px] leading-6 text-[#6b7280]">
              The next page asks which site should receive this theme. You select the site first, then the apply process runs step by step.
            </div>
          </div>
        </aside>
      </section>

      <section className="overflow-hidden border border-[#dde3eb] bg-white" style={{ borderRadius: 14 }}>
        <div className="flex flex-col gap-4 border-b border-[#eef2f6] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[17px] font-semibold text-[#1f2430]">Preview workspace</div>
            <div className="mt-1 text-[12px] leading-6 text-[#7a8395]">
              Change the preview width before you decide to clone the theme.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Mobile", value: "24%" },
              { label: "Tablet", value: "48%" },
              { label: "Laptop", value: "72%" },
              { label: "Desktop", value: "100%" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setWidth(item.value)}
                className={[
                  "inline-flex h-10 items-center justify-center rounded-[10px] border px-4 text-[12px] font-medium transition",
                  width === item.value
                    ? "border-[#bfd6ff] bg-[#eef5ff] text-[#116dff]"
                    : "border-[#dde3eb] bg-white text-[#4b5563] hover:bg-[#f8fafd]",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#f5f7fb] p-6">
          {error ? (
            <div className="rounded-[12px] border border-[#f5c2c7] bg-[#fff7f7] px-5 py-4 text-[13px] text-[#b42318]">
              {String(error.message)}
            </div>
          ) : null}
          {loading ? (
            <div className="rounded-[12px] border border-[#dde3eb] bg-white px-5 py-10 text-center text-[13px] text-[#7a8395]">
              Loading theme preview...
            </div>
          ) : null}
          {!loading && !error ? (
            <div className="overflow-hidden rounded-[16px] border border-[#dde3eb] bg-white">
              <div className="flex items-center justify-between border-b border-[#eef2f6] px-5 py-4">
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#1f2430]">
                  <SparklesIcon className="h-4 w-4 text-[#116dff]" />
                  Theme preview canvas
                </div>
                {previewUrl ? (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[12px] font-medium text-[#4f7cff] hover:underline"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Open full page
                  </a>
                ) : null}
              </div>

              <div className="flex items-center justify-center bg-[#f5f7fb] p-6">
                {previewUrl ? (
                  <iframe title="Theme preview" src={previewUrl} style={{ width }} className="h-[86vh] rounded-[12px] border border-[#dde3eb] bg-white" />
                ) : (
                  <div className="flex min-h-[420px] w-full items-center justify-center rounded-[12px] border border-dashed border-[#d4dce8] bg-white px-6 text-center text-[13px] leading-6 text-[#7a8395]">
                    No live preview URL is available for this theme yet.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
