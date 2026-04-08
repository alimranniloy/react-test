export type ApiPluginMeta = {
  privateKey: string;
  secretKey: string;
  wordpressPluginName: string;
  updatedAt: string;
};

const DEFAULT_WORDPRESS_PLUGIN_NAME = "Bponi WordPress Bridge";

const safeRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }

  return {};
};

const generateToken = (prefix: string) => {
  const bytes = new Uint8Array(18);

  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${prefix}_${value}`;
};

export const createApiPluginMeta = (
  overrides: Partial<ApiPluginMeta> = {}
): ApiPluginMeta => ({
  privateKey: overrides.privateKey || generateToken("bpn_pk"),
  secretKey: overrides.secretKey || generateToken("bpn_sk"),
  wordpressPluginName:
    overrides.wordpressPluginName || DEFAULT_WORDPRESS_PLUGIN_NAME,
  updatedAt: overrides.updatedAt || new Date().toISOString(),
});

export const readApiPluginMeta = (meta: unknown): ApiPluginMeta => {
  const root = safeRecord(meta);
  const current = safeRecord(root.apiPlugin);

  return createApiPluginMeta({
    privateKey:
      typeof current.privateKey === "string" ? current.privateKey : undefined,
    secretKey:
      typeof current.secretKey === "string" ? current.secretKey : undefined,
    wordpressPluginName:
      typeof current.wordpressPluginName === "string"
        ? current.wordpressPluginName
        : undefined,
    updatedAt:
      typeof current.updatedAt === "string" ? current.updatedAt : undefined,
  });
};

export const hasStoredApiPluginMeta = (meta: unknown) => {
  const root = safeRecord(meta);
  const current = safeRecord(root.apiPlugin);

  return (
    typeof current.privateKey === "string" &&
    current.privateKey.length > 0 &&
    typeof current.secretKey === "string" &&
    current.secretKey.length > 0
  );
};

export const mergeApiPluginMeta = (
  meta: unknown,
  overrides: Partial<ApiPluginMeta> = {}
) => {
  const root = safeRecord(meta);
  const current = readApiPluginMeta(meta);

  return {
    ...root,
    apiPlugin: {
      ...current,
      ...overrides,
      updatedAt: new Date().toISOString(),
    },
  };
};
