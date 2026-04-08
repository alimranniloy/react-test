import * as t from '@rekajs/types';

import {
  STUDIO_SLIDER_AUTOPLAY_PROP,
  STUDIO_SLIDER_BLOCK_CLASS,
  STUDIO_SLIDER_IMAGE_CLASS,
  STUDIO_SLIDER_INTERVAL_PROP,
  STUDIO_SLIDER_LOOP_PROP,
  STUDIO_SLIDER_MARKER_PROP,
  STUDIO_SLIDER_PLACEHOLDER_IMAGES,
  STUDIO_SLIDER_SHOW_ARROWS_PROP,
  STUDIO_SLIDER_SHOW_DOTS_PROP,
  STUDIO_SLIDER_SLIDE_CLASS,
  STUDIO_SLIDER_TRANSITION_PROP,
} from '@app/components/studioBlocks/constants';

const literal = (value: unknown) =>
  t.literal({ value: value as string | number | boolean });

const objectStyle = (properties: Record<string, string>) =>
  t.objectExpression({
    properties: Object.fromEntries(
      Object.entries(properties).map(([key, value]) => [key, literal(value)])
    ),
  });

export const createSliderSlideTemplate = (
  src = STUDIO_SLIDER_PLACEHOLDER_IMAGES[0],
  index = 0
) =>
  t.tagTemplate({
    tag: 'div',
    props: {
      className: literal(
        `${STUDIO_SLIDER_SLIDE_CLASS} relative h-full w-full overflow-hidden bg-slate-900`
      ),
      'data-studio-slider-slide': literal(String(index + 1)),
      style: objectStyle({
        width: '100%',
        height: '100%',
      }),
    },
    children: [
      t.tagTemplate({
        tag: 'img',
        props: {
          src: literal(src),
          alt: literal(`Slider image ${index + 1}`),
          className: literal(
            `${STUDIO_SLIDER_IMAGE_CLASS} block h-full w-full object-cover`
          ),
          style: objectStyle({
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            maxWidth: '100%',
          }),
        },
        children: [],
      }),
    ],
  });

export const createSliderBlockTemplate = () =>
  t.tagTemplate({
    tag: 'section',
    props: {
      className: literal(
        `${STUDIO_SLIDER_BLOCK_CLASS} relative block overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950`
      ),
      [STUDIO_SLIDER_MARKER_PROP]: literal('true'),
      [STUDIO_SLIDER_AUTOPLAY_PROP]: literal('true'),
      [STUDIO_SLIDER_LOOP_PROP]: literal('true'),
      [STUDIO_SLIDER_SHOW_ARROWS_PROP]: literal('true'),
      [STUDIO_SLIDER_SHOW_DOTS_PROP]: literal('true'),
      [STUDIO_SLIDER_INTERVAL_PROP]: literal('3200'),
      [STUDIO_SLIDER_TRANSITION_PROP]: literal('700'),
      style: objectStyle({
        display: 'block',
        width: '520px',
        height: '320px',
        maxWidth: '100%',
      }),
    },
    children: STUDIO_SLIDER_PLACEHOLDER_IMAGES.slice(0, 3).map((src, index) =>
      createSliderSlideTemplate(src, index)
    ),
  });
