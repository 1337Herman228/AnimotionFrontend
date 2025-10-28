import { InferOutput } from "valibot";
import {
    BoardSchema,
    MockBoardsSummarySchema,
    MockBoardSummarySchema,
    BoardsSummarySchema,
    BoardStat,
    BoardStats,
    BoardSummarySchema,
} from "./contracts";

export type TBoardSchema = InferOutput<typeof BoardSchema>;
export type TBoardSummarySchema = InferOutput<typeof BoardSummarySchema>;
export type TBoardsSummarySchema = InferOutput<typeof BoardsSummarySchema>;
export type TBoardStat = InferOutput<typeof BoardStat>;
export type TBoardStats = InferOutput<typeof BoardStats>;
export type TMockBoardSummarySchema = InferOutput<
    typeof MockBoardSummarySchema
>;
export type TMockBoardsSummarySchema = InferOutput<
    typeof MockBoardsSummarySchema
>;
