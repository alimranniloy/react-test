import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useSearchParams } from "react-router-dom";
import { STORE_PRODUCT_PREVIEW } from "@/graphql/queries/product";
import { SELF_STORE_PRODUCT_UPDATE } from "@/graphql/mutations/product";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

function safeJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function ProductUpdate() {
  const [params] = useSearchParams();
  const addToast = useToastStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);

  const idParam = params.get("id");
  const productId = useMemo(() => {
    const id = idParam ? Number(idParam) : null;
    if (id && Number.isFinite(id)) return id;
    return null;
  }, [idParam]);

  const { data, loading, error, refetch } = useQuery(STORE_PRODUCT_PREVIEW, {
    variables: { id: productId ?? 0 },
    fetchPolicy: "network-only",
    skip: !productId
  });

  const product = data?.storeProduct ?? null;

  const [schemaText, setSchemaText] = useState<string>("{}");
  const [isLanding, setIsLanding] = useState<boolean>(false);

  useEffect(() => {
    if (!product) return;
    setSchemaText(safeJsonStringify(product.schema));
    setIsLanding(!!product.isLanding);
  }, [product?.id]);

  const [updateProduct, { loading: saving }] = useMutation(
    SELF_STORE_PRODUCT_UPDATE,
    {
      onCompleted: () =>
        addToast({ kind: "success", title: "Product", subTitle: "Updated." }),
      onError: (err) =>
        addToast({ kind: "error", title: "Product", subTitle: err.message })
    }
  );

  const handleSave = async () => {
    if (!user?.id) return;
    if (!product) return;
    const parsed = safeJsonParse(schemaText);
    if (parsed === null) {
      addToast({
        kind: "error",
        title: "Schema",
        subTitle: "Invalid JSON schema."
      });
      return;
    }

    await updateProduct({
      variables: {
        userId: user.id,
        siteId: Number(product.siteId),
        id: Number(product.id),
        schema: parsed,
        isLanding
      }
    });
    await refetch();
  };

  if (!productId) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">Missing product id</h2>
        <p className="mt-2 text-sm text-slate-500">
          Open from <Link to="/product/" className="text-brand-600 underline">Product</Link>.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1">
      <div className="relative mx-auto md:px-2 xl:px-0">
        {error ? (
          <div className="mb-4 rounded-md border bg-white p-4 text-sm text-rose-600">
            {String(error.message)}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-md border bg-white p-4 text-sm text-slate-500">
            Loading...
          </div>
        ) : null}

        {product ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    className="h-16 w-16 rounded-full object-cover border bg-slate-100"
                    src={String(product.image || product.thumbnail || "")}
                    alt=""
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  <span
                    className="absolute inset-0 rounded-full shadow-inner"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 truncate">
                  {String(product.title ?? "")}
                </h1>
                {product.site?.domain ? (
                  <p className="text-sm font-medium text-blue-700">
                    <a
                      href={`https://${String(product.site.domain)}/product-spotlight/${String(
                        product.slug
                      )}/${String(product.hid)}/`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {`/product-spotlight/${String(product.slug)}/${String(
                        product.hid
                      )}/`}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Home Schema
                  </div>
                  <div className="text-xs text-slate-500">
                    JSON schema editor (React replacement for Vue editor).
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={isLanding}
                      onChange={(e) => setIsLanding(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Landing
                  </label>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <textarea
                value={schemaText}
                onChange={(e) => setSchemaText(e.target.value)}
                className="w-full min-h-[360px] rounded-md border px-3 py-2 font-mono text-xs"
                spellCheck={false}
              />

              <div className="flex justify-end gap-3">
                <Link
                  to="/product/"
                  className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Back
                </Link>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

