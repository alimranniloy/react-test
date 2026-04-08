import * as t from '@rekajs/types';

import { Select } from '@app/components/select';
import { Switch } from '@app/components/switch/Switch';
import { TextField } from '@app/components/text-field';
import {
  STUDIO_COUNT_DECIMALS_PROP,
  STUDIO_COUNT_DURATION_PROP,
  STUDIO_COUNT_FORMAT_PROP,
  STUDIO_COUNT_FROM_PROP,
  STUDIO_COUNT_PART_PROP,
  STUDIO_COUNT_PREFIX_PROP,
  STUDIO_COUNT_SEPARATOR_PROP,
  STUDIO_COUNT_SUFFIX_PROP,
  STUDIO_COUNT_TO_PROP,
} from '@app/components/studioBlocks/constants';
import { useEditor } from '@app/editor';

import { ControlCard } from '../controls/ControlCard';
import { ControlField } from '../controls/ControlField';
import { readLiteralString, readPropLiteral } from '../style-utils';
import {
  findCountLabelTemplate,
  findCountMetaTemplate,
  findCountValueTemplates,
} from '../studioBlockTemplateUtils';

type CountControlsProps = {
  template: t.TagTemplate | null;
};

type CountFormat = 'number' | 'mm:ss' | 'hh:mm:ss';
type CountPart = 'hours' | 'minutes' | 'seconds';

const COUNT_FORMAT_ITEMS = [
  { value: 'number', title: 'Number' },
  { value: 'mm:ss', title: 'MM:SS' },
  { value: 'hh:mm:ss', title: 'HH:MM:SS' },
] as const;

const writeTextTemplateValue = (template: t.TagTemplate | null, value: string) => {
  if (!template) {
    return;
  }

  const currentText = template.children[0];

  if (currentText instanceof t.TagTemplate && currentText.tag === 'text') {
    currentText.props.value = t.literal({ value });
    return;
  }

  template.children.splice(
    0,
    template.children.length,
    t.tagTemplate({
      tag: 'text',
      props: {
        value: t.literal({ value }),
      },
      children: [],
    })
  );
};

const setTextTemplateValue = (
  editor: ReturnType<typeof useEditor>,
  template: t.TagTemplate | null,
  value: string
) => {
  if (!template) {
    return;
  }

  editor.reka.change(() => {
    writeTextTemplateValue(template, value);
  });
};

const setLiteralPropOnTemplates = (
  editor: ReturnType<typeof useEditor>,
  templates: t.TagTemplate[],
  key: string,
  value: string
) => {
  editor.reka.change(() => {
    templates.forEach((template) => {
      if (!value.trim()) {
        delete template.props[key];
        return;
      }

      template.props[key] = t.literal({ value });
    });
  });
};

const readTextTemplateValue = (template: t.TagTemplate | null) => {
  if (!template) {
    return '';
  }

  const firstChild = template.children[0];

  if (!(firstChild instanceof t.TagTemplate) || firstChild.tag !== 'text') {
    return '';
  }

  return readLiteralString(firstChild.props.value);
};

const parseNumber = (value: string, fallback: number) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readFormatValue = (value: string): CountFormat => {
  if (value === 'mm:ss' || value === 'hh:mm:ss') {
    return value;
  }

  return 'number';
};

const readCountPartValue = (value: string): CountPart | null => {
  if (value === 'hours' || value === 'minutes' || value === 'seconds') {
    return value;
  }

  return null;
};

const formatTimerValue = (value: number, format: Exclude<CountFormat, 'number'>) => {
  const totalSeconds = Math.max(0, Math.round(value));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (format === 'hh:mm:ss') {
    return [hours, minutes, seconds]
      .map((part) => String(part).padStart(2, '0'))
      .join(':');
  }

  return [Math.floor(totalSeconds / 60), seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
};

const formatTimerParts = (value: number) => {
  const totalSeconds = Math.max(0, Math.round(value));

  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
    seconds: String(totalSeconds % 60).padStart(2, '0'),
  } satisfies Record<CountPart, string>;
};

