import { useDrag } from 'react-dnd';
import * as React from 'react';

import { SettingSection } from '@app/components/settings-section';
import { cn } from '@app/utils';

import {
  STUDIO_BLOCK_ITEM_TYPE,
  STUDIO_BLOCKS,
  type StudioBlockDefinition,
  type StudioAssetPanel,
  type StudioDragItem,
} from './blockPresets';
import { QuickBlocksGroup } from './QuickBlocksGroup';
import { QuickBlocksReadyComponents } from './QuickBlocksReadyComponents';
import { QuickBlocksImageLibrary } from './QuickBlocksImageLibrary';

const SHAPE_PREVIEW_STYLES: Record<string, React.CSSProperties> = {
  square: { width: 34, height: 34, background: '#2563eb' },
  roundedSquare: {
    width: 34,
    height: 34,
    background: '#0ea5e9',
    borderRadius: 10,
  },
  circle: {
    width: 34,
    height: 34,
    background: '#22c55e',
    borderRadius: 999,
  },
  pill: {
    width: 52,
    height: 26,
    background: '#f97316',
    borderRadius: 999,
  },
  diamond: {
    width: 36,
    height: 36,
    background: '#8b5cf6',
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  },
  triangle: {
    width: 38,
    height: 34,
    background: '#ef4444',
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  },
  hexagon: {
    width: 42,
    height: 34,
    background: '#14b8a6',
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  },
  octagon: {
    width: 36,
    height: 36,
    background: '#ec4899',
    clipPath:
      'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  },
  star: {
    width: 40,
    height: 40,
    background: '#eab308',
    clipPath:
      'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  },
  speechBubble: {
    width: 46,
    height: 34,
    background: '#6366f1',
    clipPath:
      'polygon(0% 0%, 100% 0%, 100% 78%, 58% 78%, 42% 100%, 42% 78%, 0% 78%)',
  },
};

const ShapePreview = ({ blockKey }: { blockKey: string }) => {
  return (
    <div className="flex h-16 items-center justify-center rounded-[16px] border border-dashed border-slate-200 bg-white">
      <div style={SHAPE_PREVIEW_STYLES[blockKey]} />
    </div>
  );
};

const ElementPreview = ({ block }: { block: StudioBlockDefinition }) => {
  return (
    <div className="rounded-[16px] border border-slate-200 bg-white px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {block.group}
      </div>
      <div className="mt-2 space-y-1">
        <div className="h-2.5 w-3/4 rounded-full bg-slate-900/85" />
        <div className="h-2.5 w-full rounded-full bg-slate-200" />
        <div className="h-2.5 w-2/3 rounded-full bg-slate-200" />
      </div>
    </div>
  );
};

const DraggableBlockCard = ({ block }: { block: StudioBlockDefinition }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: STUDIO_BLOCK_ITEM_TYPE,
      item: {
        kind: 'block',
        blockKey: block.key,
      } satisfies StudioDragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [block.key]
  );

  const isShape = block.panel === 'shapes';

  return (
    <button
      ref={drag}
      type="button"
      className={cn(
        'rounded-[18px] border border-slate-200 bg-slate-50/70 p-2.5 text-left transition hover:border-sky-300 hover:bg-sky-50',
        {
          'opacity-40': isDragging,
        }
      )}
    >
      {isShape ? <ShapePreview blockKey={block.key} /> : <ElementPreview block={block} />}
      <div className="mt-2 px-1">
        <div className="text-[12px] font-semibold text-slate-900">
          {block.label}
        </div>
        <div className="mt-0.5 text-[11px] leading-5 text-slate-500">
          {block.hint}
        </div>
      </div>
    </button>
  );
};

const PANEL_ITEMS: Array<{ value: StudioAssetPanel; label: string; hint: string }> = [
  { value: 'elements', label: 'Elements', hint: '30+ content blocks' },
  { value: 'shapes', label: 'Shapes', hint: '10 editable shapes' },
  { value: 'images', label: 'Images', hint: 'Free stock library' },
  { value: 'components', label: 'Components', hint: 'Database library' },
];

export const QuickBlocksPalette = () => {
  const [activePanel, setActivePanel] =
    React.useState<StudioAssetPanel>('elements');

  const visibleBlocks = React.useMemo(
    () =>
      STUDIO_BLOCKS.filter(
        (block) => activePanel !== 'images' && block.panel === activePanel
      ),
    [activePanel]
  );

  const groupedBlocks = React.useMemo(() => {
    return visibleBlocks.reduce<Record<string, StudioBlockDefinition[]>>(
      (acc, block) => {
        acc[block.group] = [...(acc[block.group] ?? []), block];
        return acc;
      },
      {}
    );
  }, [visibleBlocks]);

  return (
    <SettingSection
      title="Quick Blocks"
      info="Drag preset elements directly into the preview canvas"
      collapsedOnInitial={false}
    >
      <div className="rounded-[18px] border border-slate-200 bg-white p-2">
        <div className="grid grid-cols-2 gap-2">
          {PANEL_ITEMS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setActivePanel(item.value)}
              className={cn(
                'rounded-[14px] border px-3 py-2 text-left transition',
                activePanel === item.value
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              )}
            >
              <div className="text-[12px] font-semibold">{item.label}</div>
              <div
                className={cn('mt-0.5 text-[10px]', {
                  'text-white/70': activePanel === item.value,
                  'text-slate-400': activePanel !== item.value,
                })}
              >
                {item.hint}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {activePanel === 'images' ? (
          <QuickBlocksImageLibrary />
        ) : activePanel === 'components' ? (
          <QuickBlocksReadyComponents />
        ) : (
          Object.entries(groupedBlocks).map(([group, blocks], index) => (
            <QuickBlocksGroup
              key={group}
              title={group}
              count={blocks.length}
              defaultOpen={index === 0}
            >
              <div className="grid grid-cols-2 gap-2">
                {blocks.map((block) => (
                  <DraggableBlockCard key={block.key} block={block} />
                ))}
              </div>
            </QuickBlocksGroup>
          ))
        )}
      </div>

      <div className="mt-3 rounded-[16px] border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-[11px] leading-5 text-slate-500">
        Drop blocks on the preview canvas, then use the left styling panel for
        color, font, radius, rotate, shape styling and more.
      </div>
    </SettingSection>
  );
};
