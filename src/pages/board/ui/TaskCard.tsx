import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
    CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/sortable";
import { ICard } from "@/types";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";
import CardSettings from "./CardSettings";
import { memo } from "react";

interface TaskCardProps {
    card: ICard;
    isOverlay?: boolean;
}

const TaskCard = memo(({ card, isOverlay }: TaskCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transition,
        transform,
        isDragging,
    } = useSortable({
        id: card.id,
        data: { type: "Card", card },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const cardClasses = ` ${isDragging && !isOverlay ? "opacity-45" : ""} ${
        isOverlay ? "cursor-grabbing" : "cursor-grab"
    }`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(cardClasses, "")}
        >
            <Card
                style={
                    {
                        "--card-color": card.priority.color,
                    } as React.CSSProperties
                }
                className={cn(
                    "border-l-[var(--card-color)]",
                    "border-l-8 rounded-md transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent-foreground/35 select-none gap-3"
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex justify-between gap-2">
                        <CardTitle className="text-lg font-semibold leading-6">
                            {card.title}
                            {/* ({card.id}) */}
                        </CardTitle>
                    </div>
                    <CardSettings card={card} />
                </CardHeader>

                {card.description && (
                    <CardContent>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <p className=" line-clamp-3">{card.description}</p>
                        </div>
                    </CardContent>
                )}

                <CardFooter className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                        <Avatar className="h-8 w-8 border-0">
                            <AvatarImage src={card.assigneeId} />
                            <AvatarFallback>{card.assigneeId}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex gap-0.5 place-items-center font-medium">
                        <Dot
                            size={20}
                            strokeWidth={9}
                            style={{
                                color: card.priority.color,
                            }}
                        />

                        {card.priority.label}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        Updated 2 days ago
                    </span>
                </CardFooter>
            </Card>
        </div>
    );
});

export default TaskCard;
