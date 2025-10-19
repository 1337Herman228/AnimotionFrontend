import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/cn";
import ProjectProperty from "../ProjectProperty";
import { TCardFormSchema } from "../EditCardForm";
import { UseFormReturn } from "react-hook-form";
import { ITaskPriority } from "@/types";
import PriorityBadge from "@/shared/ui/priority-badge";

interface PrioritySelectProps {
  currentValues: TCardFormSchema;
  form: UseFormReturn<TCardFormSchema>;
  priorities: ITaskPriority[];
}

const PrioritySelect = ({
  currentValues,
  form,
  priorities,
}: PrioritySelectProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <ProjectProperty
            title="Priority"
            propertyValue={[
              {
                value: currentValues.priority.label,
                icon: (
                  <PriorityBadge
                    color={currentValues.priority.color}
                    letter={currentValues.priority.value}
                  />
                ),
              },
            ]}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[70vw] lg:min-w-[260px]"
        align="start"
      >
        {priorities.map((priority) => (
          <DropdownMenuItem
            key={priority.value}
            onClick={() => {
              form.setValue("priority", priority);
            }}
            className={cn(
              currentValues.priority.id === priority.id &&
                "bg-accent text-accent-foreground",
              "flex gap-2 place-items-center font-medium cursor-pointer rounded-md hover:bg-accent-foreground/10 select-none"
            )}
          >
            <PriorityBadge color={priority.color} letter={priority.value} />
            {priority.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PrioritySelect;
