import { DragAndDropProvider } from "@/features/drag-and-drop";
import React from "react";
import { ColumnList } from "../column/ColumnList";
import { KanbanDragOverlay } from "../dnd/KanbanDragOverlay";
import { useQuery } from "@tanstack/react-query";
import { boardQueries } from "@/entities/board";
import { useParams } from "next/navigation";
import ScreenLoading from "@/shared/ui/screen-loading";
import useWebsocket from "@/features/drag-and-drop/model/useWebsocket";
import { TestDialog } from "./test";

export const Board = () => {
    const params = useParams();
    const boardId = params?.boardId as string;

    const { data: board, isPending } = useQuery({
        ...boardQueries.byId(boardId),
    });

    useWebsocket();

    if (isPending) return <ScreenLoading />;

    return (
        <DragAndDropProvider initialColumns={board?.columns}>
            <ColumnList />
            <KanbanDragOverlay />
            <TestDialog />
        </DragAndDropProvider>
    );
};
