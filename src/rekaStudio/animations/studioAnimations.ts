export type StudioAnimationTrigger = 'load' | 'hover' | 'click';
export type StudioAnimationIteration = '1' | '2' | '3' | 'infinite';

export const STUDIO_ANIMATION_PROP_KEYS = {
  preset: 'dataStudioAnimation',
  trigger: 'dataStudioAnimationTrigger',
  duration: 'dataStudioAnimationDuration',
  delay: 'dataStudioAnimationDelay',
  iteration: 'dataStudioAnimationIteration',
} as const;

export type StudioAnimationPreviewSpec = {
  accentFrom: string;
  accentTo: string;
  shape: 'dot' | 'pill' | 'diamond';
};

export type StudioAnimationPreset = {
  key: string;
  label: string;
  group: string;
  description: string;
  defaultDurationMs: number;
  easing: string;
  keyframes: Keyframe[];
  preview: StudioAnimationPreviewSpec;
};

export type StudioAnimationConfig = {
  preset: string;
  trigger: StudioAnimationTrigger;
  durationMs: number;
  delayMs: number;
  iteration: StudioAnimationIteration;
  easing: string;
};

const translateFrames = (
  x: number,
  y: number,
  options?: {
    scaleFrom?: number;
    scaleTo?: number;
    rotateFrom?: number;
    opacityFrom?: number;
    filterFrom?: string;
  }
): Keyframe[] => [
  {
    opacity: options?.opacityFrom ?? 0,
    transform: `translate3d(${x}px, ${y}px, 0) scale(${options?.scaleFrom ?? 1}) rotate(${options?.rotateFrom ?? 0}deg)`,
    filter: options?.filterFrom,
  },
  {
    opacity: 1,
    transform: `translate3d(0, 0, 0) scale(${options?.scaleTo ?? 1}) rotate(0deg)`,
    filter: 'blur(0px)',
  },
];

const loopFrames = (frames: Keyframe[]): Keyframe[] => frames;

const bounceFrames = (axis: 'x' | 'y'): Keyframe[] => {
  const translate = (value: number) =>
    axis === 'x'
      ? `translate3d(${value}px, 0, 0)`
      : `translate3d(0, ${value}px, 0)`;

  return [
    { transform: translate(0) },
    { transform: translate(axis === 'x' ? -10 : -16), offset: 0.3 },
    { transform: translate(axis === 'x' ? 6 : 10), offset: 0.58 },
    { transform: translate(axis === 'x' ? -2 : -4), offset: 0.78 },
    { transform: translate(0), offset: 1 },
  ];
};

