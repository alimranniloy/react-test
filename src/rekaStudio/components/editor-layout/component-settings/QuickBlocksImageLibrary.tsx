import { useDrag } from 'react-dnd';
import * as React from 'react';

import { cn } from '@app/utils';

import {
  STUDIO_BLOCK_ITEM_TYPE,
  type StudioDragItem,
} from './blockPresets';

type PicsumItem = {
  id: string;
  author: string;
  download_url: string;
};

const IMAGE_COUNT = 18;

const DraggableSliderCard = () => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: STUDIO_BLOCK_ITEM_TYPE,
      item: {
        kind: 'block',
        blockKey: 'slider',
      } satisfies StudioDragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  return (
    <button
      ref={drag}
      type="button"
      className={cn(
        'overflow-hidden rounded-[18px] border border-slate-200 bg-white text-left transition hover:border-sky-300 hover:bg-sky-50',
        {
          'opacity-40': isDragging,
        }
      )}
    >
      <div className="relative h-28 overflow-hidden bg-slate-950">
        <div
          className="absolute inset-y-3 left-3 w-[42%] rounded-[14px] bg-cover bg-center opacity-90"
          style={{ backgroundImage: 'url(https://picsum.photos/id/1015/480/320)' }}
        />
        <div
          className="absolute inset-y-5 left-[31%] w-[42%] rounded-[14px] bg-cover bg-center opacity-80"
          style={{ backgroundImage: 'url(https://picsum.photos/id/1025/480/320)' }}
        />
        <div
          className="absolute inset-y-3 right-3 w-[42%] rounded-[14px] bg-cover bg-center"
          style={{ backgroundImage: 'url(https://picsum.photos/id/1035/480/320)' }}
        />
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          <span className="h-1.5 w-5 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="text-[11px] font-semibold text-slate-900">
          Image Slider
        </div>
        <div className="mt-0.5 text-[10px] text-slate-400">
          Drag a ready carousel with dummy images
        </div>
      </div>
    </button>
  );
};

const DraggableImageCard = ({ item }: { item: PicsumItem }) => {
  const previewSrc = `https://picsum.photos/id/${item.id}/320/220`;
  const dropSrc = `https://picsum.photos/id/${item.id}/1200/800`;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: STUDIO_BLOCK_ITEM_TYPE,
      item: {
        kind: 'image',
        imageSrc: dropSrc,
        imageAlt: `Photo by ${item.author}`,
      } satisfies StudioDragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [dropSrc, item.author]
  );

  return (
    <button
      ref={drag}
      type="button"
      className={cn(
        'overflow-hidden rounded-[18px] border border-slate-200 bg-white text-left transition hover:border-sky-300 hover:bg-sky-50',
        {
          'opacity-40': isDragging,
        }
      )}
    >
      <img
        src={previewSrc}
        alt={item.author}
        className="h-28 w-full object-cover"
        loading="lazy"
      />
      <div className="px-3 py-2">
        <div className="text-[11px] font-semibold text-slate-900">
          {item.author}
        </div>
        <div className="mt-0.5 text-[10px] text-slate-400">
          Drag to drop this image
        </div>
      </div>
    </button>
  );
};

export const QuickBlocksImageLibrary = () => {
  const [items, setItems] = React.useState<PicsumItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(
          `https://picsum.photos/v2/list?page=2&limit=${IMAGE_COUNT}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Image library failed (${response.status})`);
        }

        const data = (await response.json()) as PicsumItem[];
        setItems(data);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError((err as Error).message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-6 text-center text-[11px] text-slate-500">
        Loading free image library...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-6 text-center text-[11px] text-rose-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-[11px] leading-5 text-slate-500">
        Free images powered by Lorem Picsum. Drag a single image or use the
        slider preset to drop a fully editable carousel with dummy photos.
      </div>
      <div className="grid grid-cols-1 gap-2">
        <DraggableSliderCard />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <DraggableImageCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
