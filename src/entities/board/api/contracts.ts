import { CardPrioritySchema } from "@/entities/card/@x";
import { ColumnSchema } from "@/entities/column/@x";
import { MemberSchema } from "@/entities/user/@x/board";
import * as v from "valibot";

export const BoardSchema = v.object({
    id: v.string(),
    name: v.string(),
    ownerId: v.string(),
    columns: v.array(ColumnSchema),
    members: v.array(MemberSchema),
    columnOrder: v.array(v.string()),
    priorities: v.array(CardPrioritySchema),
});

export const BoardSummarySchema = v.object({
    id: v.string(),
    name: v.string(),
    ownerId: v.string(),
    members: v.array(MemberSchema),
});
export const BoardsSummarySchema = v.array(BoardSummarySchema);

export const BoardStat = v.object({
    value: v.string(),
    label: v.string(),
    count: v.number(),
});
export const BoardStats = v.array(BoardStat);

export const MockBoardSummarySchema = v.object({
    id: v.string(),
    name: v.string(),
    ownerId: v.string(),
    members: v.array(MemberSchema),
    stats: BoardStats,
    lastUpdated: v.string(),
});
export const MockBoardsSummarySchema = v.array(MockBoardSummarySchema);
