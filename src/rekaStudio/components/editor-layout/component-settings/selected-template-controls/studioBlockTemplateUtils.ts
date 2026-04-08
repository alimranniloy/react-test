import * as t from '@rekajs/types';

import {
  STUDIO_COUNT_BLOCK_CLASS,
  STUDIO_COUNT_LABEL_CLASS,
  STUDIO_COUNT_MARKER_PROP,
  STUDIO_COUNT_META_CLASS,
  STUDIO_COUNT_VALUE_CLASS,
  STUDIO_COUNT_VALUE_MARKER_PROP,
  STUDIO_SLIDER_BLOCK_CLASS,
  STUDIO_SLIDER_IMAGE_CLASS,
  STUDIO_SLIDER_MARKER_PROP,
  STUDIO_SLIDER_SLIDE_CLASS,
} from '@app/components/studioBlocks/constants';

import { readLiteralString } from './style-utils';

type EditorLike = {
  reka: {
    getParentNode: <T extends t.Type = t.Template>(
      node: t.Type,
      klass?: t.TypeConstructor<T>
    ) => T | null;
  };
};

const safeGetParentTemplate = (editor: EditorLike, template: t.Template) => {
  try {
    return editor.reka.getParentNode(template, t.Template);
  } catch {
    return null;
  }
};

export const hasTemplateClassToken = (template: t.TagTemplate, token: string) =>
  readLiteralString(template.props.className)
    .split(/\s+/)
    .includes(token);

export const hasTemplateLiteralProp = (
  template: t.TagTemplate,
  key: string,
  expected?: string
) => {
  const value = readLiteralString(template.props[key]).trim();

  if (!value) {
    return false;
  }

  if (typeof expected === 'string') {
    return value === expected;
  }

  return value === 'true' || value === '1' || value === 'yes';
};

export const findDescendantTagTemplate = (
  template: t.TagTemplate,
  predicate: (candidate: t.TagTemplate) => boolean
) => {
  const queue = [...template.children];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!(current instanceof t.TagTemplate)) {
      continue;
    }

    if (predicate(current)) {
      return current;
    }

    queue.push(...current.children);
  }

  return null;
};

export const findNearestTagTemplate = (
  editor: EditorLike,
  template: t.Template,
  predicate: (candidate: t.TagTemplate) => boolean
) => {
  let current: t.Template | null = template;

  while (current) {
    if (current instanceof t.TagTemplate && predicate(current)) {
      return current;
    }

    current = safeGetParentTemplate(editor, current);
  }

  return null;
};

const isSliderRoot = (template: t.TagTemplate) =>
  hasTemplateClassToken(template, STUDIO_SLIDER_BLOCK_CLASS) ||
  hasTemplateLiteralProp(template, STUDIO_SLIDER_MARKER_PROP);

const isCountRoot = (template: t.TagTemplate) =>
  hasTemplateClassToken(template, STUDIO_COUNT_BLOCK_CLASS) ||
  hasTemplateLiteralProp(template, STUDIO_COUNT_MARKER_PROP);

export const findSliderRootTemplate = (
  editor: EditorLike,
  template: t.Template | null
) => {
  if (!template) {
    return null;
  }

  if (template instanceof t.TagTemplate) {
    if (isSliderRoot(template)) {
      return template;
    }

    const nearest = findNearestTagTemplate(editor, template, isSliderRoot);

    if (nearest) {
      return nearest;
    }
  }

  return null;
};

export const findCountRootTemplate = (
  editor: EditorLike,
  template: t.Template | null
) => {
  if (!template) {
    return null;
  }

  if (template instanceof t.TagTemplate) {
    if (isCountRoot(template)) {
      return template;
    }

    const nearest = findNearestTagTemplate(editor, template, isCountRoot);

    if (nearest) {
      return nearest;
    }
  }

  return null;
};

export const findSliderSlides = (template: t.TagTemplate) =>
  template.children.filter(
    (child): child is t.TagTemplate =>
      child instanceof t.TagTemplate &&
      hasTemplateClassToken(child, STUDIO_SLIDER_SLIDE_CLASS)
  );

export const findSliderSlideMediaTemplate = (template: t.TagTemplate) =>
  findDescendantTagTemplate(
    template,
    (candidate) =>
      candidate.tag === 'img' ||
      candidate.tag === 'video' ||
      hasTemplateClassToken(candidate, STUDIO_SLIDER_IMAGE_CLASS)
  );

export const findCountValueTemplate = (template: t.TagTemplate) =>
  findDescendantTagTemplate(
    template,
    (candidate) =>
      hasTemplateClassToken(candidate, STUDIO_COUNT_VALUE_CLASS) ||
      hasTemplateLiteralProp(candidate, STUDIO_COUNT_VALUE_MARKER_PROP)
  );

export const findCountValueTemplates = (template: t.TagTemplate) => {
  const matches: t.TagTemplate[] = [];
  const queue = [...template.children];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!(current instanceof t.TagTemplate)) {
      continue;
    }

    if (
      hasTemplateClassToken(current, STUDIO_COUNT_VALUE_CLASS) ||
      hasTemplateLiteralProp(current, STUDIO_COUNT_VALUE_MARKER_PROP)
    ) {
      matches.push(current);
    }

    queue.push(...current.children);
  }

  return matches;
};

export const findCountLabelTemplate = (template: t.TagTemplate) =>
  findDescendantTagTemplate(template, (candidate) =>
    hasTemplateClassToken(candidate, STUDIO_COUNT_LABEL_CLASS)
  );

export const findCountMetaTemplate = (template: t.TagTemplate) =>
  findDescendantTagTemplate(template, (candidate) =>
    hasTemplateClassToken(candidate, STUDIO_COUNT_META_CLASS)
  );
