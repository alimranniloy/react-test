import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
  EyeIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  SparklesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { SITES } from "@/graphql/queries/site";

type ThemeSite = {
  id: number;
  title?: string | null;
  domain?: string | null;
  hostname?: string | null;
  desktopLogo?: string | null;
  favicon?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  isVerified?: boolean | null;
};

const categories = [
  { title: "SaaS", id: 1 },
  { title: "Product", id: 2 },
  { title: "Business", id: 3 },
  { title: "Marketing", id: 4 },
  { title: "Design Tools", id: 5 },
  { title: "Software", id: 6 },
  { title: "Technology", id: 7 },
  { title: "Mobile App", id: 8 },
  { title: "Freelance", id: 9 },
  { title: "Artificial Intelligence", id: 10 },
  { title: "Users", id: 11 },
  { title: "Crypto", id: 12 },
];

const PRIMARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-[#116dff] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0056ff]";
const SECONDARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-[#d7deea] bg-white px-5 text-[13px] font-semibold text-[#3d4758] transition hover:bg-[#f7f9fc]";

function getThemeUrl(theme: ThemeSite) {
  if (theme.hostname) {
    return `https://${String(theme.hostname)}.store.bponi.com`;
  }
  if (theme.domain) {
    return /^https?:\/\//i.test(theme.domain) ? String(theme.domain) : `https://${String(theme.domain)}`;
  }
  return null;
}

function ThemePreview({ theme }: { theme: ThemeSite }) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = theme.desktopLogo || theme.favicon || null;

  if (!imageSrc || hasError) {
    return (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f5f2ff_54%,#e4d8ff_100%)] p-5">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded-full bg-white/80" />
          <div className="h-9 w-9 rounded-full bg-white/70" />
        </div>
        <div>
          <div className="text-[18px] font-semibold tracking-[-0.03em] text-[#1f2430]">
            {theme.title || "Theme Preview"}
          </div>
          <div className="mt-2 h-2.5 w-32 rounded-full bg-[#95a1b2]/60" />
          <div className="mt-2 h-2.5 w-24 rounded-full bg-[#b6bfd0]/60" />
        </div>
        <div className="rounded-[16px] bg-white/75 p-4 backdrop-blur-sm">
          <div className="h-3 w-20 rounded-full bg-[#272b38]" />
          <div className="mt-3 h-2 w-full rounded-full bg-[#b6bfd0]" />
          <div className="mt-2 h-2 w-[82%] rounded-full bg-[#c7ced9]" />
          <div className="mt-4 flex gap-2">
            <div className="h-8 w-20 rounded-[10px] bg-[#116dff]" />
            <div className="h-8 w-20 rounded-[10px] bg-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={String(imageSrc)}
      alt={String(theme.title || "Theme preview")}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[10px] border px-4 text-[12px] font-medium transition",
        active
          ? "border-[#bfd6ff] bg-[#eef5ff] text-[#116dff]"
          : "border-[#dde3eb] bg-white text-[#4b5563] hover:bg-[#f8fafd]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ThemeCard({ theme, onOpen }: { theme: ThemeSite; onOpen: () => void }) {
  const navigate = useNavigate();
  const previewUrl = getThemeUrl(theme);

  return (
    <article className="group overflow-hidden border border-[#dde3eb] bg-white" style={{ borderRadius: 14 }}>
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative aspect-[4/4.9] overflow-hidden border-b border-[#eef2f6] bg-[#f7f8fc]">
          <ThemePreview theme={theme} />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold text-[#1f2430] shadow-sm backdrop-blur-sm">
              <CheckBadgeIcon className="h-3.5 w-3.5 text-[#116dff]" />
              Verified
            </span>
            <span className="inline-flex items-center rounded-full bg-[#111827]/75 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              Theme
            </span>
          </div>
        </div>
      </button>

      <div className="flex min-h-[196px] flex-col px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-semibold tracking-[-0.02em] text-[#1f2430]">
              {String(theme.title || "Untitled Theme")}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#7a8395]">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <GlobeAltIcon className="h-4 w-4 text-[#98a1b2]" />
                <span className="max-w-[180px] truncate">{theme.domain || (theme.hostname ? `${theme.hostname}.store.bponi.com` : "No public domain")}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-[#8c96a8]">
          <div className="rounded-[10px] bg-[#f7f9fc] px-3 py-2.5">
            <div className="uppercase tracking-[0.06em]">Created</div>
            <div className="mt-1 truncate text-[12px] font-medium text-[#4b5563]">
              {theme.createdAt ? dayjs(theme.createdAt).format("MMM DD, YYYY") : "Recently"}
            </div>
          </div>
          <div className="rounded-[10px] bg-[#f7f9fc] px-3 py-2.5">
            <div className="uppercase tracking-[0.06em]">Updated</div>
            <div className="mt-1 truncate text-[12px] font-medium text-[#4b5563]">
              {theme.updatedAt ? dayjs(theme.updatedAt).fromNow() : "Recently"}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={onOpen}
            className={`${PRIMARY_BUTTON} w-full px-4`}
          >
            <PaintBrushIcon className="h-4 w-4" />
            <span>Use Theme</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (previewUrl) {
                window.open(previewUrl, "_blank", "noopener,noreferrer");
                return;
              }
              navigate(`/theme/update/?id=${theme.id}`);
            }}
            className={`${SECONDARY_BUTTON} w-full px-4`}
          >
            {previewUrl ? <EyeIcon className="h-4 w-4" /> : <ArrowTopRightOnSquareIcon className="h-4 w-4" />}
            <span>{previewUrl ? "Open Preview" : "View Details"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Themes() {
  const navigate = useNavigate();
  const [industry, setIndustry] = useState<number | null>(null);
  const [first] = useState(16);

  const { data, loading, error, fetchMore, refetch } = useQuery(SITES, {
    variables: {
      siteType: "site",
      queryType: "latest",
      isVerified: true,
      industry: industry ?? null,
      first,
      after: null,
    },
    fetchPolicy: "network-only",
  });

  const pageInfo = data?.sites?.pageInfo ?? {};
  const themes = useMemo(() => {
    const edges: { node: ThemeSite }[] = data?.sites?.edges ?? [];
    return edges.map((edge) => edge.node).filter(Boolean);
  }, [data?.sites?.edges]);
  const activeCategory = categories.find((item) => item.id === industry)?.title ?? "All";
  const hasMore = !!pageInfo?.endCursor;
  const connectedPreviewCount = themes.filter((theme) => Boolean(getThemeUrl(theme))).length;

  const loadMore = async () => {
    const endCursor = pageInfo?.endCursor;
    if (!endCursor) return;
    await fetchMore({
      variables: {
        siteType: "site",
        queryType: "latest",
        isVerified: true,
        industry: industry ?? null,
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

  return (
    <main className="mx-auto max-w-[1300px] space-y-5 pb-16">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden border border-[#dde3eb] bg-white px-6 py-6" style={{ borderRadius: 14 }}>
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#8c96a8]">Theme Library</div>
          <h1 className="mt-3 max-w-[760px] text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#1f2430] sm:text-[36px]">
            Browse verified website themes and launch faster without rebuilding every page from scratch.
          </h1>
          <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-[#6b7280]">
            Pick a clean starting point, preview the layout, then open the theme and adapt it for your own store,
            business or landing page flow.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-[12px] border border-[#e5e9ef] bg-[#f7f9fc] px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.06em] text-[#8c96a8]">Themes Loaded</div>
              <div className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#111827]">{themes.length}</div>
            </div>
            <div className="rounded-[12px] border border-[#e5e9ef] bg-[#f7f9fc] px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.06em] text-[#8c96a8]">Preview Ready</div>
              <div className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#111827]">{connectedPreviewCount}</div>
            </div>
            <div className="rounded-[12px] border border-[#e5e9ef] bg-[#f7f9fc] px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.06em] text-[#8c96a8]">Active Filter</div>
              <div className="mt-2 text-[15px] font-semibold tracking-[-0.02em] text-[#111827]">{activeCategory}</div>
            </div>
          </div>
        </div>

        <aside className="overflow-hidden border border-[#dde3eb] bg-white p-6" style={{ borderRadius: 14 }}>
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef4ff] text-[#116dff]">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-[20px] font-semibold tracking-[-0.03em] text-[#1f2430]">
                Build from a solid base instead of starting from zero.
              </div>
              <p className="mt-3 text-[13px] leading-6 text-[#6b7280]">
                Every theme card has a stable preview area, clean actions and a safe placeholder if the remote image does not load.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate("/component/")}
                className={PRIMARY_BUTTON}
              >
                <Squares2X2Icon className="h-4 w-4" />
                Browse Components
              </button>
              <button type="button" onClick={() => refetch()} className={SECONDARY_BUTTON}>
                <ArrowPathIcon className="h-4 w-4" />
                Refresh Themes
              </button>
            </div>
          </div>
        </aside>
      </section>

      <section className="overflow-hidden border border-[#dde3eb] bg-white px-6 py-5" style={{ borderRadius: 14 }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#1f2430]">Filter by category</h2>
            <p className="mt-1 text-[12px] leading-6 text-[#7a8395]">
              Choose a category and keep the cards aligned, readable and ready to preview.
            </p>
          </div>
          <div className="text-[12px] text-[#7a8395]">{themes.length} verified themes</div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <CategoryPill
            active={industry == null}
            onClick={() => {
              setIndustry(null);
              refetch({
                siteType: "site",
                queryType: "latest",
                isVerified: true,
                industry: null,
                first,
                after: null,
              });
            }}
          >
            All
          </CategoryPill>
          {categories.map((item) => (
            <CategoryPill key={item.id} active={industry === item.id} onClick={() => setIndustry(item.id)}>
              {item.title}
            </CategoryPill>
          ))}
        </div>
      </section>

      {error ? (
        <div className="rounded-[12px] border border-[#f5c2c7] bg-[#fff7f7] px-5 py-4 text-[13px] text-[#b42318]">
          {String(error.message)}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {themes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} onOpen={() => navigate(`/theme/update/?id=${theme.id}`)} />
        ))}
      </section>

      {loading ? (
        <div className="rounded-[12px] border border-[#dde3eb] bg-white px-5 py-10 text-center text-[13px] text-[#7a8395]">
          Loading themes...
        </div>
      ) : null}

      {!loading && themes.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[#d4dce8] bg-[#fbfcfe] px-5 py-10 text-center text-[13px] text-[#7a8395]">
          No themes found for this category.
        </div>
      ) : null}

      {themes.length > 0 && hasMore ? (
        <div className="flex justify-center pt-2">
          <button type="button" onClick={loadMore} className={SECONDARY_BUTTON}>
            View More Themes
          </button>
        </div>
      ) : null}
    </main>
  );
}