const PRESETS: StudioAnimationPreset[] = [
  {
    key: 'fade-up',
    label: 'Fade Up',
    group: 'Entrance',
    description: 'Soft rise from below with opacity.',
    defaultDurationMs: 650,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: translateFrames(0, 30),
    preview: { accentFrom: '#0f172a', accentTo: '#38bdf8', shape: 'pill' },
  },
  {
    key: 'fade-down',
    label: 'Fade Down',
    group: 'Entrance',
    description: 'Slides down into place.',
    defaultDurationMs: 650,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: translateFrames(0, -30),
    preview: { accentFrom: '#1d4ed8', accentTo: '#60a5fa', shape: 'pill' },
  },
  {
    key: 'fade-left',
    label: 'Fade Left',
    group: 'Entrance',
    description: 'Slides in from the right edge.',
    defaultDurationMs: 680,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: translateFrames(26, 0),
    preview: { accentFrom: '#0f766e', accentTo: '#2dd4bf', shape: 'pill' },
  },
  {
    key: 'fade-right',
    label: 'Fade Right',
    group: 'Entrance',
    description: 'Slides in from the left edge.',
    defaultDurationMs: 680,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: translateFrames(-26, 0),
    preview: { accentFrom: '#ca8a04', accentTo: '#facc15', shape: 'pill' },
  },
  {
    key: 'zoom-in',
    label: 'Zoom In',
    group: 'Entrance',
    description: 'Scales into view with subtle fade.',
    defaultDurationMs: 620,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    keyframes: translateFrames(0, 0, { scaleFrom: 0.72 }),
    preview: { accentFrom: '#7c3aed', accentTo: '#c084fc', shape: 'dot' },
  },
  {
    key: 'zoom-out',
    label: 'Zoom Out',
    group: 'Entrance',
    description: 'Starts large and settles naturally.',
    defaultDurationMs: 700,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: translateFrames(0, 0, { scaleFrom: 1.24 }),
    preview: { accentFrom: '#be123c', accentTo: '#fb7185', shape: 'dot' },
  },
  {
    key: 'blur-in',
    label: 'Blur In',
    group: 'Entrance',
    description: 'Sharpens from a blurred entrance.',
    defaultDurationMs: 720,
    easing: 'ease-out',
    keyframes: translateFrames(0, 18, { filterFrom: 'blur(10px)' }),
    preview: { accentFrom: '#0f172a', accentTo: '#94a3b8', shape: 'diamond' },
  },
  {
    key: 'rotate-in',
    label: 'Rotate In',
    group: 'Entrance',
    description: 'Angular entry for badges and stickers.',
    defaultDurationMs: 720,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    keyframes: translateFrames(0, 0, { scaleFrom: 0.88, rotateFrom: -18 }),
    preview: { accentFrom: '#0f766e', accentTo: '#5eead4', shape: 'diamond' },
  },
  {
    key: 'pop-in',
    label: 'Pop In',
    group: 'Entrance',
    description: 'Fast scale overshoot for CTA moments.',
    defaultDurationMs: 540,
    easing: 'ease-out',
    keyframes: [
      { opacity: 0, transform: 'scale(0.65)' },
      { opacity: 1, transform: 'scale(1.08)', offset: 0.65 },
      { opacity: 1, transform: 'scale(1)' },
    ],
    preview: { accentFrom: '#0f172a', accentTo: '#818cf8', shape: 'dot' },
  },
  {
    key: 'swing-in',
    label: 'Swing In',
    group: 'Entrance',
    description: 'Subtle pendulum-style entrance.',
    defaultDurationMs: 840,
    easing: 'ease-out',
    keyframes: [
      { opacity: 0, transform: 'rotate(-18deg) translate3d(-8px, -10px, 0)' },
      {
        opacity: 1,
        transform: 'rotate(10deg) translate3d(0, 0, 0)',
        offset: 0.55,
      },
      { opacity: 1, transform: 'rotate(-6deg)', offset: 0.78 },
      { opacity: 1, transform: 'rotate(0deg)' },
    ],
    preview: { accentFrom: '#7c2d12', accentTo: '#fb923c', shape: 'diamond' },
  },
  {
    key: 'slide-up',
    label: 'Slide Up',
    group: 'Motion',
    description: 'Strong vertical travel.',
    defaultDurationMs: 700,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: translateFrames(0, 48, { opacityFrom: 1 }),
    preview: { accentFrom: '#0f172a', accentTo: '#38bdf8', shape: 'pill' },
  },
  {
    key: 'slide-down',
    label: 'Slide Down',
    group: 'Motion',
    description: 'Strong downward travel.',
    defaultDurationMs: 700,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: translateFrames(0, -48, { opacityFrom: 1 }),
    preview: { accentFrom: '#1e3a8a', accentTo: '#60a5fa', shape: 'pill' },
  },
  {
    key: 'slide-left',
    label: 'Slide Left',
    group: 'Motion',
    description: 'Horizontal travel from right.',
    defaultDurationMs: 730,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: translateFrames(52, 0, { opacityFrom: 1 }),
    preview: { accentFrom: '#14532d', accentTo: '#4ade80', shape: 'pill' },
  },
  {
    key: 'slide-right',
    label: 'Slide Right',
    group: 'Motion',
    description: 'Horizontal travel from left.',
    defaultDurationMs: 730,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: translateFrames(-52, 0, { opacityFrom: 1 }),
    preview: { accentFrom: '#854d0e', accentTo: '#facc15', shape: 'pill' },
  },
  {
    key: 'bounce',
    label: 'Bounce',
    group: 'Motion',
    description: 'Vertical bounce for playful emphasis.',
    defaultDurationMs: 900,
    easing: 'ease-out',
    keyframes: bounceFrames('y'),
    preview: { accentFrom: '#7c3aed', accentTo: '#a78bfa', shape: 'dot' },
  },
  {
    key: 'pulse',
    label: 'Pulse',
    group: 'Motion',
    description: 'Subtle scale pulse for live indicators.',
    defaultDurationMs: 1100,
    easing: 'ease-in-out',
    keyframes: loopFrames([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1.08)', opacity: 0.88, offset: 0.5 },
      { transform: 'scale(1)', opacity: 1 },
    ]),
    preview: { accentFrom: '#be123c', accentTo: '#fb7185', shape: 'dot' },
  },
  {
    key: 'heartbeat',
    label: 'Heartbeat',
    group: 'Motion',
    description: 'Double beat pop for alerts and badges.',
    defaultDurationMs: 1100,
    easing: 'ease-in-out',
    keyframes: loopFrames([
      { transform: 'scale(1)' },
      { transform: 'scale(1.08)', offset: 0.18 },
      { transform: 'scale(1)', offset: 0.3 },
      { transform: 'scale(1.16)', offset: 0.5 },
      { transform: 'scale(1)', offset: 0.72 },
      { transform: 'scale(1)' },
    ]),
    preview: { accentFrom: '#991b1b', accentTo: '#f87171', shape: 'dot' },
  },
  {
    key: 'float',
    label: 'Float',
    group: 'Motion',
    description: 'Gentle up-down float for decorative pieces.',
    defaultDurationMs: 1800,
    easing: 'ease-in-out',
    keyframes: loopFrames([
      { transform: 'translate3d(0, 0, 0)' },
      { transform: 'translate3d(0, -10px, 0)', offset: 0.5 },
      { transform: 'translate3d(0, 0, 0)' },
    ]),
    preview: { accentFrom: '#0f172a', accentTo: '#22d3ee', shape: 'diamond' },
  },
  {
    key: 'drift',
    label: 'Drift',
    group: 'Motion',
    description: 'Soft lateral motion with micro-rotation.',
    defaultDurationMs: 1900,
    easing: 'ease-in-out',
    keyframes: loopFrames([
      { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
      {
        transform: 'translate3d(10px, -4px, 0) rotate(3deg)',
        offset: 0.45,
      },
      {
        transform: 'translate3d(-6px, 4px, 0) rotate(-2deg)',
        offset: 0.78,
      },
      { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
    ]),
    preview: { accentFrom: '#164e63', accentTo: '#67e8f9', shape: 'diamond' },
  },
  {
    key: 'spotlight',
    label: 'Spotlight',
    group: 'Motion',
    description: 'Opacity and brightness sweep.',
    defaultDurationMs: 1250,
    easing: 'ease-in-out',
    keyframes: loopFrames([
      { opacity: 0.72, filter: 'brightness(0.9)' },
      { opacity: 1, filter: 'brightness(1.18)', offset: 0.45 },
      { opacity: 0.82, filter: 'brightness(0.96)' },
    ]),
    preview: { accentFrom: '#0f172a', accentTo: '#f8fafc', shape: 'pill' },
  },
  {
    key: 'wiggle',
    label: 'Wiggle',
    group: 'Emphasis',
    description: 'Quick side-to-side rotation.',
    defaultDurationMs: 820,
    easing: 'ease-in-out',
    keyframes: loopFrames([
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-8deg)', offset: 0.2 },
      { transform: 'rotate(6deg)', offset: 0.4 },
      { transform: 'rotate(-4deg)', offset: 0.6 },
      { transform: 'rotate(2deg)', offset: 0.8 },
      { transform: 'rotate(0deg)' },
    ]),
    preview: { accentFrom: '#7c2d12', accentTo: '#fb923c', shape: 'diamond' },
  },
  {
    key: 'shake-x',
    label: 'Shake X',
    group: 'Emphasis',
    description: 'Horizontal shake for warnings or errors.',
    defaultDurationMs: 700,
    easing: 'ease-in-out',
    keyframes: bounceFrames('x'),
    preview: { accentFrom: '#7f1d1d', accentTo: '#fca5a5', shape: 'pill' },
  },
  {
    key: 'shake-y',
    label: 'Shake Y',
    group: 'Emphasis',
    description: 'Vertical shake for playful notices.',
    defaultDurationMs: 700,
    easing: 'ease-in-out',
    keyframes: bounceFrames('y'),
    preview: { accentFrom: '#7f1d1d', accentTo: '#fdba74', shape: 'pill' },
  },
  {
    key: 'jello',
    label: 'Jello',
    group: 'Emphasis',
    description: 'Squishy skew response.',
    defaultDurationMs: 920,
    easing: 'ease-out',
    keyframes: loopFrames([
      { transform: 'skew(0deg, 0deg)' },
      { transform: 'skew(-12deg, -6deg)', offset: 0.3 },
      { transform: 'skew(8deg, 4deg)', offset: 0.5 },
      { transform: 'skew(-4deg, -2deg)', offset: 0.72 },
      { transform: 'skew(0deg, 0deg)' },
    ]),
    preview: { accentFrom: '#4c1d95', accentTo: '#c084fc', shape: 'diamond' },
  },
  {
    key: 'rubber-band',
    label: 'Rubber Band',
    group: 'Emphasis',
    description: 'Stretch and snap back.',
    defaultDurationMs: 960,
    easing: 'ease-out',
    keyframes: loopFrames([
      { transform: 'scale3d(1, 1, 1)' },
      { transform: 'scale3d(1.16, 0.84, 1)', offset: 0.3 },
      { transform: 'scale3d(0.9, 1.1, 1)', offset: 0.56 },
      { transform: 'scale3d(1.04, 0.96, 1)', offset: 0.78 },
      { transform: 'scale3d(1, 1, 1)' },
    ]),
    preview: { accentFrom: '#0f172a', accentTo: '#818cf8', shape: 'pill' },
  },
  {
    key: 'flip-x',
    label: 'Flip X',
    group: 'Emphasis',
    description: 'Front-to-back flip along the X axis.',
    defaultDurationMs: 820,
    easing: 'ease-out',
    keyframes: loopFrames([
      { transform: 'perspective(420px) rotateX(0deg)' },
      { transform: 'perspective(420px) rotateX(86deg)', offset: 0.5 },
      { transform: 'perspective(420px) rotateX(0deg)' },
    ]),
    preview: { accentFrom: '#1e3a8a', accentTo: '#60a5fa', shape: 'diamond' },
  },
  {
    key: 'flip-y',
    label: 'Flip Y',
    group: 'Emphasis',
    description: 'Left-right 3D flip for visual cards.',
    defaultDurationMs: 820,
    easing: 'ease-out',
    keyframes: loopFrames([
      { transform: 'perspective(420px) rotateY(0deg)' },
      { transform: 'perspective(420px) rotateY(86deg)', offset: 0.5 },
      { transform: 'perspective(420px) rotateY(0deg)' },
    ]),
    preview: { accentFrom: '#065f46', accentTo: '#34d399', shape: 'diamond' },
  },
  {
    key: 'skew-in',
    label: 'Skew In',
    group: 'Emphasis',
    description: 'Skewed entrance for energetic headlines.',
    defaultDurationMs: 760,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: [
      { opacity: 0, transform: 'translate3d(-18px, 0, 0) skewX(14deg)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0) skewX(0deg)' },
    ],
    preview: { accentFrom: '#7c2d12', accentTo: '#fdba74', shape: 'pill' },
  },
  {
    key: 'sweep-rotate',
    label: 'Sweep Rotate',
    group: 'Emphasis',
    description: 'Curved rotation sweep into place.',
    defaultDurationMs: 860,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    keyframes: [
      {
        opacity: 0,
        transform: 'translate3d(-22px, 16px, 0) rotate(-42deg) scale(0.92)',
      },
      {
        opacity: 1,
        transform: 'translate3d(10px, -4px, 0) rotate(8deg)',
        offset: 0.65,
      },
      { opacity: 1, transform: 'translate3d(0, 0, 0) rotate(0deg)' },
    ],
    preview: { accentFrom: '#4c1d95', accentTo: '#c084fc', shape: 'diamond' },
  },
  {
    key: 'breathe',
    label: 'Breathe',
    group: 'Emphasis',
    description: 'Slow calm pulse for subtle attention.',
    defaultDurationMs: 2200,
    easing: 'ease-in-out',
    keyframes: loopFrames([
      { transform: 'scale(1)', opacity: 0.96 },
      { transform: 'scale(1.05)', opacity: 1, offset: 0.5 },
      { transform: 'scale(1)', opacity: 0.96 },
    ]),
    preview: { accentFrom: '#0f172a', accentTo: '#38bdf8', shape: 'dot' },
  },
  {
    key: 'glide-in',
    label: 'Glide In',
    group: 'Entrance',
    description: 'Longer smooth glide for hero content.',
    defaultDurationMs: 900,
    easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
    keyframes: [
      { opacity: 0, transform: 'translate3d(0, 68px, 0) scale(0.98)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
    ],
    preview: { accentFrom: '#0f172a', accentTo: '#2dd4bf', shape: 'pill' },
  },
  {
    key: 'drum-roll',
    label: 'Drum Roll',
    group: 'Motion',
    description: 'Tiny repeated rotation build-up.',
    defaultDurationMs: 980,
    easing: 'ease-in-out',
    keyframes: loopFrames([
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-12deg)', offset: 0.2 },
      { transform: 'rotate(12deg)', offset: 0.4 },
      { transform: 'rotate(-8deg)', offset: 0.6 },
      { transform: 'rotate(8deg)', offset: 0.8 },
      { transform: 'rotate(0deg)' },
    ]),
    preview: { accentFrom: '#111827', accentTo: '#f59e0b', shape: 'diamond' },
  },
  {
    key: 'lift',
    label: 'Lift',
    group: 'Motion',
    description: 'Slight rise with shadow-style emphasis.',
    defaultDurationMs: 700,
    easing: 'ease-out',
    keyframes: loopFrames([
      {
        transform: 'translate3d(0, 0, 0) scale(1)',
        filter: 'brightness(1)',
      },
      {
        transform: 'translate3d(0, -10px, 0) scale(1.02)',
        filter: 'brightness(1.04)',
        offset: 0.55,
      },
      {
        transform: 'translate3d(0, 0, 0) scale(1)',
        filter: 'brightness(1)',
      },
    ]),
    preview: { accentFrom: '#0f172a', accentTo: '#38bdf8', shape: 'pill' },
  },
  {
    key: 'compress',
    label: 'Compress',
    group: 'Emphasis',
    description: 'Quick compress-release for tactile click feel.',
    defaultDurationMs: 520,
    easing: 'ease-out',
    keyframes: loopFrames([
      { transform: 'scale(1)' },
      { transform: 'scale(0.92)', offset: 0.35 },
      { transform: 'scale(1.02)', offset: 0.7 },
      { transform: 'scale(1)' },
    ]),
    preview: { accentFrom: '#7c2d12', accentTo: '#f97316', shape: 'dot' },
  },
];

