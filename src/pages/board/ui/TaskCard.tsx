import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/sortable";
import { ICard } from "@/types";

interface TaskCardProps {
    card: ICard;
    isOverlay?: boolean;
}

const TaskCard = ({ card, isOverlay }: TaskCardProps) => {
    const { attributes, listeners, setNodeRef, transition, isDragging } =
        useSortable({
            id: card.id,
            data: { type: "Card", card },
        });

    const style = {
        transition,
    };

    const cardClasses = ` ${isDragging && !isOverlay ? "opacity-30" : ""} ${
        isOverlay ? "cursor-grabbing" : "cursor-grab"
    }`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cardClasses}
        >
            <Card className="hover:shadow-md cursor-grab active:cursor-grabbing">
                <CardHeader className="p-3">
                    <CardTitle className="text-sm font-normal">
                        {card.title}
                    </CardTitle>
                </CardHeader>
                {/* Можно добавить CardContent для описания */}
                <CardFooter className="p-3 flex justify-end">
                    <Avatar className="h-6 w-6">
                        {/* Логика для отображения аватара исполнителя */}
                    </Avatar>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TaskCard;
