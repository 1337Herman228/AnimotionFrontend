import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import React from "react";

const SettingsButton = ({
    children,
    className,
    ...props
}: React.ComponentProps<"button">) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className={cn(className, "cursor-pointer")}
                    variant="ghost"
                    size="icon"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>{children}</DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SettingsButton;
