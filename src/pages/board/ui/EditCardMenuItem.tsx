import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ICard } from "@/types";
import { Edit } from "lucide-react";
import EditCardForm from "./EditCardForm";

interface EditCardMenuItemProps {
    card: ICard;
}

const EditCardMenuItem = ({ card }: EditCardMenuItemProps) => {
    return (
        <DropdownMenuItem asChild>
            <Dialog>
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
                    <EditCardForm card={card} />
                </DialogContent>
            </Dialog>
        </DropdownMenuItem>
    );
};

export default EditCardMenuItem;
