import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { arrayMove } from "@dnd-kit/sortable";
import { useMoveColumn } from "../api/useMoveColumn";
import { TColumnDragHandlers } from "./types";
import { useDndStore } from "./dnd-store";

export const useColumnDragHandlers = () => {
    const { columns, setColumns, setActiveColumn } = useDndStore();

    const { mutate: moveColumn } = useMoveColumn();

    const onDragStart = ({ active }: DragStartEvent) => {
        if (!active || active.data.current?.type !== "column") return;

        setActiveColumn(active.data.current.column);
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        setActiveColumn(null);

        if (!active || !over || active.data.current?.type !== "column") return;

        const activeColumnIndex = columns.findIndex((c) => c.id === active.id);
        const overColumnIndex = columns.findIndex((c) => c.id === over.id);

        if (activeColumnIndex === overColumnIndex) return;

        const updatedColumns = arrayMove(
            columns,
            activeColumnIndex,
            overColumnIndex
        );

        setColumns(updatedColumns);

        moveColumn({
            projectId: active.data.current.projectId,
            columnOrder: updatedColumns.map((c) => c.id),
        });
    };

    return { onDragStart, onDragEnd };
};
