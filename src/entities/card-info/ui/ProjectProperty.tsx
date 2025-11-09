"use client";

import { cn } from "@/shared/lib/cn";
import { ComponentProps, ReactNode } from "react";

interface ProjectPropertyProps {
    title: string;
    propertyValue: {
        value: string;
        icon?: ReactNode;
    }[];
}

const ProjectProperty = ({
    title,
    propertyValue,
    className,
}: ProjectPropertyProps & ComponentProps<"div">) => {
    return (
        <div
            className={cn(
                "grid grid-cols-[minmax(0,126px)_minmax(0,160px)] gap-1.5 text-sm px-4 py-2 cursor-pointer hover:bg-accent-foreground/5",
                className
            )}
        >
            <div className="text-accent-foreground/60">{title}</div>
            <div className="flex flex-col justify-between gap-2 place-items-start">
                {propertyValue?.map(({ value, icon }, index) => (
                    <div
                        key={index}
                        className="flex gap-2 justify-between place-items-center w-full"
                    >
                        <div className="break-words overflow-hidden">
                            {value}
                        </div>
                        {icon && <div className="shrink-0">{icon}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ProjectProperty;
