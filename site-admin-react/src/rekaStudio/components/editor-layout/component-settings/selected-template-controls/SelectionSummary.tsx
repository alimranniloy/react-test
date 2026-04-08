import * as t from '@rekajs/types';

import { getTemplateDisplayName } from './style-utils';

type SelectionSummaryProps = {
  sourceTemplate: t.Template | null;
  editableTemplate: t.TagTemplate | null;
};

export const SelectionSummary = (props: SelectionSummaryProps) => {
  return (
    <div
      className="rounded-[18px] border border-slate-200 bg-white p-3.5"
      style={{ fontFamily: '"Outfit", sans-serif' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Live Styling
          </div>
          <div className="mt-1 text-[16px] font-semibold tracking-tight text-slate-900">
            {props.editableTemplate
              ? getTemplateDisplayName(props.editableTemplate)
              : 'No editable element selected'}
          </div>
          <div className="mt-1 text-[11px] leading-5 text-slate-500">
            {props.editableTemplate
              ? 'Color, spacing, typography, radius and media props update instantly from this panel.'
              : 'Click text, image, button or container inside the preview to unlock styling controls here.'}
          </div>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {props.sourceTemplate ? props.sourceTemplate.type : 'idle'}
        </div>
      </div>
    </div>
  );
};
