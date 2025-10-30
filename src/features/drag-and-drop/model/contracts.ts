import * as v from "valibot";
import { ColumnContracts, ColumnTypes } from "@/entities/column";
import { CardTypes } from "@/entities/card";

export const DndDataSchema = v.pipe(
    ColumnContracts.ColumnsSchema,
    v.transform((fullColumns) => {
        const initialState = {
            columns: [] as ColumnTypes.TColumnsWhithoutCardsSchema,
            cards: [] as CardTypes.TCardsSchema,
        };

        return fullColumns.reduce((acc, currentColumn) => {
            const { cards, ...columnWithoutCards } = currentColumn;

            acc.columns.push(columnWithoutCards);
            acc.cards.push(...cards);

            return acc;
        }, initialState);
    })
);
