import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { IBoardColumn, ICard, IBoardProject } from "@/types";
import { websocketService } from "@/services/webSocketService";
import { AxiosInstance } from "axios";
import { findColumnByCardId, updateColumns } from "../utils";

interface BoardState {
    projectName: string | null;
    columns: IBoardColumn[];
    cards: ICard[];

    // Actions
    init: (axios: AxiosInstance, projectId: string) => void;
    setBoardState: (projectData: IBoardProject) => void;
    handleDragStart: (event: DragStartEvent) => void;
    handleCardDragEnd: (event: DragEndEvent) => void;
    handleColumnDragEnd: (event: DragEndEvent) => void;
    addCard: () => void;
}

export const useBoardStore = create<BoardState>((set, get) => {
    let sourceColumn: IBoardColumn | null = null;
    let axios: AxiosInstance | null = null;
    let projectId: string | null = null;

    return {
        // Base state
        projectName: null,
        columns: [],
        cards: [],

        init: (axiosInstance: AxiosInstance, pId: string) => {
            axios = axiosInstance;
            projectId = pId;

            const fetchProject = async () => {
                try {
                    const response = await axios!.get<IBoardProject>(
                        `/projects/${projectId}`
                    );
                    get().setBoardState(response.data);
                } catch (err) {
                    // mb set error in future
                    console.error(err);
                }
            };
            fetchProject();
        },

        setBoardState: (projectData) => {
            const columnsMap = new Map(
                projectData.columns.map((col) => [col.id, col])
            );
            const sortedColumns = (projectData.columnOrder || [])
                .map((colId) => columnsMap.get(colId)!)
                .filter(Boolean);

            set({
                projectName: projectData.name,
                columns: sortedColumns,
                cards: sortedColumns.flatMap((col) => col.cards),
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
            if (!axios || !projectId) return;

            websocketService.moveCard({
                projectId: projectId,
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
            if (!over || !active || !projectId || !columns) return;

            const oldIndex = columns.findIndex((c) => c.id === active.id);
            const newIndex = columns.findIndex((c) => c.id === over.id);
            const newColumns = arrayMove(columns, oldIndex, newIndex);

            set(() => ({ columns: newColumns }));

            const newOrder = newColumns.map((col) => col.id);
            websocketService.moveColumn({
                projectId: projectId,
                columnOrder: newOrder,
            });
        },

        addCard: () => {
            if (!projectId) return;
            websocketService.addCard({
                projectId,
                title: "new card" + Math.random(),
                columnId: "68b6fb215d8baf41b878c229",
                description: "Description...",
                assigneeId: "68b6fb215d8baf41b878c222",
                priority: {
                    id: "68b6fb215d8baf41b878c225",
                    projectId: null,
                    value: "NORMAL",
                    label: "Normal",
                    color: "#b8e7bc",
                },
            });
        },
    };
});
