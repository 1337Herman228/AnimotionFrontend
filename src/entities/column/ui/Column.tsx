import { ComponentProps, createContext, use, useMemo } from "react";
import { TColumnSchema } from "../model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/lib/cn";

type ColumnContext = {
    column: TColumnSchema;
};

const ColumnContext = createContext<ColumnContext | undefined>(undefined);

const useColumnContext = () => {
    const context = use(ColumnContext);

    if (!context) {
        throw new Error(
            "useColumnContext must be used with a ColumnContext.Provider"
        );
    }

    return context;
};

type ColumnProviderProps = ColumnContext & ComponentProps<"div">;

const ColumnProvider = ({
    column,
    className,
    children,
    ...props
}: ColumnProviderProps) => {
    const value = useMemo(() => ({ column }), [column]);
    return (
        <ColumnContext value={value}>
            <Card
                className={cn(
                    "w-[320px] bg-muted/65 dark:bg-muted/90 rounded-md py-0 pt-3 gap-3",
                    className
                )}
                {...props}
            >
                {children}
            </Card>
        </ColumnContext>
    );
};

const ColumnHeader = ({
    className,
    children,
    ...props
}: ComponentProps<"div">) => {
    return (
        <CardHeader
            {...props}
            className={cn("flex flex-row items-center select-none", className)}
        >
            {children}
        </CardHeader>
    );
};

const ColumnContent = ({
    className,
    children,
    ...props
}: ComponentProps<"div">) => {
    return (
        <CardContent
            className={cn("flex flex-col gap-2.5 px-2.5 pb-2.5", className)}
            {...props}
        >
            {children}
        </CardContent>
    );
};

const ColumnTitle = ({
    className,
    children,
    ...props
}: ComponentProps<"div">) => {
    const { column } = useColumnContext();

    return (
        <CardTitle
            className={cn("text-md font-semibold break-all text-lg", className)}
            {...props}
        >
            {column.title}
        </CardTitle>
    );
};

export const Column = Object.assign(ColumnProvider, {
    Header: ColumnHeader,
    Content: ColumnContent,
    Title: ColumnTitle,
});
