import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/cn";
import { MoreHorizontal } from "lucide-react";

export const SettingsMenu = ({
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
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                    Delete project
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
