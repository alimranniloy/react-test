export const STUDIO_CLICK_ACTION_PROP = 'studioClickAction';
export const STUDIO_CLICK_PAGE_SLUG_PROP = 'studioClickPageSlug';
export const STUDIO_CLICK_URL_PROP = 'studioClickUrl';

export type StudioClickActionType = 'none' | 'page' | 'link';

export type StudioClickActionConfig = {
  type: StudioClickActionType;
  pageSlug: string | null;
  url: string | null;
};

export const STUDIO_CLICK_ACTION_ITEMS: Array<{
  value: StudioClickActionType;
  label: string;
}> = [
  { value: 'none', label: 'No Action' },
  { value: 'page', label: 'Open Page' },
  { value: 'link', label: 'Open Link' },
];

export const normalizeStudioPageSlug = (value: unknown) => {
  const normalized = String(value ?? '')
    .trim()
    .replace(/^\/+|\/+$/g, '');

  return normalized || null;
};

export const buildStudioPagePath = (slug: unknown) => {
  const normalizedSlug = normalizeStudioPageSlug(slug);

  if (!normalizedSlug) {
    return '/';
  }

  return `/${normalizedSlug}/`;
};

export const readStudioClickActionConfig = (
  props: Record<string, unknown> | null | undefined
): StudioClickActionConfig => {
  const rawType = String(props?.[STUDIO_CLICK_ACTION_PROP] ?? '').trim().toLowerCase();
  const type: StudioClickActionType =
    rawType === 'page' || rawType === 'link' ? rawType : 'none';

  return {
    type,
    pageSlug: normalizeStudioPageSlug(props?.[STUDIO_CLICK_PAGE_SLUG_PROP]),
    url: String(props?.[STUDIO_CLICK_URL_PROP] ?? '').trim() || null,
  };
};

export const omitStudioClickActionProps = (
  props: Record<string, unknown>
) => {
  const nextProps = { ...props };

  delete nextProps[STUDIO_CLICK_ACTION_PROP];
  delete nextProps[STUDIO_CLICK_PAGE_SLUG_PROP];
  delete nextProps[STUDIO_CLICK_URL_PROP];

  return nextProps;
};
