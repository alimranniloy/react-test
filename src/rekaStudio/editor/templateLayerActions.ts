import * as t from '@rekajs/types';

type EditorLike = {
  reka: {
    change: (fn: () => void) => void;
    getParentNode: (node: t.Template, type: typeof t.Template) => t.Template | null;
  };
  activeComponentEditor?: {
    setTplEvent: (event: 'selected' | 'hovered', template: t.Template | null) => void;
  } | null;
};

const safeGetParentTemplate = (editor: EditorLike, template: t.Template) => {
  try {
    return editor.reka.getParentNode(template, t.Template);
  } catch {
    return null;
  }
};

const isTemplateAncestor = (
  editor: EditorLike,
  ancestor: t.Template,
  template: t.Template
) => {
  let current = safeGetParentTemplate(editor, template);

  while (current) {
    if (current.id === ancestor.id) {
      return true;
    }

    current = safeGetParentTemplate(editor, current);
  }

  return false;
};

const getParentInfo = (editor: EditorLike, template: t.Template) => {
  const parent = safeGetParentTemplate(editor, template);

  if (!(parent instanceof t.SlottableTemplate)) {
    return null;
  }

  const index = parent.children.indexOf(template);

  if (index === -1) {
    return null;
  }

  return {
    parent,
    index,
    total: parent.children.length,
  };
};

const setSelection = (editor: EditorLike, template: t.Template | null) => {
  editor.activeComponentEditor?.setTplEvent('selected', template);
  editor.activeComponentEditor?.setTplEvent('hovered', null);
};

export const getTemplateLayerState = (editor: EditorLike, template: t.Template) => {
  const info = getParentInfo(editor, template);

  if (!info) {
    return {
      hasParent: false,
      index: 0,
      total: 1,
      canMoveUp: false,
      canMoveDown: false,
    };
  }

  return {
    hasParent: true,
    index: info.index,
    total: info.total,
    canMoveUp: info.index > 0,
    canMoveDown: info.index < info.total - 1,
  };
};

export const moveTemplateLayer = (
  editor: EditorLike,
  template: t.Template,
  direction: 'up' | 'down'
) => {
  const info = getParentInfo(editor, template);

  if (!info) {
    return false;
  }

  const nextIndex = direction === 'up' ? info.index - 1 : info.index + 1;

  if (nextIndex < 0 || nextIndex >= info.total) {
    return false;
  }

  editor.reka.change(() => {
    info.parent.children.splice(info.index, 1);
    info.parent.children.splice(nextIndex, 0, template);
  });

  setSelection(editor, template);
  return true;
};

export const moveTemplateLayerRelative = (
  editor: EditorLike,
  template: t.Template,
  target: t.Template,
  position: 'before' | 'after'
) => {
  if (template.id === target.id) {
    return false;
  }

  const sourceInfo = getParentInfo(editor, template);
  const targetParent = safeGetParentTemplate(editor, target);

  if (!sourceInfo || !(targetParent instanceof t.SlottableTemplate)) {
    return false;
  }

  if (isTemplateAncestor(editor, template, target)) {
    return false;
  }

  const targetIndex = targetParent.children.indexOf(target);

  if (targetIndex === -1) {
    return false;
  }

  editor.reka.change(() => {
    const currentParent = safeGetParentTemplate(editor, template);

    if (!(currentParent instanceof t.SlottableTemplate)) {
      return;
    }

    const currentIndex = currentParent.children.indexOf(template);

    if (currentIndex === -1) {
      return;
    }

    currentParent.children.splice(currentIndex, 1);

    let insertionIndex = position === 'before' ? targetIndex : targetIndex + 1;

    if (currentParent === targetParent && currentIndex < targetIndex) {
      insertionIndex -= 1;
    }

    targetParent.children.splice(
      Math.max(0, Math.min(insertionIndex, targetParent.children.length)),
      0,
      template
    );
  });

  setSelection(editor, template);
  return true;
};

export const moveTemplateLayerToEdge = (
  editor: EditorLike,
  template: t.Template,
  edge: 'front' | 'back'
) => {
  const info = getParentInfo(editor, template);

  if (!info) {
    return false;
  }

  const targetIndex = edge === 'front' ? info.total - 1 : 0;

  if (targetIndex === info.index) {
    return false;
  }

  editor.reka.change(() => {
    info.parent.children.splice(info.index, 1);
    info.parent.children.splice(targetIndex, 0, template);
  });

  setSelection(editor, template);
  return true;
};

export const duplicateTemplateLayer = (editor: EditorLike, template: t.Template) => {
  const info = getParentInfo(editor, template);

  if (!info) {
    return null;
  }

  const duplicated = t.Schema.fromJSON(JSON.parse(JSON.stringify(template)), {
    clone: { replaceExistingId: true },
  }) as t.Template;

  editor.reka.change(() => {
    info.parent.children.splice(info.index + 1, 0, duplicated);
  });

  setSelection(editor, duplicated);
  return duplicated;
};

export const removeTemplateLayer = (editor: EditorLike, template: t.Template) => {
  const info = getParentInfo(editor, template);

  if (!info) {
    return false;
  }

  const fallbackSelection =
    info.parent.children[info.index - 1] ?? info.parent.children[info.index + 1] ?? info.parent;

  editor.reka.change(() => {
    info.parent.children.splice(info.index, 1);
  });

  setSelection(editor, fallbackSelection ?? null);
  return true;
};
