import * as v from "valibot";

export const CardPrioritySchema = v.object({
    id: v.string(),
    projectId: v.nullable(v.string()),
    value: v.string(),
    label: v.string(),
    color: v.string(),
});

export const CardMemberSchema = v.object({
    id: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
});

export const CardSchema = v.object({
    id: v.string(),
    title: v.string(),
    description: v.string(),
    columnId: v.string(),
    projectId: v.string(),
    appointedMembers: v.array(CardMemberSchema),
    createdAt: v.date(),
    updatedAt: v.date(),
    priority: CardPrioritySchema,
});

export const CardsSchema = v.array(CardSchema);
