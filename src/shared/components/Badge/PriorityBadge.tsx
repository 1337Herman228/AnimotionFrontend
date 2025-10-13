import { cn } from "@/shared/utils/lib/cn";
import { readableColor } from "polished";

interface PriorityBadgeProps {
    letter: string;
    color: string;
    className?: string;
}

const PriorityBadge = ({ color, letter, className }: PriorityBadgeProps) => {
    return (
        <div
            style={
                {
                    "--priority-color": color,
                    "--text-color": readableColor(color),
                } as React.CSSProperties
            }
            className={cn(
                "flex rounded-xs bg-[var(--priority-color)]! text-[var(--text-color)]! p-0.5 aspect-square min-w-4 min-h-4 text-xs place-items-center justify-center leading-4 font-mono",
                className
            )}
        >
            {letter.charAt(0)}
        </div>
    );
};

export default PriorityBadge;
