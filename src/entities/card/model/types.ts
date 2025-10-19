import type { InferOutput } from "valibot";
import {
    CardMemberSchema,
    CardPrioritySchema,
    CardSchema,
    CardsSchema,
} from "./contracts";

export type TCardMemberSchema = InferOutput<typeof CardMemberSchema>;
export type TCardSchema = InferOutput<typeof CardSchema>;
export type TCardsSchema = InferOutput<typeof CardsSchema>;
export type TCardPrioritySchema = InferOutput<typeof CardPrioritySchema>;
