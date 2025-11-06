import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/cn";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";

const SettingsButton = ({
    children,
    className,
    ...props
}: React.ComponentProps<"button">) => {
    // const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    // const handleClose = () => setIsSettingsOpen(false);

    return (
        <DropdownMenu
        // open={isSettingsOpen} onOpenChange={setIsSettingsOpen}
        >
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
            <DropdownMenuContent
            // onClick={(e) => {
            //     e.stopPropagation();
            //     handleClose();
            // }}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SettingsButton;
