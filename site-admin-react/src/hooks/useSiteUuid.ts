import { useEffect, useState } from "react";
import { isUuid, legacySiteUuid } from "@/utils/uuid";

export default function useSiteUuid(siteId: string | number | null | undefined) {
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!siteId && siteId !== 0) {
      setUuid(null);
      return () => {
        active = false;
      };
    }
    const raw = String(siteId);
    if (isUuid(raw)) {
      setUuid(raw);
      return () => {
        active = false;
      };
    }
    legacySiteUuid(raw)
      .then((value) => {
        if (active) setUuid(value);
      })
      .catch(() => {
        if (active) setUuid(null);
      });
    return () => {
      active = false;
    };
  }, [siteId]);

  return uuid;
}
