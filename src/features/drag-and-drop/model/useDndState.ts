import type { CardTypes } from "@/entities/card";
import type { ColumnTypes } from "@/entities/column";
import { useMemo, useRef, useState } from "react";
import { parse } from "valibot";
import { DndDataSchema } from "./contracts";

export const useDndState = (
    initialColumns?: ColumnTypes.TColumnsSchema | undefined
) => {
    const { columns: parsedColumns, cards: parsedCards } = useMemo(
        () => parse(DndDataSchema, initialColumns),
        [initialColumns]
    );

    const [columns, setColumns] = useState(parsedColumns);
    const [cards, setCards] = useState(parsedCards);

    const prevInitialColumns = useRef(initialColumns);

    const [activeCard, setActiveCard] = useState<CardTypes.TCardSchema | null>(
        null
    );

    const [activeColumn, setActiveColumn] =
        useState<ColumnTypes.TColumnWhithoutCardsSchema | null>(null);

    if (initialColumns !== prevInitialColumns.current) {
        prevInitialColumns.current = initialColumns;

        const { columns: parsedColumns, cards: parsedCards } = parse(
            DndDataSchema,
            initialColumns
        );

        setColumns(parsedColumns);
        setCards(parsedCards);
    }

    return {
        columns,
        cards,
        activeColumn,
        activeCard,
        setColumns,
        setCards,
        setActiveColumn,
        setActiveCard,
    };
};
