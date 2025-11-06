import SettingsButton from "@/shared/components/Settings/SettingsButton";
import { ICard } from "@/types";
import EditCardMenuItem from "./EditCardMenuItem";
import { DeleteCardMenuItem } from "@/features/card/delete-card";

interface CardSettingsProps {
    card: ICard;
}

const CardSettings = ({ card }: CardSettingsProps) => {
    return (
        <SettingsButton>
            <EditCardMenuItem card={card} />
            <DeleteCardMenuItem card={card} />
        </SettingsButton>
    );
};

export default CardSettings;
