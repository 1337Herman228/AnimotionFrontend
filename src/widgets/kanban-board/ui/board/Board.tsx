import { DragAndDropProvider } from "@/features/drag-and-drop";
import React from "react";
import { ColumnList } from "../column/ColumnList";
import { KanbanDragOverlay } from "../dnd/KanbanDragOverlay";
import { useQuery } from "@tanstack/react-query";

const Board = () => {
    const {
        data: board,
        isPending,
        isError,
        error,
    } = useQuery({
        ...boardQueries.detail(boardId),
        retry: 1,
    });

    return (
        <DragAndDropProvider initialColumns={board.columns}>
            <ColumnList />
            <KanbanDragOverlay />
        </DragAndDropProvider>
    );
};

export default Board;
