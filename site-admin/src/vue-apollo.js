import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client/core";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { WebSocketLink } from "apollo-link-ws";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "apollo-utilities";
import { sha256 } from "crypto-hash";
import { name } from "../package.json";

// Name of the localStorage item
const AUTH_TOKEN = "BPONI-AUTH_" + name;
const ENV_COOKIE = "BPONI-ENV";
const ENV_DEV = "dev";
const ENV_PROD = "prod";

function getEnvParam() {
  if (typeof window === "undefined") {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("env");
}

function replaceUrlSearch(nextSearch) {
  if (typeof window === "undefined") {
    return;
  }
  const { pathname, hash } = window.location;
  const url = `${pathname}${nextSearch}${hash}`;
  window.history.replaceState({}, "", url);
}

function stripEnvParamFromUrl() {
  if (typeof window === "undefined") {
    return;
  }
  const url = new URL(window.location.href);
  if (!url.searchParams.has("env")) {
    return;
  }
  url.searchParams.delete("env");
  replaceUrlSearch(url.search);
}

function normalizeEnvInUrl() {
  const param = getEnvParam();
  if (param === ENV_PROD) {
    stripEnvParamFromUrl();
  }
}

function getCookie(name) {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(
    new RegExp("(^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days) {
  if (typeof document === "undefined") {
    return;
  }
  const maxAge = days ? days * 24 * 60 * 60 : 0;
  const maxAgePart = maxAge ? `; Max-Age=${maxAge}` : "";
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}${maxAgePart}; Path=/; SameSite=Lax`;
}

function clearCookie(name) {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function syncEnvCookie(envValue) {
  if (!envValue) {
    return;
  }
  const normalized = String(envValue).toLowerCase();
  if (normalized === ENV_DEV) {
    setCookie(ENV_COOKIE, ENV_DEV, 7);
  } else if (normalized === ENV_PROD) {
    clearCookie(ENV_COOKIE);
    normalizeEnvInUrl();
  }
}

function resolveEnvPreference() {
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

function withEnvQuery(url, envValue) {
  if (envValue !== ENV_DEV) {
    return url;
  }
  const parsed = new URL(url);
  parsed.searchParams.set("env", ENV_DEV);
  return parsed.toString();
}

function stripQuery(url) {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    return parsed.toString();
  } catch (e) {
    return url;
  }
}

let envPreference = resolveEnvPreference();
normalizeEnvInUrl();

// Http endpoint
const httpEndpointBase =
  process.env.NODE_ENV === "production"
    ? "https://api.bponi.com/x"
    : "https://api.bponi.com/x";
// websocket endpoint
const wsEndpointBase =

  process.env.NODE_ENV === "production"
    ? "wss://api.bponi.com/x"
    : "wss://api.bponi.com/x";

const wsEndpoint = withEnvQuery(wsEndpointBase, envPreference);

function getEnvPreference() {
  return envPreference;
}

export function setEnvMode(mode) {
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

export function getEnvMode() {
  return getEnvPreference();
}

function getRequestUrl(baseUrl) {
  return withEnvQuery(baseUrl, getEnvPreference());
}

const customFetch = (uri, options) => {
  return new Promise(async (resolve, reject) => {
    let req = new XMLHttpRequest();
    const requestUrl = getRequestUrl(uri);
    req.open(options.method || "get", requestUrl);
    const token = localStorage.getItem(AUTH_TOKEN);
    req.setRequestHeader("authorization", token ? `BPONI-AUTH ${token}` : "");
    const isEncoding = false;
    const isCrypting = uri !== "https://api.bponi.com/x";
    if (!isCrypting) {
      req.setRequestHeader("X-API-KEY", "local");
    }
    for (let i in options.headers) {
      if (isEncoding && i.toLowerCase() === "content-type") {
        req.setRequestHeader(i, "text/plain; charset=UTF-8");
        req.setRequestHeader("Content-Transfer-Encoding", "base64");
      } else {
        req.setRequestHeader(i, options.headers[i]);
      }
    } // Some additional necessary bits of the fetch() standard function
    req.withCredentials = options.credentials == "include";
    req.onload = () => {
      syncEnvCookie(req.getResponseHeader("X-Env"));
      resolve(response());
    };
    req.onerror = reject;
    let body = options.body;
    req.send(isEncoding ? encodeTextBody(body) : body);
    // response
    function response() {
      let keys = [],
        all = [],
        headers = {},
        header;
      req
        .getAllResponseHeaders()
        .replace(/^(.*?):\s*([\s\S]*?)$/gm, (m, key, value) => {
          keys.push((key = key.toLowerCase()));
          all.push([key, value]);
          header = headers[key];
          headers[key] = header ? `${header},${value}` : value;
        });
      return {
        ok: ((req.status / 200) | 0) == 1,
        status: req.status,
        statusText: req.statusText,
        url: req.responseURL,
        clone: response,
        text: async () =>
          isCrypting
            ? decodeTextBody(req.responseText) // decoding
            : req.responseText,
        json: async () =>
          JSON.parse(
            isCrypting
              ? decodeTextBody(req.responseText) // decoding
              : req.responseText
          ),
        blob: () => Promise.resolve(new Blob([req.response])),
        headers: {
          keys: () => keys,
          entries: () => all,
          get: (n) => headers[n.toLowerCase()],
          has: (n) => n.toLowerCase() in headers,
        },
      };
    }
    // encodeTextBody
    function encodeTextBody(text) {
      let buffer = new Uint8Array(new TextEncoder().encode(text));
      const encodedText = window.btoa(String.fromCharCode.apply(null, buffer));
      return encodedText;
    }
    // decodeTextBody
    function decodeTextBody(text) {
      let response = JSON.parse(text);
      let buffer = new Uint8Array(
        [...atob(response.data.slice(5))].map((char) => char.charCodeAt(0))
      );
      const decodedText = new TextDecoder().decode(buffer);
      response.data = JSON.parse(decodedText).data;
      return JSON.stringify(response);
    }
  });
};
// config
const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: () => getRequestUrl(httpEndpointBase),
  credentials: "include",
  fetch: customFetch,
});
// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: wsEndpoint,
  options: {
    reconnect: true,
    connectionParams() {
      const token = localStorage.getItem(AUTH_TOKEN);
      return {
        authorization: token ? `BPONI-AUTH ${token}` : "",
      };
    },
  },
});
// const authCubeLink = setContext(async (_, {
//   headers
// }) => {
//   return {
//     headers: {
//       ...headers,
//       authorization: "4f6o0cjiki2rfm34kfdadl1eqq"
//     }
//   };
// });
const uploadLink = createUploadLink({
  uri: () => getRequestUrl(httpEndpointBase),
  fetch: customFetch,
});
const persistedQueriesLink = createPersistedQueryLink({
  sha256,
});
// decodeTextBody
function decodeTextBody(text) {
  try {
    let response = JSON.parse(text); // response is an object
    let buffer = new Uint8Array(
      [...atob(response.data.slice(5))].map((char) => char.charCodeAt(0))
    );
    const decodedText = new TextDecoder().decode(buffer);
    response.data = JSON.parse(decodedText).data; // assign object, not string
    return response.data; // return the decoded object
  } catch (e) {
    console.error("Failed to decode:", e);
    return {}; // fallback empty object
  }
}
const decodeWsLink = new ApolloLink((operation, forward) => {
  const isCrypting = true;
  return new Observable((observer) => {
    const sub = forward(operation).subscribe({
      next: (result) => {
        if (isCrypting && result.data) {
          result.data = decodeTextBody(JSON.stringify(result));
        }
        observer.next(result);
      },
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    });
    return () => sub.unsubscribe();
  });
});
// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  decodeWsLink.concat(wsLink),
  uploadLink.concat(httpLink)
);

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  ssrMode: false,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
  connectToDevTools: true,
});
wsLink.subscriptionClient.on("connecting", () => {
  console.log("connecting");
});

wsLink.subscriptionClient.on("connected", () => {
  console.log("connected");
});

// Manually call this when user log in
export async function onLogin(token) {
  localStorage.setItem(AUTH_TOKEN, token);
  if (wsLink.subscriptionClient)
    wsLink.subscriptionClient.tryReconnect(wsLink.subscriptionClient);
  try {
    await apolloClient.cache.reset();
  } catch (e) {
    if (!isUnauthorizedError(e)) {
      console.log(
        "%cError on cache reset (login)",
        "color: orange;",
        e.message
      );
    }
  }
}

// Manually call this when user log out
export async function onLogout() {
  localStorage.removeItem(AUTH_TOKEN);
  // clear localstorage
  // localStorage.clear();
  if (wsLink.subscriptionClient)
    wsLink.subscriptionClient.tryReconnect(wsLink.subscriptionClient);
  try {
    await apolloClient.cache.reset();
  } catch (e) {
    if (!isUnauthorizedError(e)) {
      console.log(
        "%cError on cache reset (logout)",
        "color: orange;",
        e.message
      );
    }
  }
}

function isUnauthorizedError(error) {
  if (error) {
    if (
      error.message.indexOf("Unauthorized") >= 0 ||
      error.message.indexOf("permission denied") >= 0 ||
      error.message.indexOf("status code 401") >= 0
    ) {
      return true;
    }
  }
  return false;
}
