import { sha1 } from "crypto-hash";

const NAMESPACE_OID = "6ba7b812-9dad-11d1-80b4-00c04fd430c8";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isUuid = (value: string) => UUID_REGEX.test(value);

const hexToBytes = (hex: string) => {
  const clean = hex.replace(/-/g, "");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

const bytesToUuid = (bytes: Uint8Array) => {
  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  const hex = Array.from(bytes, toHex).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join("-");
};

export async function uuidV5(name: string, namespace = NAMESPACE_OID) {
  const namespaceBytes = hexToBytes(namespace);
  const nameBytes = new TextEncoder().encode(name);
  const toHash = new Uint8Array(namespaceBytes.length + nameBytes.length);
  toHash.set(namespaceBytes);
  toHash.set(nameBytes, namespaceBytes.length);

  const hash = new Uint8Array(await sha1(toHash, { outputFormat: "buffer" }));
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  return bytesToUuid(hash.slice(0, 16));
}

export async function legacySiteUuid(siteId: string | number) {
  return uuidV5(`bponi-legacy-site-${siteId}`);
}
