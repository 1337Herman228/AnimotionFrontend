import Link from "next/link";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/ui/card";
import UserAvatar from "@/shared/ui/user-avatar";
import { ComponentProps, createContext, use, useMemo } from "react";
import { cn } from "@/shared/lib/cn";
import { TMockBoardSummarySchema } from "../api/types";

type BoardSummaryCardContext = {
    board: TMockBoardSummarySchema;
};

const BoardSummaryCardContext = createContext<
    BoardSummaryCardContext | undefined
>(undefined);

const useBoardSummaryCardContext = () => {
    const context = use(BoardSummaryCardContext);

    if (!context) {
        throw new Error(
            "useBoardSummaryCardContext must be used with a BoardSummaryCard.Provider"
        );
    }

    return context;
};

type BoardSummaryCardProviderProps = BoardSummaryCardContext &
    ComponentProps<"div">;

const BoardSummaryCardProvider = ({
    board,
    className,
    children,
    ...props
}: BoardSummaryCardProviderProps) => {
    const value = useMemo(() => ({ board }), [board]);

    return (
        <BoardSummaryCardContext value={value}>
            <Link href={`/projects/${board.id}`}>
                <Card
                    {...props}
                    className={cn(
                        "hover:border-primary transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent-foreground/35 ",
                        className
                    )}
                >
                    {children}
                </Card>
            </Link>
        </BoardSummaryCardContext>
    );
};

const BoardSummaryCardHeader = ({
    className,
    children,
}: ComponentProps<"div">) => {
    const { board } = useBoardSummaryCardContext();
    return (
        <CardHeader
            className={cn(
                "flex flex-row items-center justify-between",
                className
            )}
        >
            <CardTitle className="text-lg font-semibold">
                {board.name}
            </CardTitle>
            {children}
        </CardHeader>
    );
};

const BoardSummaryCardContent = ({
    className,
    children,
}: ComponentProps<"div">) => {
    return <CardContent className={cn(className)}>{children}</CardContent>;
};

const BoardSummaryCardFooter = ({
    className,
    children,
}: ComponentProps<"div">) => {
    return (
        <CardFooter
            className={cn("flex justify-between items-center gap-3", className)}
        >
            {children}
        </CardFooter>
    );
};

const BoardSummaryCardMembers = ({ className }: ComponentProps<"div">) => {
    const { board } = useBoardSummaryCardContext();
    return (
        <div className={cn("flex -space-x-2 overflow-hidden", className)}>
            {board.members.map((member, index) => (
                <UserAvatar
                    src={member.image}
                    key={index}
                    className="h-8 w-8 border-0"
                />
            ))}
        </div>
    );
};

const BoardSummaryCardLastUpdated = ({ className }: ComponentProps<"div">) => {
    const { board } = useBoardSummaryCardContext();
    return (
        <span className={cn("text-xs text-muted-foreground", className)}>
            {board.lastUpdated}
        </span>
    );
};

const BoardSummaryCardStats = ({ className }: ComponentProps<"div">) => {
    const { board } = useBoardSummaryCardContext();
    return (
        <div
            className={cn(
                "flex justify-between text-sm text-muted-foreground",
                className
            )}
        >
            {board.stats.map((stat) => (
                <div className="text-center" key={stat.value}>
                    <p className="text-xl font-bold text-foreground">
                        {stat.count}
                    </p>
                    <p> {stat.label} </p>
                </div>
            ))}
        </div>
    );
};

export const BoardSummaryCard = Object.assign(BoardSummaryCardProvider, {
    Header: BoardSummaryCardHeader,
    Content: BoardSummaryCardContent,
    Footer: BoardSummaryCardFooter,
    Members: BoardSummaryCardMembers,
    LastUpdated: BoardSummaryCardLastUpdated,
    Stats: BoardSummaryCardStats,
});
