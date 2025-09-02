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
import {
    SortableContext,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
// import useBoardPage from "../api";
import useBoardPage from "../api/index2";

import Column from "./Column";
import TaskCard from "./TaskCard";
import { createPortal } from "react-dom";
import { ICard, IBoardColumn } from "@/types";
import { useEffect } from "react";

// const BoardPage = () => {
//     const { boardStore } = useBoardPage();

//     const sensors = useSensors(
//         useSensor(PointerSensor),
//         useSensor(KeyboardSensor, {
//             coordinateGetter: sortableKeyboardCoordinates,
//         })
//     );

//     if (boardStore.isFetching) {
//         return <div>Loading board...</div>;
//     }

//     const cardsMap = new Map<string, ICard>(
//         boardStore.cards.map((card: ICard) => [card.id, card])
//     );

//     return (
//         <div className="p-4 h-full">
//             <h1 className="text-2xl font-bold mb-4">
//                 {boardStore.projectName}
//             </h1>
//             <DndContext
//                 sensors={sensors}
//                 collisionDetection={closestCorners}
//                 onDragStart={boardStore.handleDragStart}
//                 onDragOver={boardStore.handleDragOver}
//                 onDragEnd={boardStore.handleDragEnd}
//             >
//                 <div className="flex gap-4 overflow-x-auto h-full pb-4">
//                     <SortableContext
//                         items={boardStore.columns.map(
//                             (c: IBoardColumn) => c.id
//                         )}
//                     >
//                         {boardStore.columns.map((column: IBoardColumn) => (
//                             <Column
//                                 key={column.id}
//                                 column={column}
//                                 cards={column.cardOrder.map(
//                                     (id) => cardsMap.get(id)!
//                                 )}
//                             />
//                         ))}
//                     </SortableContext>
//                 </div>

//                 {createPortal(
//                     <DragOverlay>
//                         {boardStore.activeCard ? (
//                             <TaskCard card={boardStore.activeCard} isOverlay />
//                         ) : null}
//                         {boardStore.activeColumn ? (
//                             <Column
//                                 column={boardStore.activeColumn}
//                                 cards={boardStore.activeColumn.cards}
//                                 isOverlay
//                             />
//                         ) : null}
//                     </DragOverlay>,
//                     document.body
//                 )}
//             </DndContext>
//         </div>
//     );
// };

const BoardPage = () => {
    const {
        activeCard,
        activeColumn,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
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
                onDragOver={handleDragOver}
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

export default observer(BoardPage);
