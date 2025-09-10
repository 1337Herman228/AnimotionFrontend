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
import UserAvatar from "@/shared/components/Avatar/UserAvatar";
import PriorityBadge from "@/shared/components/Badge/PriorityBadge";
import ProjectProperty from "./ProjectProperty";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string(),
    // assigneeId: z.string(),
    // priority: z.string(),
});

interface EditCardFormProps {
    card: ICard;
}

const EditCardForm = ({ card }: EditCardFormProps) => {
    const { projectName, columns } = useBoardStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: card.title,
            description: card.description,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    };

    const currentColumn = useMemo(() => {
        return columns.find((column) => column.id === card.columnId);
    }, [columns, card.columnId]);

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
                        <ProjectProperty
                            title="Priority"
                            propertyValue={[
                                {
                                    value: card.priority.label,
                                    icon: (
                                        <PriorityBadge
                                            color={card.priority.color}
                                            letter={card.priority.value}
                                        />
                                    ),
                                },
                            ]}
                        />
                        <ProjectProperty
                            title="State"
                            propertyValue={[
                                { value: currentColumn?.title as string },
                            ]}
                        />
                        <ProjectProperty
                            title="Assignee"
                            propertyValue={card.appointedMembers.map(
                                (member) => ({
                                    value: member.name,
                                    icon: (
                                        <UserAvatar
                                            src={member.image}
                                            className="h-5 w-5"
                                            svgClassName="p-0.5"
                                        />
                                    ),
                                })
                            )}
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
