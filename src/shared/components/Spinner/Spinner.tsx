import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface SpinnerProps {
    className?: string;
}

const Spinner = ({ className, ...props }: SpinnerProps) => {
    return (
        <Loader2
            {...props}
            className={cn(
                "h-6 w-6 animate-[spin_0.85s_linear_infinite] text-accent-foreground",
                className
            )}
            strokeWidth={2.5}
        />
    );
};

export default Spinner;
