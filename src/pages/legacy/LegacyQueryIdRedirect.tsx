import { Navigate, useLocation } from "react-router-dom";

type LegacyQueryIdRedirectProps = {
  to: string;
  fallbackTo?: string;
  queryKey?: string;
};

export default function LegacyQueryIdRedirect({
  to,
  fallbackTo,
  queryKey = "id"
}: LegacyQueryIdRedirectProps) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const value = params.get(queryKey);

  if (!value) {
    return <Navigate to={fallbackTo ?? to} replace />;
  }

  return <Navigate to={`${to}${value}`} replace />;
}
