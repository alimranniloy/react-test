import type { DragPayload } from "@/siteAdmin/editor/rekaBlocks";

export const DND_TYPE = "Box" as const;

export type DragItem = {
  payload: DragPayload;
};

