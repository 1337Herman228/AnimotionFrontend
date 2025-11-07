import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CardApiTypes, cardQueries, cardService } from "@/entities/card";
import { BoardTypes } from "@/entities/board";
import { updateCardInColumns } from "../lib/updateCardInColumns";

export const useEditCardMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CardApiTypes.TEditCardDtoSchema) =>
            cardService.editCard(data),
        onMutate: async (editCardData) => {
            const queryKey = cardQueries.getIdKey(
                editCardData?.projectId as string
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
                        columns: updateCardInColumns(oldData, editCardData),
                    };

                    return updatedData;
                }
            );

            return { previousBoardState, boardId: editCardData.projectId };
        },
        onError: (err, _, context) => {
            console.error("Failed to edit card, rolling back...", err);
            if (context?.previousBoardState) {
                queryClient.setQueryData(
                    cardQueries.getIdKey(context.boardId as string),
                    context.previousBoardState
                );
            }
        },
        meta: {
            successMessage: "Card edited successfully",
            errorMessage: "Failed to edit card. Please try again later",
        },
    });
};
