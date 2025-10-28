import { memo } from "react";
import { boardTypes } from "@/entities/board";
import { MemoizedBoardSummaryCard } from "./MemoizedBoardSummaryCard";

export const BoardSummaryList = memo(
    ({ boards }: { boards: boardTypes.TBoardsSummarySchema }) => {
        return (
            <ul className="grid grid-cols-2 gap-4">
                {boards.map((board) => (
                    <MemoizedBoardSummaryCard key={board.id} board={board} />
                ))}
            </ul>
        );
    }
);
