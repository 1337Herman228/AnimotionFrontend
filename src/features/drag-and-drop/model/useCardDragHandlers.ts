import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    UniqueIdentifier,
} from "@dnd-kit/core";
import type { TCardDragHandlers } from "./types";

import { useCallback, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useMoveCardMutation } from "../api/useMoveCard";
import { addCardsToColumns } from "../lib/addCardsToColumns";
import { cardQueries } from "@/entities/card";

export const useCardDragHandlers = ({
    cards,
    columns,
    setCards,
    setActiveCard,
}: TCardDragHandlers) => {
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

                setTimeout(() => {
                    setCards((prevCards) => {
                        const activeCardIndex = prevCards.findIndex(
                            (c) => c.id === active.id
                        );
                        const overCardIndex = prevCards.findIndex(
                            (c) => c.id === over.id
                        );

                        const activeCard = prevCards[activeCardIndex];
                        const overCard = prevCards[overCardIndex];

                        recentlyDraggedOverId.current = over.id;

                        if (
                            activeCard &&
                            overCard &&
                            activeCard.columnId !== overCard.columnId
                        ) {
                            activeCard.columnId = overCard.columnId;

                            return arrayMove(
                                prevCards,
                                activeCardIndex,
                                Math.max(0, overCardIndex - 1)
                            );
                        }

                        return arrayMove(
                            prevCards,
                            activeCardIndex,
                            overCardIndex
                        );
                    });
                }, 0);
                // console.timeEnd("DraggingOverACard");
            }

            if (isDraggingOverAColumn) {
                // console.time("DraggingOverAColumn");
                setCards((prevCards) => {
                    const activeCardIndex = prevCards.findIndex(
                        (c) => c.id === active.id
                    );
                    const activeCard = prevCards[activeCardIndex];

                    recentlyDraggedOverId.current = over.id;

                    if (activeCard) {
                        activeCard.columnId = over.id as string;

                        return arrayMove(
                            prevCards,
                            activeCardIndex,
                            activeCardIndex
                        );
                    }

                    return prevCards;
                });
                // console.timeEnd("DraggingOverAColumn");
            }
        },
        [setCards, recentlyDraggedOverId]
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
            const updatedColumns = addCardsToColumns(columns, cards);

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
