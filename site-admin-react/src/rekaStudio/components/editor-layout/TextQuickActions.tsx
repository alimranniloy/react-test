import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useEditor } from '@app/editor';

import { Button } from '../button';
import { Popover } from '../popover';
import {
  isTextLikeTemplate,
  readStyleLiteral,
  resolveEditableTagTemplate,
  setPixelStyle,
  setStyleLiteral,
  updateStyleLiterals,
} from './component-settings/selected-template-controls/style-utils';

const ALIGN_ITEMS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'justify', label: 'Justify' },
] as const;

const LIST_ITEMS = [
  { value: 'none', label: 'None' },
  { value: 'disc', label: 'Bullet' },
  { value: 'decimal', label: 'Number' },
] as const;

const readListValue = (template: t.TagTemplate) => {
  if (readStyleLiteral(template, 'display') !== 'list-item') {
    return 'none';
  }

  return readStyleLiteral(template, 'listStyleType') || 'disc';
};

const setListValue = (
  editor: ReturnType<typeof useEditor>,
  template: t.TagTemplate,
  value: string
) => {
  if (value === 'none') {
    updateStyleLiterals(editor, template, [
      ['display', ''],
      ['listStyleType', ''],
      ['paddingLeft', ''],
    ]);
    return;
  }

  updateStyleLiterals(editor, template, [
    ['display', 'list-item'],
    ['listStyleType', value],
    ['paddingLeft', '24px'],
  ]);
};

export const TextQuickActions = observer(() => {
  const editor = useEditor();
  const selectedTemplate = editor.activeComponentEditor?.tplEvent.selected ?? null;
  const editableTemplate = React.useMemo(
    () => resolveEditableTagTemplate(editor, selectedTemplate),
    [editor, selectedTemplate]
  );

  if (
    !(editableTemplate instanceof t.TagTemplate) ||
    !isTextLikeTemplate(editableTemplate)
  ) {
    return null;
  }

  return (
    <div className="pointer-events-auto flex min-w-0 items-center justify-center">
      <div className="flex max-w-[620px] items-center gap-1.5 overflow-x-auto rounded-full border border-slate-200 bg-white px-2 py-1 shadow-[0_8px_24px_-22px_rgba(15,23,42,0.3)]">
        <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-1">
          <span
            className="h-4 w-4 rounded-full border border-slate-200"
            style={{
              backgroundColor: readStyleLiteral(editableTemplate, 'color') || '#1f2937',
            }}
          />
          <input
            type="color"
            aria-label="Text color"
            value={readStyleLiteral(editableTemplate, 'color') || '#1f2937'}
            onChange={(event) =>
              setStyleLiteral(editor, editableTemplate, 'color', event.target.value)
            }
            className="h-6 w-8 cursor-pointer rounded-md border border-slate-200 bg-white p-0"
          />
        </div>

        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
          {ALIGN_ITEMS.map((item) => {
            const active =
              (readStyleLiteral(editableTemplate, 'textAlign') || 'left') === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setStyleLiteral(editor, editableTemplate, 'textAlign', item.value)
                }
                className={
                  active
                    ? 'rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white'
                    : 'rounded-full px-2.5 py-1 text-[10px] font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900'
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
          {LIST_ITEMS.map((item) => {
            const active = readListValue(editableTemplate) === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setListValue(editor, editableTemplate, item.value)}
                className={
                  active
                    ? 'rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-900 shadow-sm'
                    : 'rounded-full px-2.5 py-1 text-[10px] font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900'
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <Popover
          trigger={
            <Button
              type="button"
              size="xs"
              variant="outline"
              className="rounded-full px-2.5 py-1.5 text-[10px] font-semibold text-slate-700"
            >
              Advanced
            </Button>
          }
        >
          <div className="w-[320px] rounded-[18px] border border-slate-200 bg-white p-4">
            <div className="text-[12px] font-semibold text-slate-900">
              Advanced Text Settings
            </div>
            <div className="mt-1 text-[11px] leading-5 text-slate-500">
              Fine-tune spacing, anchor width and weight for the selected text block.
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['fontSize', 'Font Size', '16px'],
                ['lineHeight', 'Line Spacing', '24px'],
                ['letterSpacing', 'Letter Spacing', '0px'],
                ['width', 'Text Box Width', 'auto'],
              ].map(([key, label, placeholder]) => (
                <label key={key} className="block">
                  <div className="mb-1.5 text-[11px] font-medium text-slate-700">
                    {label}
                  </div>
                  <input
                    type="text"
                    value={readStyleLiteral(editableTemplate, key)}
                    placeholder={placeholder}
                    onChange={(event) =>
                      setPixelStyle(editor, editableTemplate, key, event.target.value)
                    }
                    className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none"
                  />
                </label>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block">
                <div className="mb-1.5 text-[11px] font-medium text-slate-700">
                  Font Weight
                </div>
                <select
                  value={readStyleLiteral(editableTemplate, 'fontWeight') || '400'}
                  onChange={(event) =>
                    setStyleLiteral(editor, editableTemplate, 'fontWeight', event.target.value)
                  }
                  className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none"
                >
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra Bold</option>
                </select>
              </label>

              <label className="block">
                <div className="mb-1.5 text-[11px] font-medium text-slate-700">
                  Text Transform
                </div>
                <select
                  value={readStyleLiteral(editableTemplate, 'textTransform')}
                  onChange={(event) =>
                    setStyleLiteral(
                      editor,
                      editableTemplate,
                      'textTransform',
                      event.target.value
                    )
                  }
                  className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none"
                >
                  <option value="">Default</option>
                  <option value="uppercase">Uppercase</option>
                  <option value="lowercase">Lowercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </label>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
});
