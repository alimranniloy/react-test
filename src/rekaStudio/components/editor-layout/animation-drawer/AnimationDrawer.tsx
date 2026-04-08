import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useEditor } from '@app/editor';
import { EditorMode } from '@app/editor/Editor';
import { CREATE_BEZIER_TRANSITION, cn } from '@app/utils';

import { AnimationControls } from '../component-settings/selected-template-controls/sections/AnimationControls';
import {
  getTemplateDisplayName,
  resolveEditableTagTemplate,
} from '../component-settings/selected-template-controls/style-utils';

const DRAWER_WIDTH = 360;

export const AnimationDrawer = observer(() => {
  const editor = useEditor();
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedTemplate = editor.activeComponentEditor?.tplEvent.selected ?? null;
  const editableTemplate = resolveEditableTagTemplate(editor, selectedTemplate);

  React.useEffect(() => {
    if (editor.mode !== EditorMode.UI) {
      setIsOpen(false);
    }
  }, [editor.mode]);

  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 z-[70] flex items-center">
      {editor.mode === EditorMode.UI ? (
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className={cn(
            'pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 rounded-l-[22px] border border-r-0 border-slate-200 bg-white/95 px-3 py-4 text-slate-700 shadow-[0_18px_44px_-28px_rgba(15,23,42,0.35)] backdrop-blur',
            {
              'bg-slate-900 text-white border-slate-900': isOpen,
            }
          )}
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]">
            <SparklesIcon className="h-4 w-4" />
            Motion
          </span>
        </button>
      ) : null}

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            className="pointer-events-auto relative h-full border-l border-slate-200 bg-white"
            initial={{ x: DRAWER_WIDTH, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: DRAWER_WIDTH, opacity: 0.6 }}
            transition={CREATE_BEZIER_TRANSITION()}
            style={{ width: DRAWER_WIDTH }}
          >
            <div className="flex h-full flex-col bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
              <div className="border-b border-slate-200 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Animation Drawer
                    </div>
                    <div className="mt-1 text-[18px] font-semibold tracking-tight text-slate-900">
                      Motion Presets
                    </div>
                    <div className="mt-1 text-[11px] leading-5 text-slate-500">
                      {editableTemplate
                        ? `${getTemplateDisplayName(editableTemplate)} selected. Apply click, hover or load animations from this drawer.`
                        : 'Select a text, image, button or container from the preview, then apply animations here.'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-[14px] border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3">
                {editableTemplate ? (
                  <AnimationControls template={editableTemplate} />
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-5 py-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] border border-slate-200 bg-slate-50">
                      <SparklesIcon className="h-6 w-6 text-sky-500" />
                    </div>
                    <div className="text-[15px] font-semibold text-slate-900">
                      Nothing selected yet
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-slate-500">
                      Preview থেকে যেকোনো text, image, button, card বা container
                      select করো. তারপর animation presets এই drawer-এর মধ্যে
                      show করবে.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
});
