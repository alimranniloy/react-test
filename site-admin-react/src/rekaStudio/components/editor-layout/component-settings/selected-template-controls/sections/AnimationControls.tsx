import * as React from 'react';
import * as t from '@rekajs/types';

import { Select } from '@app/components/select';
import { useEditor } from '@app/editor';
import {
  formatAnimationTime,
  getStudioAnimationPreset,
  playStudioAnimation,
  STUDIO_ANIMATION_GROUPS,
  STUDIO_ANIMATION_PRESETS,
  STUDIO_ANIMATION_PROP_KEYS,
  STUDIO_ANIMATION_REPEAT_OPTIONS,
  STUDIO_ANIMATION_TRIGGER_OPTIONS,
  type StudioAnimationPreset,
} from '@app/animations/studioAnimations';

import { ControlCard } from '../controls/ControlCard';
import { ControlField } from '../controls/ControlField';
import { LengthStyleField } from '../controls/LengthStyleField';
import { SegmentedControl } from '../controls/SegmentedControl';
import { readPropLiteral } from '../style-utils';

type AnimationControlsProps = {
  template: t.TagTemplate;
};

const AnimationPreviewStage = ({ preset }: { preset: StudioAnimationPreset }) => {
  const gradientId = React.useId();
  const nodeRef = React.useRef<SVGGElement | null>(null);

  React.useEffect(() => {
    if (!nodeRef.current) {
      return;
    }

    const animation = playStudioAnimation(nodeRef.current, {
      preset: preset.key,
      trigger: 'load',
      durationMs: Math.max(1300, preset.defaultDurationMs + 300),
      delayMs: 0,
      iteration: 'infinite',
      easing: preset.easing,
    });

    return () => animation?.cancel();
  }, [preset]);

  return (
    <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-3">
      <svg viewBox="0 0 120 76" className="h-20 w-full">
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={preset.preview.accentFrom} />
            <stop offset="100%" stopColor={preset.preview.accentTo} />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="118"
          height="74"
          rx="18"
          fill="#ffffff"
          stroke="#e2e8f0"
        />
        <path
          d="M14 58 H106"
          stroke="#cbd5e1"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
        <path d="M14 18 H46" stroke="#dbeafe" strokeWidth="6" strokeLinecap="round" />
        <path d="M14 30 H78" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
        <path d="M14 42 H58" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />

        <g
          ref={nodeRef}
          style={{ transformBox: 'fill-box', transformOrigin: 'center center' }}
        >
          {preset.preview.shape === 'dot' ? (
            <circle cx="88" cy="32" r="11" fill={`url(#${gradientId})`} />
          ) : null}
          {preset.preview.shape === 'pill' ? (
            <rect
              x="74"
              y="22"
              width="30"
              height="20"
              rx="10"
              fill={`url(#${gradientId})`}
            />
          ) : null}
          {preset.preview.shape === 'diamond' ? (
            <rect
              x="78"
              y="22"
              width="22"
              height="22"
              rx="4"
              fill={`url(#${gradientId})`}
              transform="rotate(45 89 33)"
            />
          ) : null}
        </g>
      </svg>
    </div>
  );
};

