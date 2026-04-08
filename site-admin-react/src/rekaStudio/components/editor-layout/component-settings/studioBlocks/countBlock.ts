import * as t from '@rekajs/types';

import {
  STUDIO_COUNT_BLOCK_CLASS,
  STUDIO_COUNT_DECIMALS_PROP,
  STUDIO_COUNT_DURATION_PROP,
  STUDIO_COUNT_FORMAT_PROP,
  STUDIO_COUNT_FROM_PROP,
  STUDIO_COUNT_LABEL_CLASS,
  STUDIO_COUNT_MARKER_PROP,
  STUDIO_COUNT_META_CLASS,
  STUDIO_COUNT_PART_PROP,
  STUDIO_COUNT_PREFIX_PROP,
  STUDIO_COUNT_SEPARATOR_PROP,
  STUDIO_COUNT_SUFFIX_PROP,
  STUDIO_COUNT_TO_PROP,
  STUDIO_COUNT_VALUE_CLASS,
  STUDIO_COUNT_VALUE_MARKER_PROP,
} from '@app/components/studioBlocks/constants';

const literal = (value: unknown) =>
  t.literal({ value: value as string | number | boolean });

const objectStyle = (properties: Record<string, string>) =>
  t.objectExpression({
    properties: Object.fromEntries(
      Object.entries(properties).map(([key, value]) => [key, literal(value)])
    ),
  });

const textNode = (value: string) =>
  t.tagTemplate({
    tag: 'text',
    props: {
      value: literal(value),
    },
    children: [],
  });

const textTag = (
  tag: string,
  className: string,
  value: string,
  style?: Record<string, string>
) =>
  t.tagTemplate({
    tag,
    props: {
      className: literal(className),
      ...(style ? { style: objectStyle(style) } : {}),
    },
    children: [textNode(value)],
  });

type CountVariantConfig = {
  rootClassName: string;
  rootStyle?: Record<string, string>;
  valueClassName: string;
  labelClassName: string;
  metaClassName: string;
  previewValue: string;
  from: string;
  to: string;
  duration: string;
  prefix?: string;
  suffix?: string;
  decimals?: string;
  separator?: string;
  format?: 'number' | 'mm:ss' | 'hh:mm:ss';
  label: string;
  meta: string;
};

type CountPart = 'hours' | 'minutes' | 'seconds';

type CountValueConfig = {
  className: string;
  previewValue: string;
  from: string;
  to: string;
  duration: string;
  prefix?: string;
  suffix?: string;
  decimals?: string;
  separator?: string;
  format?: 'number' | 'mm:ss' | 'hh:mm:ss';
  part?: CountPart;
};

const createCountValueTag = (config: CountValueConfig) =>
  t.tagTemplate({
    tag: 'span',
    props: {
      className: literal(`${STUDIO_COUNT_VALUE_CLASS} ${config.className}`),
      [STUDIO_COUNT_VALUE_MARKER_PROP]: literal('true'),
      [STUDIO_COUNT_FROM_PROP]: literal(config.from),
      [STUDIO_COUNT_TO_PROP]: literal(config.to),
      [STUDIO_COUNT_DURATION_PROP]: literal(config.duration),
      [STUDIO_COUNT_PREFIX_PROP]: literal(config.prefix ?? ''),
      [STUDIO_COUNT_SUFFIX_PROP]: literal(config.suffix ?? ''),
      [STUDIO_COUNT_DECIMALS_PROP]: literal(config.decimals ?? '0'),
      [STUDIO_COUNT_SEPARATOR_PROP]: literal(config.separator ?? 'true'),
      [STUDIO_COUNT_FORMAT_PROP]: literal(config.format ?? 'number'),
      ...(config.part ? { [STUDIO_COUNT_PART_PROP]: literal(config.part) } : {}),
    },
    children: [textNode(config.previewValue)],
  });

const createCountVariant = (config: CountVariantConfig) =>
  t.tagTemplate({
    tag: 'div',
    props: {
      className: literal(`${STUDIO_COUNT_BLOCK_CLASS} ${config.rootClassName}`),
      [STUDIO_COUNT_MARKER_PROP]: literal('true'),
      style: objectStyle({
        display: 'block',
        maxWidth: '100%',
        ...(config.rootStyle ?? {}),
      }),
    },
    children: [
      createCountValueTag({
        className: config.valueClassName,
        previewValue: config.previewValue,
        from: config.from,
        to: config.to,
        duration: config.duration,
        prefix: config.prefix,
        suffix: config.suffix,
        decimals: config.decimals,
        separator: config.separator,
        format: config.format,
      }),
      textTag(
        'p',
        `${STUDIO_COUNT_LABEL_CLASS} ${config.labelClassName}`,
        config.label
      ),
      textTag(
        'span',
        `${STUDIO_COUNT_META_CLASS} ${config.metaClassName}`,
        config.meta
      ),
    ],
  });

