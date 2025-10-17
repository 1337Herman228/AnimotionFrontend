import type { InferOutput } from "valibot";
import {
    CardMemberSchema,
    CardSchema,
    CardsSchema,
    TaskPrioritySchema,
} from "./contracts";

export type TTaskPrioritySchema = InferOutput<typeof TaskPrioritySchema>;
export type TCardMemberSchema = InferOutput<typeof CardMemberSchema>;
export type TCardSchema = InferOutput<typeof CardSchema>;
export type TCardsSchema = InferOutput<typeof CardsSchema>;
