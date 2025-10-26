import { CardTypes } from "@/entities/card";
import { ColumnTypes } from "@/entities/column";
import { Dispatch, ReactNode, SetStateAction } from "react";

export type TCardDragHandlers = {
    cards: CardTypes.TCardSchema[];
    columns: ColumnTypes.TColumnsSchema;
    setCards: Dispatch<SetStateAction<CardTypes.TCardsSchema>>;
    setActiveCard: Dispatch<SetStateAction<CardTypes.TCardSchema | null>>;
};

export type TColumnDragHandlers = {
    columns: ColumnTypes.TColumnsSchema;
    setColumns: Dispatch<SetStateAction<ColumnTypes.TColumnsSchema>>;
    setActiveColumn: Dispatch<SetStateAction<ColumnTypes.TColumnSchema | null>>;
};

export type DragAndDropContext = {
    columns: ColumnTypes.TColumnsSchema;
    cards: CardTypes.TCardsSchema;
    activeColumn: ColumnTypes.TColumnSchema | null;
    activeCard: CardTypes.TCardSchema | null;
};

export type DragAndDropProviderProps = {
    children: ReactNode;
    initialColumns: ColumnTypes.TColumnsSchema | undefined;
};
