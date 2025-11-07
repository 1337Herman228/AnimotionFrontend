import { BoardTypes } from "@/entities/board";
import { CardApiTypes } from "@/entities/card";
import { ColumnTypes } from "@/entities/column";

export const updateCardInColumns = (
    oldData: BoardTypes.TBoardSchema,
    editCardData: CardApiTypes.TEditCardDtoSchema
) =>
    oldData.columns.map((column) => {
        if (column.id === editCardData.columnId) {
            const updatedCards = column.cards.map((card) => {
                if (card.id === editCardData.id) {
                    return {
                        ...card,
                        ...editCardData,
                    };
                }
                return card;
            });
            return {
                ...column,
                cards: updatedCards,
            };
        }
        return column;
    }) as ColumnTypes.TColumnsSchema;
