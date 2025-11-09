import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import AddCardForm from "./AddCardForm";
import { useParams } from "next/navigation";
import { ColumnTypes } from "@/entities/column";

interface AddCardDialogProps {
    column: ColumnTypes.TColumnSchema;
    open?: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddCardDialog = ({
    column,
    open,
    onOpenChange,
}: AddCardDialogProps) => {
    const params = useParams();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
                className="sm:max-w-[1200px] sm:w-[95vw] md:w-[90vw] sm:max-h-[90vh] overflow-auto gap-5"
            >
                <DialogTitle />
                <AddCardForm
                    boardId={params.boardId as string}
                    column={column}
                    handleDialogClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
};
