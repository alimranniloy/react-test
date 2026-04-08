import {
  ArrowTopRightOnSquareIcon,
  ArrowUpTrayIcon,
  FilmIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import * as t from '@rekajs/types';
import * as React from 'react';

import { Select } from '@app/components/select';
import { Switch } from '@app/components/switch/Switch';
import { TextField } from '@app/components/text-field';
import {
  readPropBoolean,
  readPropLiteral,
  readStyleLiteral,
  setBooleanProp,
  setLiteralProp,
  setStyleLiteral,
} from '@app/components/editor-layout/component-settings/selected-template-controls/style-utils';
import { useEditor } from '@app/editor';
import { cn } from '@app/utils';

import { useTemplateMediaUpload } from './useTemplateMediaUpload';

type TemplateMediaFieldsProps = {
  template: t.TagTemplate;
  variant?: 'panel' | 'inspector';
};

const FIT_OPTIONS = [
  { value: '__default__', title: 'Default' },
  { value: 'cover', title: 'Cover' },
  { value: 'contain', title: 'Contain' },
  { value: 'fill', title: 'Fill' },
  { value: 'scale-down', title: 'Scale Down' },
  { value: 'none', title: 'None' },
];

const VIDEO_TOGGLE_FIELDS = [
  { key: 'controls', label: 'Show controls' },
  { key: 'autoplay', label: 'Autoplay' },
  { key: 'muted', label: 'Muted' },
  { key: 'loop', label: 'Loop' },
  { key: 'playsInline', label: 'Inline play' },
] as const;

export const TemplateMediaFields = (props: TemplateMediaFieldsProps) => {
  const editor = useEditor();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const { uploadFile, resetProgress, isUploading, progress, bytesLabel } =
    useTemplateMediaUpload();

  const isImage = props.template.tag === 'img';
  const isVideo = props.template.tag === 'video';

  if (!isImage && !isVideo) {
    return null;
  }

  const isPanel = props.variant !== 'inspector';
  const sourceValue = readPropLiteral(props.template, 'src');
  const fitValue = readStyleLiteral(props.template, 'objectFit') || '__default__';
  const fieldClassName = isPanel
    ? 'h-[42px] rounded-[14px] border-slate-200 bg-white'
    : 'h-10 rounded-[10px] border-slate-200 bg-white';
  const inputClassName = isPanel ? 'text-[11px] font-medium' : 'text-xs font-medium';
  const buttonClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-[10px] border px-3 text-xs font-semibold transition',
    isPanel
      ? 'h-[42px] border-slate-200 bg-slate-900 text-white hover:bg-slate-800'
      : 'h-10 border-slate-200 bg-slate-900 text-white hover:bg-slate-800'
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const uploadedUrl = await uploadFile(file);

    if (uploadedUrl) {
      setLiteralProp(editor, props.template, 'src', uploadedUrl);

      if (isImage) {
        const currentWidth = readStyleLiteral(props.template, 'width');
        const currentAspectRatio = readStyleLiteral(props.template, 'aspectRatio');

        if (!currentWidth) {
          setStyleLiteral(editor, props.template, 'width', '320px');
        }

        if (!currentAspectRatio) {
          setStyleLiteral(editor, props.template, 'aspectRatio', '16 / 10');
        }

        setStyleLiteral(editor, props.template, 'display', 'block');
        setStyleLiteral(editor, props.template, 'objectFit', 'cover');
        setStyleLiteral(editor, props.template, 'maxWidth', '100%');
      }

      if (isVideo) {
        const currentWidth = readStyleLiteral(props.template, 'width');
        const currentAspectRatio = readStyleLiteral(props.template, 'aspectRatio');

        if (!currentWidth) {
          setStyleLiteral(editor, props.template, 'width', '420px');
        }

        if (!currentAspectRatio) {
          setStyleLiteral(editor, props.template, 'aspectRatio', '16 / 9');
        }

        setStyleLiteral(editor, props.template, 'display', 'block');
        setStyleLiteral(editor, props.template, 'objectFit', 'cover');
        setStyleLiteral(editor, props.template, 'maxWidth', '100%');
      }
    }

    event.target.value = '';
  };

  const auxiliaryFieldLabel = isImage ? 'Alt text' : 'Poster URL';
  const auxiliaryFieldKey = isImage ? 'alt' : 'poster';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-500">
            {isImage ? (
              <PhotoIcon className="h-4 w-4" />
            ) : (
              <FilmIcon className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {isImage ? 'Image asset' : 'Video asset'}
            </div>
            <div className="truncate text-[12px] font-medium text-slate-700">
              {sourceValue || 'No media linked yet'}
            </div>
          </div>
        </div>
        {sourceValue ? (
          <button
            type="button"
            onClick={() => window.open(sourceValue, '_blank', 'noopener,noreferrer')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            title="Open current media"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <label className="block">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-slate-700">Media URL</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">link</span>
        </div>
        <TextField
          value={sourceValue}
          placeholder={isImage ? 'https://image-url...' : 'https://video-url...'}
          className={fieldClassName}
          inputClassName={inputClassName}
          onCommit={(value) => {
            resetProgress();
            setLiteralProp(editor, props.template, 'src', String(value ?? ''));
          }}
        />
      </label>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <button
          type="button"
          className={buttonClassName}
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          <ArrowUpTrayIcon className="h-4 w-4" />
          {isUploading ? 'Uploading...' : isImage ? 'Upload image' : 'Upload video'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={isImage ? 'image/*' : 'video/*'}
          className="hidden"
          onChange={handleUpload}
        />
        <div className="flex items-center rounded-[10px] border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-500">
          {isUploading ? `${progress}%` : 'Database save'}
        </div>
      </div>

      {(isUploading || progress > 0) && (
        <div className="rounded-[12px] border border-slate-200 bg-white p-2.5">
          <div className="flex items-center justify-between gap-3 text-[11px] font-medium text-slate-600">
            <span>{isUploading ? 'Uploading to media library' : 'Upload complete'}</span>
            <span>{bytesLabel || `${progress}%`}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-500 transition-all"
              style={{ width: `${Math.max(progress, 4)}%` }}
            />
          </div>
        </div>
      )}

      <label className="block">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-slate-700">{auxiliaryFieldLabel}</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            {isImage ? 'seo' : 'preview'}
          </span>
        </div>
        <TextField
          value={readPropLiteral(props.template, auxiliaryFieldKey)}
          placeholder={
            isImage ? 'Describe the image for accessibility' : 'https://poster-image...'
          }
          className={fieldClassName}
          inputClassName={inputClassName}
          onCommit={(value) =>
            setLiteralProp(
              editor,
              props.template,
              auxiliaryFieldKey,
              String(value ?? '')
            )
          }
        />
      </label>

      <label className="block">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-slate-700">Object fit</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">frame</span>
        </div>
        <Select
          className={cn('min-h-10 w-full', fieldClassName, 'text-[11px]')}
          items={FIT_OPTIONS}
          value={fitValue}
          onChange={(value) =>
            setStyleLiteral(
              editor,
              props.template,
              'objectFit',
              value === '__default__' ? '' : value
            )
          }
          placeholder="Choose fit"
        />
      </label>

      {isVideo ? (
        <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Playback
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {VIDEO_TOGGLE_FIELDS.map((item) => {
              const checked = readPropBoolean(props.template, item.key) === true;

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3 py-2"
                >
                  <span className="text-[11px] font-medium text-slate-700">{item.label}</span>
                  <Switch
                    checked={checked}
                    onChange={() =>
                      setBooleanProp(editor, props.template, item.key, !checked)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
