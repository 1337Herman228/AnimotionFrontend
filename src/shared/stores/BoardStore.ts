import { websocketService } from "@/services/webSocketService";
import { IBoardProject, ICard, IBoardColumn } from "@/types";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AxiosInstance } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { SetStateAction } from "react";

export class BoardStore {
    axios: AxiosInstance | null = null;
    projectId: string | null = null;

    columns: IBoardColumn[] = [];
    cards: ICard[] = [];
    projectName: string = "";

    sourceColumn: IBoardColumn | null = null;

    isFetching = true;
    error: Error | null = null;

    activeCard: ICard | null = null;
    activeColumn: IBoardColumn | null = null;

    constructor() {
        makeAutoObservable(this, {
            axios: false,
            projectId: false,
            sourceColumn: false,
        });
    }

    // --- ИНИЦИАЛИЗАЦИЯ ---
    init(axiosInstance: AxiosInstance, projectId: string) {
        this.axios = axiosInstance;
        this.projectId = projectId;
        this.fetchProject();
    }

    async fetchProject() {
        if (!this.axios || !this.projectId) return;

        this.isFetching = true;
        try {
            // Убедитесь, что IBoardProject включает `columnOrder: string[]`
            const response = await this.axios.get<IBoardProject>(
                `/projects/${this.projectId}`
            );
            // Вызываем action для установки начального состояния
            this.setBoardState(response.data);
        } catch (err: any) {
            runInAction(() => {
                this.error = err;
            });
            console.error("Failed to fetch project:", err);
        } finally {
            runInAction(() => {
                this.isFetching = false;
            });
        }
    }

    // --- СИНХРОНИЗАЦИЯ ---
    /**
     * Единственный метод для применения состояния, полученного от сервера.
     * Вызывается как при первоначальной загрузке, так и при WebSocket-обновлениях.
     */
    setBoardState(projectData: IBoardProject) {
        this.projectName = projectData.name;

        const columnsMap = new Map(
            projectData.columns.map((col) => [col.id, col])
        );
        // Сортируем колонки в соответствии с `columnOrder` от сервера
        const sortedColumns = (projectData.columnOrder || [])
            .map((colId) => columnsMap.get(colId)!)
            .filter(Boolean);

        this.columns = sortedColumns;
        this.cards = sortedColumns.flatMap((col) => col.cards);
    }

    private findColumnByCardId = (cardId: string) => {
        return this.columns.find((col) => col.cardOrder.includes(cardId));
    };

    handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const cardId = active.id as string;

