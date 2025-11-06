import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";
import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { ICard } from "@/types";
import { Edit } from "lucide-react";
import EditCardForm from "../card-dialog/EditCardForm";
import { useState } from "react";

interface EditCardMenuItemProps {
    card: ICard;
}

const EditCardMenuItem = ({ card }: EditCardMenuItemProps) => {
    const [isEditCardDialogOpen, setIsEditCardDialogOpen] =
        useState<boolean>(false);

    const handleClose = () => setIsEditCardDialogOpen(false);

    return (
        <DropdownMenuItem asChild>
            <Dialog
                open={isEditCardDialogOpen}
                onOpenChange={setIsEditCardDialogOpen}
            >
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="p-0 w-full cursor-pointer"
                    >
                        <div className="flex items-center gap-2 w-full py-1.5 px-2 grow-1 font-normal">
                            <Edit className="shrink-0 w-4 h-4" />
                            Edit card
                        </div>
                    </Button>
                </DialogTrigger>

                <DialogContent
                    onOpenAutoFocus={(e) => {
                        e.preventDefault();
                    }}
                    className="sm:max-w-[1200px] sm:w-[95vw] md:w-[90vw] sm:max-h-[90vh] overflow-auto gap-5"
                >
                    <DialogTitle />
                    <EditCardForm card={card} handleDialogClose={handleClose} />
                </DialogContent>
            </Dialog>
        </DropdownMenuItem>
    );
};

export default EditCardMenuItem;
