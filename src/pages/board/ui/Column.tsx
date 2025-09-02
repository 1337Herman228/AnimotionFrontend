import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ICard, IBoardColumn } from "@/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { CSS } from "@dnd-kit/utilities";
import SettingsMenu from "@/pages/dashboard/ui/SettingsMenu";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import CreateNewCardBtn from "./CreateNewCard";

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
            <Card className="w-[320px] bg-muted/65 dark:bg-muted/90 rounded-md py-0 pt-6">
                <CardHeader
                    {...attributes}
                    {...listeners}
                    className="flex flex-row justify-between items-center cursor-grab active:cursor-grabbing select-none"
                >
                    <div className="flex flex-row items-center gap-2">
                        <GripVertical className="shrink-0" />
                        <CardTitle className="text-md font-semibold break-all">
                            {column.title}
                            {/* ({column.id}) */}
                        </CardTitle>
                        <Badge
                            variant="default"
                            className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums shrink-0"
                        >
                            {cards.length}
                        </Badge>
                    </div>
                    <SettingsMenu className="hover:bg-muted-foreground/15 dark:hover:bg-muted-foreground/15 shrink-0" />
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5 p-1.5">
                    <SortableContext items={cards.map((c) => c.id)}>
                        {cards.map((card) => (
                            <TaskCard key={card.id} card={card} />
                        ))}
                    </SortableContext>
                    <CreateNewCardBtn />
                </CardContent>
            </Card>
        </div>
    );
};

export default Column;
