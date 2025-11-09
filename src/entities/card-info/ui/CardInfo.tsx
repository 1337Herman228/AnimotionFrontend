import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shared/ui/form";
import { ComponentProps, createContext, use, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { TCardInfoFormSchema } from "../model/types";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { BoardTypes } from "@/entities/board";
import ProjectProperty from "./ProjectProperty";
import { CardTypes } from "@/entities/card";
import { timeAgo } from "@/shared/lib/dayjs";
import PrioritySelect from "./PrioritySelect";
import AssigneeSelect from "./AssigneeSelect";

type CardInfoContext = {
    board: BoardTypes.TBoardSchema;
    form: UseFormReturn<TCardInfoFormSchema>;
    card?: CardTypes.TCardSchema;
};

const CardInfoContext = createContext<CardInfoContext | undefined>(undefined);

const useCardInfoContext = () => {
    const context = use(CardInfoContext);

    if (!context) {
        throw new Error(
            "useCardInfoContext must be used with a CardInfoContext.Provider"
        );
    }

    return context;
};

type CardInfoFormProps = ComponentProps<"form"> &
    CardInfoContext & {
        onSubmit: (values: TCardInfoFormSchema) => void;
    };

const CardInfoFormProvider = ({
    card,
    form,
    board,
    onSubmit,
    className,
    children,
    ...props
}: CardInfoFormProps) => {
    const value = useMemo(() => ({ form, card, board }), [form, card, board]);

    return (
        <CardInfoContext value={value}>
            <Form {...form} {...props}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn(
                        "grid lg:grid-cols-[auto_300px] gap-4",
                        className
                    )}
                >
                    {children}
                </form>
            </Form>
        </CardInfoContext>
    );
};

const StaticInfoContainer = ({
    className,
    children,
    ...props
}: ComponentProps<"div">) => {
    return (
        <div
            className={cn("space-y-4 order-2 lg:order-1", className)}
            {...props}
        >
            {children}
        </div>
    );
};

const StickyInfoContainer = ({
    className,
    children,
    ...props
}: ComponentProps<"div">) => {
    return (
        <div
            className={cn("relative order-1 lg:order-2", className)}
            {...props}
        >
            <Card className="shadow-none bg-muted/30 dark:border-muted dark:bg-muted/50 rounded-md py-2 gap-0 sticky top-0">
                {children}
            </Card>
        </div>
    );
};

const FooterContainer = ({
    className,
    children,
    ...props
}: ComponentProps<"div">) => {
    return (
        <div className={cn("order-3", className)} {...props}>
            {children}
        </div>
    );
};

const CardTitle = ({ className, ...props }: ComponentProps<"div">) => {
    const { form } = useCardInfoContext();
    return (
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input
                            placeholder="Task title"
                            className={cn(
                                "border-0 shadow-none !text-3xl h-12 !font-semibold hover:bg-accent-foreground/4 dark:hover:bg-accent-foreground/10 dark:bg-transparent rounded-sm transition-all duration-200",
                                className
                            )}
                            {...props}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const CardDescription = ({ className, ...props }: ComponentProps<"div">) => {
    const { form } = useCardInfoContext();
    return (
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Textarea
                            placeholder="Task description"
                            className={cn(
                                "resize-none border-0 shadow-none hover:bg-accent-foreground/4 dark:hover:bg-accent-foreground/10 dark:bg-transparent rounded-sm transition-all duration-200",
                                className
                            )}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const ProjectField = () => {
    const { form } = useCardInfoContext();
    const { projectName } = form.watch();
    return (
        <ProjectProperty
            title="Project"
            propertyValue={[{ value: projectName }]}
        />
    );
};

const StateField = () => {
    const { form } = useCardInfoContext();
    const { state } = form.watch();
    return <ProjectProperty title="State" propertyValue={[{ value: state }]} />;
};

const LastUpdatedField = () => {
    const { card } = useCardInfoContext();
    if (!card) return null;
    return (
        <ProjectProperty
            title="Updated"
            propertyValue={[{ value: timeAgo(card.updatedAt) }]}
        />
    );
};

const PriorityField = () => {
    const { form, board } = useCardInfoContext();
    return <PrioritySelect priorities={board!.priorities} form={form} />;
};

const MembersField = () => {
    const { form, board } = useCardInfoContext();
    const { assignee } = form.watch();

    return (
        <AssigneeSelect
            members={board!.members}
            form={form}
            assignee={assignee}
        />
    );
};

export const CardInfo = Object.assign(CardInfoFormProvider, {
    StaticInfoContainer,
    StickyInfoContainer,
    FooterContainer,
    Title: CardTitle,
    Description: CardDescription,
    ProjectField,
    StateField,
    LastUpdatedField,
    PriorityField,
    MembersField,
});
