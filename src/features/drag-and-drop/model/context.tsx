import type { DragAndDropContext, DragAndDropProviderProps } from "./types";

import { createContext, use, useEffect, useMemo } from "react";
import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import { useCardDragHandlers } from "./useCardDragHandlers";
import { useColumnDragHandlers } from "./useColumnDragHandlers";
import { useDndState } from "./useDndState";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { api } from "@/shared/api/axiosInstance";
import { IBoardProject } from "@/types";
import { websocketManager } from "@/shared/api/ws-manager";
import { addCardsToColumns } from "../lib/addCardsToColumns";

const DragAndDropContext = createContext<DragAndDropContext | null>(null);

export const DragAndDropProvider = ({
    children,
    initialColumns,
}: DragAndDropProviderProps) => {
    const {
        columns,
        cards,
        activeColumn,
        activeCard,
        setActiveColumn,
        setActiveCard,
        setColumns,
        setCards,
    } = useDndState(initialColumns);

    const { data: session } = useSession();
    const params = useParams();
    const projectId = params?.projectId as string;

    const cardDragHandlers = useCardDragHandlers({
        cards,
        columns,
        setActiveCard,
        setCards,
    });

    const columnDragHandlers = useColumnDragHandlers({
        columns,
        setActiveColumn,
        setColumns,
    });

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, {
            activationConstraint: { distance: 5, delay: 250, tolerance: 5 },
        })
        // useSensor(KeyboardSensor, { coordinateGetter })
    );

    // const announcements = useGetAccessibilityAnnouncements({ columns, cards });

    const value = useMemo(
        () => ({
            columns: addCardsToColumns(columns, cards),
            cards,
            activeCard,
            activeColumn,
        }),
        [columns, cards, activeCard, activeColumn]
    );

    useEffect(() => {
        console.log("WebSocket connecting...");
        const token = session?.user?.backendToken;
        if (!api || !projectId || !token) return;

        const handleBoardUpdate = (updatedProject: IBoardProject) => {
            // setColumns(updatedProject.columns);
            // setCards(updatedProject.columns.flatMap((c) => c.cards));
        };

        websocketManager.connect(token, projectId, handleBoardUpdate);

        return () => {
            websocketManager.disconnect();
        };
    }, [api, session, projectId, setColumns, setCards]);

    return (
        <DragAndDropContext value={value}>
            <DndContext
                sensors={sensors}
                // accessibility={{ announcements }}
                onDragStart={(e) => {
                    cardDragHandlers.onDragStart(e);
                    columnDragHandlers.onDragStart(e);
                }}
                onDragOver={cardDragHandlers.onDragOver}
                onDragEnd={(e) => {
                    cardDragHandlers.onDragEnd(e);
                    columnDragHandlers.onDragEnd(e);
                }}
            >
                {children}
            </DndContext>
        </DragAndDropContext>
    );
};

export const useDragAndDrop = () => {
    const context = use(DragAndDropContext);

    if (!context) {
        throw new Error(
            "useDragAndDrop must be used within a DragAndDropProvider"
        );
    }

    return context;
};
