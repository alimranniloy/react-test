import {
  ChatBubbleIcon,
  DragHandleDots2Icon,
  PlusIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { IconButton } from '@app/components/button';
import { Dropdown } from '@app/components/dropdown';
import { Tooltip } from '@app/components/tooltip';
import { useEditor } from '@app/editor';
import { cn } from '@app/utils';
import {
  moveTemplateLayerRelative,
  removeTemplateLayer,
} from '@app/editor/templateLayerActions';

import { AddTemplateModal } from './AddTemplateModal';

type AddTemplateButtonProps = {
  target: t.Template;
};

const AddTemplateButton = (props: AddTemplateButtonProps) => {
  const [option, setOption] = React.useState<
    'before' | 'after' | 'child' | null
  >(null);

  const editor = useEditor();

  return (
    <React.Fragment>
      <Dropdown
        items={[
          {
            title: 'Add Before',
            onSelect: () => {
              setOption('before');
            },
          },
          {
            title: 'Add After',
            onSelect: () => {
              setOption('after');
            },
          },
          {
            title: 'Add child',
            onSelect: () => {
              setOption('child');
            },
          },
        ]}
      >
        <span>
          <Tooltip content="Add new template">
            <IconButton>
              <PlusIcon />
            </IconButton>
          </Tooltip>
        </span>
      </Dropdown>
      <AddTemplateModal
        isOpen={!!option}
        onClose={() => {
          setOption(null);
        }}
        onAdd={(template) => {
          setOption(null);

          editor.reka.change(() => {
            if (option === 'child') {
              if (!(props.target instanceof t.SlottableTemplate)) {
                return;
              }

              props.target.children.push(template);
              return;
            }

            const parent = safeGetParentTemplate(editor, props.target);

            if (!parent) {
              return;
            }

            if (!(parent instanceof t.SlottableTemplate)) {
              return;
            }

            const indexInParent = parent.children.indexOf(props.target);

            if (indexInParent === -1) {
              return;
            }

            if (option === 'after') {
              parent.children.splice(indexInParent + 1, 0, template);
              return;
            }

            parent.children.splice(indexInParent, 0, template);
          });
        }}
      />
    </React.Fragment>
  );
};

const getTemplateName = (template: t.Template) => {
  if (template instanceof t.TagTemplate) {
    return template.tag;
  }

  if (template instanceof t.ComponentTemplate) {
    return template.component.name;
  }

  if (template instanceof t.SlotTemplate) {
    return `<slot />`;
  }

  if (template instanceof t.FragmentTemplate) {
    return `<fragment />`;
  }

  throw new Error();
};

const safeGetParentTemplate = (
  editor: ReturnType<typeof useEditor>,
  template: t.Template
) => {
  try {
    return editor.reka.getParentNode(template, t.Template);
  } catch {
    return null;
  }
};

type DropPosition = 'before' | 'after';

type TemplateLayerDragState = {
  draggedTemplateId: string | null;
  overTemplateId: string | null;
  position: DropPosition | null;
};

const getDropPosition = (
  event: React.DragEvent<HTMLDivElement>
): DropPosition => {
  const rect = event.currentTarget.getBoundingClientRect();

  return event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
};

type RenderTemplateNodeProps = {
  templateId: string;
  depth?: number;
  dragState: TemplateLayerDragState;
  onDropTemplate: (targetTemplateId: string, position: DropPosition) => void;
  onDragStateChange: (state: TemplateLayerDragState) => void;
  onDragStateReset: () => void;
};

const RenderTemplateNode = observer((props: RenderTemplateNodeProps) => {
  const depth = props.depth ?? 0;

  const editor = useEditor();

  const template = editor.reka.getNodeFromId(props.templateId, t.Template);

  if (!template) {
    return null;
  }

  const activeComponentEditor = editor.activeComponentEditor;

  if (!activeComponentEditor) {
    return null;
  }

  const isSelected =
    activeComponentEditor.tplEvent.selected?.id === props.templateId;
  const canDrag = !!safeGetParentTemplate(editor, template);
  const isDragged = props.dragState.draggedTemplateId === template.id;
  const isDropTarget =
    props.dragState.draggedTemplateId !== template.id &&
    props.dragState.overTemplateId === template.id &&
    !!safeGetParentTemplate(editor, template);

  return (
    <div>
      <div
        className={cn(
          'template-layer-name relative rounded-md my-1 border border-transparent px-4 py-0.5 cursor-pointer transition-colors',
          {
            'bg-primary/10 text-primary': isSelected,
            'hover:bg-gray-100': !isSelected,
            'opacity-50': isDragged,
            'border-primary bg-primary/5':
              isDropTarget && props.dragState.position === 'before',
            'border-b-primary border-b-2 bg-primary/5':
              isDropTarget && props.dragState.position === 'after',
          }
        )}
        onDragOver={(event) => {
          if (!canDrag || props.dragState.draggedTemplateId === template.id) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          props.onDragStateChange({
            draggedTemplateId: props.dragState.draggedTemplateId,
            overTemplateId: template.id,
            position: getDropPosition(event),
          });
        }}
        onDrop={(event) => {
          if (!canDrag || props.dragState.draggedTemplateId === template.id) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          props.onDropTemplate(template.id, getDropPosition(event));
        }}
      >
        <div
          className="flex items-center"
          style={{ marginLeft: `${depth * 10}px` }}
          onMouseDown={(e) => {
            e.stopPropagation();

            activeComponentEditor.setTplEvent('selected', template);
          }}
          onMouseOver={(e) => {
            e.stopPropagation();

            activeComponentEditor.setTplEvent('hovered', template);
          }}
          onMouseOut={() => {
            if (
              activeComponentEditor.tplEvent.hovered?.id !== props.templateId
            ) {
              return;
            }

            activeComponentEditor.setTplEvent('hovered', null);
          }}
        >
          <div className="flex flex-1 gap-2 items-center">
            <Tooltip
              content={canDrag ? 'Drag to reorder' : 'Root layer cannot move'}
            >
              <span
                className={cn(
                  'inline-flex items-center justify-center rounded-sm text-slate-400',
                  {
                    'cursor-grab active:cursor-grabbing hover:bg-slate-200':
                      canDrag,
                  }
                )}
                draggable={canDrag}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onDragStart={(event) => {
                  if (!canDrag) {
                    return;
                  }

                  event.stopPropagation();
                  event.dataTransfer.effectAllowed = 'move';
                  event.dataTransfer.setData('text/plain', template.id);

                  props.onDragStateChange({
                    draggedTemplateId: template.id,
                    overTemplateId: null,
                    position: null,
                  });
                }}
                onDragEnd={(event) => {
                  event.stopPropagation();
                  props.onDragStateReset();
                }}
              >
                <DragHandleDots2Icon />
              </span>
            </Tooltip>
            <span className="text-xs">{getTemplateName(template)}</span>
            {activeComponentEditor.getCommentCount(template) > 0 && (
              <Tooltip content="View comments">
                <IconButton
                  onClick={() => {
                    activeComponentEditor.showComments(template);
                  }}
                >
                  <ChatBubbleIcon />
                  <span className="text-[0.6rem] mt-px -mb-px ml-1.5">
                    {activeComponentEditor.getCommentCount(template)}
                  </span>
                </IconButton>
              </Tooltip>
            )}
          </div>
          <div>
            <AddTemplateButton target={template} />

            <Tooltip content="Remove template">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  removeTemplateLayer(editor, template);
                }}
              >
                <TrashIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      {t.is(template, t.SlottableTemplate) &&
        template.children.map((child) => (
          <RenderTemplateNode
            key={child.id}
            templateId={child.id}
            depth={depth + 1}
            dragState={props.dragState}
            onDropTemplate={props.onDropTemplate}
            onDragStateChange={props.onDragStateChange}
            onDragStateReset={props.onDragStateReset}
          />
        ))}
    </div>
  );
});

