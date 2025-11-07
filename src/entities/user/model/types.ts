import type { InferOutput } from "valibot";
import { MemberSchema } from "./contracts";

export type TMemberShema = InferOutput<typeof MemberSchema>;
