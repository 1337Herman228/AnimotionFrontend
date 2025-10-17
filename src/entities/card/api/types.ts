import type { InferOutput } from "valibot";
import {
    AddCardDtoSchema,
    DeleteCardDtoSchema,
    EditCardDtoSchema,
} from "./contracts";

export type TAddCardDtoSchema = InferOutput<typeof AddCardDtoSchema>;
export type TEditCardDtoSchema = InferOutput<typeof EditCardDtoSchema>;
export type TDeleteCardDtoSchema = InferOutput<typeof DeleteCardDtoSchema>;
