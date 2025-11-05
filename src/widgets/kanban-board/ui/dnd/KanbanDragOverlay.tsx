import { DragOverlay } from "@dnd-kit/core";
import { useDndStore } from "@/features/drag-and-drop";
import { MemoizedColumn } from "../column/MemoizedColumn";
import { MemoizedCard } from "../card/MemoizedCard";
import { useMemo } from "react";

export const KanbanDragOverlay = () => {
    const { activeCard, getActiveColumnWithCards } = useDndStore();

    const activeColumn = useMemo(() => getActiveColumnWithCards(), []);

    return (
        <DragOverlay>
            {activeColumn && <MemoizedColumn column={activeColumn} isOverlay />}
            {activeCard && <MemoizedCard card={activeCard} isOverlay />}
        </DragOverlay>
    );
};
