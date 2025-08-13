import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ICard, IColumnCard } from "@/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
    column: IColumnCard;
    cards: ICard[];
}

const Column = ({ column, cards }: ColumnProps) => {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: { type: "Column" },
    });

    return (
        <div ref={setNodeRef}>
            <Card className="w-[320px] bg-muted/50">
                <CardHeader className="flex flex-row justify-between items-center p-4">
                    <CardTitle className="text-md font-semibold">
                        {column.title}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                        {cards.length}
                    </span>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 p-2">
                    {/* Контекст для сортировки карточек ВНУТРИ этой колонки */}
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
