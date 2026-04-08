import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { Select } from '@app/components/select';
import { TextField } from '@app/components/text-field';
import { useEditor } from '@app/editor';
import { cn } from '@app/utils';
import {
  buildStudioPagePath,
  readStudioClickActionConfig,
  STUDIO_CLICK_PAGE_SLUG_PROP,
  STUDIO_CLICK_URL_PROP,
  STUDIO_CLICK_ACTION_PROP,
  type StudioClickActionType,
} from '@app/utils/studioClickAction';
import { useMaybeStudioPageContext } from '@/siteAdmin/studio/studioPageContext';
import {
  readStyleLiteral,
  setLiteralProp,
  setStyleLiteral,
} from '../../component-settings/selected-template-controls/style-utils';

type ClickActionTemplateSettingsProps = {
  template: t.TagTemplate | null;
};

const ACTION_CARDS: Array<{
  value: StudioClickActionType;
  title: string;
  description: string;
}> = [
  {
    value: 'none',
    title: 'No Action',
    description: 'Keep this element non-clickable on the live site.',
  },
  {
    value: 'page',
    title: 'Open Page',
    description: 'Send visitors to another page managed in Studio.',
  },
  {
    value: 'link',
    title: 'Open Link',
    description: 'Send visitors to any external URL.',
  },
];