        runInAction(() => {
            if (active.data.current?.type === "Card") {
                this.activeCard = active.data.current.card;
                this.sourceColumn = this.findColumnByCardId(cardId) || null;
            }
            if (active.data.current?.type === "Column") {
                this.activeColumn = active.data.current.column;
            }
        });
    };

    // Момент перетаскивания карточки / колонки
    handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || !active || active.data.current?.type !== "Card") return;

        // перетасиваемая карточка
        const cardId = active.id as string;
        // карточка или колонка на которую перетаскивают
        const overId = over.id as string;

        // Ссылки на карточки внутри колонок (изменяют колонки внутри this.columns)
        // const column = this.findColumnByCardId(cardId) || null;
        // this.sourceColumn = column;

        console.log("this.sourceColumn", this.sourceColumn);

        //// когда active = over, то
        const destColumn =
            over.data.current?.type === "Column"
                ? this.columns.find((c) => c.id === overId)
                : active.id === over.id
                ? this.columns.find(
                      (c) => c.id === over.data.current?.card.columnId
                  )
                : this.findColumnByCardId(overId);

        // console.log("active", active);
        // console.log("over", over);
        console.log(" this.sourceColumn ", this.sourceColumn?.id);
        console.log("destColumn", destColumn?.id);

        if (!this.sourceColumn || !destColumn) {
            return;
        }

        // Оптимистично "перекидываем" карточку для плавного UI
        runInAction(() => {
            if (!this.sourceColumn) return;

            // Обновляем массив всех карточек сards и вносим в карточку новые данные
            this.cards = this.cards.map((card) => {
                if (card.id === cardId) {
                    card.columnId = destColumn.id;
                }
                return card;
            });

            // Обновляем source-колонку и все данные внутри неё
            const cardIndex = this.sourceColumn.cardOrder.indexOf(cardId);
            this.sourceColumn.cardOrder.splice(cardIndex, 1);
            this.sourceColumn.cards = this.sourceColumn.cards.filter(
                (c) => c.id !== cardId
            );

            // Обновляем destination-колонку и все данные внутри неё
            destColumn.cardOrder.push(cardId);
            const cardToUpdate = this.cards.find((c) => c.id === cardId);
            destColumn.cards.push(cardToUpdate!);

            // console.log("this.columns", this.columns);
            // console.log("this.cards", this.cards);
        });
    };

    handleCardDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !active || !this.sourceColumn) return;

        const cardId = active.id as string;
        const overId = over.id as string;
        // console.log(" active", active);
        // console.log(" over", over);

        const destColumn =
            this.findColumnByCardId(overId) ||
            this.columns.find((c) => c.id === overId)!;

        // console.log("active.id", active.id);
        // console.log("over.id", over.id);

        // console.log("destColumn", destColumn.id);
        // console.log("this.sourceColumn", this.sourceColumn.id);

        // Финальная сортировка на клиенте
        runInAction(() => {
            if (!this.sourceColumn) return;

            // Меняем местами карточки в одной и той же колонке
            if (this.sourceColumn.id === destColumn.id) {
                const oldIndex = this.sourceColumn.cardOrder.indexOf(cardId);
                const newIndex = destColumn.cardOrder.indexOf(overId);
                this.sourceColumn.cardOrder = arrayMove(
                    this.sourceColumn.cardOrder,
                    oldIndex,
                    newIndex
                );
            } else {
                // Так как в handleDragOver мы добавляем карточку в массив, перетаскиваемая карточка всегда будет в конце
                // сначала убираем фантомную карточку, а затем ставим на ее место настояющую
                const isOverCard = this.cards.some((c) => c.id === overId);
                destColumn.cardOrder = destColumn.cardOrder.filter(
                    (c) => c !== cardId
                );
                const newIndex = isOverCard
                    ? destColumn.cardOrder.indexOf(overId)
                    : destColumn.cardOrder.length;
                destColumn.cardOrder.splice(newIndex, 0, cardId);
            }
        });

        // console.log("sourceColumn end", sourceColumn!.id);
        // console.log("destColumn end", destColumn!.id);

        // --- 2. ОТПРАВКА НА СЕРВЕР ---
        if (!this.axios || !this.projectId) return;

        websocketService.moveCard({
            projectId: this.projectId,
            sourceColumn: {
                id: this.sourceColumn.id,
                cardOrder: this.sourceColumn.cardOrder,
            },
            destinationColumn: {
                id: destColumn.id,
                cardOrder: destColumn.cardOrder,
            },
            card: this.cards.find((c) => c.id === cardId)!,
        });
    };

    moveColumn = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !active || !this.projectId) return;

        // 1. Оптимистичное обновление
        const oldIndex = this.columns.findIndex((col) => col.id === active.id);
        const newIndex = this.columns.findIndex((col) => col.id === over.id);
        this.columns = arrayMove(this.columns, oldIndex, newIndex);

        // 2. Отправка на сервер
        const newOrder = this.columns.map((col) => col.id);
        websocketService.moveColumn({
            projectId: this.projectId,
            columnOrder: newOrder,
        });
    };

    handleDragEnd = (event: DragEndEvent) => {
        runInAction(() => {
            this.activeCard = null;
            this.activeColumn = null;
        });

        const { active, over } = event;

        // if (!over || active.id === over.id) return; //Неверное условие (когда перетаскиваешь снизу, то over = active)
        if (!over || !active) return;

        const activeIsColumn = active.data.current?.type === "Column";
        const activeIsCard = active.data.current?.type === "Card";

        if (activeIsColumn && active.id !== over.id) {
            this.moveColumn(event);
        }
        if (activeIsCard) {
            this.handleCardDragEnd(event);
        }
    };
}
