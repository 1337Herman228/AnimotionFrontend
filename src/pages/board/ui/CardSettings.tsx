import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import SettingsButton from "@/shared/components/Settings/SettingsButton";
import { ICard } from "@/types";
import { useBoardStore } from "@/shared/stores/boardStore";
import { Delete, Edit } from "lucide-react";

interface CardSettingsProps {
    card: ICard;
}

const CardSettings = ({ card }: CardSettingsProps) => {
    const { deleteCard } = useBoardStore();

    return (
        <SettingsButton>
            <DropdownMenuItem>
                <Edit />
                Edit card
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => deleteCard(card.id, card.columnId)}
            >
                <Delete className="text-red-500" />
                <span className="text-red-500">Delete card</span>
            </DropdownMenuItem>
        </SettingsButton>
    );
};

export default CardSettings;
