import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ICard, IColumnCard } from "@/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { CSS } from "@dnd-kit/utilities";

interface ColumnProps {
    column: IColumnCard;
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
            <Card className="w-[320px] bg-muted/50">
                <CardHeader
                    {...attributes}
                    {...listeners}
                    className="flex flex-row justify-between items-center p-4 cursor-grab active:cursor-grabbing"
                >
                    <CardTitle className="text-md font-semibold">
                        {column.title}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                        {cards.length}
                    </span>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 p-2">
                    <SortableContext items={cards.map((c) => c.id)}>
                        {cards.map((card) => (
                            <TaskCard key={card.id} card={card} />
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </div>
    );
};

export default Column;
