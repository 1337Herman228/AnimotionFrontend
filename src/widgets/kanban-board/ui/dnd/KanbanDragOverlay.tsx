import { DragOverlay } from "@dnd-kit/core";
import { MemoizedColumn } from "../column/MemoizedColumn";
import { MemoizedCard } from "../card/MemoizedCard";
import { useDragAndDrop } from "@/features/drag-and-drop/model/context";
import { ColumnTypes } from "@/entities/column";
import { addCardsToColumns } from "@/features/drag-and-drop/lib/addCardsToColumns";

export const KanbanDragOverlay = () => {
    const { activeCard, cards, activeColumn } = useDragAndDrop();
    return (
        <DragOverlay>
            {activeColumn && (
                <MemoizedColumn
                    column={
                        addCardsToColumns(
                            activeColumn,
                            cards
                        ) as ColumnTypes.TColumnSchema
                    }
                    isOverlay
                />
            )}
            {activeCard && <MemoizedCard card={activeCard} isOverlay />}
        </DragOverlay>
    );
};
