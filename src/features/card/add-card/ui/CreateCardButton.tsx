import { TAddCardDtoSchema } from "@/entities/card";
import { TColumnSchema } from "@/entities/column";
import { websocketManager } from "@/shared/api/ws-manager";
import { useBoardStore } from "@/shared/stores/boardStore";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";

interface CreateCardBtnProps {
    column: TColumnSchema;
}

export const CreateCardButton = ({ column }: CreateCardBtnProps) => {
    const params = useParams();
    const projectId = params?.projectId as string;

    const template: TAddCardDtoSchema = {
        projectId: projectId || "",
        title: "Card" + Math.random().toString(36).substring(2),
        columnId: column.id,
        description: "Description...",
        appointedMembers: null,
        priority: null,
    };

    return (
        <Button
            onClick={() => websocketManager.addCard(template)}
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
