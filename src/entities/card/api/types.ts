import type { InferOutput } from "valibot";
import {
    AddCardDtoSchema,
    DeleteCardDtoSchema,
    EditCardDtoSchema,
    MoveCardDtoSchema,
} from "./contracts";
import { Client } from "@stomp/stompjs";

export type TAddCardDtoSchema = InferOutput<typeof AddCardDtoSchema>;
export type TEditCardDtoSchema = InferOutput<typeof EditCardDtoSchema>;
export type TDeleteCardDtoSchema = InferOutput<typeof DeleteCardDtoSchema>;
export type TMoveCardDtoSchema = InferOutput<typeof MoveCardDtoSchema>;

export type TcardService = {
    client: Client | null;
    addCard: (arg: TAddCardDtoSchema) => void;
    deleteCard: (arg: TDeleteCardDtoSchema) => void;
    editCard: (arg: TEditCardDtoSchema) => void;
    moveCard: (arg: TMoveCardDtoSchema) => Promise<unknown>;
};
