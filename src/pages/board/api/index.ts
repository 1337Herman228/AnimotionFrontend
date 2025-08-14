"use client";

import { useStores } from "@/providers/mobx/StoreProvider";
import useAxios from "@/shared/hooks/useAxios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { ICard, IColumnCard } from "@/types";
import { useSession } from "next-auth/react";

export const useBoardPage = () => {
    const params = useParams();
    const { boardStore } = useStores();
    const { data: session } = useSession();
    const axios = useAxios();
    const projectId = params?.projectId as string;

    const [activeCard, setActiveCard] = useState<ICard | null>(null);
    const [activeColumn, setActiveColumn] = useState<IColumnCard | null>(null);

    useEffect(() => {
        if (axios && boardStore && projectId) {
            boardStore.fetchProject(axios, projectId, session);
        }
    }, [boardStore, axios, projectId]);

    useEffect(() => {
        if (!axios || !boardStore || !params?.projectId) return;
        boardStore.fetchProject(axios, params.projectId as string, session);
    }, [boardStore, axios, session, params?.projectId]);

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Card") {
            setActiveCard(event.active.data.current.card);
        }
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
        }
    };

    const handleDragOver = boardStore.handleDragOver;
    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCard(null);
        setActiveColumn(null);

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeIsColumn = active.data.current?.type === "Column";
        const activeIsCard = active.data.current?.type === "Card";

        if (activeIsColumn) {
            boardStore.moveColumn(event);
            return;
        }

        if (activeIsCard) {
            boardStore.handleCardDragEnd(event);
            return;
        }

        setActiveCard(null);
        setActiveColumn(null);
    };

    return {
        boardStore,
        activeCard,
        activeColumn,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
};

export default useBoardPage;
