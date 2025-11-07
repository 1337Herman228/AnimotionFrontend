import * as v from "valibot";
import { CardSchema } from "@/entities/card/@x";

export const ColumnSchema = v.object({
    cardOrder: v.array(v.string()),
    cards: v.array(CardSchema),
    id: v.string(),
    title: v.string(),
    projectId: v.string(),
});
export const ColumnsSchema = v.array(ColumnSchema);

export const ColumnWhithoutCardsSchema = v.object({
    projectId: v.string(),
    cardOrder: v.array(v.string()),
    id: v.string(),
    title: v.string(),
});
export const ColumnsWhithoutCardsSchema = v.array(ColumnWhithoutCardsSchema);
