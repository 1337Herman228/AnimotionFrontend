import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CardApiTypes, cardQueries, cardService } from "@/entities/card";
import { BoardTypes } from "@/entities/board";
import { addCardInColumn } from "../lib/addCardInColumn";

export const useAddCardMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CardApiTypes.TAddCardDtoSchema) =>
            cardService.addCard(data),
        onMutate: async (addCardData) => {
            const queryKey = cardQueries.getIdKey(
                addCardData?.projectId as string
            );

            await queryClient.cancelQueries({ queryKey });

            const previousBoardState =
                queryClient.getQueryData<BoardTypes.TBoardSchema>(queryKey);

            queryClient.setQueryData<BoardTypes.TBoardSchema>(
                queryKey,
                (oldData) => {
                    if (!oldData) return undefined;

                    const updatedData = {
                        ...oldData,
                        columns: addCardInColumn(oldData, addCardData),
                    };

                    return updatedData;
                }
            );

            return { previousBoardState, boardId: addCardData.projectId };
        },
        onError: (err, _, context) => {
            console.error("Failed to add card, rolling back...", err);
            if (context?.previousBoardState) {
                queryClient.setQueryData(
                    cardQueries.getIdKey(context.boardId as string),
                    context.previousBoardState
                );
            }
        },
        meta: {
            successMessage: "Card added successfully",
            errorMessage: "Failed to add card. Please try again later",
        },
    });
};
