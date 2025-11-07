import type { InferOutput } from "valibot";
import { AddColumnDtoSchema, MoveColumnDtoSchema } from "./contracts";

export type TAddColumnDtoSchema = InferOutput<typeof AddColumnDtoSchema>;
export type TMoveColumnDtoSchema = InferOutput<typeof MoveColumnDtoSchema>;

export type TColumnService = {
    moveColumn: (arg: TMoveColumnDtoSchema) => Promise<unknown>;
};
