import * as t from '@rekajs/types';

import {
  createBadgeCountTemplate,
  createCompactCountTemplate,
  createCountBlockTemplate,
  createMilestoneCountTemplate,
  createSpotlightCountTemplate,
  createTimerCountTemplate,
} from './studioBlocks/countBlock';
import { createSliderBlockTemplate } from './studioBlocks/sliderBlock';

export const STUDIO_BLOCK_ITEM_TYPE = 'studio-template-block';

export type StudioBlockPanel = 'elements' | 'shapes';
export type StudioAssetPanel = StudioBlockPanel | 'images' | 'components';

export type StudioDragItem =
  | {
      kind: 'block';
      blockKey: StudioBlockKey;
    }
  | {
      kind: 'image';
      imageSrc: string;
      imageAlt?: string;
    }
  | {
      kind: 'component';
      componentId: number;
      componentTitle?: string;
    };

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

const boxTag = (
  tag: string,
  className: string,
  children: t.Template[] = [],
  style?: Record<string, string>
) =>
  t.tagTemplate({
    tag,
    props: {
      className: literal(className),
      ...(style ? { style: objectStyle(style) } : {}),
    },
    children,
  });

const imageTag = (src: string, className: string, style?: Record<string, string>) =>
  t.tagTemplate({
    tag: 'img',
    props: {
      src: literal(src),
      alt: literal('Placeholder image'),
      className: literal(className),
      ...(style ? { style: objectStyle(style) } : {}),
    },
    children: [],
  });

const shapeTag = (
  className: string,
  style: Record<string, string>,
  label?: string
) =>
  t.tagTemplate({
    tag: 'div',
    props: {
      className: literal(className),
      style: objectStyle(style),
      ...(label ? { title: literal(label) } : {}),
    },
    children: [],
  });

