import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ICard } from "@/types";
import { Delete } from "lucide-react";

interface DeleteCardMenuItemProps {
    card: ICard;
    deleteCard: (cardId: string, columnId: string) => void;
}
const DeleteCardMenuItem = ({ deleteCard, card }: DeleteCardMenuItemProps) => {
    return (
        <DropdownMenuItem
            onClick={() => deleteCard(card.id, card.columnId)}
            className="cursor-pointer"
        >
            <Delete className="text-red-500 shrink-0" />
            <span className="text-red-500">Delete card</span>
        </DropdownMenuItem>
    );
};

export default DeleteCardMenuItem;
