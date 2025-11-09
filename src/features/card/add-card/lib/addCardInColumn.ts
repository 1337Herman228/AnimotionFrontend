import { BoardTypes } from "@/entities/board";
import { CardApiTypes } from "@/entities/card";
import { ColumnTypes } from "@/entities/column";

export const addCardInColumn = (
    currentBoard: BoardTypes.TBoardSchema,
    cardToAdd: CardApiTypes.TAddCardDtoSchema
) =>
    currentBoard.columns.map((column) => {
        if (column.id === cardToAdd.columnId) {
            const cardWithId = {
                ...cardToAdd,
                id: crypto.randomUUID(),
                createdAt: String(new Date()),
                updatedAt: String(new Date()),
            };
            return {
                ...column,
                cards: [...column.cards, cardWithId],
            };
        }
        return column;
    }) as ColumnTypes.TColumnsSchema;
