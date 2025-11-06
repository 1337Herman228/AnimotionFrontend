import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IBoard } from "@/types";
import { cardQueries, cardService, TMoveCardDtoSchema } from "@/entities/card";

export const useMoveCardMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TMoveCardDtoSchema) => cardService.moveCard(data),
        onMutate: async (movedCardData) => {
            const queryKey = cardQueries.getIdKey(movedCardData.boardId);

            await queryClient.cancelQueries({ queryKey });

            const previousBoardState =
                queryClient.getQueryData<IBoard>(queryKey);

            queryClient.setQueryData<IBoard>(queryKey, (oldData) => {
                if (!oldData) return undefined;

                const updatedData = {
                    ...oldData,
                    columns: movedCardData.updatedColumns,
                };

                return updatedData;
            });

            return { previousBoardState, boardId: movedCardData.boardId };
        },
        onError: (err, _, context) => {
            console.error("Failed to move card, rolling back...", err);
            if (context?.previousBoardState) {
                queryClient.setQueryData(
                    cardQueries.getIdKey(context.boardId),
                    context.previousBoardState
                );
            }
        },
        // onSettled: (_, __, context) => {
        //     queryClient.invalidateQueries({
        //         queryKey: cardQueries.getIdKey(context.projectId),
        //     });
        // },
        meta: {
            errorMessage: "Failed to move card. Please try again later",
        },
    });
};
