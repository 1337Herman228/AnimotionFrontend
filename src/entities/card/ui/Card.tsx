import {
    Card as ShadcnCard,
    CardHeader,
    CardFooter,
    CardContent,
} from "@/shared/ui/card";
import { cn } from "@/shared/lib/cn";
import { TCardSchema } from "../model/types";
import { ComponentProps, createContext, use, useMemo } from "react";
import { UserRoundX } from "lucide-react";
import { TMemberShema } from "@/entities/user/@x/card";
import UserAvatar from "@/shared/ui/user-avatar";
import { readableColor } from "polished";
import PriorityBadge from "@/shared/ui/priority-badge";
import { timeAgo } from "@/shared/lib/dayjs";

type CardContext = {
    card: TCardSchema;
};

const CardContext = createContext<CardContext | undefined>(undefined);

const useCardContext = () => {
    const context = use(CardContext);

    if (!context) {
        throw new Error(
            "useCardContext must be used with a CardContext.Provider"
        );
    }

    return context;
};

type CardProviderProps = CardContext & ComponentProps<"div">;

const TaskCardProvider = ({
    card,
    className,
    children,
    ...props
}: CardProviderProps) => {
    const value = useMemo(() => ({ card }), [card]);

    return (
        <CardContext value={value}>
            <ShadcnCard
                style={
                    {
                        "--card-color": card.priority.color,
                    } as React.CSSProperties
                }
                className={cn(
                    "border-l-[var(--card-color)]",
                    "border-l-8 rounded-md transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent-foreground/35 select-none gap-3",
                    className
                )}
                {...props}
            >
                {children}
            </ShadcnCard>
        </CardContext>
    );
};

const TaskCardHeader = ({ className, children }: ComponentProps<"div">) => {
    return (
        <CardHeader
            className={cn("grid grid-cols-[auto_36px] gap-0", className)}
        >
            {children}
        </CardHeader>
    );
};

const TaskCardDescription = ({ className }: ComponentProps<"div">) => {
    const { card } = useCardContext();

    return (
        <CardContent>
            <div
                className={cn(
                    "flex justify-between text-sm text-muted-foreground",
                    className
                )}
            >
                <p className=" line-clamp-3">{card?.description || ""}</p>
            </div>
        </CardContent>
    );
};

interface MembersProps {
    members: TMemberShema[];
    color: string;
    overCount?: number;
}
const Members = ({ members, color, overCount = 3 }: MembersProps) => {
    const membersCount = members.length;
    const isOver = membersCount > overCount;
    const redundantCount = membersCount - overCount;

    return (
        <div className="flex gap-2 place-items-center">
            <div className="flex shrink-0 -space-x-3 overflow-hidden">
                {members.slice(0, overCount).map((member, index) => (
                    <UserAvatar
                        src={member.image}
                        key={index}
                        className="h-8 w-8 border-0"
                    />
                ))}
                {isOver && (
                    <div
                        style={
                            {
                                "--card-color": color,
                                "--text-color": readableColor(color),
                            } as React.CSSProperties
                        }
                        className="z-50 rounded-full h-8 w-8 bg-[var(--card-color)] font-mono flex place-items-center justify-center text-[var(--text-color)]"
                    >
                        +{redundantCount}
                    </div>
                )}
            </div>
            <div className="text-md text-muted-foreground overflow-ellipsis line-clamp-1">
                {membersCount > 1 ? (
                    <span>{membersCount} Assigned</span>
                ) : (
                    <span>{members[0]?.name}</span>
                )}
            </div>
        </div>
    );
};

const TaskCardMembers = () => {
    const { card } = useCardContext();

    return (
        <div className="pb-2">
            {card.appointedMembers.length ? (
                <Members
                    members={card.appointedMembers}
                    color={card.priority.color}
                />
            ) : (
                <div className="flex place-items-center gap-2">
                    <div className="flex place-items-center justify-center h-8 w-8 rounded-full bg-accent-foreground/7 dark:bg-accent-foreground/10 ">
                        <UserRoundX className="shrink-0 h-5 w-5" />
                    </div>
                    <span className="text-md text-muted-foreground">
                        Unassigned
                    </span>
                </div>
            )}
        </div>
    );
};

const TaskCardFooterContainer = ({
    className,
    children,
}: ComponentProps<"div">) => {
    return (
        <CardFooter
            className={cn(
                "flex flex-col justify-start items-start gap-2",
                className
            )}
        >
            {children}
        </CardFooter>
    );
};

const TaskCardFooter = () => {
    const { card } = useCardContext();

    return (
        <div className="flex place-items-center gap-3 w-full justify-between">
            <div className="flex gap-1.5 place-items-center font-medium">
                <PriorityBadge
                    color={card.priority.color}
                    letter={card.priority.value}
                    className="h-5 w-5 text-md"
                />
                <span className="leading-4">{card.priority.label}</span>
            </div>
            <div className="text-xs text-muted-foreground">
                Updated {timeAgo(card.updatedAt)}
            </div>
        </div>
    );
};

export const Card = Object.assign(TaskCardProvider, {
    Header: TaskCardHeader,
    Description: TaskCardDescription,
    Members: TaskCardMembers,
    FooterContainer: TaskCardFooterContainer,
    Footer: TaskCardFooter,
});
