import { DragOverlay } from "@dnd-kit/core";
import { createPortal } from "react-dom";

import { useDragAndDrop } from "@/features/drag-and-drop";
import { MemoizedColumn } from "../column/MemoizedColumn";
import { MemoizedCard } from "../card/MemoizedCard";

export const KanbanDragOverlay = () => {
    const { activeCard, activeColumn } = useDragAndDrop();

    return createPortal(
        <DragOverlay>
            {activeColumn && <MemoizedColumn column={activeColumn} isOverlay />}
            {activeCard && <MemoizedCard card={activeCard} isOverlay />}
        </DragOverlay>,
        document.body
    );
};
