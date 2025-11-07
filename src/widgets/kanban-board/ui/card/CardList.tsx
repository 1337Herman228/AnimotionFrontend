import { CardTypes } from "@/entities/card";
import { SortableContext } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { MemoizedCard } from "./MemoizedCard";

type CardListProps = {
    cards: CardTypes.TCardsSchema | undefined;
};

export const CardList = ({ cards }: CardListProps) => {
    const cardsIds = useMemo(() => cards?.map((c) => c.id), [cards]);

    const filteredCards =
        // useFilteredCards
        cards || [];

    return (
        <SortableContext items={cardsIds || []}>
            {filteredCards?.length > 0 && (
                <div className="flex flex-col gap-2 ">
                    {filteredCards.map((card) => (
                        <MemoizedCard key={card.id} card={card} />
                    ))}
                </div>
            )}
        </SortableContext>
    );
};
