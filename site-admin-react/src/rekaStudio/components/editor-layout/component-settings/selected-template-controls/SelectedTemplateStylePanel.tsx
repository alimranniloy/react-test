import { SparklesIcon } from '@heroicons/react/24/outline';
import { observer } from 'mobx-react-lite';
import * as t from '@rekajs/types';

import { useEditor } from '@app/editor';

import { SelectionSummary } from './SelectionSummary';
import { CountControls } from './sections/CountControls';
import { LayoutControls } from './sections/LayoutControls';
import { PageSizeControls } from './sections/PageSizeControls';
import { SliderControls } from './sections/SliderControls';
import { SurfaceControls } from './sections/SurfaceControls';
import { TypographyControls } from './sections/TypographyControls';
import { ImageControls } from './sections/ImageControls';
import { TransformControls } from './sections/TransformControls';
import { resolveEditableTagTemplate } from './style-utils';
import {
  findCountRootTemplate,
  findSliderRootTemplate,
} from './studioBlockTemplateUtils';
import { getPageSizeTarget } from '@app/components/frame/pageSizeTarget';

const isTemplateWithinAncestor = (
  editor: ReturnType<typeof useEditor>,
  template: t.Template | null,
  ancestor: t.Template | null
) => {
  if (!template || !ancestor) {
    return false;
  }

  let current: t.Template | null = template;

  while (current) {
    if (current.id === ancestor.id) {
      return true;
    }

    try {
      current = editor.reka.getParentNode(current, t.Template);
    } catch {
      return false;
    }
  }

  return false;
};

export const SelectedTemplateStylePanel = observer(() => {
  const editor = useEditor();
  const selectedTemplate = editor.activeComponentEditor?.tplEvent.selected ?? null;
  const rootTemplate =
    editor.activeComponentEditor?.component instanceof t.RekaComponent
      ? editor.activeComponentEditor.component.template
      : null;
  const pageSizeTarget = getPageSizeTarget(
    editor.activeComponentEditor?.activeFrame,
    editor.iframe,
    rootTemplate
  );
  const pageSizeTemplate =
    selectedTemplate &&
    pageSizeTarget &&
    isTemplateWithinAncestor(editor, selectedTemplate, pageSizeTarget.template)
      ? pageSizeTarget.template
      : null;
  const sliderRootTemplate = findSliderRootTemplate(editor, selectedTemplate);
  const countRootTemplate = findCountRootTemplate(editor, selectedTemplate);
  const editableTemplate =
    sliderRootTemplate ?? resolveEditableTagTemplate(editor, selectedTemplate);

  return (
    <div
      className="space-y-3 border-b border-solid border-outline bg-slate-50/40 px-4 py-4"
      style={{ fontFamily: '"Outfit", sans-serif' }}
    >
      <SelectionSummary
        sourceTemplate={selectedTemplate}
        editableTemplate={editableTemplate}
      />

      {editableTemplate ? (
        <div className="space-y-3 rounded-[18px] border border-slate-200 bg-white p-3">
          <PageSizeControls template={pageSizeTemplate} />
          <SliderControls template={sliderRootTemplate} />
          <CountControls template={countRootTemplate} />
          <SurfaceControls template={editableTemplate} />
          <TypographyControls template={editableTemplate} />
          <LayoutControls template={editableTemplate} />
          <TransformControls template={editableTemplate} />
          <ImageControls template={editableTemplate} />
        </div>
      ) : (
        <div className="rounded-[18px] border border-dashed border-slate-200 bg-white px-4 py-5 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <SparklesIcon className="h-5 w-5 text-sky-500" />
          </div>
          <div className="text-[14px] font-semibold text-slate-900">
            Pick any live element
          </div>
          <div className="mt-1 text-[11px] leading-5 text-slate-500">
            Text, image, button, card or container select করলে left sidebar-এ
            ready style controls চলে আসবে.
          </div>
        </div>
      )}
    </div>
  );
});
