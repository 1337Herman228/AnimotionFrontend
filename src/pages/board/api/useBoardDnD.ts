import { useBoardStore } from "@/shared/stores/boardStore";
import { IBoardColumn, ICard } from "@/types";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";

export const useBoardDnD = () => {
    const [activeCard, setActiveCard] = useState<ICard | null>(null);
    const [activeColumn, setActiveColumn] = useState<IBoardColumn | null>(null);

    const {
        handleDragStart: storeDragStart,
        handleCardDragEnd,
        handleColumnDragEnd,
    } = useBoardStore();

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Card") {
            setActiveCard(event.active.data.current.card);
        }
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
        }
        storeDragStart(event);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCard(null);
        setActiveColumn(null);

        if (event.active.data.current?.type === "Column") {
            handleColumnDragEnd(event);
        }
        if (event.active.data.current?.type === "Card") {
            handleCardDragEnd(event);
        }
    };

    return { activeCard, activeColumn, handleDragStart, handleDragEnd };
};
