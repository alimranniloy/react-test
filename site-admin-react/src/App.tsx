import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { router } from "@/app/router";
import { apolloClient } from "@/graphql/apolloClient";

function RuntimeErrorPanel({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl rounded-lg border bg-white p-6">
        <div className="text-lg font-semibold text-rose-700">{title}</div>
        <pre className="mt-3 whitespace-pre-wrap rounded-md bg-slate-900 p-4 text-xs text-slate-100 overflow-auto">
          {message}
        </pre>
        <div className="mt-4 text-sm text-slate-600">
          Fix the error and reload. This panel exists so the app never shows a blank white screen.
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    // Ensure it's visible even without devtools.
    console.error("[App ErrorBoundary]", error);
  }
  render() {
    if (this.state.error) {
      return (
        <RuntimeErrorPanel
          title="Runtime error"
          message={this.state.error.stack || this.state.error.message}
        />
      );
    }
    return this.props.children;
  }
}

function GlobalErrorListener({ children }: { children: React.ReactNode }) {
  const [fatal, setFatal] = useState<string | null>(null);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      const err = event.error as Error | undefined;
      const message = event.message || "";

      if (
        !err &&
        (/^Script error\.?$/i.test(message) ||
          /^ResizeObserver loop completed with undelivered notifications\.?$/i.test(
            message
          ) ||
          /^ResizeObserver loop limit exceeded\.?$/i.test(message))
      ) {
        return;
      }

      setFatal(err?.stack || message || "Unknown error");
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { stack?: string } | null | undefined;
      setFatal(reason?.stack || String(event.reason));
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (fatal) {
    return <RuntimeErrorPanel title="Unhandled error" message={fatal} />;
  }
  return children;
}

export default function App() {
  return (
    <GlobalErrorListener>
      <ErrorBoundary>
        <ApolloProvider client={apolloClient}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </ErrorBoundary>
    </GlobalErrorListener>
  );
}
