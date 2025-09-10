import SettingsButton from "@/shared/components/Settings/SettingsButton";
import { ICard } from "@/types";
import { useBoardStore } from "@/shared/stores/boardStore";
import EditCardMenuItem from "./EditCardMenuItem";
import DeleteCardMenuItem from "./DeleteCardMenuItem";

interface CardSettingsProps {
    card: ICard;
}

const CardSettings = ({ card }: CardSettingsProps) => {
    const { deleteCard } = useBoardStore();

    return (
        <SettingsButton>
            <EditCardMenuItem card={card} />
            <DeleteCardMenuItem deleteCard={deleteCard} card={card} />
        </SettingsButton>
    );
};

export default CardSettings;
