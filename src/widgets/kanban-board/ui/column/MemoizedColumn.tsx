import { ColumnTypes } from "@/entities/column";
import { useDragAndDrop } from "@/features/drag-and-drop";
import { memo } from "react";
import type {
    DraggableAttributes,
    DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { useDndSortable } from "@/shared/lib/useDndSortable";
import { SortableContext } from "@dnd-kit/sortable";
import SettingsMenu from "@/pages/dashboard/ui/SettingsMenu";
import { Badge } from "@/shared/ui/badge";
import { GripVertical } from "lucide-react";
import { CreateCardButton } from "@/features/card/add-card";
import { Column as BoardColumn } from "@/entities/column";
import { cn } from "@/shared/lib/cn";
import { CardList } from "../card/CardList";

type MemoizedColumnProps = {
    column: ColumnTypes.TColumnSchema;
    isOverlay?: boolean;
    draggableAttributes?: DraggableAttributes;
    draggableListeners?: DraggableSyntheticListeners;
};

export const MemoizedColumn = memo(
    ({
        column,
        draggableAttributes,
        draggableListeners,
        isOverlay,
    }: MemoizedColumnProps) => {
        const { cards } = useDragAndDrop();

        const { setNodeRef, listeners, attributes, style, isDragging } =
            useDndSortable({
                id: column.id,
                data: { type: "column", column },
                attributes: { roleDescription: `Column: ${column.title}` },
            });

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    isOverlay && "cursor-grabbing",
                    isDragging && "opacity-45"
                )}
            >
                <BoardColumn column={column}>
                    <BoardColumn.Header {...attributes}>
                        <div
                            {...listeners}
                            {...draggableAttributes}
                            {...draggableListeners}
                            className="flex flex-row grow-1 items-center gap-2 hover:bg-accent-foreground/7 transition-all duration-100 rounded-md p-1 py-2 cursor-grab active:cursor-grabbing"
                        >
                            <GripVertical className="shrink-0" />
                            <BoardColumn.Title />
                            <Badge
                                variant="default"
                                className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums shrink-0 font-bold"
                            >
                                {cards.length}
                            </Badge>
                        </div>
                        <SettingsMenu className="hover:bg-muted-foreground/15 dark:hover:bg-muted-foreground/15 shrink-0" />
                    </BoardColumn.Header>
                    <BoardColumn.Content>
                        <SortableContext items={cards.map((c) => c.id)}>
                            <CardList
                                cards={cards?.filter(
                                    (c) => c.columnId === column.id
                                )}
                            />
                        </SortableContext>
                        <CreateCardButton column={column} />
                    </BoardColumn.Content>
                </BoardColumn>
            </div>
        );
    }
);
