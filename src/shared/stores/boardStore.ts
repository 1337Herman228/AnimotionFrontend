import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
    IBoardColumn,
    ICard,
    IBoardProject,
    ICardMessage,
    ITaskPriority,
    IMember,
} from "@/types";
import { websocketService } from "@/services/webSocketService";
import { AxiosInstance } from "axios";
import { findColumnByCardId, updateColumns } from "../utils/functions/index";

interface BoardState {
    projectId: string | null;
    projectName: string | null;
    columns: IBoardColumn[];
    cards: ICard[];
    isFetching: boolean;
    isLoading: boolean;
    priorities: ITaskPriority[];
    members: IMember[];

    // Actions
    init: (axios: AxiosInstance, projectId: string) => void;
    setBoardState: (projectData: IBoardProject) => void;
    handleDragStart: (event: DragStartEvent) => void;
    handleCardDragEnd: (event: DragEndEvent) => void;
    handleColumnDragEnd: (event: DragEndEvent) => void;
    addCard: (message: ICardMessage) => void;
    deleteCard: (cardId: string, columnId: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => {
    let sourceColumn: IBoardColumn | null = null;
    let axios: AxiosInstance | null = null;
    let letProjectId: string | null = null;

    return {
        // Base state
        isLoading: true,
        isFetching: false,
        projectId: null,
        projectName: null,
        priorities: [],
        members: [],
        columns: [],
        cards: [],

        init: (axiosInstance: AxiosInstance, pId: string) => {
            axios = axiosInstance;
            set(() => ({ projectId: pId }));
            letProjectId = pId;

            const fetchProject = async () => {
                try {
                    set({ isLoading: true });
                    const response = await axios!.get<IBoardProject>(
                        `/projects/${letProjectId}`
                    );
                    get().setBoardState(response.data);
                } catch (err) {
                    // mb set error in future
                    console.error(err);
                } finally {
                    set({ isLoading: false });
                }
            };
            fetchProject();
        },

        setBoardState: (projectData) => {
            const cleanProjectData = JSON.parse(JSON.stringify(projectData));

            const columnsMap = new Map(
                cleanProjectData.columns.map((col: any) => [col.id, col])
            );
            const sortedColumns = (cleanProjectData.columnOrder || [])
                .map((colId: any) => columnsMap.get(colId)!)
                .filter(Boolean);

            set({
                priorities: projectData.priorities,
                members: projectData.members,
                projectName: projectData.name,
                columns: sortedColumns,
                cards: sortedColumns.flatMap((col: any) => col.cards),
            });
        },

        handleDragStart: (event) => {
            const { active } = event;
            const cardId = active.id as string;

            if (active.data.current?.type === "Card") {
                sourceColumn =
                    findColumnByCardId(cardId, get().columns) || null;
            }
        },

        handleCardDragEnd: (event) => {
            const { active, over } = event;
            const { columns, cards } = get();
            if (!over || !active || !sourceColumn || !columns || !cards) return;

            const cardId = active.id as string;
            const overId = over.id as string;

            const destColumn =
                findColumnByCardId(overId, columns) ||
                columns.find((c) => c.id === overId)!;

            // If card destination not changed
            if (destColumn === sourceColumn && cardId === overId) return;

            // Swap cards order in the same column
            if (sourceColumn.id === destColumn.id) {
                const oldIndex = sourceColumn.cardOrder.indexOf(cardId);
                const newIndex = destColumn.cardOrder.indexOf(overId);
                sourceColumn.cardOrder = arrayMove(
                    sourceColumn.cardOrder,
                    oldIndex,
                    newIndex
                );
                set(() => ({
                    columns: updateColumns(columns, sourceColumn!),
                }));
            } else {
                // Так как в handleDragOver мы добавляем карточку в массив, перетаскиваемая карточка всегда будет в конце
                // сначала убираем фантомную карточку, а затем ставим на ее место настояющую
                const isOverCard = cards.some((c) => c.id === overId);
                sourceColumn.cardOrder = sourceColumn.cardOrder.filter(
                    (c) => c !== cardId
                );
                destColumn.cardOrder = destColumn.cardOrder.filter(
                    (c) => c !== cardId
                );
                const newIndex = isOverCard
                    ? destColumn.cardOrder.indexOf(overId)
                    : destColumn.cardOrder.length;
                destColumn.cardOrder.splice(newIndex, 0, cardId);

                set(() => ({
                    columns: updateColumns(columns, [
                        destColumn,
                        sourceColumn!,
                    ]),
                    cards: cards.map((card) => {
                        if (card.id === cardId) {
                            card.columnId = destColumn.id;
                        }
                        return card;
                    }),
                }));
            }

            // --- 2. ОТПРАВКА НА СЕРВЕР ---
            if (!axios || !letProjectId) return;

            websocketService.moveCard({
                projectId: letProjectId,
                sourceColumn: {
                    id: sourceColumn.id,
                    cardOrder: sourceColumn.cardOrder,
                },
                destinationColumn: {
                    id: destColumn.id,
                    cardOrder: destColumn.cardOrder,
                },
                card: cards.find((c) => c.id === cardId)!,
            });
        },

        handleColumnDragEnd: (event) => {
            const { active, over } = event;
            const { columns } = get();
            if (!over || !active || !letProjectId || !columns) return;

            const oldIndex = columns.findIndex((c) => c.id === active.id);
            const newIndex = columns.findIndex((c) => c.id === over.id);

            // If column destination not changed
            if (oldIndex === newIndex) return;

            const newColumns = arrayMove(columns, oldIndex, newIndex);

            set(() => ({ columns: newColumns }));

            const newOrder = newColumns.map((col) => col.id);
            websocketService.moveColumn({
                projectId: letProjectId,
                columnOrder: newOrder,
            });
        },

        addCard: (cardDto: ICardMessage) => {
            if (!letProjectId) return;
            websocketService.addCard(cardDto);
        },

        deleteCard: (cardId: string, columnId: string) => {
            if (!letProjectId) return;
            websocketService.deleteCard({
                projectId: letProjectId,
                deletedCardId: cardId,
                columnId,
            });
        },
    };
});
