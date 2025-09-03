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
import useBoardPage from "../api";

import Column from "./Column";
import TaskCard from "./TaskCard";
import { createPortal } from "react-dom";
import { ICard, IBoardColumn } from "@/types";

const BoardPage = () => {
    const {
        activeCard,
        activeColumn,
        handleDragStart,
        handleDragEnd,
        addCard,
        columns,
        cards,
        projectName,
    } = useBoardPage();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (!columns || !cards) {
        return <div>Loading board...</div>;
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
                                addCard={addCard}
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
                                    addCard={addCard}
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
