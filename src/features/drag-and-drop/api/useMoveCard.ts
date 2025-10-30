import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IBoardProject } from "@/types";
import { cardService, TMoveCardDtoSchema } from "@/entities/card";

const boardQueryKey = (projectId: string) => ["board", projectId];

export const useMoveCardMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TMoveCardDtoSchema) => cardService.moveCard(data),
        onMutate: async (movedCardData) => {
            const queryKey = boardQueryKey(movedCardData.projectId);

            await queryClient.cancelQueries({ queryKey });

            const previousBoardState =
                queryClient.getQueryData<IBoardProject>(queryKey);

            queryClient.setQueryData<IBoardProject>(queryKey, (oldData) => {
                if (!oldData) return undefined;

                const updatedData = {
                    ...oldData,
                    columns: movedCardData.updatedColumns,
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
