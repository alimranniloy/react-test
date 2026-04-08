import { useDrag } from "react-dnd";
import { DND_TYPE, type DragItem } from "@/siteAdmin/editor/dnd/types";
import { DND_PAYLOAD_SOURCES } from "@/siteAdmin/editor/rekaBlocks";

export default function DndDbComponentTile({
  id,
  title,
  image,
  onClickAdd,
}: {
  id: number;
  title: string;
  image?: string | null;
  onClickAdd?: () => void;
}) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DND_TYPE,
      item: { payload: { source: DND_PAYLOAD_SOURCES.COMPONENT, id, title } } satisfies DragItem,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [id, title]
  );

  return (
    <button
      ref={drag}
      type="button"
      onClick={onClickAdd}
      className={[
        "relative h-24 w-full overflow-hidden rounded-md border-2 border-transparent bg-slate-50 transition-all hover:-translate-y-0.5 hover:border-slate-300 text-left",
        isDragging ? "opacity-50" : "",
      ].join(" ")}
      title="Drag into canvas or click to add"
    >
      {image ? (
        <img
          src={image}
          className="h-full w-full object-contain bg-white"
          alt={title}
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
          No image
        </div>
      )}
      <span className="absolute right-0 bottom-2 rounded-l-sm bg-rose-400 px-2 py-1 text-[10px] text-white">
        {title}
      </span>
    </button>
  );
}

