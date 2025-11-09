import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/cn";
import { Controller, UseFormReturn } from "react-hook-form";
import PriorityBadge from "@/shared/ui/priority-badge";
import ProjectProperty from "./ProjectProperty";
import { CardTypes } from "@/entities/card";
import { memo } from "react";
import { TCardInfoFormSchema } from "../model/types";

interface PrioritySelectProps {
    form: UseFormReturn<TCardInfoFormSchema>;
    priorities: CardTypes.TCardPrioritySchema[];
}

const PrioritySelect = memo(({ form, priorities }: PrioritySelectProps) => {
    return (
        <Controller
            control={form.control}
            name="priority"
            render={({ field, fieldState }) => {
                const selectedPriority = field.value;
                const isError = fieldState?.error;
                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div>
                                    <ProjectProperty
                                        title="Priority"
                                        className={
                                            isError &&
                                            "text-destructive border-destructive"
                                        }
                                        propertyValue={[
                                            {
                                                value: isError
                                                    ? "Priority is required"
                                                    : selectedPriority?.label ||
                                                      "",
                                                icon: selectedPriority && (
                                                    <PriorityBadge
                                                        color={
                                                            selectedPriority.color
                                                        }
                                                        letter={
                                                            selectedPriority.value
                                                        }
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
                                        key={priority.id}
                                        onClick={() => {
                                            field.onChange(priority);
                                        }}
                                        className={cn(
                                            selectedPriority?.id ===
                                                priority.id &&
                                                "bg-accent text-accent-foreground",
                                            "flex gap-2 items-center font-medium cursor-pointer rounded-md hover:bg-accent-foreground/10 select-none"
                                        )}
                                    >
                                        <PriorityBadge
                                            color={priority.color}
                                            letter={priority.value}
                                        />
                                        {priority.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                );
            }}
        />
    );
});

export default PrioritySelect;
