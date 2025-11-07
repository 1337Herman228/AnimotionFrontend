import { CardApiTypes, cardService } from "@/entities/card";
import { ColumnTypes } from "@/entities/column";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";

interface CreateCardBtnProps {
    column: ColumnTypes.TColumnSchema;
}

export const CreateCardButton = ({ column }: CreateCardBtnProps) => {
    const params = useParams();
    const boardId = params?.boardId as string;

    const template: CardApiTypes.TAddCardDtoSchema = {
        projectId: boardId || "",
        title: "Card" + Math.random().toString(36).substring(2),
        columnId: column.id,
        description: "Description...",
        appointedMembers: null,
        priority: null,
    };

    return (
        <Button
            onClick={() => cardService.addCard(template)}
            variant={"ghost"}
            className="cursor-pointer w-full hover:bg-accent-foreground/10 dark:hover:bg-accent-foreground/10 transition-all duration-300 justify-start"
        >
            <div className="flex place-items-center gap-1.5">
                <Plus strokeWidth={2} size={20} className="size-5" />
                <span className="">Create New Card</span>
            </div>
        </Button>
    );
};
