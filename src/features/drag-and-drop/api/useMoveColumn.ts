import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnApiTypes, columnService, ColumnTypes } from "@/entities/column";
import { boardQueries, BoardTypes } from "@/entities/board";

export const useMoveColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ColumnApiTypes.TMoveColumnDtoSchema) =>
            columnService.moveColumn(data),
        onMutate: async (movedColumnData) => {
            const queryKey = boardQueries.getIdKey(movedColumnData.projectId);

            await queryClient.cancelQueries({ queryKey });

            const previousBoardState =
                queryClient.getQueryData<BoardTypes.TBoardSchema>(queryKey);

            queryClient.setQueryData<BoardTypes.TBoardSchema>(
                queryKey,
                (oldData) => {
                    if (!oldData) return undefined;

                    const updatedData = {
                        ...oldData,
                        columnOrder: movedColumnData.columnOrder,
                    };

                    return updatedData;
                }
            );

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
        meta: {
            errorMessage: "Failed to move column. Please try again later",
        },
    });
};
