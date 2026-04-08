import { useEffect, useMemo, useState } from "react";

type UseRowSelectionOptions<T> = {
  rows: T[];
  getId: (row: T) => number;
};

export default function useRowSelection<T>({ rows, getId }: UseRowSelectionOptions<T>) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const rowIds = useMemo(() => rows.map(getId), [rows, getId]);

  useEffect(() => {
    const idSet = new Set(rowIds);
    setSelectedIds((prev) => prev.filter((id) => idSet.has(id)));
  }, [rowIds]);

  const allSelected = rowIds.length > 0 && selectedIds.length === rowIds.length;
  const indeterminate = selectedIds.length > 0 && selectedIds.length < rowIds.length;

  const toggleAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(rowIds);
  };

  const toggleOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((item) => item !== id);
    });
  };

  const clearSelection = () => setSelectedIds([]);

  return {
    selectedIds,
    setSelectedIds,
    allSelected,
    indeterminate,
    toggleAll,
    toggleOne,
    clearSelection
  };
}
