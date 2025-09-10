"use client";

import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import Column from "./Column/Column";
import TaskCard from "./Card/TaskCard";
import { createPortal } from "react-dom";
import { ICard, IBoardColumn, IAddCardMessage } from "@/types";
import { useBoardDnD } from "../api/useBoardDnD";
import { useBoardStore } from "@/shared/stores/boardStore";
import { useBoardLifecycle } from "../api/useBoardLifecycle";
import ScreenLoading from "@/shared/components/Loading/ScreenLoading";

const BoardPage = () => {
    const { projectId } = useBoardLifecycle();

    const { activeCard, activeColumn, handleDragStart, handleDragEnd } =
        useBoardDnD();

    const { columns, cards, projectName, isFetching, isLoading } =
        useBoardStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    console.log(cards);

    if (!columns || !cards || isLoading) {
        return <ScreenLoading />;
    }

    const cardsMap = new Map<string, ICard>(
        cards.map((card: ICard) => [card.id, card])
    );

    return (
        <div className="h-full max-w-[1200px] mx-auto my-8 px-8">
            <h1 className="text-2xl font-bold mb-4">{projectName}</h1>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto h-full pb-4">
                    <SortableContext
                        items={columns.map((c: IBoardColumn) => c.id)}
                    >
                        {columns.map((column: IBoardColumn) => (
                            <Column
                                key={column.id}
                                column={column}
                                cards={column.cardOrder.map(
                                    (id) => cardsMap.get(id)!
                                )}
                            />
                        ))}
                    </SortableContext>
                </div>

                {typeof window !== "undefined" &&
                    createPortal(
                        <DragOverlay>
                            {activeCard ? (
                                <TaskCard card={activeCard} isOverlay />
                            ) : null}
                            {activeColumn ? (
                                <Column
                                    column={activeColumn}
                                    cards={activeColumn.cards}
                                    isOverlay
                                />
                            ) : null}
                        </DragOverlay>,
                        document.body
                    )}
            </DndContext>
        </div>
    );
};

export default BoardPage;