type TemplateLayersProps = {
  componentId: string;
  className?: string;
  showHint?: boolean;
};

export const TemplateLayers = (props: TemplateLayersProps) => {
  const editor = useEditor();
  const [dragState, setDragState] = React.useState<TemplateLayerDragState>({
    draggedTemplateId: null,
    overTemplateId: null,
    position: null,
  });

  const component = editor.reka.getNodeFromId(props.componentId);

  if (!component || !t.is(component, t.RekaComponent)) {
    return null;
  }

  const resetDragState = () => {
    setDragState({
      draggedTemplateId: null,
      overTemplateId: null,
      position: null,
    });
  };

  const handleDropTemplate = (
    targetTemplateId: string,
    position: DropPosition
  ) => {
    if (!dragState.draggedTemplateId) {
      resetDragState();
      return;
    }

    const draggedTemplate = editor.reka.getNodeFromId(
      dragState.draggedTemplateId,
      t.Template
    );
    const targetTemplate = editor.reka.getNodeFromId(targetTemplateId, t.Template);

    if (!draggedTemplate || !targetTemplate) {
      resetDragState();
      return;
    }

    moveTemplateLayerRelative(editor, draggedTemplate, targetTemplate, position);
    resetDragState();
  };

  return (
    <div className={cn('mt-3', props.className)}>
      {props.showHint && (
        <p className="mb-3 text-[11px] leading-4 text-slate-500">
          Drag a layer above or below another layer to reorder it in the editor.
        </p>
      )}
      {component.template && (
        <RenderTemplateNode
          templateId={component.template.id}
          dragState={dragState}
          onDropTemplate={handleDropTemplate}
          onDragStateChange={setDragState}
          onDragStateReset={resetDragState}
        />
      )}
    </div>
  );
};
