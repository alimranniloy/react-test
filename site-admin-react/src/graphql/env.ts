const APP_NAME = "site-admin";

export const AUTH_TOKEN = `BPONI-AUTH_${APP_NAME}`;
const ENV_COOKIE = "BPONI-ENV";
const ENV_DEV = "dev";
const ENV_PROD = "prod";

export const HTTP_ENDPOINT_BASE =
  import.meta.env.VITE_GRAPHQL_HTTP ?? "https://api.bponi.com/x";
export const WS_ENDPOINT_BASE =
  import.meta.env.VITE_GRAPHQL_WS ?? "wss://api.bponi.com/x";

function getEnvParam(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("env");
}

function replaceUrlSearch(nextSearch: string) {
  if (typeof window === "undefined") return;
  const { pathname, hash } = window.location;
  const url = `${pathname}${nextSearch}${hash}`;
  window.history.replaceState({}, "", url);
}

function stripEnvParamFromUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("env")) return;
  url.searchParams.delete("env");
  replaceUrlSearch(url.search);
}

function normalizeEnvInUrl() {
  const param = getEnvParam();
  if (param === ENV_PROD) {
    stripEnvParamFromUrl();
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days?: number) {
  if (typeof document === "undefined") return;
  const maxAge = days ? days * 24 * 60 * 60 : 0;
  const maxAgePart = maxAge ? `; Max-Age=${maxAge}` : "";
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}${maxAgePart}; Path=/; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function syncEnvCookie(envValue: string | null) {
  if (!envValue) return;
  const normalized = String(envValue).toLowerCase();
  if (normalized === ENV_DEV) {
    setCookie(ENV_COOKIE, ENV_DEV, 7);
  } else if (normalized === ENV_PROD) {
    clearCookie(ENV_COOKIE);
    normalizeEnvInUrl();
  }
}

function resolveEnvPreference(): string | null {
  const param = getEnvParam();
  if (param === ENV_DEV) {
    setCookie(ENV_COOKIE, ENV_DEV, 7);
    return ENV_DEV;
  }
  if (param === ENV_PROD) {
    clearCookie(ENV_COOKIE);
    normalizeEnvInUrl();
    return null;
  }
  const cookie = getCookie(ENV_COOKIE);
  return cookie === ENV_DEV ? ENV_DEV : null;
}

export function withEnvQuery(url: string, envValue: string | null): string {
  if (envValue !== ENV_DEV) return url;
  const parsed = new URL(url);
  parsed.searchParams.set("env", ENV_DEV);
  return parsed.toString();
}

export function stripQuery(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    return parsed.toString();
  } catch {
    return url;
  }
}

export function shouldCryptRequest(
  requestUrl: string,
  baseUrl: string,
): boolean {
  if (import.meta.env.PROD) return true;
  return stripQuery(requestUrl) !== stripQuery(baseUrl);
}

let envPreference = resolveEnvPreference();
normalizeEnvInUrl();

export function getEnvMode(): string | null {
  return envPreference;
}

export function setEnvMode(mode: string | null) {
  const normalized = String(mode || "").toLowerCase();
  if (normalized === ENV_DEV) {
    setCookie(ENV_COOKIE, ENV_DEV, 7);
    envPreference = ENV_DEV;
  } else {
    clearCookie(ENV_COOKIE);
    envPreference = null;
  }
  normalizeEnvInUrl();
}

export function syncEnvFromUrl() {
  envPreference = resolveEnvPreference();
  normalizeEnvInUrl();
}

export function getRequestUrl(baseUrl: string): string {
  return withEnvQuery(baseUrl, getEnvMode());
}

export function syncEnvCookieFromResponse(res: Response) {
  syncEnvCookie(res.headers.get("X-Env"));
}
