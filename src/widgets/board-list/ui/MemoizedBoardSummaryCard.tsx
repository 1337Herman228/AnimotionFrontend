import { BoardSummaryCard, boardTypes } from "@/entities/board";
import { SettingsMenu } from "@/features/board";
import { Separator } from "@/shared/ui/separator";
import { memo } from "react";

export const MemoizedBoardSummaryCard = memo(
    ({ board }: { board: boardTypes.TBoardSummarySchema }) => {
        return (
            <BoardSummaryCard
                key={board.id}
                // Mock some additional data
                board={{
                    ...board,
                    stats: [
                        {
                            value: "TO_DO",
                            label: "To do",
                            count: 1,
                        },
                        {
                            value: "IN_PROGRESS",
                            label: "In progress",
                            count: 2,
                        },
                        {
                            value: "DONE",
                            label: "done",
                            count: 1,
                        },
                    ],
                    lastUpdated: "Updated 2 days ago",
                }}
            >
                <BoardSummaryCard.Header>
                    <SettingsMenu />
                </BoardSummaryCard.Header>
                <BoardSummaryCard.Content>
                    <Separator className="mb-4" />
                    <BoardSummaryCard.Stats />
                </BoardSummaryCard.Content>
                <BoardSummaryCard.Footer>
                    <BoardSummaryCard.Members />
                    <BoardSummaryCard.LastUpdated />
                </BoardSummaryCard.Footer>
            </BoardSummaryCard>
        );
    }
);
