import * as React from 'react';
import * as t from '@rekajs/types';

import { EditorMode } from '@app/editor/Editor';
import { cn } from '@app/utils';
import {
  STUDIO_COUNT_DECIMALS_PROP,
  STUDIO_COUNT_FROM_PROP,
  STUDIO_COUNT_FORMAT_PROP,
  STUDIO_COUNT_PART_PROP,
  STUDIO_COUNT_PREFIX_PROP,
  STUDIO_COUNT_SEPARATOR_PROP,
  STUDIO_COUNT_SUFFIX_PROP,
  STUDIO_COUNT_TO_PROP,
  STUDIO_COUNT_DURATION_PROP,
  STUDIO_COUNT_VALUE_MARKER_PROP,
  STUDIO_SLIDER_AUTOPLAY_PROP,
  STUDIO_SLIDER_INTERVAL_PROP,
  STUDIO_SLIDER_LOOP_PROP,
  STUDIO_SLIDER_MARKER_PROP,
  STUDIO_SLIDER_SHOW_ARROWS_PROP,
  STUDIO_SLIDER_SHOW_DOTS_PROP,
  STUDIO_SLIDER_TRANSITION_PROP,
} from '@app/components/studioBlocks/constants';

type StudioInteractiveRenderProps = {
  tag: string;
  rawProps: Record<string, unknown>;
  baseElementProps: Record<string, unknown>;
  view: t.TagView;
  editorMode?: EditorMode;
  renderView: (view: t.View) => React.ReactNode;
};

type CountFormat = 'number' | 'mm:ss' | 'hh:mm:ss';
type CountPart = 'hours' | 'minutes' | 'seconds';

const readStringProp = (props: Record<string, unknown>, key: string) => {
  const value = props[key];

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
};

const readBooleanProp = (
  props: Record<string, unknown>,
  key: string,
  fallback = false
) => {
  const value = readStringProp(props, key).trim().toLowerCase();

  if (!value) {
    return fallback;
  }

  return value === 'true' || value === '1' || value === 'yes';
};

