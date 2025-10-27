import { ICard } from "@/types";
import { GripVertical } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/entities/card";
import { CardTitle } from "@/shared/ui/card";
import CardSettings from "@/pages/board/ui/Card/card-settings/CardSettings";
import { memo } from "react";
import { useDndSortable } from "@/shared/lib/useDndSortable";

interface TaskCardProps {
    card: ICard;
    isOverlay?: boolean;
}

export const MemoizedCard = memo(({ card, isOverlay }: TaskCardProps) => {
    const { setNodeRef, listeners, attributes, style, isDragging } =
        useDndSortable({
            id: card.id,
            data: { type: "card", card },
            attributes: { roleDescription: `Card: ${card.title}` },
        });

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card card={card}>
                <Card.Header>
                    <div
                        {...listeners}
                        className={cn(
                            "flex gap-2 place-items-center hover:bg-accent-foreground/7 transition-all duration-100 rounded-md p-1",
                            isDragging && "opacity-45",
                            isOverlay ? "cursor-grabbing" : "cursor-grab"
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
});
