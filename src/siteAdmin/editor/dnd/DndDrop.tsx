import { useDrop } from "react-dnd";
import { DND_TYPE, type DragItem } from "@/siteAdmin/editor/dnd/types";
import type { DropMeta } from "@/siteAdmin/editor/rekaBlocks";

export default function DndDrop({
  dropMeta,
  label = "Drag and drop here",
  className = "",
  onDropped,
}: {
  dropMeta: DropMeta;
  label?: string;
  className?: string;
  onDropped?: (item: DragItem, meta: DropMeta) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: DND_TYPE,
    drop: (item: DragItem) => {
      onDropped?.(item, dropMeta);
      return dropMeta;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [dropMeta, onDropped]);

  const active = canDrop && isOver;

  return (
    <div
      ref={drop}
      className={[
        "h-10 w-full text-center flex items-center justify-center border-2 border-dashed rounded-md transition",
        active
          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
          : canDrop
            ? "border-amber-500 bg-amber-50 text-amber-700"
            : "border-slate-200 bg-slate-50 text-slate-400",
        className,
      ].join(" ")}
    >
      {active ? "Release to drop" : label}
    </div>
  );
}

