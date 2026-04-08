import * as t from '@rekajs/types';

import { useEditor } from '@app/editor';

type EditorType = ReturnType<typeof useEditor>;

export const TEXT_LIKE_TAGS = new Set([
  'p',
  'span',
  'a',
  'button',
  'label',
  'strong',
  'em',
  'small',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);

const safeGetParentTemplate = (editor: EditorType, template: t.Template) => {
  try {
    return editor.reka.getParentNode(template, t.Template);
  } catch {
    return null;
  }
};

export const readLiteralString = (value: unknown) => {
  if (value instanceof t.Literal) {
    return String(value.value ?? '');
  }

  if (value && typeof value === 'object' && 'type' in value) {
    const candidate = value as { type?: string; value?: unknown };

    if (candidate.type === 'Literal') {
      return String(candidate.value ?? '');
    }
  }

  return '';
};

const hasClassToken = (template: t.TagTemplate, token: string) =>
  readLiteralString(template.props.className)
    .split(/\s+/)
    .includes(token);

const findNestedMediaTemplate = (template: t.TagTemplate) => {
  if (!hasClassToken(template, 'studio-free-block')) {
    return null;
  }

  const queue = [...template.children];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    if (current instanceof t.TagTemplate) {
      if (current.tag === 'img' || current.tag === 'video') {
        return current;
      }

      queue.push(...current.children);
    }
  }

  return null;
};

export const readLiteralBoolean = (value: unknown) => {
  if (value instanceof t.Literal) {
    if (typeof value.value === 'boolean') {
      return value.value;
    }

    if (typeof value.value === 'string') {
      if (value.value === 'true') {
        return true;
      }

      if (value.value === 'false') {
        return false;
      }
    }
  }

  if (value && typeof value === 'object' && 'type' in value) {
    const candidate = value as { type?: string; value?: unknown };

    if (candidate.type === 'Literal') {
      if (typeof candidate.value === 'boolean') {
        return candidate.value;
      }

      if (candidate.value === 'true') {
        return true;
      }

      if (candidate.value === 'false') {
        return false;
      }
    }
  }

  return null;
};

export const ensureStyleExpression = (template: t.TagTemplate) => {
  const currentStyle = template.props.style;

  if (currentStyle instanceof t.ObjectExpression) {
    return currentStyle;
  }

  const nextStyle = t.objectExpression({
    properties: {},
  });

  template.props.style = nextStyle;

  return nextStyle;
};

export const readStyleLiteral = (template: t.TagTemplate, key: string) => {
  const style = template.props.style;

  if (!(style instanceof t.ObjectExpression)) {
    return '';
  }

  return readLiteralString(style.properties[key]);
};

export const readStylePx = (template: t.TagTemplate, key: string) => {
  const raw = readStyleLiteral(template, key);
  const parsed = Number.parseFloat(raw);

  return Number.isFinite(parsed) ? parsed : null;
};

export const readPropLiteral = (template: t.TagTemplate, key: string) => {
  return readLiteralString(template.props[key]);
};

export const readPropBoolean = (template: t.TagTemplate, key: string) => {
  return readLiteralBoolean(template.props[key]);
};

export const setLiteralProp = (
  editor: EditorType,
  template: t.TagTemplate,
  key: string,
  value: string
) => {
  editor.reka.change(() => {
    if (!value.trim()) {
      delete template.props[key];
      return;
    }

    template.props[key] = t.literal({ value });
  });
};

export const setBooleanProp = (
  editor: EditorType,
  template: t.TagTemplate,
  key: string,
  value: boolean
) => {
  editor.reka.change(() => {
    if (!value) {
      delete template.props[key];
      return;
    }

    template.props[key] = t.literal({ value: true });
  });
};

export const setStyleLiteral = (
  editor: EditorType,
  template: t.TagTemplate,
  key: string,
  value: string
) => {
  editor.reka.change(() => {
    const style = ensureStyleExpression(template);

    if (!value.trim()) {
      delete style.properties[key];
      return;
    }

    style.properties[key] = t.literal({ value });
  });
};

export const setPixelStyle = (
  editor: EditorType,
  template: t.TagTemplate,
  key: string,
  value: string
) => {
  const trimmed = value.trim();

  if (!trimmed) {
    setStyleLiteral(editor, template, key, '');
    return;
  }

  if (/%|px|rem|em|vh|vw$/.test(trimmed)) {
    setStyleLiteral(editor, template, key, trimmed);
    return;
  }

  const parsed = Number.parseFloat(trimmed);

  if (!Number.isFinite(parsed)) {
    return;
  }

  setStyleLiteral(editor, template, key, `${parsed}px`);
};

export const updateStyleLiterals = (
  editor: EditorType,
  template: t.TagTemplate,
  entries: Array<[string, string]>
) => {
  editor.reka.change(() => {
    const style = ensureStyleExpression(template);

    entries.forEach(([key, value]) => {
      if (!value.trim()) {
        delete style.properties[key];
        return;
      }

      style.properties[key] = t.literal({ value });
    });
  });
};

const readTransformString = (template: t.TagTemplate) =>
  readStyleLiteral(template, 'transform');

const stripTransformPart = (transform: string, pattern: RegExp) =>
  transform.replace(pattern, '').replace(/\s+/g, ' ').trim();

export const readRotateValue = (template: t.TagTemplate) => {
  const transform = readTransformString(template);
  const match = transform.match(/rotate\(([^)]+)\)/);

  return match?.[1] ?? '';
};

export const setRotateValue = (
  editor: EditorType,
  template: t.TagTemplate,
  value: string
) => {
  const trimmed = value.trim();
  const normalized = trimmed
    ? /deg$/.test(trimmed)
      ? trimmed
      : `${trimmed}deg`
    : '';

  editor.reka.change(() => {
    const current = readTransformString(template);
    const withoutRotate = stripTransformPart(current, /rotate\([^)]+\)/g);
    const next = [withoutRotate, normalized ? `rotate(${normalized})` : '']
      .filter(Boolean)
      .join(' ')
      .trim();

    const style = ensureStyleExpression(template);

    if (!next) {
      delete style.properties.transform;
      return;
    }

    style.properties.transform = t.literal({ value: next });
    style.properties.transformOrigin = t.literal({ value: 'center center' });
  });
};

export const resolveEditableTagTemplate = (
  editor: EditorType,
  template: t.Template | null
) => {
  let current = template;

  while (current) {
    const componentTemplate = current;

    if (componentTemplate instanceof t.ComponentTemplate) {
      const componentDefinition = editor.reka.components.program.find(
        (component) => component.name === componentTemplate.component.name
      );
      const componentRoot = componentDefinition?.template;

      if (componentRoot instanceof t.TagTemplate && componentRoot.tag !== 'text') {
        return findNestedMediaTemplate(componentRoot) ?? componentRoot;
      }
    }

    if (current instanceof t.TagTemplate && current.tag !== 'text') {
      return findNestedMediaTemplate(current) ?? current;
    }

    current = safeGetParentTemplate(editor, current);
  }

  return null;
};

export const isTextLikeTemplate = (template: t.TagTemplate) => {
  return TEXT_LIKE_TAGS.has(template.tag);
};

export const getTemplateDisplayName = (template: t.Template | null) => {
  if (!template) {
    return 'Element';
  }

  if (template instanceof t.TagTemplate) {
    return template.tag;
  }

  if (template instanceof t.ComponentTemplate) {
    return template.component.name;
  }

  if (template instanceof t.SlotTemplate) {
    return 'slot';
  }

  return 'template';
};
