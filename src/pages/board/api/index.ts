"use client";

import { useStores } from "@/providers/mobx/StoreProvider";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { IBoardProject, ICard, IBoardColumn } from "@/types";
import { useSession } from "next-auth/react";
import { websocketService } from "@/services/webSocketService";
import useAxios from "@/shared/hooks/useAxios";

const useBoardPage = () => {
    const params = useParams();
    const { boardStore } = useStores();
    const { data: session } = useSession();
    const axiosAuth = useAxios();
    const projectId = params?.projectId as string;

    // Состояния для UI (DragOverlay) остаются здесь
    // const [activeCard, setActiveCard] = useState<ICard | null>(null);
    // const [activeColumn, setActiveColumn] = useState<IBoardColumn | null>(null);

    // Главный useEffect для управления жизненным циклом
    useEffect(() => {
        const token = session?.user?.backendToken;
        if (!axiosAuth || !boardStore || !projectId || !session || !token) {
            return;
        }

        // 1. Инициализируем store и загружаем данные
        boardStore.init(axiosAuth, projectId);

        // 2. Определяем колбэк для WebSocket
        const handleBoardUpdate = (updatedProject: IBoardProject) => {
            console.log("Applying update from WebSocket...");
            // boardStore.setBoardState(updatedProject);
        };

        // 3. Подключаемся к WebSocket
        websocketService.connect(token, projectId, handleBoardUpdate);

        // 4. Отключаемся при размонтировании компонента
        return () => {
            websocketService.disconnect();
        };
    }, [boardStore, axiosAuth, session, projectId]); // Ваши зависимости

    // --- ОБРАБОТЧИКИ DND ---

    // const handleDragStart = (event: DragStartEvent) => {
    //     if (event.active.data.current?.type === "Card") {
    //         setActiveCard(event.active.data.current.card);
    //     }
    //     if (event.active.data.current?.type === "Column") {
    //         setActiveColumn(event.active.data.current.column);
    //     }
    // };

    // Передаем управление напрямую в store
    // const handleDragOver = boardStore.handleDragOver;
    // const handleDragStart = boardStore.handleDragStart;
    // const handleDragEnd = boardStore.handleDragEnd;

    // const handleDragEnd = (event: DragEndEvent) => {
    //     setActiveCard(null);
    //     setActiveColumn(null);

    //     const { active, over } = event;

    //     // if (!over || active.id === over.id) return; //Неверное условие (когда перетаскиваешь снизу, то over = active)
    //     if (!over || !active) return;

    //     // console.log("active", active);
    //     // console.log("over", over);

    //     const activeIsColumn = active.data.current?.type === "Column";
    //     const activeIsCard = active.data.current?.type === "Card";

    //     if (activeIsColumn) {
    //         boardStore.moveColumn(event);
    //     }
    //     if (activeIsCard) {
    //         boardStore.handleCardDragEnd(event);
    //     }
    // };

    return {
        boardStore,
    };
};

export default useBoardPage;
