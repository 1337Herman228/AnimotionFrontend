import type { DragAndDropContext, DragAndDropProviderProps } from "./types";

import { createContext } from "react";
import {
    DndContext as DndKitContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import { useCardDragHandlers } from "./useCardDragHandlers";
import { useColumnDragHandlers } from "./useColumnDragHandlers";
import { useDndStore } from "./dnd-store";

// const DragAndDropContext = createContext<DragAndDropContext | null>(null);

export const DragAndDropProvider = ({
    children,
    initialColumns,
}: DragAndDropProviderProps) => {
    const { parseInitialColumnsToState, prevInitialColumns } = useDndStore();

    console.log("rerender DragAndDropProvider");

    if (initialColumns !== prevInitialColumns) {
        parseInitialColumnsToState(initialColumns ?? []);
        console.log("parseInitialColumnsToState");
    }
    // const {
    //     columns,
    //     cards,
    //     activeColumn,
    //     activeCard,
    //     setActiveColumn,
    //     setActiveCard,
    //     setColumns,
    //     setCards,
    // } = useDndState(initialColumns);

    const cardDragHandlers = useCardDragHandlers();
    //     {
    //     cards,
    //     columns,
    //     setActiveCard,
    //     setCards,
    // }

    const columnDragHandlers = useColumnDragHandlers();
    //     {
    //     columns,
    //     setActiveColumn,
    //     setColumns,
    // }

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, {
            activationConstraint: { distance: 5, delay: 250, tolerance: 5 },
        })
        // useSensor(KeyboardSensor, { coordinateGetter })
    );

    // const announcements = useGetAccessibilityAnnouncements({ columns, cards });

    // const value = useMemo(
    //     () => ({
    //         columns: addCardsToColumns(columns, cards),
    //         cards,
    //         activeCard,
    //         activeColumn: activeColumn,
    //     }),
    //     [columns, cards, activeCard, activeColumn]
    // );

    console.log("DND context render");

    return (
        // <DragAndDropContext value={value}>
        <DndKitContext
            sensors={sensors}
            // accessibility={{ announcements }}
            onDragStart={(e) => {
                cardDragHandlers.onDragStart(e);
                columnDragHandlers.onDragStart(e);
            }}
            onDragOver={cardDragHandlers.onDragOver}
            onDragEnd={(e) => {
                cardDragHandlers.onDragEnd(e);
                columnDragHandlers.onDragEnd(e);
            }}
        >
            {children}
        </DndKitContext>
        // </DragAndDropContext>
    );
};

// export const useDragAndDrop = () => {
//     const context = use(DragAndDropContext);

//     if (!context) {
//         throw new Error(
//             "useDragAndDrop must be used within a DragAndDropProvider"
//         );
//     }

//     return context;
// };
