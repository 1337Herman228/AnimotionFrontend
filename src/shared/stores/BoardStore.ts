import { IBoardProject, ICard, IColumnCard } from "@/types";
import { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AxiosInstance } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { Session } from "next-auth";

export class BoardStore {
    columns: IColumnCard[] = [];
    cards: ICard[] = [];
    projectName: string = "";

    isFetching = true;
    error: Error | null = null;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    // Action для загрузки и "разбора" данных проекта
    fetchProject = async (
        axios: AxiosInstance,
        id: string,
        session: Session | null
    ) => {
        if (!session) return;

        this.isFetching = true;
        try {
            const response = await axios.get<IBoardProject>(`/projects/${id}`);
            const projectData = response.data;

            runInAction(() => {
                this.projectName = projectData.name;
                this.columns = projectData.columns;
                this.cards = projectData.columns.flatMap((col) => col.cards);
            });
        } catch (err: any) {
            runInAction(() => {
                this.error = err;
                console.error("Failed to fetch project:", err);
            });
        } finally {
            runInAction(() => {
                this.isFetching = false;
            });
        }
    };

    get findColumnByCardId() {
        return (cardId: string) =>
            this.columns.find((col) => col.cardOrder.includes(cardId));
    }

    handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const cardId = active.id as string;
        const overId = over.id as string;

        const sourceColumn = this.findColumnByCardId(cardId);
        const destColumn =
            over.data.current?.type === "Column"
                ? this.columns.find((c) => c.id === overId)
                : this.findColumnByCardId(overId);

        if (!sourceColumn || !destColumn || sourceColumn.id === destColumn.id) {
            return;
        }

        const cardIndex = sourceColumn.cardOrder.indexOf(cardId);
        sourceColumn.cardOrder.splice(cardIndex, 1);
        destColumn.cardOrder.push(cardId);
    }

    handleCardDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        const cardId = active.id as string;
        const overId = over.id as string;

        const sourceColumn = this.findColumnByCardId(cardId)!;
        const destColumn =
            this.findColumnByCardId(overId) ||
            this.columns.find((c) => c.id === overId)!;

        if (!sourceColumn || !destColumn) return;

        if (sourceColumn.id === destColumn.id) {
            if (cardId === overId) return;

            const oldIndex = sourceColumn.cardOrder.indexOf(cardId);
            const newIndex = sourceColumn.cardOrder.indexOf(overId);

            sourceColumn.cardOrder = arrayMove(
                sourceColumn.cardOrder,
                oldIndex,
                newIndex
            );
        } else {
            const isOverACard = this.cards.some((c) => c.id === overId);
            const overIndex = isOverACard
                ? destColumn.cardOrder.indexOf(overId)
                : destColumn.cardOrder.length;

            // We a `handleDragOver`,
            // поэтому нам нужно только отсортировать ее в новой колонке.
            const oldIndexInNewColumn = destColumn.cardOrder.indexOf(cardId);

            destColumn.cardOrder = arrayMove(
                destColumn.cardOrder,
                oldIndexInNewColumn,
                overIndex
            );
        }

        // TODO: Отправить запрос на бэкенд для сохранения изменений.
        // Теперь у вас есть финальное состояние `destColumn.cardOrder` и `destColumn.id`,
        // которые можно отправить на сервер.
    }

    moveColumn(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = this.columns.findIndex((col) => col.id === active.id);
        const newIndex = this.columns.findIndex((col) => col.id === over.id);

        // Используем arrayMove для обновления порядка в массиве колонок
        this.columns = arrayMove(this.columns, oldIndex, newIndex);

        // TODO: Вызвать API для сохранения нового порядка
        // const newOrder = this.columns.map(col => col.id);
        // axios.patch(`/projects/${this.projectId}/column-order`, { columnOrder: newOrder });
    }
}

export default BoardStore;
