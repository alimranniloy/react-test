import * as t from '@rekajs/types';

import { useEditor } from '@app/editor';

type ActiveFrame =
  | NonNullable<
      NonNullable<ReturnType<typeof useEditor>['activeComponentEditor']>['activeFrame']
    >
  | null
  | undefined;

const readLiteralString = (value: unknown) => {
  if (value instanceof t.Literal) {
    return String(value.value ?? '');
  }

  if (value && typeof value === 'object') {
    const candidate = value as { type?: string; value?: unknown };

    if (candidate.type === 'Literal') {
      return String(candidate.value ?? '');
    }
  }

  return '';
};

const readClassName = (template: t.TagTemplate) =>
  readLiteralString(template.props.className);

const isFreeBlockTemplate = (template: t.Template) => {
  if (!(template instanceof t.TagTemplate)) {
    return false;
  }

  return readClassName(template).split(/\s+/).includes('studio-free-block');
};

export const getPageSizeTarget = (
  activeFrame: ActiveFrame,
  iframe: HTMLIFrameElement | null,
  rootTemplate?: t.Template | null
) => {
  if (!activeFrame || !iframe) {
    return null;
  }

  const frameWidth = iframe.contentWindow?.innerWidth ?? iframe.clientWidth;

  if (
    rootTemplate instanceof t.TagTemplate &&
    rootTemplate instanceof t.SlottableTemplate &&
    !isFreeBlockTemplate(rootTemplate)
  ) {
    const rootDom = [...(activeFrame.tplElements.get(rootTemplate) ?? [])][0] ?? null;

    if (rootDom) {
      const rect = rootDom.getBoundingClientRect();

      if (rect.height >= 240 && rect.width >= frameWidth * 0.6) {
        return {
          template: rootTemplate,
          dom: rootDom,
          area: rect.width * rect.height,
        };
      }
    }
  }

  let bestMatch:
    | {
        template: t.TagTemplate & t.SlottableTemplate;
        dom: HTMLElement;
        area: number;
      }
    | null = null;

  for (const [template, doms] of activeFrame.tplElements) {
    if (
      !(template instanceof t.TagTemplate) ||
      !(template instanceof t.SlottableTemplate) ||
      isFreeBlockTemplate(template)
    ) {
      continue;
    }

    for (const dom of doms) {
      const rect = dom.getBoundingClientRect();

      if (rect.height < 320 || rect.width < frameWidth * 0.72) {
        continue;
      }

      const area = rect.width * rect.height;

      if (!bestMatch || area > bestMatch.area) {
        bestMatch = {
          template,
          dom,
          area,
        };
      }
    }
  }

  return bestMatch;
};
