import * as t from '@rekajs/types';

import { Switch } from '@app/components/switch/Switch';
import { TextField } from '@app/components/text-field';
import { TemplateMediaFields } from '@app/components/editor-layout/shared/media/TemplateMediaFields';
import {
  STUDIO_SLIDER_AUTOPLAY_PROP,
  STUDIO_SLIDER_INTERVAL_PROP,
  STUDIO_SLIDER_LOOP_PROP,
  STUDIO_SLIDER_SHOW_ARROWS_PROP,
  STUDIO_SLIDER_SHOW_DOTS_PROP,
  STUDIO_SLIDER_TRANSITION_PROP,
  STUDIO_SLIDER_PLACEHOLDER_IMAGES,
} from '@app/components/studioBlocks/constants';
import { useEditor } from '@app/editor';

import { createSliderSlideTemplate } from '../../studioBlocks/sliderBlock';
import { ControlCard } from '../controls/ControlCard';
import { ControlField } from '../controls/ControlField';
import { LengthStyleField } from '../controls/LengthStyleField';
import {
  readPropLiteral,
  readStyleLiteral,
  setLiteralProp,
  setPixelStyle,
} from '../style-utils';
import { findSliderSlideMediaTemplate, findSliderSlides } from '../studioBlockTemplateUtils';

type SliderControlsProps = {
  template: t.TagTemplate | null;
};

const readEnabled = (template: t.TagTemplate, key: string, fallback = true) => {
  const raw = readPropLiteral(template, key).trim().toLowerCase();

  if (!raw) {
    return fallback;
  }

  return raw === 'true' || raw === '1' || raw === 'yes';
};

export const SliderControls = (props: SliderControlsProps) => {
  const editor = useEditor();

  if (!props.template) {
    return null;
  }

  const slides = findSliderSlides(props.template);

  return (
    <>
      <ControlCard
        eyebrow="Slider"
        title="Carousel behavior"
        description="Autoplay, dots, arrows and transition timing for the image slider."
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              key: STUDIO_SLIDER_AUTOPLAY_PROP,
              label: 'Autoplay',
              checked: readEnabled(props.template, STUDIO_SLIDER_AUTOPLAY_PROP, true),
            },
            {
              key: STUDIO_SLIDER_LOOP_PROP,
              label: 'Loop',
              checked: readEnabled(props.template, STUDIO_SLIDER_LOOP_PROP, true),
            },
            {
              key: STUDIO_SLIDER_SHOW_ARROWS_PROP,
              label: 'Arrows',
              checked: readEnabled(props.template, STUDIO_SLIDER_SHOW_ARROWS_PROP, true),
            },
            {
              key: STUDIO_SLIDER_SHOW_DOTS_PROP,
              label: 'Dots',
              checked: readEnabled(props.template, STUDIO_SLIDER_SHOW_DOTS_PROP, true),
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-[12px] border border-slate-200 bg-white px-3 py-2"
            >
              <span className="text-[11px] font-medium text-slate-700">
                {item.label}
              </span>
              <Switch
                checked={item.checked}
                onChange={() =>
                  setLiteralProp(
                    editor,
                    props.template as t.TagTemplate,
                    item.key,
                    item.checked ? 'false' : 'true'
                  )
                }
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ControlField label="Interval" hint="ms">
            <TextField
              value={readPropLiteral(props.template, STUDIO_SLIDER_INTERVAL_PROP) || '3200'}
              placeholder="3200"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) =>
                setLiteralProp(
                  editor,
                  props.template as t.TagTemplate,
                  STUDIO_SLIDER_INTERVAL_PROP,
                  String(value ?? '3200')
                )
              }
            />
          </ControlField>
          <ControlField label="Transition" hint="ms">
            <TextField
              value={readPropLiteral(props.template, STUDIO_SLIDER_TRANSITION_PROP) || '700'}
              placeholder="700"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) =>
                setLiteralProp(
                  editor,
                  props.template as t.TagTemplate,
                  STUDIO_SLIDER_TRANSITION_PROP,
                  String(value ?? '700')
                )
              }
            />
          </ControlField>
        </div>

        <LengthStyleField
          label="Slider Height"
          value={readStyleLiteral(props.template, 'height')}
          placeholder="320px"
          badge="canvas"
          onCommit={(value) => setPixelStyle(editor, props.template as t.TagTemplate, 'height', value)}
        />

        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-[12px] border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            onClick={() => {
              editor.reka.change(() => {
                props.template?.children.push(
                  createSliderSlideTemplate(
                    STUDIO_SLIDER_PLACEHOLDER_IMAGES[
                      slides.length % STUDIO_SLIDER_PLACEHOLDER_IMAGES.length
                    ],
                    slides.length
                  )
                );
              });
            }}
          >
            Add Slide
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-[12px] border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={slides.length <= 1}
            onClick={() => {
              const lastSlide = slides[slides.length - 1];

              if (!lastSlide) {
                return;
              }

              editor.reka.change(() => {
                const index = props.template?.children.indexOf(lastSlide) ?? -1;

                if (index >= 0) {
                  props.template?.children.splice(index, 1);
                }
              });
            }}
          >
            Remove Last
          </button>
        </div>
      </ControlCard>

      <ControlCard
        eyebrow="Slides"
        title="Replace dummy images"
        description="Every slide uses the normal media uploader, so you can swap URLs or upload real files."
      >
        <div className="space-y-3">
          {slides.map((slide, index) => {
            const mediaTemplate = findSliderSlideMediaTemplate(slide);

            if (!mediaTemplate) {
              return null;
            }

            return (
              <div
                key={slide.id}
                className="rounded-[14px] border border-slate-200 bg-white p-3"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Slide {index + 1}
                    </div>
                    <div className="mt-0.5 text-[12px] font-medium text-slate-800">
                      Update image and alt text
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-8 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-2.5 text-[10px] font-semibold text-slate-500 transition hover:border-rose-200 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={slides.length <= 1}
                    onClick={() => {
                      editor.reka.change(() => {
                        const slideIndex = props.template?.children.indexOf(slide) ?? -1;

                        if (slideIndex >= 0) {
                          props.template?.children.splice(slideIndex, 1);
                        }
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
                <TemplateMediaFields template={mediaTemplate} variant="panel" />
              </div>
            );
          })}
        </div>
      </ControlCard>
    </>
  );
};
