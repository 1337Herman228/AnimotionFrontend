import { CardTypes } from "@/entities/card";
import { ColumnTypes } from "@/entities/column";

export const addCardsToColumns = (
    columns:
        | ColumnTypes.TColumnsWhithoutCardsSchema
        | ColumnTypes.TColumnWhithoutCardsSchema,
    cards: CardTypes.TCardsSchema
) => {
    if (!Array.isArray(columns)) {
        const _cards = cards.filter((card) => card.columnId === columns.id);
        return {
            ...columns,
            cards: _cards,
            cardOrder: _cards.map((c) => c.id),
        };
    } else
        return columns.map((column) => {
            const _cards = cards.filter((card) => card.columnId === column.id);
            return {
                ...column,
                cards: _cards,
                cardOrder: _cards.map((c) => c.id),
            };
        });
};
