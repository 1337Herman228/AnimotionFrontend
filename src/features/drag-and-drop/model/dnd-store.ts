import { CardTypes } from "@/entities/card";
import { ColumnTypes } from "@/entities/column";
import { create } from "zustand";
import { DndDataSchema } from "./contracts";
import { parse } from "valibot";
import { addCardsToColumns } from "../lib/addCardsToColumns";

interface DndState {
    columns: ColumnTypes.TColumnsWhithoutCardsSchema;
    cards: CardTypes.TCardsSchema;
    prevInitialColumns: ColumnTypes.TColumnsSchema;
    activeCard: CardTypes.TCardSchema | null;
    activeColumn: ColumnTypes.TColumnWhithoutCardsSchema | null;

    setColumns: (columns: ColumnTypes.TColumnsWhithoutCardsSchema) => void;
    setActiveColumn: (
        activeColumn: ColumnTypes.TColumnWhithoutCardsSchema | null
    ) => void;
    setCards: (cards: CardTypes.TCardsSchema) => void;
    setActiveCard: (activeCard: CardTypes.TCardSchema | null) => void;
    parseInitialColumnsToState: (
        initialColumns: ColumnTypes.TColumnsSchema
    ) => void;
    getColumnsWithCards: () => ColumnTypes.TColumnsSchema;
    getActiveColumnWithCards: () => ColumnTypes.TColumnSchema | null;
}

export const useDndStore = create<DndState>((set, get) => {
    return {
        columns: [],
        cards: [],
        prevInitialColumns: [],
        activeCard: null,
        activeColumn: null,

        setColumns: (columns: ColumnTypes.TColumnsWhithoutCardsSchema) =>
            set({ columns }),

        setActiveColumn: (
            activeColumn: ColumnTypes.TColumnWhithoutCardsSchema | null
        ) => set({ activeColumn }),

        setCards: (cards: CardTypes.TCardsSchema) => {
            set({ cards });
        },

        setActiveCard: (activeCard: CardTypes.TCardSchema | null) => {
            set({ activeCard });
        },

        parseInitialColumnsToState: (
            initialColumns: ColumnTypes.TColumnsSchema
        ) => {
            const { columns: parsedColumns, cards: parsedCards } = parse(
                DndDataSchema,
                initialColumns
            );
            set({
                prevInitialColumns: initialColumns,
                columns: parsedColumns,
                cards: parsedCards,
            });
        },

        getColumnsWithCards: () => {
            const { columns, cards } = get();
            return addCardsToColumns(
                columns,
                cards
            ) as ColumnTypes.TColumnsSchema;
        },
        getActiveColumnWithCards: () => {
            const { activeColumn, cards } = get();
            return activeColumn
                ? (addCardsToColumns(
                      activeColumn,
                      cards
                  ) as ColumnTypes.TColumnSchema)
                : null;
        },
    };
});
