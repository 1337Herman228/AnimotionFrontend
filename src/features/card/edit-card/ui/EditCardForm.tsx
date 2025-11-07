"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Card } from "@/shared/ui/card";
import ProjectProperty from "./ProjectProperty";
import { timeAgo } from "@/shared/lib/dayjs";
import { boardQueries, BoardTypes } from "@/entities/board";
import { queryClient } from "@/shared/api/query-client";
import PrioritySelect from "./PrioritySelect";
import AssigneeSelect from "./AssigneeSelect";
import { cardService, CardTypes } from "@/entities/card";
import { useMemo } from "react";
import { TEditCardFormSchema } from "../model/types";
import { EditCardFormSchema } from "../model/contracts";

interface EditCardFormProps {
    card: CardTypes.TCardSchema;
    handleDialogClose: () => void;
}

const EditCardForm = ({ card, handleDialogClose }: EditCardFormProps) => {
    const board = useMemo(
        () =>
            queryClient.getQueryData<BoardTypes.TBoardSchema>(
                boardQueries.getIdKey(card.projectId)
            ),
        [card.projectId]
    );

    const column = board?.columns.find((c) => c.id === card.columnId);

    const form = useForm<TEditCardFormSchema>({
        resolver: valibotResolver(EditCardFormSchema),
        defaultValues: {
            title: card.title,
            description: card.description,
            priority: card.priority,
            assignee: card.appointedMembers,
        },
    });

    const onSubmit = (values: TEditCardFormSchema) => {
        const message = {
            id: card.id,
            title: values.title,
            description: values.description,
            priority: values.priority,
            columnId: card?.columnId as string,
            projectId: card.projectId as string,
            appointedMembers: values.assignee,
        };
        cardService.editCard(message);
        handleDialogClose();
    };

    const { assignee, priority } = form.watch();

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
                            propertyValue={[{ value: board?.name as string }]}
                        />
                        <PrioritySelect
                            priorities={board!.priorities}
                            form={form}
                            selectedPriority={priority}
                        />
                        <ProjectProperty
                            title="State"
                            propertyValue={[{ value: column?.title as string }]}
                        />
                        <AssigneeSelect
                            members={board!.members}
                            form={form}
                            assignee={assignee}
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
