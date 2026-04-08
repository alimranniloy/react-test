import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { PairInput } from '@app/components/pair-input';
import { SettingSection } from '@app/components/settings-section';
import { useEditor } from '@app/editor';
import {
  duplicateTemplateLayer,
  getTemplateLayerState,
  moveTemplateLayer,
  moveTemplateLayerToEdge,
  removeTemplateLayer,
} from '@app/editor/templateLayerActions';
import {
  isTextLikeTemplate,
  readStyleLiteral,
  setPixelStyle,
  setStyleLiteral,
} from '../../component-settings/selected-template-controls/style-utils';
import {
  STUDIO_CLICK_ACTION_PROP,
  STUDIO_CLICK_PAGE_SLUG_PROP,
  STUDIO_CLICK_URL_PROP,
} from '@app/utils/studioClickAction';

type PropEditorSectionProps = {
  template: t.Template;
};

const CORNER_STYLE_KEYS = [
  { key: 'borderTopLeftRadius', label: 'Top Left' },
  { key: 'borderTopRightRadius', label: 'Top Right' },
  { key: 'borderBottomRightRadius', label: 'Bottom Right' },
  { key: 'borderBottomLeftRadius', label: 'Bottom Left' },
] as const;

const FONT_WEIGHT_ITEMS = [
  { value: '', label: 'Default' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
] as const;

const TEXT_ALIGN_ITEMS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'justify', label: 'Justify' },
] as const;

