import { IMember } from "@/types";
import React from "react";
import UserAvatar from "../../../entities/user-avatar/ui/UserAvatar";
import { readableColor } from "polished";

interface TaskMembersProps {
    members: IMember[];
    color: string;
    overCount?: number;
}

const TaskMembers = ({ members, color, overCount = 3 }: TaskMembersProps) => {
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

export default TaskMembers;
