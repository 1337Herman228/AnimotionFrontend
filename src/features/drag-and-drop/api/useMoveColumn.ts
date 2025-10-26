import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IBoardProject, IMoveColumnMessage } from "@/types";
import { columnService } from "@/entities/column";

const boardQueryKey = (projectId: string) => ["board", projectId];

export const useMoveColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IMoveColumnMessage) =>
            columnService.moveColumn(data),
        onMutate: async (movedColumnData) => {
            const queryKey = boardQueryKey(movedColumnData.projectId);

            await queryClient.cancelQueries({ queryKey });

            const previousBoardState =
                queryClient.getQueryData<IBoardProject>(queryKey);

            queryClient.setQueryData<IBoardProject>(queryKey, (oldData) => {
                if (!oldData) return undefined;

                const updatedData = {
                    ...oldData,
                    columnOrder: movedColumnData.columnOrder,
                };

                return updatedData;
            });

            return { previousBoardState, projectId: movedColumnData.projectId };
        },
        onError: (err, _, context) => {
            console.error("Failed to move column, rolling back...", err);
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
            errorMessage: "Failed to move column. Please try again later",
        },
    });
};