const readNumberProp = (
  props: Record<string, unknown>,
  key: string,
  fallback: number
) => {
  const parsed = Number.parseFloat(readStringProp(props, key));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clampIndex = (value: number, length: number) => {
  if (length <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(length - 1, value));
};

const readCountFormat = (props: Record<string, unknown>) => {
  const value = readStringProp(props, STUDIO_COUNT_FORMAT_PROP);

  if (value === 'mm:ss' || value === 'hh:mm:ss') {
    return value;
  }

  return 'number';
};

const readCountPart = (props: Record<string, unknown>) => {
  const value = readStringProp(props, STUDIO_COUNT_PART_PROP);

  if (value === 'hours' || value === 'minutes' || value === 'seconds') {
    return value;
  }

  return null;
};

const formatTimerValue = (value: number, format: Exclude<CountFormat, 'number'>) => {
  const sign = value < 0 ? '-' : '';
  const totalSeconds = Math.max(0, Math.round(Math.abs(value)));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (format === 'hh:mm:ss') {
    return `${sign}${[hours, minutes, seconds]
      .map((part) => String(part).padStart(2, '0'))
      .join(':')}`;
  }

  return `${sign}${[Math.floor(totalSeconds / 60), seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')}`;
};

const formatTimerPartValue = (value: number, part: CountPart) => {
  const totalSeconds = Math.max(0, Math.round(Math.abs(value)));

  if (part === 'hours') {
    return String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  }

  if (part === 'minutes') {
    return String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  }

  return String(totalSeconds % 60).padStart(2, '0');
};

const formatCounterValue = (
  value: number,
  prefix: string,
  suffix: string,
  decimals: number,
  separator: boolean,
  format: CountFormat,
  part: CountPart | null
) => {
  if (part) {
    return `${prefix}${formatTimerPartValue(value, part)}${suffix}`;
  }

  if (format !== 'number') {
    return `${prefix}${formatTimerValue(value, format)}${suffix}`;
  }

  const formatted = separator
    ? new Intl.NumberFormat(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)
    : value.toFixed(decimals);

  return `${prefix}${formatted}${suffix}`;
};

const StudioSliderRuntime = ({
  tag,
  baseElementProps,
  childViews,
  rawProps,
  editorMode,
  renderView,
}: {
  tag: string;
  baseElementProps: Record<string, unknown>;
  childViews: t.View[];
  rawProps: Record<string, unknown>;
  editorMode?: EditorMode;
  renderView: (view: t.View) => React.ReactNode;
}) => {
  const slideCount = childViews.length;
  const autoplay = readBooleanProp(rawProps, STUDIO_SLIDER_AUTOPLAY_PROP, true);
  const loop = readBooleanProp(rawProps, STUDIO_SLIDER_LOOP_PROP, true);
  const showArrows = readBooleanProp(
    rawProps,
    STUDIO_SLIDER_SHOW_ARROWS_PROP,
    true
  );
  const showDots = readBooleanProp(rawProps, STUDIO_SLIDER_SHOW_DOTS_PROP, true);
  const intervalMs = Math.max(
    800,
    readNumberProp(rawProps, STUDIO_SLIDER_INTERVAL_PROP, 3200)
  );
  const transitionMs = Math.max(
    120,
    readNumberProp(rawProps, STUDIO_SLIDER_TRANSITION_PROP, 700)
  );
  const allowOverlayInteraction =
    editorMode === undefined || editorMode === EditorMode.Preview;
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    setActiveIndex((current) => clampIndex(current, slideCount));
  }, [slideCount]);

  React.useEffect(() => {
    if (!autoplay || slideCount <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= slideCount - 1) {
          return loop ? 0 : current;
        }

        return current + 1;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [autoplay, intervalMs, loop, slideCount]);

  const moveToSlide = (index: number) => {
    setActiveIndex(clampIndex(index, slideCount));
  };

  const moveBy = (delta: number) => {
    setActiveIndex((current) => {
      const nextIndex = current + delta;

      if (nextIndex < 0) {
        return loop ? slideCount - 1 : 0;
      }

      if (nextIndex >= slideCount) {
        return loop ? 0 : slideCount - 1;
      }

      return nextIndex;
    });
  };

  return React.createElement(
    tag,
    baseElementProps,
    <>
      <div className="relative h-full w-full">
        {childViews.map((child, index) => (
          <div
            key={child.id}
            className={cn(
              'absolute inset-0 h-full w-full transition-all ease-out',
              index === activeIndex
                ? 'translate-x-0 opacity-100'
                : 'pointer-events-none translate-x-4 opacity-0'
            )}
            style={{ transitionDuration: `${transitionMs}ms` }}
            aria-hidden={index !== activeIndex}
          >
            {renderView(child)}
          </div>
        ))}
      </div>

      {showArrows && slideCount > 1 ? (
        <>
          <button
            type="button"
            className={cn(
              'absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white backdrop-blur-sm transition',
              allowOverlayInteraction ? 'cursor-pointer hover:bg-black/60' : 'pointer-events-none'
            )}
            onClick={(event) => {
              event.stopPropagation();
              moveBy(-1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className={cn(
              'absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white backdrop-blur-sm transition',
              allowOverlayInteraction ? 'cursor-pointer hover:bg-black/60' : 'pointer-events-none'
            )}
            onClick={(event) => {
              event.stopPropagation();
              moveBy(1);
            }}
          >
            ›
          </button>
        </>
      ) : null}

      {showDots && slideCount > 1 ? (
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
          {childViews.map((child, index) => (
            <button
              key={child.id}
              type="button"
              className={cn(
                'h-2 rounded-full bg-white/55 transition',
                index === activeIndex ? 'w-7 bg-white' : 'w-2 hover:bg-white/80',
                allowOverlayInteraction ? 'cursor-pointer' : 'pointer-events-none'
              )}
              onClick={(event) => {
                event.stopPropagation();
                moveToSlide(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </>
  );
};

const StudioCountValueRuntime = ({
  tag,
  baseElementProps,
  rawProps,
}: {
  tag: string;
  baseElementProps: Record<string, unknown>;
  rawProps: Record<string, unknown>;
}) => {
  const from = readNumberProp(rawProps, STUDIO_COUNT_FROM_PROP, 0);
  const to = readNumberProp(rawProps, STUDIO_COUNT_TO_PROP, from);
  const durationMs = Math.max(
    0,
    readNumberProp(rawProps, STUDIO_COUNT_DURATION_PROP, 2400)
  );
  const decimals = Math.max(
    0,
    Math.min(4, Math.round(readNumberProp(rawProps, STUDIO_COUNT_DECIMALS_PROP, 0)))
  );
  const prefix = readStringProp(rawProps, STUDIO_COUNT_PREFIX_PROP);
  const suffix = readStringProp(rawProps, STUDIO_COUNT_SUFFIX_PROP);
  const separator = readBooleanProp(rawProps, STUDIO_COUNT_SEPARATOR_PROP, true);
  const format = readCountFormat(rawProps);
  const part = readCountPart(rawProps);
  const [displayValue, setDisplayValue] = React.useState(from);

  React.useEffect(() => {
    if (durationMs <= 0 || from === to) {
      setDisplayValue(to);
      return undefined;
    }

    let frameId = 0;
    const start = window.performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.max(0, Math.min(1, elapsed / durationMs));
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(from + (to - from) * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [decimals, durationMs, format, from, part, prefix, separator, suffix, to]);

  return React.createElement(
    tag,
    baseElementProps,
    formatCounterValue(
      displayValue,
      prefix,
      suffix,
      decimals,
      separator,
      format,
      part
    )
  );
};

export const renderStudioInteractiveBlock = (
  props: StudioInteractiveRenderProps
) => {
  if (readBooleanProp(props.rawProps, STUDIO_SLIDER_MARKER_PROP)) {
    return (
      <StudioSliderRuntime
        tag={props.tag}
        baseElementProps={props.baseElementProps}
        childViews={props.view.children}
        rawProps={props.rawProps}
        editorMode={props.editorMode}
        renderView={props.renderView}
      />
    );
  }

  if (readBooleanProp(props.rawProps, STUDIO_COUNT_VALUE_MARKER_PROP)) {
    return (
      <StudioCountValueRuntime
        tag={props.tag}
        baseElementProps={props.baseElementProps}
        rawProps={props.rawProps}
      />
    );
  }

  return null;
};
