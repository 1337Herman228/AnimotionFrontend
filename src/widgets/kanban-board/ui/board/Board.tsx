import { DragAndDropProvider } from "@/features/drag-and-drop";
import React from "react";
import { ColumnList } from "../column/ColumnList";
import { KanbanDragOverlay } from "../dnd/KanbanDragOverlay";
import { useQuery } from "@tanstack/react-query";
import { boardQueries } from "@/entities/board";
import { useParams } from "next/navigation";
import ScreenLoading from "@/shared/ui/screen-loading";

export const Board = () => {
    const params = useParams();
    const projectId = params?.projectId as string;

    const {
        data: board,
        isPending,
        isError,
        error,
    } = useQuery({
        ...boardQueries.byId(projectId),
    });

    if (isPending) return <ScreenLoading />;

    return (
        <DragAndDropProvider initialColumns={board?.columns}>
            <ColumnList />
            <KanbanDragOverlay />
        </DragAndDropProvider>
    );
};
