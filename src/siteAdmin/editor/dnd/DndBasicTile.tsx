import { useDrag } from "react-dnd";
import { DND_TYPE, type DragItem } from "@/siteAdmin/editor/dnd/types";
import { BASIC_COMPONENT_LIBRARY, DND_PAYLOAD_SOURCES } from "@/siteAdmin/editor/rekaBlocks";

export default function DndBasicTile({
  blockKey,
  label,
  onClickAdd,
}: {
  blockKey: keyof typeof BASIC_COMPONENT_LIBRARY;
  label: string;
  onClickAdd?: () => void;
}) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DND_TYPE,
      item: { payload: { source: DND_PAYLOAD_SOURCES.BASIC, key: blockKey } } satisfies DragItem,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [blockKey]
  );

  return (
    <button
      ref={drag}
      type="button"
      onClick={onClickAdd}
      className={[
        "rounded-md border bg-white px-3 py-2 text-left text-sm hover:bg-slate-50 transition",
        isDragging ? "opacity-50" : "",
      ].join(" ")}
      title="Drag into canvas or click to add"
    >
      {label}
    </button>
  );
}
