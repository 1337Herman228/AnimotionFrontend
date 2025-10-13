import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
    CardContent,
} from "@/shared/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { ICard } from "@/types";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, UserRoundX } from "lucide-react";
import CardSettings from "./card-settings/CardSettings";
import PriorityBadge from "@/shared/components/Badge/PriorityBadge";
import TaskMembers from "@/features/task-members/ui/TaskMembers";
import { timeAgo } from "@/shared/utils/lib/dayjs";
import { cn } from "@/shared/utils/lib/cn";

interface TaskCardProps {
    card: ICard;
    isOverlay?: boolean;
}

const TaskCard = ({ card, isOverlay }: TaskCardProps) => {
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
        <div ref={setNodeRef} style={style} {...attributes}>
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
                <CardHeader className="grid grid-cols-[auto_36px] gap-0">
                    <div
                        {...listeners}
                        className={cn(
                            cardClasses,
                            "flex gap-2 place-items-center hover:bg-accent-foreground/7 transition-all duration-100 rounded-md p-1"
                        )}
                    >
                        <GripVertical className="shrink-0" />
                        <CardTitle className="text-lg font-semibold leading-6 break-words overflow-hidden">
                            {card.title}
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

                <CardFooter className="flex flex-col justify-start items-start gap-2">
                    <div className="pb-2">
                        {card.appointedMembers.length ? (
                            <TaskMembers
                                members={card.appointedMembers}
                                color={card.priority.color}
                            />
                        ) : (
                            <div className="flex place-items-center gap-2">
                                <div className="flex place-items-center justify-center h-8 w-8 rounded-full bg-accent-foreground/7 dark:bg-accent-foreground/10 ">
                                    <UserRoundX className="shrink-0 h-5 w-5" />
                                </div>
                                <span className="text-md text-muted-foreground">
                                    Unassigned
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex place-items-center gap-3 w-full justify-between">
                        <div className="flex gap-1.5 place-items-center font-medium">
                            <PriorityBadge
                                color={card.priority.color}
                                letter={card.priority.value}
                                className="h-5 w-5 text-md"
                            />
                            <span className="leading-4">
                                {card.priority.label}
                            </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Updated {timeAgo(card.updatedAt)}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TaskCard;
