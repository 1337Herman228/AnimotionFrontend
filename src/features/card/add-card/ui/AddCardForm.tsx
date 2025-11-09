"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { boardQueries, BoardTypes } from "@/entities/board";
import { queryClient } from "@/shared/api/query-client";
import { CardApiTypes } from "@/entities/card";
import { useMemo } from "react";
import {
    CardInfo,
    CardInfoContracts,
    CardInfoTypes,
} from "@/entities/card-info";
import { useAddCardMutation } from "../api/useAddCard";
import { ColumnTypes } from "@/entities/column";

interface AddCardFormProps {
    column: ColumnTypes.TColumnSchema;
    boardId: string;
    handleDialogClose: () => void;
}

const AddCardForm = ({
    column,
    boardId,
    handleDialogClose,
}: AddCardFormProps) => {
    const { mutate: addCard } = useAddCardMutation();

    const board = useMemo(
        () =>
            queryClient.getQueryData<BoardTypes.TBoardSchema>(
                boardQueries.getIdKey(boardId)
            ),
        [boardId]
    );

    const form = useForm<CardInfoTypes.TCardInfoFormSchema>({
        resolver: valibotResolver(CardInfoContracts.CardInfoFormSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: null,
            state: column?.title,
            assignee: [],
            projectName: board?.name,
        },
    });

    const onSubmit = (values: CardInfoTypes.TCardInfoFormSchema) => {
        const message: CardApiTypes.TAddCardDtoSchema = {
            ...values,
            projectId: boardId,
            priority: values.priority,
            columnId: column.id,
            appointedMembers: values.assignee,
        };
        addCard(message);
        handleDialogClose();
    };

    return (
        <CardInfo form={form} board={board!} onSubmit={onSubmit as any}>
            <CardInfo.StaticInfoContainer>
                <CardInfo.Title />
                <CardInfo.Description />
            </CardInfo.StaticInfoContainer>
            <CardInfo.StickyInfoContainer>
                <CardInfo.ProjectField />
                <CardInfo.PriorityField />
                <CardInfo.StateField />
                <CardInfo.MembersField />
            </CardInfo.StickyInfoContainer>
            <CardInfo.FooterContainer>
                <Button type="submit" className="cursor-pointer">
                    Add card
                </Button>
            </CardInfo.FooterContainer>
        </CardInfo>
    );
};

export default AddCardForm;
