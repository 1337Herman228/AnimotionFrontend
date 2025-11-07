import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/cn";
import { UseFormReturn } from "react-hook-form";
import UserAvatar from "@/shared/ui/user-avatar";
import { TCardFormSchema } from "./EditCardForm";
import ProjectProperty from "./ProjectProperty";
import { CardTypes } from "@/entities/card";

interface AssigneeSelectProps {
    currentValues: TCardFormSchema;
    form: UseFormReturn<TCardFormSchema>;
    members: CardTypes.TCardMembersSchema;
}

const AssigneeSelect = ({
    currentValues,
    form,
    members,
}: AssigneeSelectProps) => {
    const assignee = currentValues.assignee;

    const check = (id: string) => {
        return !!assignee.find((member) => member.id === id);
    };

    const toggleMember = (member: CardTypes.TCardMemberSchema) => {
        if (assignee.find((m) => m.id === member.id)) {
            return form.setValue(
                "assignee",
                assignee.filter((m) => m.id !== member.id)
            );
        } else {
            return form.setValue("assignee", [...assignee, member]);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>
                    <ProjectProperty
                        title="Assignee"
                        propertyValue={currentValues.assignee.map((member) => ({
                            value: member.name,
                            icon: (
                                <UserAvatar
                                    src={member.image}
                                    className="h-5 w-5"
                                    svgClassName="p-0.5"
                                />
                            ),
                        }))}
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="min-w-[70vw] lg:min-w-[260px]"
                align="start"
            >
                {members.map((member) => (
                    <DropdownMenuCheckboxItem
                        checked={check(member.id)}
                        key={member.id}
                        onClick={() => toggleMember(member)}
                        className={cn(
                            "flex gap-2 place-items-center font-medium cursor-pointer rounded-md hover:bg-accent-foreground/7 select-none"
                        )}
                    >
                        <UserAvatar
                            src={member.image}
                            className="h-5 w-5"
                            svgClassName="p-0.5"
                        />
                        {member.name}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AssigneeSelect;
