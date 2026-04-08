export function getAssetUrl(path) {
  return import.meta.env.PROD
    ? `https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/assets/store/${path}`
    : new URL(`/src/assets/${path}`, import.meta.url).href;
}
