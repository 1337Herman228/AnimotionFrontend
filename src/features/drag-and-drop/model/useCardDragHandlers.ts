import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    UniqueIdentifier,
} from "@dnd-kit/core";
import { useCallback, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useMoveCardMutation } from "../api/useMoveCard";
import { cardQueries } from "@/entities/card";
import { useDndStore } from "./dnd-store";

export const useCardDragHandlers = () => {
    const { cards, setCards, setActiveCard, getColumnsWithCards } =
        useDndStore();

    const { mutate: moveCard } = useMoveCardMutation();

    const recentlyDraggedOverId = useRef<UniqueIdentifier | null>(null);
    const sourceColumnId = useRef<string | null>(null);

    const onDragStart = useCallback(
        ({ active }: DragStartEvent) => {
            if (!active || active.data.current?.type !== "card") return;
            setActiveCard(active.data.current.card);
            sourceColumnId.current = active.data.current.card.columnId;
        },
        [setActiveCard, sourceColumnId]
    );

    const onDragOver = useCallback(
        ({ active, over }: DragOverEvent) => {
            if (!over || active.id === over.id) return;

            const isActiveACard = active.data.current?.type === "card";
            const isDraggingOverACard = over.data.current?.type === "card";
            const isDraggingOverAColumn = over.data.current?.type === "column";

            if (!isActiveACard) return;

            if (isDraggingOverACard) {
                // console.time("DraggingOverACard");

                // setTimeout(() => {
                const activeCardIndex = cards.findIndex(
                    (c) => c.id === active.id
                );
                const overCardIndex = cards.findIndex((c) => c.id === over.id);

                const activeCard = cards[activeCardIndex];
                const overCard = cards[overCardIndex];

                recentlyDraggedOverId.current = over.id;

                if (
                    activeCard &&
                    overCard &&
                    activeCard.columnId !== overCard.columnId
                ) {
                    activeCard.columnId = overCard.columnId;

                    setCards(
                        arrayMove(
                            cards,
                            activeCardIndex,
                            Math.max(0, overCardIndex - 1)
                        )
                    );
                }

                setCards(arrayMove(cards, activeCardIndex, overCardIndex));
                // }, 0);
                // console.timeEnd("DraggingOverACard");
            }

            if (isDraggingOverAColumn) {
                // console.time("DraggingOverAColumn");

                const activeCardIndex = cards.findIndex(
                    (c) => c.id === active.id
                );
                const activeCard = cards[activeCardIndex];

                recentlyDraggedOverId.current = over.id;

                if (activeCard) {
                    activeCard.columnId = over.id as string;

                    setCards(
                        arrayMove(cards, activeCardIndex, activeCardIndex)
                    );
                }

                // console.timeEnd("DraggingOverAColumn");
            }
        },
        [setCards, cards, recentlyDraggedOverId]
    );

    const onDragEnd = ({ active }: DragEndEvent) => {
        setActiveCard(null);

        if (
            !active ||
            active.data.current?.type !== "card" ||
            !recentlyDraggedOverId.current ||
            !sourceColumnId.current
        ) {
            return;
        }

        const activeCard = cards.find((c) => c.id === active.id);

        if (activeCard) {
            const updatedColumns = getColumnsWithCards();

            moveCard({
                updatedColumns,
                projectId: activeCard.projectId,
                sourceColumn: {
                    id: sourceColumnId.current,
                    cardOrder:
                        updatedColumns.find(
                            (c) => c.id === sourceColumnId.current
                        )?.cardOrder || [],
                },
                destinationColumn: {
                    id: activeCard.columnId,
                    cardOrder:
                        updatedColumns.find((c) => c.id === activeCard.columnId)
                            ?.cardOrder || [],
                },
                cardId: activeCard.id,
                queryKey: cardQueries.getIdKey(activeCard.projectId),
            });
        }
    };

    return { onDragStart, onDragOver, onDragEnd };
};