const readRadiusValue = (template: t.TagTemplate, key: string) => {
  const raw = readStyleLiteral(template, key);
  const parsed = Number.parseFloat(raw);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const PropTemplateSettings = observer(
  ({ template }: PropEditorSectionProps) => {
    const [addNewProp, setAddNewProp] = React.useState(false);
    const [addNewClassListItem, setAddNewClassListItem] = React.useState(false);
    const editor = useEditor();

    const classList = template.classList;

    const variables = editor.reka.getIdentifiablesAtNode(template, {
      filter: (variable) => !t.is(variable, t.RekaComponent),
    });
    const layerState = getTemplateLayerState(editor, template);

    return (
      <React.Fragment>
        <SettingSection
          title={'Class List'}
          info={'Add CSS classes conditionally'}
          onAdd={() => setAddNewClassListItem(true)}
          collapsedOnInitial={false}
        >
          <PairInput
            addingNewField={addNewClassListItem}
            onCancelAdding={() => setAddNewClassListItem(false)}
            getIdentifiablesForExpr={() => variables}
            values={
              classList
                ? Object.keys(classList.properties).map((key) => ({
                    id: key,
                    value: classList.properties[key],
                  }))
                : []
            }
            onRemove={(id) => {
              editor.reka.change(() => {
                delete template.classList?.properties[id];
              });
            }}
            onChange={(id, value) => {
              editor.reka.change(() => {
                if (!template.classList) {
                  template.classList = t.objectExpression({
                    properties: {},
                  });
                }

                template.classList.properties[id] = value;
              });
            }}
            idPlaceholder="CSS class"
            valuePlaceholder="Condition"
          ></PairInput>
        </SettingSection>
        {template instanceof t.TagTemplate ? (
          <SettingSection
            title={'Corners'}
            info={'Control each corner radius separately for the selected layout or block'}
            collapsedOnInitial={false}
          >
            <div className="rounded-[14px] border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[12px] font-medium text-slate-800">
                    Border radius
                  </div>
                  <div className="mt-1 text-[11px] leading-5 text-slate-500">
                    Adjust the corner radius for the selected layout or block from
                    the inspector.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStyleLiteral(editor, template, 'borderRadius', '');
                    CORNER_STYLE_KEYS.forEach(({ key }) => {
                      setStyleLiteral(editor, template, key, '');
                    });
                  }}
                  className="inline-flex h-8 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {[0, 8, 16, 24].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setPixelStyle(editor, template, 'borderRadius', `${value}`);
                      CORNER_STYLE_KEYS.forEach(({ key }) => {
                        setStyleLiteral(editor, template, key, '');
                      });
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-2 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    {value}px
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>All corners</span>
                  <span className="font-medium text-slate-700">
                    {readStyleLiteral(template, 'borderRadius') || '0px'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={readRadiusValue(template, 'borderRadius')}
                  onChange={(event) =>
                    setPixelStyle(editor, template, 'borderRadius', event.target.value)
                  }
                  className="h-2 w-full cursor-pointer accent-slate-900"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {CORNER_STYLE_KEYS.map((item) => (
                  <div key={item.key} className="rounded-[12px] border border-slate-200 bg-slate-50 p-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{item.label}</span>
                      <span className="font-medium text-slate-700">
                        {readStyleLiteral(template, item.key) || '0px'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="1"
                      value={readRadiusValue(template, item.key)}
                      onChange={(event) =>
                        setPixelStyle(editor, template, item.key, event.target.value)
                      }
                      className="mt-2 h-2 w-full cursor-pointer accent-slate-900"
                    />
                  </div>
                ))}
              </div>
            </div>
          </SettingSection>
        ) : null}
        {template instanceof t.TagTemplate && isTextLikeTemplate(template) ? (
          <SettingSection
            title={'Typography'}
            info={'Control text size, wrapping and letter spacing from the inspector'}
            collapsedOnInitial={false}
          >
            <div className="rounded-[14px] border border-slate-200 bg-white p-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['fontSize', 'Font Size', '16px'],
                  ['lineHeight', 'Line Height', '24px'],
                  ['letterSpacing', 'Letter Spacing', '0px'],
                  ['width', 'Text Width', 'auto'],
                ].map(([key, label, placeholder]) => (
                  <label key={key} className="block">
                    <div className="mb-1.5 text-[11px] font-medium text-slate-700">
                      {label}
                    </div>
                    <input
                      type="text"
                      value={readStyleLiteral(template, key)}
                      placeholder={placeholder}
                      onChange={(event) =>
                        setPixelStyle(editor, template, key, event.target.value)
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
                    value={readStyleLiteral(template, 'fontWeight')}
                    onChange={(event) =>
                      setStyleLiteral(editor, template, 'fontWeight', event.target.value)
                    }
                    className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none"
                  >
                    {FONT_WEIGHT_ITEMS.map((item) => (
                      <option key={item.label} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <div className="mb-1.5 text-[11px] font-medium text-slate-700">
                    Text Align
                  </div>
                  <select
                    value={readStyleLiteral(template, 'textAlign') || 'left'}
                    onChange={(event) =>
                      setStyleLiteral(editor, template, 'textAlign', event.target.value)
                    }
                    className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none"
                  >
                    {TEXT_ALIGN_ITEMS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </SettingSection>
        ) : null}
        <SettingSection
          title={'Layer'}
          info={'Move the selected layer up or down among sibling elements'}
          collapsedOnInitial={false}
        >
          <div className="rounded-[14px] border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-3 text-[11px] text-slate-500">
              <span>Layer order</span>
              <span className="font-medium text-slate-700">
                {layerState.hasParent
                  ? `${layerState.index + 1} / ${layerState.total}`
                  : 'Root layer'}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!layerState.canMoveUp}
                onClick={() => moveTemplateLayer(editor, template, 'up')}
                className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Move Up
              </button>
              <button
                type="button"
                disabled={!layerState.canMoveDown}
                onClick={() => moveTemplateLayer(editor, template, 'down')}
                className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Move Down
              </button>
              <button
                type="button"
                disabled={!layerState.hasParent || !layerState.canMoveDown}
                onClick={() => moveTemplateLayerToEdge(editor, template, 'front')}
                className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Bring Front
              </button>
              <button
                type="button"
                disabled={!layerState.hasParent || !layerState.canMoveUp}
                onClick={() => moveTemplateLayerToEdge(editor, template, 'back')}
                className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send Back
              </button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!layerState.hasParent}
                onClick={() => duplicateTemplateLayer(editor, template)}
                className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Duplicate
              </button>
              <button
                type="button"
                disabled={!layerState.hasParent}
                onClick={() => removeTemplateLayer(editor, template)}
                className="inline-flex h-9 items-center justify-center rounded-[10px] border border-rose-200 bg-rose-50 px-3 text-[12px] font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </SettingSection>
        <SettingSection
          onAdd={() => setAddNewProp(true)}
          title={'Props'}
          collapsedOnInitial={false}
        >
          <PairInput
            addingNewField={addNewProp}
            onCancelAdding={() => setAddNewProp(false)}
            emptyValuesText={'No props set for this template'}
            onChange={(id, value) => {
              editor.reka.change(() => {
                template.props[id] = value;
              });
            }}
            allowPropBinding={true}
            onRemove={(id) => {
              editor.reka.change(() => {
                delete template.props[id];
              });
            }}
            getIdentifiablesForExpr={() =>
              editor.reka.getIdentifiablesAtNode(template, {
                filter: ({ identifiable }) => !t.is(identifiable, t.Component),
              })
            }
            values={Object.keys(template.props).reduce<
              Array<{ id: string; value: t.Expression | null }>
            >((items, prop) => {
              if (
                prop === STUDIO_CLICK_ACTION_PROP ||
                prop === STUDIO_CLICK_PAGE_SLUG_PROP ||
                prop === STUDIO_CLICK_URL_PROP
              ) {
                return items;
              }

              items.push({
                id: prop,
                value: template.props[prop] ?? null,
              });

              return items;
            }, [])}
            idPlaceholder="Prop"
            valuePlaceholder="Value"
          />
        </SettingSection>
      </React.Fragment>
    );
  }
);
