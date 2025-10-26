import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMoveCardMessage, IBoardProject } from "@/types";
import { cardService } from "@/entities/card";
import { findColumnByCardId, updateColumns } from "@/shared/utils/functions";

const boardQueryKey = (projectId: string) => ["board", projectId];

export const useMoveCardMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IMoveCardMessage) => cardService.moveCard(data),
        onMutate: async (movedCardData) => {
            const queryKey = boardQueryKey(movedCardData.projectId);

            await queryClient.cancelQueries({ queryKey });

            const previousBoardState =
                queryClient.getQueryData<IBoardProject>(queryKey);

            queryClient.setQueryData<IBoardProject>(queryKey, (oldData) => {
                if (!oldData) return undefined;

                const updatedColumns = updateColumns(oldData.columns, [
                    findColumnByCardId(
                        movedCardData.destinationColumn.id,
                        oldData.columns
                    )!,
                    findColumnByCardId(
                        movedCardData.sourceColumn.id,
                        oldData.columns
                    )!,
                ]);

                const updatedCards = oldData.columns
                    .flatMap((col) => col.cards)
                    .map((card) => {
                        if (card.id === movedCardData.cardId) {
                            card.columnId = movedCardData.destinationColumn.id;
                        }
                        return card;
                    });

                const updatedData = {
                    ...oldData,
                    columns: updatedColumns,
                    cards: updatedCards,
                };

                return updatedData;
            });

            return { previousBoardState, projectId: movedCardData.projectId };
        },
        onError: (err, _, context) => {
            console.error("Failed to move card, rolling back...", err);
            if (context?.previousBoardState) {
                queryClient.setQueryData(
                    boardQueryKey(context.projectId),
                    context.previousBoardState
                );
            }
        },
        onSettled: (_, __, context) => {
            queryClient.invalidateQueries({
                queryKey: boardQueryKey(context.projectId),
            });
        },
        meta: {
            errorMessage: "Failed to move card. Please try again later",
        },
    });
};
