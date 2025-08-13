"use client";

import { useStores } from "@/providers/mobx/StoreProvider";
import useAxios from "@/shared/hooks/useAxios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { ICard } from "@/types";

export const useBoardPage = () => {
    const params = useParams();
    const { boardStore } = useStores();
    const axios = useAxios();
    const projectId = params?.projectId as string;

    const [activeCard, setActiveCard] = useState<ICard | null>(null);

    useEffect(() => {
        if (axios && boardStore && projectId) {
            boardStore.fetchProject(axios, projectId);
        }
    }, [boardStore, axios, projectId]);

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Card") {
            setActiveCard(event.active.data.current.card);
        }
    };

    const handleDragOver = boardStore.handleDragOver;
    const handleDragEnd = (event: DragEndEvent) => {
        boardStore.handleDragEnd(event);
        setActiveCard(null);
    };

    return {
        boardStore,
        activeCard,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
};

export default useBoardPage;
