import { InferOutput } from "valibot";
import {
    ColumnSchema,
    ColumnsSchema,
    ColumnsWhithoutCardsSchema,
    ColumnWhithoutCardsSchema,
} from "./contracts";

export type TColumnSchema = InferOutput<typeof ColumnSchema>;
export type TColumnsSchema = InferOutput<typeof ColumnsSchema>;
export type TColumnWhithoutCardsSchema = InferOutput<
    typeof ColumnWhithoutCardsSchema
>;
export type TColumnsWhithoutCardsSchema = InferOutput<
    typeof ColumnsWhithoutCardsSchema
>;
