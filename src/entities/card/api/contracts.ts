import * as v from "valibot";
import { CardMemberSchema, CardPrioritySchema } from "../model/contracts";
import { ColumnsSchema } from "@/entities/column/@x/card";

export const AddCardDtoSchema = v.object({
    title: v.string(),
    description: v.string(),
    columnId: v.string(),
    projectId: v.string(),
    appointedMembers: v.nullable(v.array(CardMemberSchema)),
    priority: v.nullable(CardPrioritySchema),
});

export const DeleteCardDtoSchema = v.object({
    projectId: v.string(),
    deletedCardId: v.string(),
    columnId: v.string(),
});

export const CardIdDtoSchema = v.object({
    cardId: v.string(),
});

export const EditCardDtoSchema = v.intersect([
    v.partial(AddCardDtoSchema),
    CardIdDtoSchema,
]);

export const MoveCardDtoSchema = v.object({
    updatedColumns: ColumnsSchema,
    projectId: v.string(),
    sourceColumn: v.object({
        id: v.string(),
        cardOrder: v.array(v.string()),
    }),
    destinationColumn: v.object({
        id: v.string(),
        cardOrder: v.array(v.string()),
    }),
    cardId: v.string(),
    queryKey: v.array(v.string()),
});
