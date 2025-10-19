import { InferOutput } from "valibot";
import { BoardProjectSchema } from "./contracts";

export type TBoardProjectSchema = InferOutput<typeof BoardProjectSchema>;
