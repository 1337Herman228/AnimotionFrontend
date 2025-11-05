import { ICard, IBoardColumn, ICardMessage } from "@/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TaskCard from "../Card/TaskCard";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/shared/ui/badge";
import { GripVertical } from "lucide-react";
import { CreateCardButton } from "@/features/card/add-card";
import { Column as BoardColumn } from "@/entities/column";
import { SettingsMenu } from "@/features/board";

interface ColumnProps {
    column: IBoardColumn;
    cards: ICard[];
    isOverlay?: boolean;
}

const Column = ({ column, cards, isOverlay }: ColumnProps) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const containerClasses = ` ${isDragging && !isOverlay && "opacity-60"} ${
        isOverlay && "cursor-grabbing"
    }`;

    return (
        <div ref={setNodeRef} style={style} className={containerClasses}>
            <BoardColumn column={column}>
                <BoardColumn.Header {...attributes}>
                    <div
                        {...listeners}
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
                        {cards.map((card) => (
                            <TaskCard key={card.id} card={card} />
                        ))}
                    </SortableContext>
                    <CreateCardButton column={column} />
                </BoardColumn.Content>
            </BoardColumn>
        </div>
    );
};

export default Column;
