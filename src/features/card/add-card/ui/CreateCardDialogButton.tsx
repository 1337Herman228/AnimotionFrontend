import { ColumnTypes } from "@/entities/column";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { AddCardDialog } from "./AddCardDialog";
import { useState } from "react";

interface CreateCardBtnProps {
    column: ColumnTypes.TColumnSchema;
}

export const CreateCardDialogButton = ({ column }: CreateCardBtnProps) => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

    return (
        <>
            <Button
                onClick={() => setIsAddDialogOpen(true)}
                variant={"ghost"}
                className="cursor-pointer w-full hover:bg-accent-foreground/10 dark:hover:bg-accent-foreground/10 transition-all duration-300 justify-start"
            >
                <div className="flex place-items-center gap-1.5">
                    <Plus strokeWidth={2} size={20} className="size-5" />
                    <span className="">Create New Card</span>
                </div>
            </Button>
            <AddCardDialog
                column={column}
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
            />
        </>
    );
};
