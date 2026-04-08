import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useEditor } from '@app/editor';
import { cn } from '@app/utils';
import { useMaybeStudioAIContext } from '@/siteAdmin/studio/studioAIContext';
import { StudioAISidebar } from '@/siteAdmin/studio/StudioAISidebar';

import { ConditionalTemplateSettings } from './shared/ConditionalTemplateSettings';
import { ClickActionTemplateSettings } from './shared/ClickActionTemplateSettings';
import { EachTemplateSettings } from './shared/EachTemplateSettings';
import { MediaTemplateSettings } from './shared/MediaTemplateSettings';
import { PropTemplateSettings } from './shared/PropTemplateSettings';
import { AnimationControls } from '../component-settings/selected-template-controls/sections/AnimationControls';
import {
  getTemplateDisplayName,
  resolveEditableTagTemplate,
} from '../component-settings/selected-template-controls/style-utils';

type TemplateHeadingProps = {
  template: t.Template;
};

const TemplateHeading = (props: TemplateHeadingProps) => {
  let title: string;

  if (props.template instanceof t.ComponentTemplate) {
    title = props.template.component.name;
  } else if (props.template instanceof t.TagTemplate) {
    title = props.template.tag;
  } else if (props.template instanceof t.SlotTemplate) {
    title = 'Slot';
  } else {
    title = 'Template';
  }

  return (
    <div className="flex items-center flex-1">
      <div className="flex-1 text-sm">
        <span className="text-lg color-gray-800 w-full flex items-center mt-1 cursor-pointer">
          {title}
        </span>
      </div>
      <div className="text-xs bg-primary-100 text-primary inline-block w-auto px-3 py-1 rounded-full align-end">
        {props.template.type}
      </div>
    </div>
  );
};

const InternalTemplateSettings = (props: { template: t.Template }) => {
  return (
    <div>
      <div className="flex px-5 py-3 mt-4">
        <TemplateHeading template={props.template} />
      </div>
      <div className="mt-3">
        <EachTemplateSettings template={props.template} />
        <ConditionalTemplateSettings template={props.template} />
        <MediaTemplateSettings template={props.template} />
        <PropTemplateSettings template={props.template} />
      </div>
    </div>
  );
};

export const TemplateSettings = observer(() => {
  const editor = useEditor();
  const studioAI = useMaybeStudioAIContext();
  const [activePanel, setActivePanel] = React.useState<
    'props' | 'motion' | 'click-action'
  >('props');

  const template = editor.activeComponentEditor?.tplEvent.selected;
  const editableTemplate = resolveEditableTagTemplate(editor, template ?? null);
  const clickActionTemplate =
    editableTemplate instanceof t.TagTemplate
      ? editableTemplate
      : template instanceof t.TagTemplate
        ? template
        : null;

  React.useEffect(() => {
    if (!template) {
      setActivePanel('props');
    }
  }, [template]);

  if (studioAI?.isOpen) {
    return <StudioAISidebar />;
  }

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Inspector
        </div>
        <div className="mt-1 text-[17px] font-semibold tracking-tight text-slate-900">
          {template ? getTemplateDisplayName(editableTemplate ?? template) : 'No Selection'}
        </div>
        <div className="mt-1 text-[11px] leading-5 text-slate-500">
          {template
            ? 'Switch between properties, motion, and click behavior from this inspector.'
            : 'Select an element in the canvas to edit its properties, motion, and click behavior.'}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-[18px] border border-slate-200 bg-slate-50 p-1.5">
          {[
            { value: 'props', label: 'Properties' },
            { value: 'motion', label: 'Motion' },
            { value: 'click-action', label: 'Click Action' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setActivePanel(item.value as 'props' | 'motion' | 'click-action')
              }
              className={cn(
                'rounded-[14px] px-3 py-2.5 text-[11px] font-semibold transition',
                activePanel === item.value
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {activePanel === 'props' ? (
          template ? (
            <InternalTemplateSettings key={template.id} template={template} />
          ) : (
            <div className="px-8 py-4 flex flex-col justify-center items-center h-full text-center gap-2">
              <span className="text-gray-500 text-xs leading-5 max-w-[250px]">
                Click on an element on the screen to start editing a template.
              </span>
            </div>
          )
        ) : activePanel === 'motion' ? editableTemplate ? (
          <div className="p-3">
            <AnimationControls template={editableTemplate} />
          </div>
        ) : (
          <div className="px-6 py-6">
            <div className="rounded-[22px] border border-dashed border-slate-200 bg-white px-5 py-8 text-center">
              <div className="text-[14px] font-semibold text-slate-900">
                Motion Target Not Ready
              </div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">
                Select a text, image, button, card, or container layer. Motion
                controls will appear here for supported elements.
              </div>
            </div>
          </div>
        ) : (
          <ClickActionTemplateSettings template={clickActionTemplate} />
        )}
      </div>
    </div>
  );
});
