import { Navigate, useParams } from "react-router-dom";

type LegacyParamRedirectProps = {
  to: string;
  fallbackTo?: string;
};

export default function LegacyParamRedirect({
  to,
  fallbackTo = "/"
}: LegacyParamRedirectProps) {
  const params = useParams();
  const resolved = to.replace(/:([a-zA-Z0-9_]+)/g, (_, key: string) => params[key] ?? "");
  return <Navigate to={resolved || fallbackTo} replace />;
}