export const ClickActionTemplateSettings = observer(
  ({ template }: ClickActionTemplateSettingsProps) => {
    const editor = useEditor();
    const pageContext = useMaybeStudioPageContext();

    if (!template) {
      return (
        <div className="px-6 py-6">
          <div className="rounded-[22px] border border-dashed border-slate-200 bg-white px-5 py-8 text-center">
            <div className="text-[14px] font-semibold text-slate-900">
              Click Action Not Available
            </div>
            <div className="mt-2 text-[11px] leading-5 text-slate-500">
              Select a text, button, image, card, or container layer to configure
              click behavior.
            </div>
          </div>
        </div>
      );
    }

    const clickActionConfig = readStudioClickActionConfig(
      template.props as Record<string, unknown>
    );
    const [draftType, setDraftType] = React.useState<StudioClickActionType>(
      clickActionConfig.type
    );
    const [draftPageSlug, setDraftPageSlug] = React.useState(
      clickActionConfig.pageSlug || '__home__'
    );
    const [draftUrl, setDraftUrl] = React.useState(clickActionConfig.url ?? '');

    React.useEffect(() => {
      setDraftType(clickActionConfig.type);
      setDraftPageSlug(clickActionConfig.pageSlug || '__home__');
      setDraftUrl(clickActionConfig.url ?? '');
    }, [
      template.id,
      clickActionConfig.type,
      clickActionConfig.pageSlug,
      clickActionConfig.url,
    ]);

    const pageActionItems = React.useMemo(
      () => [
        { value: '__home__', title: 'Home (/)' },
        ...((pageContext?.pages ?? []).map((page) => ({
          value: page.slug,
          title: `${page.title} (/${page.slug || ''})`,
        })) ?? []),
      ],
      [pageContext?.pages]
    );

    const applyClickActionType = (value: StudioClickActionType) => {
      setDraftType(value);

      if (value !== 'page') {
        setDraftPageSlug('__home__');
      }

      if (value !== 'link') {
        setDraftUrl('');
      }

      setLiteralProp(
        editor,
        template,
        STUDIO_CLICK_ACTION_PROP,
        value === 'none' ? '' : value
      );

      if (value !== 'page') {
        setLiteralProp(editor, template, STUDIO_CLICK_PAGE_SLUG_PROP, '');
      }

      if (value !== 'link') {
        setLiteralProp(editor, template, STUDIO_CLICK_URL_PROP, '');
      }

      if (value !== 'none' && !readStyleLiteral(template, 'cursor')) {
        setStyleLiteral(editor, template, 'cursor', 'pointer');
      }
    };

    return (
      <div className="px-4 py-4">
        <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
          <div className="text-[15px] font-semibold text-slate-900">
            Click Action
          </div>
          <div className="mt-1 text-[11px] leading-5 text-slate-500">
            Choose what should happen when visitors click this element on the
            live site.
          </div>
          <div className="mt-3 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] leading-5 text-slate-500">
            Step 1: choose an action. Step 2: choose the target page or paste
            the external URL. Step 3: click the Studio <span className="font-semibold text-slate-800">Save</span>
            button in the top-right corner.
          </div>

          <div className="mt-4 grid gap-2">
            {ACTION_CARDS.map((item) => {
              const isActive = draftType === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => applyClickActionType(item.value)}
                  className={cn(
                    'rounded-[16px] border px-4 py-3 text-left transition',
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white shadow-[0_12px_32px_rgba(15,23,42,0.18)]'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold">{item.title}</div>
                    <div
                      className={cn(
                        'h-2.5 w-2.5 rounded-full transition',
                        isActive ? 'bg-white' : 'bg-slate-300'
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      'mt-1 text-[11px] leading-5',
                      isActive ? 'text-slate-200' : 'text-slate-500'
                    )}
                  >
                    {item.description}
                  </div>
                </button>
              );
            })}
          </div>

          {draftType === 'page' ? (
            <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Target Page
              </div>
              <div className="mt-1 text-[11px] leading-5 text-slate-500">
                Choose which Studio page should open when this element is clicked.
              </div>
              <div className="mt-2">
                <Select
                  className="w-full justify-between rounded-[12px] border-slate-200 bg-white px-3 py-2.5 text-[12px] text-slate-700"
                  value={draftPageSlug}
                  onChange={(value) => {
                    setDraftPageSlug(value);
                    setLiteralProp(
                      editor,
                      template,
                      STUDIO_CLICK_PAGE_SLUG_PROP,
                      value === '__home__' ? '' : value
                    );
                  }}
                  items={pageActionItems}
                />
              </div>
              <div className="mt-3 rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-[11px] leading-5 text-slate-500">
                Live click path:{' '}
                <span className="font-semibold text-slate-800">
                  {buildStudioPagePath(draftPageSlug === '__home__' ? '' : draftPageSlug)}
                </span>
              </div>
              {!(pageContext?.pages?.length ?? 0) ? (
                <div className="mt-3 rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700">
                  No extra pages are loaded in this Studio session yet. You can
                  still use the Home route.
                </div>
              ) : null}
            </div>
          ) : null}

          {draftType === 'link' ? (
            <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                External URL
              </div>
              <div className="mt-1 text-[11px] leading-5 text-slate-500">
                Paste the full link that should open when this element is clicked.
              </div>
              <div className="mt-2">
                <TextField
                  className="rounded-[12px] border-slate-200 bg-white"
                  inputClassName="py-2.5 text-[12px] text-slate-700"
                  value={draftUrl}
                  placeholder="https://example.com/offers"
                  onChange={(event) => {
                    setDraftUrl(event.target.value);
                    setLiteralProp(
                      editor,
                      template,
                      STUDIO_CLICK_URL_PROP,
                      event.target.value
                    );
                  }}
                />
              </div>
              <div className="mt-3 rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-[11px] leading-5 text-slate-500">
                This URL opens when the element is clicked on the live site.
              </div>
            </div>
          ) : null}

          {draftType === 'none' ? (
            <div className="mt-4 rounded-[16px] border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-[11px] leading-5 text-slate-500">
              Clicking this element does nothing right now. Choose a page or link
              action above when you want to make it interactive.
            </div>
          ) : null}

          <div className="mt-4 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] leading-5 text-slate-500">
            Studio keeps click navigation disabled inside the editor so you can
            keep selecting layers safely. The action runs in preview and on the
            live site.
          </div>
          {draftType !== 'none' ? (
            <div className="mt-3 rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[11px] leading-5 text-emerald-700">
              After setting the target, use the main <span className="font-semibold">Save</span> button in the
              top-right corner to store this click action.
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
