import { GripVertical } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Card, CardTypes } from "@/entities/card";
import { CardTitle } from "@/shared/ui/card";
import { memo, useState } from "react";
import { useDndSortable } from "@/shared/lib/useDndSortable";
import { DeleteCardMenuItem } from "@/features/card/delete-card";
import { EditCardDialog, EditCardMenuItem } from "@/features/card/edit-card";

interface TaskCardProps {
    card: CardTypes.TCardSchema;
    isOverlay?: boolean;
}

export const MemoizedCard = memo(({ card, isOverlay }: TaskCardProps) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

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
                    <>
                        <Card.Settings>
                            <EditCardMenuItem
                                onSelect={() => setIsEditDialogOpen(true)}
                            />
                            <DeleteCardMenuItem card={card} />
                        </Card.Settings>
                        <EditCardDialog
                            card={card}
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                        />
                    </>
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
