import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";
import React from "react";

interface UserAvatarProps {
    src: string | undefined;
    className?: string;
    svgClassName?: string;
}

const UserAvatar = ({ src, className, svgClassName }: UserAvatarProps) => {
    return (
        <Avatar className={cn("h-8 w-8 border-0", className)}>
            <AvatarImage src={src} />
            <AvatarFallback>
                <UserRound strokeWidth={1} className={svgClassName} />
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
