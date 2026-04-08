import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition, relayStylePagination } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import {
  AUTH_TOKEN,
  HTTP_ENDPOINT_BASE,
  WS_ENDPOINT_BASE,
  getEnvMode,
  getRequestUrl,
  shouldCryptRequest,
  syncEnvCookieFromResponse,
  withEnvQuery
} from "./env";

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors?.length) {
    graphQLErrors.forEach((err) => {
      console.error("[GraphQL error]", {
        message: err.message,
        path: err.path,
        operation: operation.operationName
      });
    });
  }
  if (networkError) {
    console.error("[Network error]", networkError);
  }
});

const retryLink = new RetryLink({
  attempts: {
    max: 2,
    retryIf: (error) => !!error
  },
  delay: {
    initial: 300,
    max: 2000,
    jitter: true
  }
});

const customFetch: typeof fetch = async (uri, options) => {
  const requestUrl = getRequestUrl(String(uri));
  const token =
    typeof window === "undefined" ? null : localStorage.getItem(AUTH_TOKEN);
  const headers = new Headers(options?.headers || {});
  headers.set("authorization", token ? `BPONI-AUTH ${token}` : "");

  const isEncoding = false;
  const isCrypting = shouldCryptRequest(requestUrl, HTTP_ENDPOINT_BASE);
  if (!isCrypting) {
    headers.set("X-API-KEY", "local");
  }
  if (isEncoding && headers.get("content-type")) {
    headers.set("content-type", "text/plain; charset=UTF-8");
    headers.set("Content-Transfer-Encoding", "base64");
  }

  const response = await fetch(requestUrl, {
    ...options,
    headers,
    credentials: "include"
  });

  syncEnvCookieFromResponse(response);

  if (!isCrypting) {
    return response;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return response;
  }

  const rawText = await response.text();
  const decodedText = decodeTextBody(rawText);

  return new Response(decodedText, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
};

const uploadLink = createUploadLink({
  uri: () => getRequestUrl(HTTP_ENDPOINT_BASE),
  credentials: "include",
  fetch: customFetch
});

const wsClient = createClient({
  url: withEnvQuery(WS_ENDPOINT_BASE, getEnvMode()),
  lazy: true,
  retryAttempts: 3,
  connectionParams: () => {
    const token =
      typeof window === "undefined" ? null : localStorage.getItem(AUTH_TOKEN);
    return {
      authorization: token ? `BPONI-AUTH ${token}` : ""
    };
  }
});

const wsLink = new GraphQLWsLink(wsClient);

const decodeWsLink = new ApolloLink((operation, forward) => {
  if (!forward) return null;
  const isCrypting = true;
  return forward(operation).map((result) => {
    if (isCrypting && result.data) {
      const decoded = decodeTextBody(JSON.stringify(result));
      try {
        const parsed = JSON.parse(decoded);
        return { ...result, data: parsed.data };
      } catch {
        return result;
      }
    }
    return result;
  });
});

const httpLink = ApolloLink.from([errorLink, retryLink, uploadLink]);
const wsPipeline = ApolloLink.from([errorLink, decodeWsLink, wsLink]);

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsPipeline,
  httpLink
);

export const apolloClient = new ApolloClient({
  link,
  ssrMode: false,
  cache: new InMemoryCache({
    addTypename: false,
    typePolicies: {
      Query: {
        fields: {
          storeProducts: relayStylePagination([
            "siteId",
            "search",
            "categoryId",
            "subCategoryId",
            "subSubCategoryId",
            "brandId",
            "authorId",
            "tagId",
            "supplierId",
            "campaignId",
            "collectionId"
          ]),
          storeOrders: relayStylePagination([
            "siteId",
            "search",
            "status",
            "sourceId",
            "staffId",
            "logisticsId",
            "customerType",
            "from",
            "to",
            "filterAt"
          ]),
          storeCategories: relayStylePagination(["siteId", "search", "isActive"]),
          storeSubCategories: relayStylePagination(["siteId", "categoryId"]),
          storeSubSubCategories: relayStylePagination(["siteId", "categoryId", "subCategoryId"]),
          storeBrands: relayStylePagination(["siteId", "search"]),
          storeAuthors: relayStylePagination(["siteId", "search"]),
          storeTags: relayStylePagination(["siteId", "search"]),
          storeSuppliers: relayStylePagination(["siteId", "search", "isActive"]),
          storeCustomers: relayStylePagination([
            "siteId",
            "customerType",
            "customerTypes",
            "queryType",
            "isActive",
            "search",
            "from",
            "to"
          ]),
          storeOrderPays: relayStylePagination(["siteId", "orderId"]),
          storeOrderPayments: relayStylePagination([
            "siteId",
            "customerId",
            "customerTitle",
            "isPaid",
            "isSettle",
            "paymentType"
          ]),
          siteTransactions: relayStylePagination(["siteId", "receiverId", "status"]),
          khataAccounts: relayStylePagination([
            "createdById",
            "accountType",
            "search",
            "userId",
            "min",
            "max",
            "queryType",
            "isDeleted"
          ]),
          users: relayStylePagination([
            "search",
            "referedId",
            "sourceId",
            "isActive",
            "referedById"
          ])
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true
    },
    query: {
      fetchPolicy: "cache-first",
      errorPolicy: "all"
    },
    mutate: {
      errorPolicy: "all"
    }
  },
  connectToDevTools: true
});

export async function onLogin(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN, token);
  try {
    await apolloClient.resetStore();
  } catch (error) {
    console.warn("Error on cache reset (login)", error);
  }
}

export async function onLogout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN);
  try {
    await apolloClient.resetStore();
  } catch (error) {
    console.warn("Error on cache reset (logout)", error);
  }
}

function decodeTextBody(text: string): string {
  try {
    const response = JSON.parse(text);
    const buffer = new Uint8Array(
      [...atob(response.data.slice(5))].map((char) => char.charCodeAt(0))
    );
    const decodedText = new TextDecoder().decode(buffer);
    response.data = JSON.parse(decodedText).data;
    return JSON.stringify(response);
  } catch (error) {
    console.error("Failed to decode:", error);
    return text;
  }
}
