import { Navigate, useLocation } from "react-router-dom";

type LegacyQueryIdPatternRedirectProps = {
  prefix: string;
  suffix?: string;
  fallbackTo?: string;
  queryKey?: string;
};

export default function LegacyQueryIdPatternRedirect({
  prefix,
  suffix = "",
  fallbackTo,
  queryKey = "id"
}: LegacyQueryIdPatternRedirectProps) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const value = params.get(queryKey);

  if (!value) {
    return <Navigate to={fallbackTo ?? prefix} replace />;
  }

  return <Navigate to={`${prefix}${value}${suffix}`} replace />;
}