export const STUDIO_ANIMATION_PRESETS = PRESETS;
export const STUDIO_ANIMATION_GROUPS = Array.from(
  new Set(PRESETS.map((preset) => preset.group))
);

export const STUDIO_ANIMATION_TRIGGER_OPTIONS = [
  { value: 'load', label: 'On Load' },
  { value: 'hover', label: 'On Hover' },
  { value: 'click', label: 'On Click' },
] as const;

export const STUDIO_ANIMATION_REPEAT_OPTIONS = [
  { value: '1', title: '1x' },
  { value: '2', title: '2x' },
  { value: '3', title: '3x' },
  { value: 'infinite', title: 'Infinite' },
] as const;

export const getStudioAnimationPreset = (key: string) =>
  PRESETS.find((preset) => preset.key === key) ?? null;

const parseAnimationTime = (value: string, fallbackMs: number) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return fallbackMs;
  }

  if (/ms$/i.test(trimmed)) {
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : fallbackMs;
  }

  if (/s$/i.test(trimmed)) {
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed * 1000 : fallbackMs;
  }

  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : fallbackMs;
};

export const formatAnimationTime = (valueMs: number) => {
  if (valueMs % 1000 === 0) {
    return `${valueMs / 1000}s`;
  }

  if (valueMs >= 1000) {
    return `${(valueMs / 1000).toFixed(1)}s`;
  }

  return `${Math.round(valueMs)}ms`;
};

