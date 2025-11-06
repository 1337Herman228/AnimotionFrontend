import { cardService } from "@/entities/card";
import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { ICard } from "@/types";
import { Delete } from "lucide-react";

interface DeleteCardMenuItemProps {
    card: ICard;
}
export const DeleteCardMenuItem = ({ card }: DeleteCardMenuItemProps) => {
    return (
        <DropdownMenuItem
            onClick={() => cardService.deleteCard(card.id)}
            className="cursor-pointer"
        >
            <Delete className="text-red-500 shrink-0" />
            <span className="text-red-500">Delete card</span>
        </DropdownMenuItem>
    );
};
