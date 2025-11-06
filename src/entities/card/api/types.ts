import type { InferOutput } from "valibot";
import {
    AddCardDtoSchema,
    EditCardDtoSchema,
    MoveCardDtoSchema,
} from "./contracts";
import { Client } from "@stomp/stompjs";

export type TAddCardDtoSchema = InferOutput<typeof AddCardDtoSchema>;
export type TEditCardDtoSchema = InferOutput<typeof EditCardDtoSchema>;
export type TMoveCardDtoSchema = InferOutput<typeof MoveCardDtoSchema>;

export type TCardService = {
    client: Client | null;
    addCard: (arg: TAddCardDtoSchema) => void;
    deleteCard: (id: string) => void;
    editCard: (arg: TEditCardDtoSchema) => void;
    moveCard: (arg: TMoveCardDtoSchema) => Promise<unknown>;
};
