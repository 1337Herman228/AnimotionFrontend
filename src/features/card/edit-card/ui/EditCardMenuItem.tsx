import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { Edit } from "lucide-react";

export const EditCardMenuItem = ({
    onSelect,
}: {
    onSelect: (event: Event) => void;
}) => {
    return (
        <DropdownMenuItem onSelect={onSelect}>
            <div className="flex items-center gap-2 w-full grow-1 font-normal cursor-pointer">
                <Edit className="shrink-0 w-4 h-4" />
                Edit card
            </div>
        </DropdownMenuItem>
    );
};
