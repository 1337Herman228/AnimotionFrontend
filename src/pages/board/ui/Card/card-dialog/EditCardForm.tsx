"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ICard } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useBoardStore } from "@/shared/stores/boardStore";
import { useMemo } from "react";
import { timeAgo } from "@/shared/utils/dayjs";
import ProjectProperty from "./ProjectProperty";
import PrioritySelect from "./dropdown-menu/PrioritySelect";
import AssigneeSelect from "./dropdown-menu/AssigneeSelect";
import { websocketService } from "@/services/webSocketService";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string(),
    priority: z.object({
        id: z.string(),
        projectId: z.string().or(z.null()),
        color: z.string(),
        value: z.string(),
        label: z.string(),
    }),
    assignee: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            image: z.string().optional(),
        })
    ),
});

export type TCardFormSchema = z.infer<typeof formSchema>;

interface EditCardFormProps {
    card: ICard;
}

const EditCardForm = ({ card }: EditCardFormProps) => {
    const { projectName, columns, priorities, members, projectId } =
        useBoardStore();

    const form = useForm<TCardFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: card.title,
            description: card.description,
            priority: card.priority,
            assignee: card.appointedMembers,
        },
    });

    const onSubmit = (values: TCardFormSchema) => {
        const message = {
            id: card.id,
            title: values.title,
            description: values.description,
            priority: values.priority,
            columnId: currentColumn?.id as string,
            projectId: projectId as string,
            appointedMembers: values.assignee,
        };
        websocketService.editCard(message);
    };

    const currentColumn = useMemo(() => {
        return columns.find((column) => column.id === card.columnId);
    }, [columns, card.columnId]);

    const currentValues = form.watch();

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid lg:grid-cols-[auto_300px] gap-4"
            >
                <div className="space-y-4 order-2 lg:order-1">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Task title"
                                        {...field}
                                        className="border-0 shadow-none !text-3xl h-12 !font-semibold hover:bg-accent-foreground/4 dark:hover:bg-accent-foreground/10 dark:bg-transparent rounded-sm transition-all duration-200"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Task description"
                                        className="resize-none border-0 shadow-none hover:bg-accent-foreground/4 dark:hover:bg-accent-foreground/10 dark:bg-transparent rounded-sm transition-all duration-200"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="relative order-1 lg:order-2">
                    <Card className="shadow-none bg-muted/30 dark:border-muted dark:bg-muted/50 rounded-md py-2 gap-0 sticky top-0">
                        <ProjectProperty
                            title="Project"
                            propertyValue={[{ value: projectName as string }]}
                        />
                        <PrioritySelect
                            priorities={priorities}
                            form={form}
                            currentValues={currentValues}
                        />
                        <ProjectProperty
                            title="State"
                            propertyValue={[
                                { value: currentColumn?.title as string },
                            ]}
                        />
                        <AssigneeSelect
                            members={members}
                            form={form}
                            currentValues={currentValues}
                        />
                        <ProjectProperty
                            title="Updated"
                            propertyValue={[{ value: timeAgo(card.updatedAt) }]}
                        />
                    </Card>
                </div>
                <div className="order-3">
                    <Button type="submit" className="cursor-pointer">
                        Save changes
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EditCardForm;
