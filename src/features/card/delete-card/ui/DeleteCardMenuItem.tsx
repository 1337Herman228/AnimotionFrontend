import { cardService, CardTypes } from "@/entities/card";
import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { Delete } from "lucide-react";

interface DeleteCardMenuItemProps {
    card: CardTypes.TCardSchema;
}
export const DeleteCardMenuItem = ({ card }: DeleteCardMenuItemProps) => {
    return (
        <DropdownMenuItem
            onSelect={() => cardService.deleteCard(card.id)}
            variant="destructive"
        >
            <div className="flex items-center gap-2 w-full grow-1 font-normal cursor-pointer text-red-500">
                <Delete className="text-red-500 shrink-0 w-4 h-4" />
                Delete Card
            </div>
        </DropdownMenuItem>
    );
};
