import { InferOutput } from "valibot";
import { BoardProjectSchema, ProjectSummarySchema } from "./contracts";

export type TBoardProjectSchema = InferOutput<typeof BoardProjectSchema>;
export type TProjectSummarySchema = InferOutput<typeof ProjectSummarySchema>;
