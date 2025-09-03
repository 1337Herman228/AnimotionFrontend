"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { IBoardProject, ICard, IBoardColumn } from "@/types";
import { useSession } from "next-auth/react";
import { websocketService } from "@/services/webSocketService";
import useAxios from "@/shared/hooks/useAxios";
import { arrayMove } from "@dnd-kit/sortable";

const findColumnByCardId = (cardId: string, columns: IBoardColumn[] | null) => {
    if (!columns) return null;
    return columns?.find((col) => col.cardOrder.includes(cardId));
};
const useBoardPage = () => {
    const params = useParams();
    const { data: session } = useSession();
    const axios = useAxios();
    const projectId = params?.projectId as string;

    const [activeCard, setActiveCard] = useState<ICard | null>(null);
    const [activeColumn, setActiveColumn] = useState<IBoardColumn | null>(null);

    const [projectName, setProjectName] = useState<string | null>(null);
    const [columns, setColumns] = useState<IBoardColumn[] | null>([]);
    const [cards, setCards] = useState<ICard[] | null>([]);
    const [error, setError] = useState<Error | null>(null);

    const sourceColumn = useRef<IBoardColumn | null>(null); // мб заменить на ref

    const updateColumns = useCallback(
        (updated: IBoardColumn | IBoardColumn[]) => {
            setColumns((prev) => {
                if (!prev) return prev;

                const arr = Array.isArray(updated) ? updated : [updated];
                if (arr.length === 0) return prev;

                const byId = new Map(arr.map((c) => [c.id, c]));
                return prev.map((c) => byId.get(c.id) ?? c);
            });
        },
        [setColumns]
    );

    // Главный useEffect для управления жизненным циклом
    useEffect(() => {
        const token = session?.user?.backendToken;
        if (!axios || !projectId || !session || !token) {
            return;
        }

        fetchProject();

        // 2. Определяем колбэк для WebSocket
        const handleBoardUpdate = (updatedProject: IBoardProject) => {
            console.log("Applying update from WebSocket...");
            setBoardState(updatedProject);
        };

        // 3. Подключаемся к WebSocket
        websocketService.connect(token, projectId, handleBoardUpdate);

        // 4. Отключаемся при размонтировании компонента
        return () => {
            websocketService.disconnect();
        };
    }, [axios, session, projectId]); // Ваши зависимости

    const setBoardState = useCallback(
        (projectData: IBoardProject) => {
            const columnsMap = new Map(
                projectData.columns.map((col) => [col.id, col])
            );
            // Сортируем колонки в соответствии с `columnOrder` от сервера
            const sortedColumns = (projectData.columnOrder || [])
                .map((colId) => columnsMap.get(colId)!)
                .filter(Boolean);

            setProjectName(projectData.name);
            setColumns(sortedColumns);
            setCards(sortedColumns.flatMap((col) => col.cards));
        },
        [setProjectName, setColumns, setCards]
    );

    const fetchProject = useCallback(async () => {
        if (!axios || !projectId) return;

        try {
            const response = await axios.get<IBoardProject>(
                `/projects/${projectId}`
            );
            setBoardState(response.data);
        } catch (err: any) {
            setError(err);
            console.error("Failed to fetch project:", err);
        }
    }, [axios, projectId, setBoardState, setError]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const cardId = active.id as string;

        if (event.active.data.current?.type === "Card") {
            setActiveCard(event.active.data.current.card);
            sourceColumn.current = findColumnByCardId(cardId, columns) || null;
        }
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
        }
    };

    const handleCardDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !active || !sourceColumn.current || !columns || !cards)
            return;

        const cardId = active.id as string;
        const overId = over.id as string;

        const destColumn =
            findColumnByCardId(overId, columns) ||
            columns.find((c) => c.id === overId)!;

        // Меняем местами карточки в одной и той же колонке
        if (sourceColumn.current.id === destColumn.id) {
            const oldIndex = sourceColumn.current.cardOrder.indexOf(cardId);
            const newIndex = destColumn.cardOrder.indexOf(overId);
            sourceColumn.current.cardOrder = arrayMove(
                sourceColumn.current.cardOrder,
                oldIndex,
                newIndex
            );
            updateColumns(sourceColumn.current);
        } else {
            // Так как в handleDragOver мы добавляем карточку в массив, перетаскиваемая карточка всегда будет в конце
            // сначала убираем фантомную карточку, а затем ставим на ее место настояющую
            const isOverCard = cards.some((c) => c.id === overId);
            sourceColumn.current.cardOrder =
                sourceColumn.current.cardOrder.filter((c) => c !== cardId);
            destColumn.cardOrder = destColumn.cardOrder.filter(
                (c) => c !== cardId
            );
            const newIndex = isOverCard
                ? destColumn.cardOrder.indexOf(overId)
                : destColumn.cardOrder.length;
            destColumn.cardOrder.splice(newIndex, 0, cardId);
            updateColumns([destColumn, sourceColumn.current]);

            setCards(
                cards.map((card) => {
                    if (card.id === cardId) {
                        card.columnId = destColumn.id;
                    }
                    return card;
                })
            );
        }

        // --- 2. ОТПРАВКА НА СЕРВЕР ---
        if (!axios || !projectId) return;

        websocketService.moveCard({
            projectId: projectId,
            sourceColumn: {
                id: sourceColumn.current.id,
                cardOrder: sourceColumn.current.cardOrder,
            },
            destinationColumn: {
                id: destColumn.id,
                cardOrder: destColumn.cardOrder,
            },
            card: cards.find((c) => c.id === cardId)!,
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // if (!over || active.id === over.id) return; //Неверное условие (когда перетаскиваешь снизу, то over = active)
        if (!over || !active) return;

        const activeIsColumn = active.data.current?.type === "Column";
        const activeIsCard = active.data.current?.type === "Card";

        if (activeIsColumn) {
            moveColumn(event);
        }
        if (activeIsCard) {
            handleCardDragEnd(event);
        }
        setActiveCard(null);
        setActiveColumn(null);
    };

    const moveColumn = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !active || !projectId || !columns) return;

        // 1. Оптимистичное обновление
        const oldIndex = columns.findIndex((col) => col.id === active.id);
        const newIndex = columns.findIndex((col) => col.id === over.id);
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        setColumns(newColumns);

        // 2. Отправка на сервер
        const newOrder = newColumns.map((col) => col.id);
        websocketService.moveColumn({
            projectId: projectId,
            columnOrder: newOrder,
        });
    };

    const addCard = () => {
        websocketService.addCard({
            projectId,
            title: "new card" + Math.random(),
            columnId: "68b6fb215d8baf41b878c229",
            description: "Description...",
            assigneeId: "68b6fb215d8baf41b878c222",
            priority: {
                id: "68b6fb215d8baf41b878c225",
                projectId: null,
                value: "NORMAL",
                label: "Normal",
                color: "#b8e7bc",
            },
        });
    };

    return {
        activeCard,
        activeColumn,
        handleDragStart,
        handleDragEnd,
        addCard,
        columns,
        cards,
        projectName,
    };
};

export default useBoardPage;
