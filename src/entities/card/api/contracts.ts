import * as v from "valibot";
import { CardMemberSchema, TaskPrioritySchema } from "../model/contracts";

export const AddCardDtoSchema = v.object({
    title: v.string(),
    description: v.string(),
    columnId: v.string(),
    projectId: v.string(),
    appointedMembers: v.array(CardMemberSchema),
    priority: TaskPrioritySchema,
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
