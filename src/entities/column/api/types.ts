import type { InferOutput } from "valibot";
import { AddColumnDtoSchema, MoveColumnDtoSchema } from "./contracts";
import { Client } from "@stomp/stompjs";

export type TAddColumnDtoSchema = InferOutput<typeof AddColumnDtoSchema>;
export type TMoveColumnDtoSchema = InferOutput<typeof MoveColumnDtoSchema>;

export type TColumnService = {
    client: Client | null;
    moveColumn: (arg: TMoveColumnDtoSchema) => Promise<unknown>;
};
