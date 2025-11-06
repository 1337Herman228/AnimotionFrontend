import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import EditCardForm from "./EditCardForm";
import { ICard } from "@/types";

interface EditCardDialogProps {
    card: ICard;
    open?: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditCardDialog = ({
    card,
    open,
    onOpenChange,
}: EditCardDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
                className="sm:max-w-[1200px] sm:w-[95vw] md:w-[90vw] sm:max-h-[90vh] overflow-auto gap-5"
            >
                <DialogTitle />
                <EditCardForm
                    card={card}
                    handleDialogClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
};
