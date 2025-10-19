import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMoveCardMessage, IBoardProject } from "@/types";
import { cardService } from "@/entities/card";
import { useBoardStore } from "@/shared/stores/boardStore";
import { findColumnByCardId, updateColumns } from "@/shared/utils/functions";

const boardQueryKey = (projectId: string) => ["board", projectId];

export const useMoveCardMutation = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IMoveCardMessage) => cardService.moveCard(data),

        onMutate: async (movedCardData) => {
            const queryKey = boardQueryKey(projectId);
            // 1. Отмена текущих запросов, чтобы избежать race conditions
            await queryClient.cancelQueries({ queryKey });
            // 2. Сохранение предыдущего состояния для отката
            const previousBoardState =
                queryClient.getQueryData<IBoardProject>(queryKey);
            // 3. Оптимистичное обновление кеша
            queryClient.setQueryData<IBoardProject>(queryKey, (oldData) => {
                if (!oldData) return undefined;

                // =======================================================
                // !!! ВАША ЛОГИКА ОПТИМИСТИЧНОГО ПЕРЕМЕЩЕНИЯ КАРТОЧКИ !!!
                // Используйте movedCardData для локального обновления oldData
                // =======================================================

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

                return updatedData; // Возвращаем локально обновленный объект
            });

            // Возвращаем контекст для onError
            return { previousBoardState };
        },

        // Откат: срабатывает, если промис из mutationFn был отклонен (сервер прислал ERROR)
        onError: (err, newCardData, context) => {
            console.error("Failed to move card, rolling back...", err);
            if (context?.previousBoardState) {
                queryClient.setQueryData(
                    boardQueryKey(projectId),
                    context.previousBoardState
                );
            }
            // Здесь вы можете вывести тост-уведомление об ошибке
        },

        // Синхронизация: срабатывает после успеха ИЛИ ошибки
        onSettled: () => {
            // Инвалидация заставит TanStack Query запросить свежие данные
            // (или подождать, пока они придут по общей рассылке /topic/project/{id})
            queryClient.invalidateQueries({
                queryKey: boardQueryKey(projectId),
            });
        },
    });
};
