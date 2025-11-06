import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IBoard, IMoveColumnMessage } from "@/types";
import { columnService } from "@/entities/column";
import { boardQueries } from "@/entities/board";

export const useMoveColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IMoveColumnMessage) =>
            columnService.moveColumn(data),
        onMutate: async (movedColumnData) => {
            const queryKey = boardQueries.getIdKey(movedColumnData.projectId);

            await queryClient.cancelQueries({ queryKey });

            const previousBoardState =
                queryClient.getQueryData<IBoard>(queryKey);

            queryClient.setQueryData<IBoard>(queryKey, (oldData) => {
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
                    boardQueries.getIdKey(context.projectId),
                    context.previousBoardState
                );
            }
        },
        onSettled: (_, __, context) => {
            queryClient.invalidateQueries({
                queryKey: boardQueries.getIdKey(context.projectId),
            });
        },
        meta: {
            errorMessage: "Failed to move column. Please try again later",
        },
    });
};
