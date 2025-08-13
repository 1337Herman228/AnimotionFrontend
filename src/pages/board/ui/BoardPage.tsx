"use client";

import { observer } from "mobx-react-lite";
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import useBoardPage from "../api";
import Column from "./Column";
import TaskCard from "./TaskCard";
import { createPortal } from "react-dom";

const BoardPage = () => {
    const {
        boardStore,
        activeCard,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    } = useBoardPage();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (boardStore.isFetching) {
        return <div>Loading board...</div>;
    }

    const cardsMap = new Map(boardStore.cards.map((card) => [card.id, card]));

    return (
        <div className="p-4 h-full">
            <h1 className="text-2xl font-bold mb-4">
                {boardStore.projectName}
            </h1>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto h-full pb-4">
                    {boardStore.columns.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            cards={column.cardOrder.map(
                                (id) => cardsMap.get(id)!
                            )}
                        />
                    ))}
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeCard ? (
                            <TaskCard card={activeCard} isOverlay />
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
};

export default observer(BoardPage);
