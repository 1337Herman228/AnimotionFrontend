import { Button } from "@/components/ui/button";
import { useBoardStore } from "@/shared/stores/boardStore";
import { IAddCardMessage, IBoardColumn } from "@/types";
import { Plus } from "lucide-react";

interface CreateNewCardBtnProps {
    column: IBoardColumn;
}

const CreateNewCardBtn = ({ column }: CreateNewCardBtnProps) => {
    const { addCard, projectId } = useBoardStore();

    const template: IAddCardMessage = {
        projectId: projectId || "",
        title: "Card" + Math.random().toString(36).substring(2),
        columnId: column.id,
        description: "Description...",
        appointedMembers: null,
        priority: null,
    };

    return (
        <Button
            onClick={() => addCard(template)}
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

export default CreateNewCardBtn;
