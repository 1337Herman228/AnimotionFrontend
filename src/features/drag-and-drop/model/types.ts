import { CardTypes } from "@/entities/card";
import { ColumnTypes } from "@/entities/column";
import { Dispatch, ReactNode, SetStateAction } from "react";

export type TCardDragHandlers = {
    cards: CardTypes.TCardSchema[];
    columns: ColumnTypes.TColumnsWhithoutCardsSchema;
    setCards: Dispatch<SetStateAction<CardTypes.TCardsSchema>>;
    setActiveCard: Dispatch<SetStateAction<CardTypes.TCardSchema | null>>;
};

export type TColumnDragHandlers = {
    columns: ColumnTypes.TColumnsWhithoutCardsSchema;
    setColumns: Dispatch<
        SetStateAction<ColumnTypes.TColumnsWhithoutCardsSchema>
    >;
    setActiveColumn: Dispatch<
        SetStateAction<ColumnTypes.TColumnWhithoutCardsSchema | null>
    >;
};

export type DragAndDropContext = {
    columns: ColumnTypes.TColumnsSchema;
    cards: CardTypes.TCardsSchema;
    activeColumn: ColumnTypes.TColumnWhithoutCardsSchema | null;
    activeCard: CardTypes.TCardSchema | null;
};

export type DragAndDropProviderProps = {
    children: ReactNode;
    initialColumns: ColumnTypes.TColumnsSchema | undefined;
};
