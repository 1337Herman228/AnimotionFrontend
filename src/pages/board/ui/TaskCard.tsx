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
import SettingsMenu from "@/pages/dashboard/ui/SettingsMenu";
import { cn } from "@/lib/utils";

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
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(cardClasses, "")}
        >
            <Card className="rounded-md hover:border-primary transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent-foreground/35 select-none gap-3">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex justify-between gap-2">
                        <CardTitle className="text-lg font-semibold">
                            {card.title}
                            {/* ({card.id}) */}
                        </CardTitle>
                    </div>
                    <SettingsMenu />
                </CardHeader>

                <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground mb-4 ">
                        <p className=" line-clamp-3">{card.description}</p>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                        <Avatar className="h-8 w-8 border-0">
                            <AvatarImage src={card.assigneeId} />
                            <AvatarFallback>{card.assigneeId}</AvatarFallback>
                        </Avatar>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        Updated 2 days ago
                    </span>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TaskCard;