export const readStudioAnimationConfig = (
  props: Record<string, unknown>
): StudioAnimationConfig | null => {
  const presetKey = String(
    props[STUDIO_ANIMATION_PROP_KEYS.preset] ?? ''
  ).trim();

  if (!presetKey) {
    return null;
  }

  const preset = getStudioAnimationPreset(presetKey);

  if (!preset) {
    return null;
  }

  const trigger = String(
    props[STUDIO_ANIMATION_PROP_KEYS.trigger] ?? 'load'
  ) as StudioAnimationTrigger;
  const iteration = String(
    props[STUDIO_ANIMATION_PROP_KEYS.iteration] ?? '1'
  ) as StudioAnimationIteration;

  return {
    preset: preset.key,
    trigger: trigger === 'hover' || trigger === 'click' ? trigger : 'load',
    durationMs: parseAnimationTime(
      String(props[STUDIO_ANIMATION_PROP_KEYS.duration] ?? ''),
      preset.defaultDurationMs
    ),
    delayMs: parseAnimationTime(
      String(props[STUDIO_ANIMATION_PROP_KEYS.delay] ?? ''),
      0
    ),
    iteration:
      iteration === '2' || iteration === '3' || iteration === 'infinite'
        ? iteration
        : '1',
    easing: preset.easing,
  };
};

export const omitStudioAnimationProps = (props: Record<string, unknown>) => {
  const next = { ...props };

  delete next[STUDIO_ANIMATION_PROP_KEYS.preset];
  delete next[STUDIO_ANIMATION_PROP_KEYS.trigger];
  delete next[STUDIO_ANIMATION_PROP_KEYS.duration];
  delete next[STUDIO_ANIMATION_PROP_KEYS.delay];
  delete next[STUDIO_ANIMATION_PROP_KEYS.iteration];

  return next;
};

const resolveIterations = (iteration: StudioAnimationIteration) => {
  if (iteration === 'infinite') {
    return Infinity;
  }

  return Number.parseInt(iteration, 10) || 1;
};

export const playStudioAnimation = (
  target: Element,
  config: StudioAnimationConfig
) => {
  const preset = getStudioAnimationPreset(config.preset);

  if (!preset || typeof target.animate !== 'function') {
    return null;
  }

  return target.animate(preset.keyframes, {
    duration: config.durationMs,
    delay: config.delayMs,
    easing: config.easing,
    iterations: resolveIterations(config.iteration),
    fill: 'both',
  });
};
