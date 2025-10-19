import { useSortable } from "@dnd-kit/sortable";
import { ICard } from "@/types";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import CardSettings from "./card-settings/CardSettings";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/entities/card";
import { CardTitle } from "@/shared/ui/card";

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
            <Card card={card}>
                <Card.Header>
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
                </Card.Header>
                <Card.Description />
                <Card.FooterContainer>
                    <Card.Members />
                    <Card.Footer />
                </Card.FooterContainer>
            </Card>
        </div>
    );
};

export default TaskCard;
