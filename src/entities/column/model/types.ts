import { InferOutput } from "valibot";
import { ColumnSchema, ColumnsSchema } from "./contracts";

export type TColumnSchema = InferOutput<typeof ColumnSchema>;
export type TColumnsSchema = InferOutput<typeof ColumnsSchema>;
