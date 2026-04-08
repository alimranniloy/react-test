import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CheckIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SELF_SITE_CREATE } from "@/graphql/mutations/site";
import { SELF_SITE_UPDATE } from "@/graphql/mutations/siteUpdate";
import { SITE_IS_EXISTS, SITE_SCHEMA_DETAILS } from "@/graphql/queries/site";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";
import { createApiPluginMeta } from "@/siteAdmin/utils/apiPluginKeys";

type Industry = { value: number; name: string };

const industries: Industry[] = [
  { value: 10, name: "Beauty" },
  { value: 2, name: "Fashion" },
  { value: 3, name: "Electronics" },
  { value: 4, name: "Furniture" },
  { value: 5, name: "Handcrafts" },
  { value: 6, name: "Jewelry" },
  { value: 7, name: "Painting" },
  { value: 8, name: "Photography" },
  { value: 9, name: "Restaurants" },
  { value: 1, name: "Groceries" },
  { value: 17, name: "Medicine" },
  { value: 11, name: "Food & drink" },
  { value: 12, name: "Sports" },
  { value: 13, name: "Toys" },
  { value: 14, name: "Services" },
  { value: 15, name: "Virtual services" },
  { value: 16, name: "Course" },
  { value: 17, name: "Restaurant" },
  { value: 99, name: "Other" },
];

const industryDescriptions: Record<string, string> = {
  Beauty: "Salon, skincare, cosmetics",
  Fashion: "Clothing, boutique, apparel",
  Electronics: "Devices, gadgets, accessories",
  Furniture: "Home, decor, interiors",
  Handcrafts: "Handmade products and gifts",
  Jewelry: "Accessories, ornaments, premium pieces",
  Painting: "Art, canvas, creative studio",
  Photography: "Photo service or portfolio",
  Restaurants: "Dining, cafe, food service",
  Groceries: "Daily essentials and groceries",
  Medicine: "Pharmacy or health products",
  "Food & drink": "Snacks, drinks, packaged food",
  Sports: "Fitness, gear, sports products",
  Toys: "Kids items and playful products",
  Services: "Local or professional services",
  "Virtual services": "Digital services and remote work",
  Course: "Learning, coaching, education",
  Restaurant: "Restaurant and food delivery",
  Other: "Something different or mixed",
};

const guide = [
  { code: "product_product", id: 1, isActive: true, isPurchased: true, title: "Product" },
  { code: "product_category", id: 2, isActive: true, isPurchased: true, title: "Product Category" },
  { code: "product_sub_category", id: 3, isActive: true, isPurchased: true, title: "Product Sub Category" },
  { code: "product_sub_sub_category", id: 4, isActive: true, isPurchased: true, title: "Product Sub Sub Category" },
  { code: "product_excel", id: 5, isActive: true, isPurchased: true, title: "Product Excel" },
  { code: "product_brand", id: 6, isActive: true, isPurchased: true, title: "Product Brand" },
  { code: "order_order", id: 7, isActive: true, isPurchased: true, title: "Orders" },
  { code: "order_pos", id: 8, isActive: true, isPurchased: false, title: "Order POS" },
  { code: "order_excel", id: 9, isActive: true, isPurchased: true, title: "Order Excel" },
  { code: "payment_customer", id: 10, isActive: true, isPurchased: true, title: "Payment Customer" },
  { code: "payment_reseller", id: 11, isActive: true, isPurchased: true, title: "Payment Reseller" },
  { code: "payment_transaction", id: 35, isActive: true, isPurchased: true, title: "Payment Transaction" },
  { code: "user_reseller", id: 12, isActive: true, isPurchased: true, title: "User reseller" },
  { code: "user_affiliate", id: 13, isActive: true, isPurchased: true, title: "User Affiliate" },
  { code: "user_wholesaler", id: 14, isActive: true, isPurchased: false, title: "User wholesaler" },
  { code: "user_excel", id: 15, isActive: true, isPurchased: true, title: "user_excel" },
  { code: "user_users", id: 16, isActive: true, isPurchased: true, title: "user_users" },
  { code: "marketing_campaign", id: 17, isActive: true, isPurchased: true, title: "marketing_campaign" },
  { code: "marketing_collection", id: 18, isActive: true, isPurchased: true, title: "marketing_collection" },
  { code: "marketing_voucher", id: 19, isActive: true, isPurchased: true, title: "marketing_voucher" },
  { code: "marketing_slider", id: 20, isActive: true, isPurchased: true, title: "marketing_slider" },
  { code: "connection_merchant", id: 21, isActive: true, isPurchased: false, title: "connection_merchant" },
  { code: "connection_supplier", id: 22, isActive: true, isPurchased: true, title: "connection_supplier" },
  { code: "connection_partner", id: 23, isActive: true, isPurchased: false, title: "connection_partner" },
  { code: "connection_affiliate", id: 24, isActive: true, isPurchased: true, title: "Connection Affiliate" },
  { code: "connection_staff", id: 25, isActive: true, isPurchased: true, title: "connection_staff" },
  { code: "tool_gateway", id: 26, isActive: true, isPurchased: true, title: "tool_gateway" },
  { code: "tool_logistics", id: 27, isActive: true, isPurchased: true, title: "tool_logistics" },
  { code: "tool_stoppage", id: 28, isActive: true, isPurchased: false, title: "tool_stoppage" },
  { code: "tool_page", id: 29, isActive: true, isPurchased: true, title: "tool_page" },
  { code: "tool_file", id: 30, isActive: true, isPurchased: true, title: "tool_file" },
  { code: "tool_invoice", id: 31, isActive: true, isPurchased: false, title: "tool_invoice" },
  { code: "tool_feed", id: 32, isActive: true, isPurchased: false, title: "tool_feed" },
  { code: "tool_navigation", id: 33, isActive: true, isPurchased: false, title: "tool_navigation" },
];