const createTimerUnit = (
  part: CountPart,
  label: string,
  previewValue: string,
  to: string
) =>
  t.tagTemplate({
    tag: 'div',
    props: {
      className: literal('flex min-w-[78px] flex-col items-center text-center'),
      style: objectStyle({
        display: 'flex',
        minWidth: '78px',
        maxWidth: '100%',
      }),
    },
    children: [
      createCountValueTag({
        className:
          'block font-mono text-[76px] font-medium leading-[0.84] tracking-[0.12em] text-[#ff5a5a]',
        previewValue,
        from: '0',
        to,
        duration: '1600',
        separator: 'false',
        format: 'hh:mm:ss',
        part,
      }),
      textTag(
        'p',
        `${STUDIO_COUNT_LABEL_CLASS} mt-2 text-[17px] font-normal lowercase leading-none text-[#ff5a5a]`,
        label
      ),
    ],
  });

export const createCountBlockTemplate = () =>
  createCountVariant({
    rootClassName: 'block border border-slate-200 bg-white px-6 py-5',
    rootStyle: {
      width: '280px',
    },
    valueClassName: 'block text-5xl font-bold tracking-tight text-slate-900',
    labelClassName: 'mt-2 text-sm font-medium text-slate-600',
    metaClassName:
      'mt-3 block text-xs uppercase tracking-[0.22em] text-slate-400',
    previewValue: '1,280+',
    from: '0',
    to: '1280',
    duration: '2400',
    suffix: '+',
    separator: 'true',
    format: 'number',
    label: 'Projects launched',
    meta: 'Animates in 2.4s',
  });

export const createTimerCountTemplate = () =>
  t.tagTemplate({
    tag: 'div',
    props: {
      className: literal(
        `${STUDIO_COUNT_BLOCK_CLASS} inline-flex items-start justify-between gap-7`
      ),
      [STUDIO_COUNT_MARKER_PROP]: literal('true'),
      style: objectStyle({
        display: 'inline-flex',
        width: '367px',
        maxWidth: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }),
    },
    children: [
      createTimerUnit('hours', 'hours', '10', '37244'),
      createTimerUnit('minutes', 'min', '20', '37244'),
      createTimerUnit('seconds', 'sec', '44', '37244'),
    ],
  });

export const createCompactCountTemplate = () =>
  createCountVariant({
    rootClassName: 'inline-flex flex-col border border-slate-200 bg-white px-4 py-4',
    rootStyle: {
      width: '220px',
    },
    valueClassName: 'block text-4xl font-bold tracking-tight text-slate-900',
    labelClassName: 'mt-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-400',
    metaClassName: 'mt-2 block text-[11px] text-emerald-600',
    previewValue: '48K',
    from: '0',
    to: '48000',
    duration: '1800',
    suffix: '',
    separator: 'true',
    format: 'number',
    label: 'Monthly reach',
    meta: '+12.4% this week',
  });

export const createMilestoneCountTemplate = () =>
  createCountVariant({
    rootClassName:
      'block border border-amber-200 bg-amber-50 px-6 py-5',
    rootStyle: {
      width: '290px',
    },
    valueClassName: 'block text-5xl font-black tracking-tight text-amber-950',
    labelClassName: 'mt-2 text-sm font-semibold text-amber-900',
    metaClassName:
      'mt-3 block text-xs uppercase tracking-[0.22em] text-amber-700',
    previewValue: '250',
    from: '0',
    to: '250',
    duration: '2000',
    separator: 'false',
    format: 'number',
    label: 'Milestones closed',
    meta: 'Quarterly goal tracker',
  });

export const createBadgeCountTemplate = () =>
  createCountVariant({
    rootClassName:
      'inline-flex flex-col rounded-full border border-slate-200 bg-white px-5 py-4',
    rootStyle: {
      width: '210px',
    },
    valueClassName: 'block text-3xl font-bold tracking-tight text-slate-900',
    labelClassName: 'mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400',
    metaClassName: 'mt-2 block text-[11px] text-slate-500',
    previewValue: '99%',
    from: '0',
    to: '99',
    duration: '2200',
    suffix: '%',
    separator: 'false',
    format: 'number',
    label: 'Success rate',
    meta: 'Support satisfaction',
  });

export const createSpotlightCountTemplate = () =>
  createCountVariant({
    rootClassName:
      'block border border-sky-200 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)] px-6 py-6',
    rootStyle: {
      width: '320px',
    },
    valueClassName: 'block text-6xl font-bold tracking-tight text-sky-950',
    labelClassName: 'mt-3 text-sm font-semibold text-sky-900',
    metaClassName:
      'mt-3 block text-xs uppercase tracking-[0.22em] text-sky-600',
    previewValue: '$24.5K',
    from: '0',
    to: '24500',
    duration: '2600',
    prefix: '$',
    separator: 'true',
    format: 'number',
    label: 'Revenue generated',
    meta: 'Animated spotlight stat',
  });