const AnimationPresetCard = ({
  preset,
  active,
  onClick,
}: {
  preset: StudioAnimationPreset;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[18px] border p-2 text-left transition ${
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50'
      }`}
    >
      <AnimationPreviewStage preset={preset} />
      <div className="mt-2 px-1">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[12px] font-semibold">{preset.label}</div>
          <div
            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] ${
              active ? 'bg-white/10 text-white/75' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {preset.group}
          </div>
        </div>
        <div
          className={`mt-1 text-[10px] leading-4 ${
            active ? 'text-white/70' : 'text-slate-500'
          }`}
        >
          {preset.description}
        </div>
      </div>
    </button>
  );
};

export const AnimationControls = ({ template }: AnimationControlsProps) => {
  const editor = useEditor();

  const currentPresetKey = readPropLiteral(
    template,
    STUDIO_ANIMATION_PROP_KEYS.preset
  );
  const currentTrigger =
    readPropLiteral(template, STUDIO_ANIMATION_PROP_KEYS.trigger) || 'load';
  const currentDuration = readPropLiteral(
    template,
    STUDIO_ANIMATION_PROP_KEYS.duration
  );
  const currentDelay = readPropLiteral(template, STUDIO_ANIMATION_PROP_KEYS.delay);
  const currentIteration =
    readPropLiteral(template, STUDIO_ANIMATION_PROP_KEYS.iteration) || '1';
  const currentPreset =
    getStudioAnimationPreset(currentPresetKey) ?? STUDIO_ANIMATION_PRESETS[0];

  const applyAnimationPreset = React.useCallback(
    (preset: StudioAnimationPreset) => {
      editor.reka.change(() => {
        template.props[STUDIO_ANIMATION_PROP_KEYS.preset] = t.literal({
          value: preset.key,
        });

        if (!template.props[STUDIO_ANIMATION_PROP_KEYS.trigger]) {
          template.props[STUDIO_ANIMATION_PROP_KEYS.trigger] = t.literal({
            value: 'load',
          });
        }

        if (!template.props[STUDIO_ANIMATION_PROP_KEYS.duration]) {
          template.props[STUDIO_ANIMATION_PROP_KEYS.duration] = t.literal({
            value: formatAnimationTime(preset.defaultDurationMs),
          });
        }

        if (!template.props[STUDIO_ANIMATION_PROP_KEYS.delay]) {
          template.props[STUDIO_ANIMATION_PROP_KEYS.delay] = t.literal({
            value: '0ms',
          });
        }

        if (!template.props[STUDIO_ANIMATION_PROP_KEYS.iteration]) {
          template.props[STUDIO_ANIMATION_PROP_KEYS.iteration] = t.literal({
            value: '1',
          });
        }
      });
    },
    [editor, template]
  );

  const setAnimationProp = React.useCallback(
    (key: string, value: string) => {
      editor.reka.change(() => {
        if (!value.trim()) {
          delete template.props[key];
          return;
        }

        template.props[key] = t.literal({ value });
      });
    },
    [editor, template]
  );

  const clearAnimation = React.useCallback(() => {
    editor.reka.change(() => {
      delete template.props[STUDIO_ANIMATION_PROP_KEYS.preset];
      delete template.props[STUDIO_ANIMATION_PROP_KEYS.trigger];
      delete template.props[STUDIO_ANIMATION_PROP_KEYS.duration];
      delete template.props[STUDIO_ANIMATION_PROP_KEYS.delay];
      delete template.props[STUDIO_ANIMATION_PROP_KEYS.iteration];
    });
  }, [editor, template]);

  return (
    <ControlCard
      eyebrow="Animation"
      title="Live motion presets"
      description="Choose an animation, trigger it on load, hover or click, and preview the motion directly from this panel."
    >
      <div className="rounded-[18px] border border-slate-200 bg-[linear-gradient(140deg,#ffffff_0%,#f8fafc_45%,#eff6ff_100%)] p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Applied Animation
            </div>
            <div className="mt-1 text-[15px] font-semibold text-slate-900">
              {currentPresetKey ? currentPreset.label : 'No animation selected'}
            </div>
            <div className="mt-1 text-[11px] leading-5 text-slate-500">
              {currentPresetKey
                ? `${currentTrigger} trigger • ${currentDuration || formatAnimationTime(currentPreset.defaultDurationMs)} • ${currentIteration === 'infinite' ? 'looping' : `${currentIteration}x repeat`}`
                : 'Pick any preset below to make the selected text, image, button or container animate.'}
            </div>
          </div>
          <button
            type="button"
            onClick={clearAnimation}
            className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            Reset
          </button>
        </div>

        <div className="mt-3">
          <AnimationPreviewStage preset={currentPreset} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <ControlField label="Trigger" hint="when">
          <SegmentedControl
            value={currentTrigger}
            items={STUDIO_ANIMATION_TRIGGER_OPTIONS.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            onChange={(value) =>
              setAnimationProp(STUDIO_ANIMATION_PROP_KEYS.trigger, value)
            }
          />
        </ControlField>

        <div className="grid grid-cols-2 gap-3">
          <LengthStyleField
            label="Duration"
            value={currentDuration}
            placeholder={formatAnimationTime(currentPreset.defaultDurationMs)}
            badge="time"
            onCommit={(value) =>
              setAnimationProp(STUDIO_ANIMATION_PROP_KEYS.duration, value)
            }
          />
          <LengthStyleField
            label="Delay"
            value={currentDelay}
            placeholder="0ms"
            badge="wait"
            onCommit={(value) =>
              setAnimationProp(STUDIO_ANIMATION_PROP_KEYS.delay, value)
            }
          />
        </div>

        <ControlField label="Repeat" hint="loop">
          <Select
            className="min-h-[42px] w-full rounded-[14px] border-slate-200 bg-white text-[11px]"
            items={STUDIO_ANIMATION_REPEAT_OPTIONS.map((item) => ({
              value: item.value,
              title: item.title,
            }))}
            value={currentIteration}
            onChange={(value) =>
              setAnimationProp(STUDIO_ANIMATION_PROP_KEYS.iteration, value)
            }
            placeholder="Select repeat"
          />
        </ControlField>
      </div>

      <div className="space-y-3">
        {STUDIO_ANIMATION_GROUPS.map((group) => (
          <div
            key={group}
            className="rounded-[18px] border border-slate-200 bg-white p-3"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-[12px] font-semibold text-slate-900">
                {group}
              </div>
              <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {
                  STUDIO_ANIMATION_PRESETS.filter(
                    (preset) => preset.group === group
                  ).length
                }{' '}
                styles
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STUDIO_ANIMATION_PRESETS.filter(
                (preset) => preset.group === group
              ).map((preset) => (
                <AnimationPresetCard
                  key={preset.key}
                  preset={preset}
                  active={currentPresetKey === preset.key}
                  onClick={() => applyAnimationPreset(preset)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ControlCard>
  );
};
