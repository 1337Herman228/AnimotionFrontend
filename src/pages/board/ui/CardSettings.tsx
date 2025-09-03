import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import SettingsButton from "@/shared/components/Settings/SettingsButton";
import { ICard } from "@/types";
import { websocketService } from "@/services/webSocketService";

interface CardSettingsProps {
    card: ICard;
}

const onDeleteCard = () => {};

const CardSettings = ({ card }: CardSettingsProps) => {
    return (
        <SettingsButton>
            <DropdownMenuItem>Edit card</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
                Delete card
            </DropdownMenuItem>
        </SettingsButton>
    );
};

export default CardSettings;
