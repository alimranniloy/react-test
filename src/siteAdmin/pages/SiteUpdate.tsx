import { useEffect, useMemo, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SITE_IS_EXISTS, SITE_SCHEMA_DETAILS, SITES } from "@/graphql/queries/site";
import { SELF_SITE_UPDATE } from "@/graphql/mutations/siteUpdate";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";
import Pages from "@/siteAdmin/pages/Pages";

type TabName = "Home" | "General" | "Meta" | "Domain" | "Pages";

const STUDIO_ENTRY_KEY = "site-admin-react-studio-entry";

function normalizeHostname(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

function safeJsonParse(text: string | null): unknown | null {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function clearPersistedStudioEntryForTheme(themeId: number) {
  if (typeof window === "undefined") {
    return;
  }

  const entry = safeJsonParse(window.sessionStorage.getItem(STUDIO_ENTRY_KEY)) as
    | {
        themeId?: number | null;
        entityType?: "site" | "theme";
      }
    | null;

  if (entry?.entityType === "theme" && entry.themeId === themeId) {
    window.sessionStorage.removeItem(STUDIO_ENTRY_KEY);
  }
}

export default function SiteUpdate() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);

  const user = useAuthStore((s) => s.user);
  const selectedSiteId = useSiteAdminStore((s) => s.siteId);

  const queryId = params.get("id");
  const siteId = useMemo(() => {
    const fromQuery = queryId ? Number(queryId) : null;
    if (fromQuery && Number.isFinite(fromQuery)) return fromQuery;
    return selectedSiteId;
  }, [queryId, selectedSiteId]);

  const [tab, setTab] = useState<TabName>("Home");
  const [hostnameInput, setHostnameInput] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [isHostnameAvailable, setIsHostnameAvailable] = useState<boolean | null>(
    null
  );
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean | null>(
    null
  );

  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [desktopLogoFile, setDesktopLogoFile] = useState<File | null>(null);
  const [phoneLogoFile, setPhoneLogoFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const { data, loading, error, refetch } = useQuery(SITE_SCHEMA_DETAILS, {
    variables: { id: siteId ?? 0 },
    fetchPolicy: "network-only",
    skip: !siteId
  });

  const site = data?.siteById ?? null;

  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [locale, setLocale] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [notice, setNotice] = useState<string>("");
  const [isOtp, setIsOtp] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [schemaText, setSchemaText] = useState<string>("{}");
  const [linkedThemeSiteId, setLinkedThemeSiteId] = useState<number | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!site) return;
    setTitle(String(site.title ?? ""));
    setMetaTitle(String(site.metaTitle ?? ""));
    setMetaDescription(String(site.metaDescription ?? ""));
    setEmail(String(site.email ?? ""));
    setPhone(site.phone != null ? String(site.phone) : "");
    setAddress(String(site.address ?? ""));
    setStreet(String(site.street ?? ""));
    setLocale(String(site.locale ?? ""));
    setCurrency(String(site.currency ?? ""));
    setNotice(String(site.notice ?? ""));
    setIsOtp(!!site.isOtp);
    setIsPublic(!!site.isPublic);
    setIsGuest(!!site.isGuest);
    setHostnameInput(String(site.hostname ?? ""));
    setDomainInput(String(site.domain ?? ""));
    setSchemaText(safeJsonStringify(site.schema));
    setIsHostnameAvailable(null);
    setIsDomainAvailable(null);
    setFaviconFile(null);
    setDesktopLogoFile(null);
    setPhoneLogoFile(null);
    setCoverImageFile(null);
    setLinkedThemeSiteId(site.parent?.id ?? null);
  }, [site]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const createdById = useMemo(() => {
    if (!user?.id) return null;
    return user.isStaff ? null : user.id;
  }, [user?.id, user?.isStaff]);

  const isThemeRecord = !!site?.isTheme || site?.siteType === "theme";

  const { data: websiteData } = useQuery(SITES, {
    variables: {
      createdById,
      siteType: "site",
      queryType: "latest",
      first: 50,
      after: null,
    },
    fetchPolicy: "network-only",
    skip: !user?.id || !isThemeRecord,
  });

  const websiteOptions = useMemo(() => {
    const edges = websiteData?.sites?.edges ?? [];
    return edges.map((edge: { node?: { id: number; title?: string | null } | null }) => edge?.node).filter(Boolean);
  }, [websiteData?.sites?.edges]);

  const [checkExists] = useLazyQuery(SITE_IS_EXISTS, {
    fetchPolicy: "network-only"
  });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const value = normalizeHostname(hostnameInput);
    if (value.length < 4) {
      setIsHostnameAvailable(null);
      return;
    }
    const t = window.setTimeout(async () => {
      try {
        const result = await checkExists({ variables: { hostname: value } });
        const exists = !!result.data?.siteSiteIsExists?.exists;
        setIsHostnameAvailable(!exists);
      } catch {
        setIsHostnameAvailable(null);
      }
    }, 350);
    return () => window.clearTimeout(t);
  }, [checkExists, hostnameInput]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const value = domainInput.toLowerCase().trim();
    if (value.length < 4) {
      setIsDomainAvailable(null);
      return;
    }
    const t = window.setTimeout(async () => {
      try {
        const result = await checkExists({ variables: { hostname: value } });
        const exists = !!result.data?.siteSiteIsExists?.exists;
        setIsDomainAvailable(!exists);
      } catch {
        setIsDomainAvailable(null);
      }
    }, 350);
    return () => window.clearTimeout(t);
  }, [checkExists, domainInput]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const [updateSite, { loading: saving }] = useMutation(SELF_SITE_UPDATE, {
    onCompleted: () => {
      addToast({
        kind: "success",
        title: "Site info",
        subTitle: "Successfully updated new data."
      });
      refetch();
    },
    onError: (err) => {
      addToast({ kind: "error", title: "Site info", subTitle: err.message });
    }
  });

  const canSubmit = useMemo(() => {
    if (!user?.id || !siteId) return false;
    if (tab === "Domain") {
      // When unchanged, availability stays null; allow update.
      if (isHostnameAvailable === false || isDomainAvailable === false) return false;
    }
    return true;
  }, [isDomainAvailable, isHostnameAvailable, siteId, tab, user?.id]);

  const handleUpdate = async () => {
    if (!user?.id || !siteId) return;
    const parsedSchema = safeJsonParse(schemaText);
    if (tab === "Home" && parsedSchema == null) {
      addToast({ kind: "error", title: "Schema", subTitle: "Invalid JSON" });
      return;
    }

    await updateSite({
      variables: {
        userId: user.id,
        siteId,
        title,
        metaTitle,
        metaDescription,
        email: email || null,
        phone: phone ? parseInt(phone, 10) : null,
        address: address || null,
        street: street || null,
        locale: locale || null,
        currency: currency || null,
        notice: notice || null,
        isOtp,
        isPublic,
        isGuest,
        hostname: hostnameInput || null,
        domain: domainInput || null,
        favicon: faviconFile,
        desktopLogo: desktopLogoFile,
        phoneLogo: phoneLogoFile,
        coverImage: coverImageFile,
        schema: parsedSchema != null ? parsedSchema : undefined
        ,
        ...(isThemeRecord
          ? {
              parents: linkedThemeSiteId ? [linkedThemeSiteId] : [],
              isTheme: true,
              isPublic: false,
              siteType: "theme",
            }
          : {})
      }
    });
  };

  const handleArchiveTheme = async () => {
    if (!user?.id || !siteId || !isThemeRecord) return;

    await updateSite({
      variables: {
        userId: user.id,
        siteId,
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
      }
    });

    clearPersistedStudioEntryForTheme(siteId);

    addToast({
      kind: "success",
      title: "Theme deleted",
      subTitle: "The private theme was removed, unlinked, and its Studio draft was cleared.",
    });

    navigate("/", { replace: true });
  };

  if (!siteId) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">No site selected</h2>
        <p className="mt-2 text-sm text-slate-500">
          Select a site from <Link className="text-brand-600 underline" to="/site/">Site</Link>{" "}
          and then open update.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1">
      <div className="relative mx-auto">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 overflow-hidden rounded-full border bg-slate-100">
            {site?.favicon ? (
              <img
                className="h-full w-full object-cover"
                src={String(site.favicon)}
                alt={String(site.title ?? "")}
                loading="lazy"
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 truncate">
              {site?.title ?? (isThemeRecord ? "Theme" : "Site")}
            </h1>
            {isThemeRecord ? (
              <p className="mt-1 text-sm text-slate-500">
                Private theme workspace settings
              </p>
            ) : null}
            {site?.hostname || site?.domain ? (
              <p className="text-sm font-medium text-blue-700 truncate">
                {site?.hostname ? (
                  <>
                    <a
                      href={`https://${String(site.hostname)}.site.bponi.com`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {String(site.hostname)}
                    </a>
                    {" | "}
                  </>
                ) : null}
                {site?.domain ? (
                  <a
                    href={`https://${String(site.domain)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {String(site.domain)}
                  </a>
                ) : null}
              </p>
            ) : null}
          </div>
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={loading}
              className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-md border bg-white p-4 text-sm text-rose-600">
            {String(error.message)}
          </div>
        ) : null}

        <div className="mt-6">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex gap-6 overflow-x-auto">
              {(["Home", "General", "Meta", "Domain", "Pages"] as TabName[]).map(
                (name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setTab(name)}
                    className={[
                      "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
                      tab === name
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                    ].join(" ")}
                  >
                    {name}
                  </button>
                )
              )}
            </nav>
          </div>

          {tab === "Home" ? (
            <div className="mt-4 rounded-md border bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">
                Schema (Raw JSON)
              </div>
              <p className="mt-1 text-xs text-slate-500">
                This replaces the Vue Editor for now. Paste valid JSON and click Update.
              </p>
              <textarea
                value={schemaText}
                onChange={(e) => setSchemaText(e.target.value)}
                className="mt-3 w-full min-h-72 rounded-md border p-3 font-mono text-xs"
              />
            </div>
          ) : null}

          {tab === "General" ? (
            <div className="mt-4 rounded-md border bg-white p-4">
              {isThemeRecord ? (
                <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    Theme Settings
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Keep this theme private, link it to a website, or archive it so it no longer appears on the home dashboard.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
                    <div>
                      <label className="text-xs font-medium text-slate-700">
                        Linked website
                      </label>
                      <select
                        value={linkedThemeSiteId ?? ""}
                        onChange={(event) => setLinkedThemeSiteId(Number(event.target.value) || null)}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      >
                        <option value="">No linked website</option>
                        {websiteOptions.map((website: { id: number; title?: string | null }) => (
                          <option key={website.id} value={website.id}>
                            {website.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleArchiveTheme}
                        className="w-full rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
                      >
                        Delete Theme
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="01XXXXXXXXX / 8801XXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    Address
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    Street
                  </label>
                  <input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    Notice
                  </label>
                  <input
                    value={notice}
                    onChange={(e) => setNotice(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-md border p-3">
                  <div className="text-xs font-semibold text-slate-700">
                    Favicon (max 3MB)
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2 text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (!file) return setFaviconFile(null);
                      if (file.size > 3 * 1024 * 1024) {
                        addToast({
                          kind: "error",
                          title: "File",
                          subTitle: "File size exceeds the maximum (3 MB) allowed limit."
                        });
                        return;
                      }
                      setFaviconFile(file);
                    }}
                  />
                  {faviconFile ? (
                    <div className="mt-2 text-xs text-slate-500">
                      Selected: {faviconFile.name}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-md border p-3">
                  <div className="text-xs font-semibold text-slate-700">
                    Desktop Logo (max 3MB)
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2 text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (!file) return setDesktopLogoFile(null);
                      if (file.size > 3 * 1024 * 1024) {
                        addToast({
                          kind: "error",
                          title: "File",
                          subTitle: "File size exceeds the maximum (3 MB) allowed limit."
                        });
                        return;
                      }
                      setDesktopLogoFile(file);
                    }}
                  />
                  {desktopLogoFile ? (
                    <div className="mt-2 text-xs text-slate-500">
                      Selected: {desktopLogoFile.name}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-md border p-3">
                  <div className="text-xs font-semibold text-slate-700">
                    Phone Logo (max 3MB)
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2 text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (!file) return setPhoneLogoFile(null);
                      if (file.size > 3 * 1024 * 1024) {
                        addToast({
                          kind: "error",
                          title: "File",
                          subTitle: "File size exceeds the maximum (3 MB) allowed limit."
                        });
                        return;
                      }
                      setPhoneLogoFile(file);
                    }}
                  />
                  {phoneLogoFile ? (
                    <div className="mt-2 text-xs text-slate-500">
                      Selected: {phoneLogoFile.name}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-md border p-3">
                  <div className="text-xs font-semibold text-slate-700">
                    Cover Image (max 3MB)
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2 text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (!file) return setCoverImageFile(null);
                      if (file.size > 3 * 1024 * 1024) {
                        addToast({
                          kind: "error",
                          title: "File",
                          subTitle: "File size exceeds the maximum (3 MB) allowed limit."
                        });
                        return;
                      }
                      setCoverImageFile(file);
                    }}
                  />
                  {coverImageFile ? (
                    <div className="mt-2 text-xs text-slate-500">
                      Selected: {coverImageFile.name}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={isOtp}
                    onChange={(e) => setIsOtp(e.target.checked)}
                  />
                  OTP enabled
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={isGuest}
                    onChange={(e) => setIsGuest(e.target.checked)}
                  />
                  Guest
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  Public
                </label>
              </div>
            </div>
          ) : null}

          {tab === "Meta" ? (
            <div className="mt-4 rounded-md border bg-white p-4">
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Meta Title
                </label>
                <input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-700">
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="mt-1 w-full min-h-32 rounded-md border px-3 py-2 text-sm"
                />
              </div>
            </div>
          ) : null}

          {tab === "Domain" ? (
            <div className="mt-4 rounded-md border bg-white p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    Hostname
                  </label>
                  <input
                    value={hostnameInput}
                    onChange={(e) => setHostnameInput(normalizeHostname(e.target.value))}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                  {isHostnameAvailable === false ? (
                    <div className="mt-1 text-xs text-rose-600">
                      Hostname already used.
                    </div>
                  ) : isHostnameAvailable === true ? (
                    <div className="mt-1 text-xs text-emerald-600">
                      Hostname available.
                    </div>
                  ) : null}
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    Domain
                  </label>
                  <input
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value.toLowerCase().trim())}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                  {isDomainAvailable === false ? (
                    <div className="mt-1 text-xs text-rose-600">
                      Domain already used.
                    </div>
                  ) : isDomainAvailable === true ? (
                    <div className="mt-1 text-xs text-emerald-600">
                      Domain available.
                    </div>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Update will be blocked only when availability check returns
                false.
              </p>
            </div>
          ) : null}

          {tab === "Pages" ? (
            <div className="mt-4">
              <Pages />
            </div>
          ) : null}
        </div>

        {["General", "Meta", "Domain", "Home"].includes(tab) ? (
          <div className="pt-5 flex justify-end gap-3">
            <Link
              to="/"
              className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={!canSubmit || saving}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              Update
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