const BLOCK_CREATORS = {
  text: () =>
    textTag('p', 'text-base leading-7 text-slate-700', 'New paragraph text'),
  subtext: () =>
    textTag(
      'p',
      'text-sm leading-6 text-slate-500',
      'Supportive secondary copy'
    ),
  caption: () =>
    textTag(
      'span',
      'inline-flex text-xs uppercase tracking-[0.24em] text-slate-400',
      'Caption'
    ),
  heading: () =>
    textTag(
      'h2',
      'text-3xl font-bold tracking-tight text-slate-900',
      'New heading'
    ),
  subheading: () =>
    textTag(
      'h3',
      'text-xl font-semibold tracking-tight text-slate-900',
      'Section heading'
    ),
  quote: () =>
    boxTag(
      'blockquote',
      'border-l-4 border-sky-400 pl-4 italic text-slate-700',
      [textNode('“Design is intelligence made visible.”')]
    ),
  checklist: () =>
    boxTag(
      'div',
      'space-y-3',
      [
        boxTag('div', 'flex items-center gap-3', [
          boxTag(
            'div',
            'flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700',
            [textNode('1')]
          ),
          textTag('span', 'text-sm text-slate-700', 'Checklist item'),
        ]),
        boxTag('div', 'flex items-center gap-3', [
          boxTag(
            'div',
            'flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700',
            [textNode('2')]
          ),
          textTag('span', 'text-sm text-slate-700', 'Another item'),
        ]),
      ]
    ),
  button: () =>
    textTag(
      'button',
      'inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white',
      'Click here'
    ),
  ghostButton: () =>
    textTag(
      'button',
      'inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700',
      'Secondary action'
    ),
  pillButton: () =>
    textTag(
      'button',
      'inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white',
      'Pill button'
    ),
  badge: () =>
    textTag(
      'span',
      'inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700',
      'Badge'
    ),
  iconBadge: () =>
    boxTag(
      'div',
      'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2',
      [
        boxTag(
          'div',
          'flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700',
          [textNode('i')]
        ),
        textTag('span', 'text-sm font-medium text-slate-700', 'Info chip'),
      ]
    ),
  inputField: () =>
    t.tagTemplate({
      tag: 'input',
      props: {
        type: literal('text'),
        placeholder: literal('Type here'),
        className: literal(
          'w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none'
        ),
      },
      children: [],
    }),
  textArea: () =>
    t.tagTemplate({
      tag: 'textarea',
      props: {
        placeholder: literal('Longer text goes here'),
        className: literal(
          'w-full min-h-[120px] rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none'
        ),
      },
      children: [],
    }),
  searchBar: () =>
    boxTag(
      'div',
      'flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3',
      [
        textTag('span', 'text-sm text-slate-400', '⌕'),
        textTag('span', 'text-sm text-slate-500', 'Search anything'),
      ]
    ),
  image: () =>
    imageTag(
      'https://placehold.co/800x500/png',
      'rounded-xl object-cover',
      {
        display: 'block',
        width: '320px',
        aspectRatio: '16 / 10',
        objectFit: 'cover',
        maxWidth: '100%',
      }
    ),
  avatar: () =>
    imageTag(
      'https://placehold.co/180x180/png',
      'h-20 w-20 rounded-full object-cover',
      {
        width: '80px',
        height: '80px',
      }
    ),
  logoStrip: () =>
    boxTag(
      'div',
      'flex items-center gap-4 rounded-2xl border border-dashed border-slate-200 px-5 py-4',
      [
        textTag('span', 'text-sm font-semibold text-slate-400', 'LOGO'),
        textTag('span', 'text-sm font-semibold text-slate-400', 'LOGO'),
        textTag('span', 'text-sm font-semibold text-slate-400', 'LOGO'),
        textTag('span', 'text-sm font-semibold text-slate-400', 'LOGO'),
      ]
    ),
  videoFrame: () =>
    boxTag(
      'div',
      'relative overflow-hidden rounded-3xl bg-slate-900 text-white aspect-video flex items-center justify-center',
      [
        boxTag(
          'div',
          'flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-xl',
          [textNode('▶')]
        ),
      ]
    ),
  slider: () => createSliderBlockTemplate(),
  container: () =>
    boxTag(
      'div',
      'border border-slate-200 bg-white p-6',
      [textNode('Container content')]
    ),
  section: () =>
    boxTag(
      'section',
      'space-y-4 py-8',
      [
        textTag('h3', 'text-2xl font-semibold text-slate-900', 'Section title'),
        textTag(
          'p',
          'text-base leading-7 text-slate-600',
          'Section description'
        ),
      ]
    ),
  flexRow: () =>
    boxTag(
      'div',
      'flex items-center justify-between gap-4 border border-slate-200 bg-white p-5',
      [
        textTag('span', 'text-sm font-medium text-slate-700', 'Left content'),
        textTag('span', 'text-sm font-medium text-slate-500', 'Right content'),
      ]
    ),
  stack: () =>
    boxTag(
      'div',
      'flex flex-col gap-3 border border-slate-200 bg-white p-5',
      [
        textTag('span', 'text-sm font-medium text-slate-900', 'Stack item one'),
        textTag('span', 'text-sm font-medium text-slate-700', 'Stack item two'),
        textTag('span', 'text-sm font-medium text-slate-500', 'Stack item three'),
      ]
    ),
  heroPanel: () =>
    boxTag(
      'section',
      'bg-slate-950 px-7 py-8 text-white',
      [
        textTag('span', 'text-xs uppercase tracking-[0.28em] text-sky-300', 'Hero'),
        textTag('h2', 'mt-3 text-3xl font-bold tracking-tight', 'Launch something big'),
        textTag(
          'p',
          'mt-3 text-sm leading-6 text-slate-300',
          'High-impact hero panel with a dark surface and tight headline rhythm.'
        ),
      ]
    ),
  divider: () =>
    boxTag(
      'div',
      'h-px w-full bg-slate-200',
      [],
      {
        width: '280px',
      }
    ),
  notificationBar: () =>
    boxTag(
      'div',
      'flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3',
      [
        textTag('span', 'text-sm', '⚠'),
        textTag(
          'span',
          'text-sm font-medium text-amber-800',
          'Notification bar with alert styling'
        ),
      ]
    ),
  card: () =>
    boxTag(
      'div',
      'rounded-3xl border border-slate-200 bg-white p-6',
      [
        textTag('h3', 'text-lg font-semibold text-slate-900', 'Card title'),
        textTag(
          'p',
          'mt-2 text-sm leading-6 text-slate-500',
          'Simple card container for feature or content blocks.'
        ),
      ]
    ),
  glassCard: () =>
    boxTag(
      'div',
      'rounded-3xl border border-white/50 bg-white/70 p-6 backdrop-blur-xl',
      [
        textTag('h3', 'text-lg font-semibold text-slate-900', 'Glass card'),
        textTag(
          'p',
          'mt-2 text-sm leading-6 text-slate-600',
          'Soft glassmorphism card preset.'
        ),
      ]
    ),
  featureCard: () =>
    boxTag(
      'div',
      'rounded-3xl border border-slate-200 bg-white p-6',
      [
        boxTag(
          'div',
          'mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700',
          [textNode('★')]
        ),
        textTag('h3', 'text-lg font-semibold text-slate-900', 'Feature title'),
        textTag(
          'p',
          'mt-2 text-sm leading-6 text-slate-500',
          'Explain a product feature with short detail.'
        ),
      ]
    ),
  statCard: () =>
    boxTag(
      'div',
      'rounded-3xl border border-slate-200 bg-white p-6',
      [
        textTag('span', 'text-xs uppercase tracking-[0.22em] text-slate-400', 'Revenue'),
        textTag('h2', 'mt-3 text-4xl font-bold tracking-tight text-slate-900', '$24.5K'),
        textTag('p', 'mt-2 text-sm text-emerald-600', '+18.2% this month'),
      ]
    ),
  testimonialCard: () =>
    boxTag(
      'div',
      'rounded-3xl border border-slate-200 bg-white p-6',
      [
        textTag(
          'p',
          'text-base leading-7 text-slate-700',
          '“This builder feels a lot closer to a design tool than a typical admin editor.”'
        ),
        textTag('span', 'mt-4 block text-sm font-semibold text-slate-900', 'Raihan Ahmed'),
        textTag('span', 'text-xs text-slate-400', 'Product lead'),
      ]
    ),
  pricingCard: () =>
    boxTag(
      'div',
      'rounded-3xl border border-slate-900 bg-slate-950 p-6 text-white',
      [
        textTag('span', 'text-sm font-semibold text-sky-300', 'Pro'),
        textTag('h2', 'mt-3 text-4xl font-bold tracking-tight', '$49'),
        textTag('p', 'mt-2 text-sm leading-6 text-slate-300', 'For advanced teams and creators.'),
      ]
    ),
  count: () => createCountBlockTemplate(),
  timerCount: () => createTimerCountTemplate(),
  compactCount: () => createCompactCountTemplate(),
  milestoneCount: () => createMilestoneCountTemplate(),
  badgeCount: () => createBadgeCountTemplate(),
  spotlightCount: () => createSpotlightCountTemplate(),
  square: () =>
    shapeTag(
      'block',
      {
        width: '120px',
        height: '120px',
        backgroundColor: '#2563eb',
      },
      'Square'
    ),
  roundedSquare: () =>
    shapeTag(
      'block',
      {
        width: '120px',
        height: '120px',
        backgroundColor: '#0ea5e9',
        borderRadius: '28px',
      },
      'Rounded square'
    ),
  circle: () =>
    shapeTag(
      'block',
      {
        width: '120px',
        height: '120px',
        backgroundColor: '#22c55e',
        borderRadius: '9999px',
      },
      'Circle'
    ),
  pill: () =>
    shapeTag(
      'block',
      {
        width: '180px',
        height: '80px',
        backgroundColor: '#f97316',
        borderRadius: '9999px',
      },
      'Pill'
    ),
  diamond: () =>
    shapeTag(
      'block',
      {
        width: '120px',
        height: '120px',
        backgroundColor: '#8b5cf6',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      },
      'Diamond'
    ),
  triangle: () =>
    shapeTag(
      'block',
      {
        width: '130px',
        height: '120px',
        backgroundColor: '#ef4444',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      },
      'Triangle'
    ),
  hexagon: () =>
    shapeTag(
      'block',
      {
        width: '150px',
        height: '120px',
        backgroundColor: '#14b8a6',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      },
      'Hexagon'
    ),
  octagon: () =>
    shapeTag(
      'block',
      {
        width: '130px',
        height: '130px',
        backgroundColor: '#ec4899',
        clipPath:
          'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
      },
      'Octagon'
    ),
  star: () =>
    shapeTag(
      'block',
      {
        width: '140px',
        height: '140px',
        backgroundColor: '#eab308',
        clipPath:
          'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      },
      'Star'
    ),
  speechBubble: () =>
    shapeTag(
      'block',
      {
        width: '170px',
        height: '120px',
        backgroundColor: '#6366f1',
        clipPath:
          'polygon(0% 0%, 100% 0%, 100% 78%, 58% 78%, 42% 100%, 42% 78%, 0% 78%)',
      },
      'Speech bubble'
    ),
} satisfies Record<string, () => t.Template>;

export type StudioBlockKey = keyof typeof BLOCK_CREATORS;

export type StudioBlockDefinition = {
  key: StudioBlockKey;
  label: string;
  hint: string;
  panel: StudioBlockPanel;
  group: string;
};

export const STUDIO_BLOCKS: StudioBlockDefinition[] = [
  { key: 'text', label: 'Text', hint: 'Paragraph text', panel: 'elements', group: 'Typography' },
  { key: 'subtext', label: 'Subtext', hint: 'Secondary copy', panel: 'elements', group: 'Typography' },
  { key: 'caption', label: 'Caption', hint: 'Small uppercase label', panel: 'elements', group: 'Typography' },
  { key: 'heading', label: 'Heading', hint: 'Large title', panel: 'elements', group: 'Typography' },
  { key: 'subheading', label: 'Subheading', hint: 'Medium title', panel: 'elements', group: 'Typography' },
  { key: 'quote', label: 'Quote', hint: 'Editorial blockquote', panel: 'elements', group: 'Typography' },
  { key: 'checklist', label: 'Checklist', hint: 'Steps or bullets', panel: 'elements', group: 'Typography' },

  { key: 'button', label: 'Button', hint: 'Primary CTA', panel: 'elements', group: 'Actions' },
  { key: 'ghostButton', label: 'Ghost Button', hint: 'Secondary CTA', panel: 'elements', group: 'Actions' },
  { key: 'pillButton', label: 'Pill Button', hint: 'Rounded CTA', panel: 'elements', group: 'Actions' },
  { key: 'badge', label: 'Badge', hint: 'Small label pill', panel: 'elements', group: 'Actions' },
  { key: 'iconBadge', label: 'Icon Badge', hint: 'Icon + text chip', panel: 'elements', group: 'Actions' },

  { key: 'inputField', label: 'Input', hint: 'Single-line form field', panel: 'elements', group: 'Forms' },
  { key: 'textArea', label: 'Textarea', hint: 'Long form field', panel: 'elements', group: 'Forms' },
  { key: 'searchBar', label: 'Search Bar', hint: 'Search field shell', panel: 'elements', group: 'Forms' },

  { key: 'image', label: 'Image', hint: 'Single image', panel: 'elements', group: 'Media' },
  { key: 'avatar', label: 'Avatar', hint: 'Round profile image', panel: 'elements', group: 'Media' },
  { key: 'logoStrip', label: 'Logo Strip', hint: 'Partner logo row', panel: 'elements', group: 'Media' },
  { key: 'videoFrame', label: 'Video Frame', hint: 'Play-card placeholder', panel: 'elements', group: 'Media' },
  { key: 'count', label: 'Count', hint: 'Animated number counter', panel: 'elements', group: 'Data' },
  { key: 'timerCount', label: 'Timer', hint: 'MM:SS timer stat', panel: 'elements', group: 'Data' },
  { key: 'compactCount', label: 'Compact Count', hint: 'Small KPI number', panel: 'elements', group: 'Data' },
  { key: 'milestoneCount', label: 'Milestone', hint: 'Goal progress stat', panel: 'elements', group: 'Data' },
  { key: 'badgeCount', label: 'Badge Count', hint: 'Pill percentage stat', panel: 'elements', group: 'Data' },
  { key: 'spotlightCount', label: 'Spotlight Count', hint: 'Large featured metric', panel: 'elements', group: 'Data' },

  { key: 'container', label: 'Container', hint: 'Basic wrapper block', panel: 'elements', group: 'Layout' },
  { key: 'section', label: 'Section', hint: 'Title + body section', panel: 'elements', group: 'Layout' },
  { key: 'flexRow', label: 'Flex Row', hint: 'Two-side row layout', panel: 'elements', group: 'Layout' },
  { key: 'stack', label: 'Stack', hint: 'Vertical content group', panel: 'elements', group: 'Layout' },
  { key: 'heroPanel', label: 'Hero Panel', hint: 'Dark hero shell', panel: 'elements', group: 'Layout' },
  { key: 'divider', label: 'Divider', hint: 'Horizontal line', panel: 'elements', group: 'Layout' },
  { key: 'notificationBar', label: 'Alert Bar', hint: 'Inline notice strip', panel: 'elements', group: 'Layout' },

  { key: 'card', label: 'Card', hint: 'Base content card', panel: 'elements', group: 'Cards' },
  { key: 'glassCard', label: 'Glass Card', hint: 'Soft translucent card', panel: 'elements', group: 'Cards' },
  { key: 'featureCard', label: 'Feature Card', hint: 'Icon-led feature card', panel: 'elements', group: 'Cards' },
  { key: 'statCard', label: 'Stat Card', hint: 'Metric presentation card', panel: 'elements', group: 'Cards' },
  { key: 'testimonialCard', label: 'Testimonial', hint: 'Quote testimonial card', panel: 'elements', group: 'Cards' },
  { key: 'pricingCard', label: 'Pricing Card', hint: 'Dark pricing card', panel: 'elements', group: 'Cards' },

  { key: 'square', label: 'Square', hint: 'Sharp shape block', panel: 'shapes', group: 'Shapes' },
  { key: 'roundedSquare', label: 'Rounded Square', hint: 'Soft-corner block', panel: 'shapes', group: 'Shapes' },
  { key: 'circle', label: 'Circle', hint: 'Perfect circle', panel: 'shapes', group: 'Shapes' },
  { key: 'pill', label: 'Pill', hint: 'Wide rounded shape', panel: 'shapes', group: 'Shapes' },
  { key: 'diamond', label: 'Diamond', hint: 'Geometric diamond', panel: 'shapes', group: 'Shapes' },
  { key: 'triangle', label: 'Triangle', hint: '3-point polygon', panel: 'shapes', group: 'Shapes' },
  { key: 'hexagon', label: 'Hexagon', hint: '6-edge polygon', panel: 'shapes', group: 'Shapes' },
  { key: 'octagon', label: 'Octagon', hint: '8-edge polygon', panel: 'shapes', group: 'Shapes' },
  { key: 'star', label: 'Star', hint: '10-point star shape', panel: 'shapes', group: 'Shapes' },
  { key: 'speechBubble', label: 'Speech Bubble', hint: 'Callout dialog shape', panel: 'shapes', group: 'Shapes' },
];

export function createTemplateFromStudioBlock(blockKey: StudioBlockKey): t.Template {
  const factory = BLOCK_CREATORS[blockKey];

  if (!factory) {
    return textNode('New block');
  }

  return factory();
}

export function createImageTemplateFromSource(src: string, alt?: string): t.Template {
  return t.tagTemplate({
    tag: 'img',
    props: {
      src: literal(src),
      alt: literal(alt || 'Library image'),
      className: literal('rounded-2xl object-cover'),
      style: objectStyle({
        display: 'block',
        width: '320px',
        aspectRatio: '16 / 10',
        objectFit: 'cover',
        maxWidth: '100%',
      }),
    },
    children: [],
  });
}