function normalizeHostname(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

type ThemeSource = {
  id: number;
  title?: string | null;
  schema?: unknown;
  head?: string | null;
  foot?: string | null;
  theme?: string | null;
  desktopTheme?: string | null;
  navigation?: unknown;
  tools?: unknown;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type SetupSectionKey = "siteType" | "domain" | "email" | "design" | "seo";

type ChecklistRowProps = {
  label: string;
  complete?: boolean;
  active?: boolean;
  actionLabel?: string;
  onSelect?: () => void;
  onAction?: () => void;
  children: ReactNode;
};

function ChecklistRow({
  label,
  complete = false,
  active = false,
  actionLabel,
  onSelect,
  onAction,
  children,
}: ChecklistRowProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[6px] border transition-colors",
        active ? "border-[#a8c0ff] bg-[#f5f8ff]" : "border-[#d6dfeb] bg-white"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center">
            {complete ? (
              <CheckIcon className="h-4 w-4 text-[#39b36e]" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
            )}
          </span>
          <span
            className={cn(
              "truncate text-[14px] font-medium",
              complete ? "text-slate-400 line-through" : "text-[#16233b]"
            )}
          >
            {label}
          </span>
        </button>

        {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex h-7 items-center rounded-full border border-[#c9dafd] bg-white px-4 text-[12px] font-medium text-[#2563eb] transition hover:bg-[#f4f8ff]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>

      {active ? <div className="border-t border-[#d7dfed] px-10 pb-6 pt-4 sm:px-10">{children}</div> : null}
    </section>
  );
}

export default function CreateSite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const currentSite = useSiteStore((s) => s.site) as { whiteLabelUrl?: string | null } | null;
  const setCurrentSite = useSiteStore((s) => s.setSite);
  const setSelectedSiteId = useSiteAdminStore((s) => s.setSiteId);
  const upsertSite = useSiteAdminStore((s) => s.upsertSite);
  const addToast = useToastStore((s) => s.addToast);

  const [activeSection, setActiveSection] = useState<SetupSectionKey>("siteType");
  const [title, setTitle] = useState("");
  const [hostname, setHostname] = useState("");
  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [industry, setIndustry] = useState<Industry>(industries[0]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const themeId = useMemo(() => {
    const raw = searchParams.get("themeId");
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  }, [searchParams]);

  const { data: themeData } = useQuery(SITE_SCHEMA_DETAILS, {
    variables: { id: themeId ?? 0 },
    fetchPolicy: "network-only",
    skip: !themeId,
  });

  const themeSource = (themeData?.siteById ?? null) as ThemeSource | null;

  const [meta] = useState(() => {
    const primary = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;
    return {
      color: [
        { name: "primary", value: primary },
        { name: "secondary", value: "#ffffff" },
        { name: "success", value: "#28a745" },
        { name: "info", value: "#17a2b8" },
        { name: "warning", value: "#ffc107" },
        { name: "danger", value: "#ff1f1f" },
      ],
      apiPlugin: createApiPluginMeta(),
    };
  });

  const social = useMemo(
    () => ({
      facebook: "https://www.facebook.com",
      twitter: "https://www.twitter.com",
      instagram: "https://www.instagram.com",
      youtube: "https://www.youtube.com",
    }),
    []
  );

  const [checkExists] = useLazyQuery(SITE_IS_EXISTS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const exists = !!data?.siteSiteIsExists?.exists;
      if (!exists) {
        addToast({ kind: "success", title: "Store info", subTitle: "Valid username" });
        setIsAvailable(true);
      } else {
        addToast({ kind: "error", title: "Store info", subTitle: "Already used this username" });
        setIsAvailable(false);
      }
      setChecking(false);
    },
    onError: () => {
      addToast({ kind: "error", title: "Store info", subTitle: "Username check failed" });
      setIsAvailable(false);
      setChecking(false);
    },
  });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const h = normalizeHostname(hostname);
    if (h.length < 4) {
      setIsAvailable(null);
      return;
    }
    setChecking(true);
    const t = window.setTimeout(() => {
      checkExists({ variables: { hostname: h } });
    }, 350);
    return () => window.clearTimeout(t);
  }, [checkExists, hostname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const [createSite, { loading: saving }] = useMutation(SELF_SITE_CREATE, {
    onError: (error) => {
      addToast({ kind: "error", title: "Store info", subTitle: error.message });
    },
  });

  const [updateSiteFromTheme] = useMutation(SELF_SITE_UPDATE, {
    onError: (error) => {
      addToast({ kind: "error", title: "Theme apply", subTitle: error.message });
    },
  });

  const hostnameSuffix = currentSite?.whiteLabelUrl ? String(currentSite.whiteLabelUrl) : ".site.bponi.com";
  const sanitizedHostname = useMemo(() => normalizeHostname(hostname), [hostname]);
  const domainPreview = sanitizedHostname ? `${sanitizedHostname}${hostnameSuffix}` : `yourbrand${hostnameSuffix}`;
  const titleValid = title.trim().length >= 3;
  const addressValid = address.trim().length >= 3;
  const streetValid = street.trim().length >= 3;
  const usernameReady = sanitizedHostname.length >= 4 && isAvailable === true;
  const usernameStatusLabel = checking
    ? "Checking availability..."
    : isAvailable === true
      ? "Available"
      : isAvailable === false
        ? "Already used"
        : "Waiting for username";

  const actionLabel = themeId ? "Create and Open Studio" : "Create Site";
  const designReady = true;
  const canCreateSite = titleValid && usernameReady;
  const setupItems = useMemo(
    () => [
      { key: "siteType" as const, label: "Update your site type", complete: titleValid },
      { key: "domain" as const, label: "Connect a custom domain", complete: usernameReady },
      { key: "email" as const, label: "Get a custom business email", complete: false },
      { key: "design" as const, label: "Design your website", complete: designReady },
      { key: "seo" as const, label: "Set up your site's SEO", complete: addressValid || streetValid },
    ],
    [addressValid, designReady, streetValid, titleValid, usernameReady]
  );
  const completedCount = setupItems.filter((item) => item.complete).length;
  const progressPercent = Math.round((completedCount / setupItems.length) * 100);

  const handleDomainContinue = () => {
    if (sanitizedHostname.length < 4) {
      addToast({ kind: "error", title: "Validation", subTitle: "Username must be at least 4 characters." });
      setActiveSection("domain");
      return;
    }

    if (checking) {
      addToast({ kind: "error", title: "Validation", subTitle: "Wait until username checking finishes." });
      setActiveSection("domain");
      return;
    }

    if (isAvailable !== true) {
      addToast({ kind: "error", title: "Validation", subTitle: "Choose an available username first." });
      setActiveSection("domain");
      return;
    }

    setActiveSection("seo");
  };

  const handleBusinessEmail = () => {
    addToast({
      kind: "success",
      title: "Business Email",
      subTitle: "You can connect your business email right after the site is created.",
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    const sanitized = normalizeHostname(hostname);
    const suffix = currentSite?.whiteLabelUrl ? String(currentSite.whiteLabelUrl) : ".site.bponi.com";
    const fullDomain = `${sanitized}${suffix}`;

    if (!title.trim() || sanitized.length < 4) {
      addToast({ kind: "error", title: "Validation", subTitle: "Title and username are required." });
      return;
    }
    if (isAvailable === false) {
      addToast({ kind: "error", title: "Validation", subTitle: "Username is not available." });
      return;
    }

    const createResult = await createSite({
      variables: {
        userId: user.id,
        address: address || "",
        country: Number(user.country ?? 0),
        currency: String(user.currency ?? "BDT"),
        desktopTheme: "app",
        domain: fullDomain,
        email: user.email ?? null,
        footer: null,
        guide,
        hostname: sanitized,
        industry: industry.value,
        latitude: Number(user.latitude ?? 0),
        longitude: Number(user.longitude ?? 0),
        memberTemplate: null,
        meta,
        navigation: {},
        note: typeof window !== "undefined" ? window.location.host : "site-admin-react",
        phone: user.phone ?? null,
        referCode: "c",
        schema: null,
        siteInfo: "site",
        siteType: "site",
        social,
        street: street || null,
        theme: "app",
        title: title.trim(),
      },
    });

    const created = createResult.data?.selfSiteCreate;

    if (!created?.id) return;

    const createdSiteSummary = {
      ...created,
      id: Number(created.id),
      title: String(created.title ?? title.trim()),
      domain: created.domain ?? fullDomain,
      hostname: created.hostname ?? sanitized,
      street: (created.street ?? street) || null,
      address: address || "",
      siteType: "site",
      isActive: true,
    };

    upsertSite(createdSiteSummary);
    setCurrentSite(createdSiteSummary);
    setSelectedSiteId(Number(created.id));

    if (themeId && themeSource) {
      const appliedSchema = themeSource.schema != null ? JSON.parse(JSON.stringify(themeSource.schema)) : null;

      await updateSiteFromTheme({
        variables: {
          userId: user.id,
          siteId: created.id,
          schema: appliedSchema,
          head: themeSource.head ?? null,
          foot: themeSource.foot ?? null,
          theme: themeSource.theme ?? null,
          desktopTheme: themeSource.desktopTheme ?? null,
          navigation: themeSource.navigation ?? null,
          tools: themeSource.tools ?? null,
        },
      });

      await updateSiteFromTheme({
        variables: {
          userId: user.id,
          siteId: themeId,
          parents: [created.id],
          isTheme: true,
          isPublic: false,
          siteType: "theme",
        },
      });

      addToast({
        kind: "success",
        title: "Website created",
        subTitle: "A new website was created and linked to this private theme.",
      });
      navigate(`/studio/?siteId=${created.id}`, {
        replace: true,
        state: {
          siteId: Number(created.id),
          title: createdSiteSummary.title,
          schema: appliedSchema,
          entityType: "site",
        },
      });
      return;
    }

    addToast({ kind: "success", title: "Store info", subTitle: "Successfully updated new data." });
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-[calc(100vh-132px)] rounded-[20px] bg-[#dbe3ec] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[980px]">
        {themeId ? (
          <div className="mb-3 inline-flex items-center rounded-full border border-[#c9dafd] bg-white px-3 py-1 text-[12px] font-medium text-[#2563eb]">
            Using theme: {themeSource?.title || "Private Theme"}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-[14px] border border-white/80 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-[#0f1e38]">
                Let&apos;s set up your business
              </h1>
              <p className="mt-2 text-[13px] text-[#73809a]">
                Create your site now with a clean setup flow.
              </p>
            </div>

            <div className="w-full max-w-[296px]">
              <div className="flex items-center justify-between text-[13px] text-[#334155]">
                <span>{completedCount}/{setupItems.length} completed</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-[#e6eaf0]">
                <div
                  className="h-full rounded-full bg-[#2563eb] transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2.5 px-6 pb-6 sm:px-8 sm:pb-8">
            <ChecklistRow
              label="Update your site type"
              complete={titleValid}
              active={activeSection === "siteType"}
              onSelect={() => setActiveSection("siteType")}
            >
              <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div>
                  <div className="text-[14px] leading-6 text-[#1d2a42]">
                    Start with a clear business name and pick the category that best matches your store.
                  </div>
                  <div className="mt-4 rounded-full border border-[#d5ddeb] bg-white px-5 py-3">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border-0 bg-transparent px-0 py-0 text-[15px] font-medium text-[#10203b] outline-none placeholder:text-[#a2adc1]"
                      placeholder="e.g., My Site 1"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-[13px] font-medium text-[#4d5a73]">Choose your category</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {industries.slice(0, 12).map((item) => {
                      const selected = industry.value === item.value && industry.name === item.name;
                      return (
                        <button
                          key={`${item.value}-${item.name}`}
                          type="button"
                          onClick={() => setIndustry(item)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
                            selected
                              ? "border-[#2563eb] bg-[#2563eb] text-white"
                              : "border-[#d3dceb] bg-white text-[#334155] hover:border-[#9bb8ff] hover:bg-[#f7f9ff]"
                          )}
                        >
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-[12px] text-[#7b879c]">
                    {industryDescriptions[industry.name] || "Pick the category that best matches your business."}
                  </div>
                </div>
              </div>
            </ChecklistRow>

            <ChecklistRow
              label="Connect a custom domain"
              complete={usernameReady}
              active={activeSection === "domain"}
              onSelect={() => setActiveSection("domain")}
            >
              <div className="text-[14px] leading-6 text-[#1d2a42]">
                Find your perfect domain and secure it in a few clicks.
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex h-11 flex-1 items-center rounded-full border-2 border-[#3b82f6] bg-white px-4 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]">
                  <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-[#3b82f6]" />
                  <input
                    value={hostname}
                    onChange={(e) => setHostname(normalizeHostname(e.target.value))}
                    className="w-full border-0 bg-transparent px-3 py-0 text-[15px] text-[#10203b] outline-none placeholder:text-[#97a3ba]"
                    placeholder="e.g., mystunningwebsite.com"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDomainContinue}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#2563eb] px-8 text-[14px] font-semibold text-white transition hover:bg-[#1d4ed8]"
                >
                  Let&apos;s Go
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px]">
                <span
                  className={cn(
                    "font-medium",
                    checking
                      ? "text-[#334155]"
                      : isAvailable === true
                        ? "text-[#15904a]"
                        : isAvailable === false
                          ? "text-[#dc2626]"
                          : "text-[#64748b]"
                  )}
                >
                  {usernameStatusLabel}
                </span>
                <span className="text-[#7b879c]">
                  Preview: <span className="font-medium text-[#21304d]">{domainPreview}</span>
                </span>
              </div>
            </ChecklistRow>

            <ChecklistRow
              label="Get a custom business email"
              active={activeSection === "email"}
              onSelect={() => setActiveSection("email")}
              actionLabel="Get Business Email"
              onAction={handleBusinessEmail}
            >
              <div className="text-[14px] leading-6 text-[#1d2a42]">
                Set up a professional inbox that matches your domain right after launch.
              </div>
            </ChecklistRow>

            <ChecklistRow
              label="Design your website"
              complete={designReady}
              active={activeSection === "design"}
              onSelect={() => setActiveSection("design")}
            >
              <div className="text-[14px] leading-6 text-[#1d2a42]">
                {themeId
                  ? `A starter design from ${themeSource?.title || "Private Theme"} will be applied to your new site.`
                  : "Your site will start with a clean base design, and you can customize everything later in Studio."}
              </div>
            </ChecklistRow>

            <ChecklistRow
              label="Set up your site's SEO"
              complete={addressValid || streetValid}
              active={activeSection === "seo"}
              onSelect={() => setActiveSection("seo")}
              actionLabel={activeSection === "seo" ? undefined : "Get Started"}
              onAction={() => setActiveSection("seo")}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-[12px] font-medium text-[#55627b]">Business address</div>
                  <div className="rounded-full border border-[#d5ddeb] bg-white px-5 py-3">
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border-0 bg-transparent px-0 py-0 text-[15px] text-[#10203b] outline-none placeholder:text-[#a2adc1]"
                      placeholder="Dhaka, Bangladesh"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-[12px] font-medium text-[#55627b]">Street details</div>
                  <div className="rounded-full border border-[#d5ddeb] bg-white px-5 py-3">
                    <input
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full border-0 bg-transparent px-0 py-0 text-[15px] text-[#10203b] outline-none placeholder:text-[#a2adc1]"
                      placeholder="Road 12, House 22"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[12px] text-[#7b879c]">
                These details help search engines and customers understand where your business operates.
              </div>
            </ChecklistRow>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#e4e9f2] bg-[#fbfcff] px-6 py-5 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[13px] font-semibold text-[#1d2a42]">
                {title.trim() || "Your new site"}
              </div>
              <div className="mt-1 text-[12px] text-[#6f7b91]">
                {canCreateSite
                  ? `Ready to publish at ${domainPreview}`
                  : "Add a site type and an available domain to continue."}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !canCreateSite}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-[14px] font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : actionLabel}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