const formatCounterPreview = (
  from: string,
  to: string,
  prefix: string,
  suffix: string,
  decimals: string,
  separator: boolean,
  format: CountFormat
) => {
  const numericValue = parseNumber(to, parseNumber(from, 0));

  if (format !== 'number') {
    return `${prefix}${formatTimerValue(numericValue, format)}${suffix}`;
  }

  const fractionDigits = Math.max(0, Math.min(4, Number.parseInt(decimals, 10) || 0));
  const formatted = separator
    ? new Intl.NumberFormat(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(numericValue)
    : numericValue.toFixed(fractionDigits);

  return `${prefix}${formatted}${suffix}`;
};

const formatDurationMeta = (duration: string) => {
  const durationMs = Math.max(0, Number.parseInt(duration, 10) || 0);
  return `Animates in ${(durationMs / 1000).toFixed(durationMs >= 1000 ? 1 : 2)}s`;
};

const readEnabled = (template: t.TagTemplate, key: string, fallback = true) => {
  const raw = readPropLiteral(template, key).trim().toLowerCase();

  if (!raw) {
    return fallback;
  }

  return raw === 'true' || raw === '1' || raw === 'yes';
};

export const CountControls = (props: CountControlsProps) => {
  const editor = useEditor();

  if (!props.template) {
    return null;
  }

  const valueTemplates = findCountValueTemplates(props.template);
  const valueTemplate = valueTemplates[0] ?? null;
  const labelTemplate = findCountLabelTemplate(props.template);
  const metaTemplate = findCountMetaTemplate(props.template);
  const segmentedTimerTemplates = valueTemplates.filter((template) =>
    Boolean(readCountPartValue(readPropLiteral(template, STUDIO_COUNT_PART_PROP)))
  );
  const isSegmentedTimer = segmentedTimerTemplates.length >= 2;
  const editableValueTemplates = isSegmentedTimer
    ? segmentedTimerTemplates
    : valueTemplate
      ? [valueTemplate]
      : [];

  if (!valueTemplate || editableValueTemplates.length === 0) {
    return null;
  }

  const fromValue = readPropLiteral(valueTemplate, STUDIO_COUNT_FROM_PROP) || '0';
  const toValue = readPropLiteral(valueTemplate, STUDIO_COUNT_TO_PROP) || '1280';
  const durationValue =
    readPropLiteral(valueTemplate, STUDIO_COUNT_DURATION_PROP) || '2400';
  const prefixValue = readPropLiteral(valueTemplate, STUDIO_COUNT_PREFIX_PROP);
  const suffixValue = readPropLiteral(valueTemplate, STUDIO_COUNT_SUFFIX_PROP) || '+';
  const decimalsValue =
    readPropLiteral(valueTemplate, STUDIO_COUNT_DECIMALS_PROP) || '0';
  const formatValue = readFormatValue(
    readPropLiteral(valueTemplate, STUDIO_COUNT_FORMAT_PROP)
  );
  const separatorEnabled = readEnabled(
    valueTemplate,
    STUDIO_COUNT_SEPARATOR_PROP,
    true
  );

  const syncPreview = (
    nextFrom = fromValue,
    nextTo = toValue,
    nextPrefix = prefixValue,
    nextSuffix = suffixValue,
    nextDecimals = decimalsValue,
    nextSeparator = separatorEnabled,
    nextDuration = durationValue,
    nextFormat = formatValue
  ) => {
    editor.reka.change(() => {
      if (isSegmentedTimer) {
        const timerParts = formatTimerParts(
          parseNumber(nextTo, parseNumber(nextFrom, 0))
        );

        segmentedTimerTemplates.forEach((template) => {
          const part = readCountPartValue(
            readPropLiteral(template, STUDIO_COUNT_PART_PROP)
          );

          if (part) {
            writeTextTemplateValue(template, timerParts[part]);
          }
        });
      } else {
        writeTextTemplateValue(
          valueTemplate,
          formatCounterPreview(
            nextFrom,
            nextTo,
            nextPrefix,
            nextSuffix,
            nextDecimals,
            nextSeparator,
            nextFormat
          )
        );
      }

      writeTextTemplateValue(metaTemplate, formatDurationMeta(nextDuration));
    });
  };

  if (isSegmentedTimer) {
    return (
      <ControlCard
        eyebrow="Timer"
        title="Split countdown"
        description="This preset renders plain hours, minutes and seconds without any outer block."
      >
        <div className="grid grid-cols-2 gap-3">
          <ControlField label="Start Seconds" hint="sec">
            <TextField
              value={fromValue}
              placeholder="0"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) => {
                const nextValue = String(value ?? '0');
                setLiteralPropOnTemplates(
                  editor,
                  editableValueTemplates,
                  STUDIO_COUNT_FROM_PROP,
                  nextValue
                );
                syncPreview(nextValue);
              }}
            />
          </ControlField>
          <ControlField label="Target Seconds" hint="sec">
            <TextField
              value={toValue}
              placeholder="37244"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) => {
                const nextValue = String(value ?? '37244');
                setLiteralPropOnTemplates(
                  editor,
                  editableValueTemplates,
                  STUDIO_COUNT_TO_PROP,
                  nextValue
                );
                syncPreview(fromValue, nextValue);
              }}
            />
          </ControlField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ControlField label="Duration" hint="ms">
            <TextField
              value={durationValue}
              placeholder="1600"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) => {
                const nextValue = String(value ?? '1600');
                setLiteralPropOnTemplates(
                  editor,
                  editableValueTemplates,
                  STUDIO_COUNT_DURATION_PROP,
                  nextValue
                );
                syncPreview(
                  fromValue,
                  toValue,
                  prefixValue,
                  suffixValue,
                  decimalsValue,
                  separatorEnabled,
                  nextValue,
                  formatValue
                );
              }}
            />
          </ControlField>
          <div className="rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[11px] font-medium text-slate-700">Display</div>
            <div className="mt-1 text-[10px] leading-4 text-slate-500">
              The timer stays split as `hours / min / sec` and uses the total
              seconds you enter above.
            </div>
          </div>
        </div>
      </ControlCard>
    );
  }

  return (
    <>
      <ControlCard
        eyebrow="Count"
        title="Number animation"
        description="Set the start value, target, duration and formatted output for the live counter."
      >
        <div className="grid grid-cols-2 gap-3">
          <ControlField label="Start Value" hint="from">
            <TextField
              value={fromValue}
              placeholder="0"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) => {
                const nextValue = String(value ?? '0');
                setLiteralPropOnTemplates(
                  editor,
                  editableValueTemplates,
                  STUDIO_COUNT_FROM_PROP,
                  nextValue
                );
                syncPreview(nextValue);
              }}
            />
          </ControlField>
          <ControlField label="Target Value" hint="to">
            <TextField
              value={toValue}
              placeholder="1280"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) => {
                const nextValue = String(value ?? '1280');
                setLiteralPropOnTemplates(
                  editor,
                  editableValueTemplates,
                  STUDIO_COUNT_TO_PROP,
                  nextValue
                );
                syncPreview(fromValue, nextValue);
              }}
            />
          </ControlField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ControlField label="Duration" hint="ms">
            <TextField
              value={durationValue}
              placeholder="2400"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) => {
                const nextValue = String(value ?? '2400');
                setLiteralPropOnTemplates(
                  editor,
                  editableValueTemplates,
                  STUDIO_COUNT_DURATION_PROP,
                  nextValue
                );
                syncPreview(
                  fromValue,
                  toValue,
                  prefixValue,
                  suffixValue,
                  decimalsValue,
                  separatorEnabled,
                  nextValue,
                  formatValue
                );
              }}
            />
          </ControlField>
          <div>
            <div className="mb-1.5 text-[11px] font-medium text-slate-700">Format</div>
            <Select
              className="min-h-[42px] w-full rounded-[14px] border-slate-200 bg-white text-[11px]"
              items={COUNT_FORMAT_ITEMS.map((item) => ({
                value: item.value,
                title: item.title,
              }))}
              value={formatValue}
              onChange={(value) => {
                const nextValue = readFormatValue(value);
                setLiteralPropOnTemplates(
                  editor,
                  editableValueTemplates,
                  STUDIO_COUNT_FORMAT_PROP,
                  nextValue
                );
                syncPreview(
                  fromValue,
                  toValue,
                  prefixValue,
                  suffixValue,
                  decimalsValue,
                  separatorEnabled,
                  durationValue,
                  nextValue
                );
              }}
              placeholder="Choose format"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ControlField label="Decimals" hint="0-4">
            <TextField
              value={decimalsValue}
              placeholder="0"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) => {
                const nextValue = String(value ?? '0');
                setLiteralPropOnTemplates(
                  editor,
                  editableValueTemplates,
                  STUDIO_COUNT_DECIMALS_PROP,
                  nextValue
                );
                syncPreview(
                  fromValue,
                  toValue,
                  prefixValue,
                  suffixValue,
                  nextValue,
                  separatorEnabled,
                  durationValue,
                  formatValue
                );
              }}
            />
          </ControlField>
          <div className="rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[11px] font-medium text-slate-700">Timer formats</div>
            <div className="mt-1 text-[10px] leading-4 text-slate-500">
              Use total seconds in Start and Target when format is set to MM:SS or
              HH:MM:SS.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ControlField label="Prefix" hint="before">
            <TextField
              value={prefixValue}
              placeholder="$"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) => {
                const nextValue = String(value ?? '');
                setLiteralPropOnTemplates(
                  editor,
                  editableValueTemplates,
                  STUDIO_COUNT_PREFIX_PROP,
                  nextValue
                );
                syncPreview(
                  fromValue,
                  toValue,
                  nextValue,
                  suffixValue,
                  decimalsValue,
                  separatorEnabled,
                  durationValue,
                  formatValue
                );
              }}
            />
          </ControlField>
          <ControlField label="Suffix" hint="after">
            <TextField
              value={suffixValue}
              placeholder="+"
              className="h-[42px] rounded-[14px] border-slate-200 bg-white"
              inputClassName="text-[11px] font-medium"
              onCommit={(value) => {
                const nextValue = String(value ?? '');
                setLiteralPropOnTemplates(
                  editor,
                  editableValueTemplates,
                  STUDIO_COUNT_SUFFIX_PROP,
                  nextValue
                );
                syncPreview(
                  fromValue,
                  toValue,
                  prefixValue,
                  nextValue,
                  decimalsValue,
                  separatorEnabled,
                  durationValue,
                  formatValue
                );
              }}
            />
          </ControlField>
        </div>

        <div className="flex items-center justify-between rounded-[12px] border border-slate-200 bg-white px-3 py-2">
          <div>
            <div className="text-[11px] font-medium text-slate-700">Thousands separator</div>
            <div className="mt-0.5 text-[10px] text-slate-400">
              Format values like 12,800 instead of 12800
            </div>
          </div>
          <Switch
            checked={separatorEnabled}
            onChange={() => {
              const nextValue = separatorEnabled ? 'false' : 'true';
              setLiteralPropOnTemplates(
                editor,
                editableValueTemplates,
                STUDIO_COUNT_SEPARATOR_PROP,
                nextValue
              );
              syncPreview(
                fromValue,
                toValue,
                prefixValue,
                suffixValue,
                decimalsValue,
                !separatorEnabled,
                durationValue,
                formatValue
              );
            }}
          />
        </div>
      </ControlCard>

      <ControlCard
        eyebrow="Copy"
        title="Label and helper text"
        description="Keep the count title and the timing note aligned with the current animation."
      >
        <ControlField label="Label" hint="caption">
          <TextField
            value={readTextTemplateValue(labelTemplate)}
            placeholder="Projects launched"
            className="h-[42px] rounded-[14px] border-slate-200 bg-white"
            inputClassName="text-[11px] font-medium"
            onCommit={(value) =>
              setTextTemplateValue(editor, labelTemplate, String(value ?? ''))
            }
          />
        </ControlField>
        <ControlField label="Helper Text" hint="meta">
          <TextField
            value={readTextTemplateValue(metaTemplate)}
            placeholder="Animates in 2.4s"
            className="h-[42px] rounded-[14px] border-slate-200 bg-white"
            inputClassName="text-[11px] font-medium"
            onCommit={(value) =>
              setTextTemplateValue(editor, metaTemplate, String(value ?? ''))
            }
          />
        </ControlField>
      </ControlCard>
    </>
  );
};
