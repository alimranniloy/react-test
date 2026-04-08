import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  ArrowPathIcon,
  ClipboardDocumentIcon,
  KeyIcon,
  PuzzlePieceIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Link, useSearchParams } from "react-router-dom";
import { SELF_SITE_UPDATE } from "@/graphql/mutations/siteUpdate";
import { SITE_SCHEMA_DETAILS } from "@/graphql/queries/site";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";
import {
  createApiPluginMeta,
  hasStoredApiPluginMeta,
  mergeApiPluginMeta,
  readApiPluginMeta,
} from "@/siteAdmin/utils/apiPluginKeys";

export default function ApiSettings() {
  const [params] = useSearchParams();
  const addToast = useToastStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);
  const selectedSiteId = useSiteAdminStore((s) => s.siteId);

  const siteId = useMemo(() => {
    const queryId = params.get("id");
    const parsed = queryId ? Number(queryId) : null;
    if (parsed && Number.isFinite(parsed)) return parsed;
    return selectedSiteId;
  }, [params, selectedSiteId]);

  const { data, loading, error, refetch } = useQuery(SITE_SCHEMA_DETAILS, {
    variables: { id: siteId ?? 0 },
    fetchPolicy: "network-only",
    skip: !siteId,
  });

  const site = data?.siteById ?? null;
  const [siteMeta, setSiteMeta] = useState<Record<string, unknown>>({});
  const [privateKey, setPrivateKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [wordpressPluginName, setWordpressPluginName] = useState("");
  const autoPersistedSiteIdRef = useRef<number | null>(null);
  const hydratedMetaSignatureRef = useRef<string>("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!site) return;

    const signature = `${site.id}:${JSON.stringify(site.meta ?? {})}`;
    if (hydratedMetaSignatureRef.current === signature) return;

    const nextMeta =
      site.meta && typeof site.meta === "object" && !Array.isArray(site.meta)
        ? { ...(site.meta as Record<string, unknown>) }
        : {};
    const apiPlugin = readApiPluginMeta(nextMeta);

    setSiteMeta(nextMeta);
    setPrivateKey(apiPlugin.privateKey);
    setSecretKey(apiPlugin.secretKey);
    setWordpressPluginName(apiPlugin.wordpressPluginName);
    hydratedMetaSignatureRef.current = signature;
  }, [site]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const [updateSite, { loading: saving }] = useMutation(SELF_SITE_UPDATE, {
    onCompleted: async () => {
      addToast({
        kind: "success",
        title: "API settings",
        subTitle: "API keys and plugin settings were saved.",
      });
      await refetch();
    },
    onError: (mutationError) => {
      addToast({
        kind: "error",
        title: "API settings",
        subTitle: mutationError.message,
      });
    },
  });

  useEffect(() => {
    if (!site?.id || !user?.id || !siteId || saving) return;
    if (!privateKey || !secretKey) return;
    if (hasStoredApiPluginMeta(site.meta)) return;
    if (autoPersistedSiteIdRef.current === site.id) return;

    const nextMeta = mergeApiPluginMeta(site.meta, {
      privateKey,
      secretKey,
      wordpressPluginName,
    });

    autoPersistedSiteIdRef.current = site.id;
    hydratedMetaSignatureRef.current = "";
    void updateSite({
      variables: {
        userId: user.id,
        siteId,
        meta: nextMeta,
      },
    });
  }, [
    privateKey,
    secretKey,
    site,
    siteId,
    saving,
    updateSite,
    user?.id,
    wordpressPluginName,
  ]);

  const handleResetKeys = async () => {
    if (!user?.id || !siteId) return;

    const nextKeys = createApiPluginMeta({ wordpressPluginName });
    const nextMeta = mergeApiPluginMeta(siteMeta, {
      privateKey: nextKeys.privateKey,
      secretKey: nextKeys.secretKey,
      wordpressPluginName,
    });

    setPrivateKey(nextKeys.privateKey);
    setSecretKey(nextKeys.secretKey);
    setSiteMeta(nextMeta);
    autoPersistedSiteIdRef.current = siteId;
    hydratedMetaSignatureRef.current = "";

    await updateSite({
      variables: {
        userId: user.id,
        siteId,
        meta: nextMeta,
      },
    });
  };

  const handleCopyValue = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      addToast({
        kind: "success",
        title: `${label} copied`,
        subTitle: "The value was copied to your clipboard.",
      });
    } catch {
      addToast({
        kind: "error",
        title: `${label} copy failed`,
        subTitle: "Clipboard access is not available in this browser.",
      });
    }
  };

  const handleSave = async () => {
    if (!user?.id || !siteId) return;

    hydratedMetaSignatureRef.current = "";
    await updateSite({
      variables: {
        userId: user.id,
        siteId,
        meta: mergeApiPluginMeta(siteMeta, {
          privateKey,
          secretKey,
          wordpressPluginName,
        }),
      },
    });
  };

  if (!siteId) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">No site selected</h2>
        <p className="mt-2 text-sm text-slate-500">
          Select a website from <Link className="text-brand-600 underline" to="/site/">Site</Link>{" "}
          and then open API settings.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1">
      <div className="relative mx-auto max-w-[1080px] space-y-4">
        <section className="rounded-[14px] border border-[#dce3ec] bg-white px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dce6ff] bg-[#f4f7ff] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#335cff]">
                <KeyIcon className="h-3.5 w-3.5" />
                API & Plugin
              </div>
              <h1 className="mt-2 text-[24px] font-bold tracking-[-0.04em] text-slate-900">
                {site?.title ?? "Website"}
              </h1>
              <p className="mt-1 max-w-[720px] text-[13px] leading-6 text-slate-500">
                Stable private credentials for integrations and a dedicated WordPress plugin area.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <div className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#e8edf3] bg-[#f8fafc] px-3 text-[12px] font-semibold text-slate-900">
                <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                Stable Keys
              </div>
              <div className="inline-flex h-10 items-center rounded-[10px] border border-[#e8edf3] bg-[#f8fafc] px-3 text-[12px] font-semibold text-slate-900">
                Per Website
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex h-10 items-center justify-center rounded-[10px] bg-indigo-600 px-4 text-[13px] font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                Save Changes
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-md border bg-white p-4 text-sm text-rose-600">
            {String(error.message)}
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-[14px] border border-[#dce3ec] bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-[15px] font-semibold text-slate-900">API Access Keys</div>
                <p className="mt-1 text-[13px] leading-6 text-slate-500">
                  Reset generates brand new keys immediately and saves them to the database at once.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetKeys}
                disabled={saving || loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-slate-300 bg-white px-3.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Reset Keys
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-[12px] border border-[#e6ebf2] bg-[#f8fafc] p-3.5">
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Private Key
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopyValue("Private key", privateKey)}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-[8px] border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
                <input
                  value={privateKey}
                  readOnly
                  className="mt-2.5 h-11 w-full rounded-[10px] border border-slate-200 bg-white px-3 font-mono text-[12px] text-slate-800"
                />
              </div>

              <div className="rounded-[12px] border border-[#e6ebf2] bg-[#f8fafc] p-3.5">
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Secret Key
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopyValue("Secret key", secretKey)}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-[8px] border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
                <input
                  value={secretKey}
                  readOnly
                  className="mt-2.5 h-11 w-full rounded-[10px] border border-slate-200 bg-white px-3 font-mono text-[12px] text-slate-800"
                />
              </div>
            </div>
          </section>

          <aside className="rounded-[14px] border border-[#dce3ec] bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-900">
              <PuzzlePieceIcon className="h-4.5 w-4.5 text-emerald-600" />
              WordPress Plugin
            </div>
            <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
              Plugin shell is ready. Connection and sync logic can be added later without changing this layout.
            </p>

            <div className="mt-4 rounded-[12px] border border-slate-200 bg-[#f8fafc] p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Plugin Slot</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Reserved for the WordPress bridge.
                  </div>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-700">
                  Coming Soon
                </span>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Plugin Name
                </label>
                <input
                  value={wordpressPluginName}
                  onChange={(event) => setWordpressPluginName(event.target.value)}
                  className="mt-2 h-10 w-full rounded-[10px] border border-slate-200 bg-white px-3 text-sm text-slate-800"
                />
              </div>

              <div className="mt-4 grid gap-2 text-xs text-slate-600">
                <div className="rounded-[10px] border border-dashed border-slate-200 bg-white px-3 py-2.5">
                  WordPress plugin installer package
                </div>
                <div className="rounded-[10px] border border-dashed border-slate-200 bg-white px-3 py-2.5">
                  Private key and secret key authentication
                </div>
                <div className="rounded-[10px] border border-dashed border-slate-200 bg-white px-3 py-2.5">
                  Theme sync, site sync, and webhook slots
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  disabled
                  className="rounded-[10px] border border-slate-200 bg-slate-100 px-3 py-2.5 text-[13px] font-medium text-slate-400"
                >
                  Download Plugin
                </button>
                <button
                  type="button"
                  disabled
                  className="rounded-[10px] border border-slate-200 bg-slate-100 px-3 py-2.5 text-[13px] font-medium text-slate-400"
                >
                  Connect WordPress
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
