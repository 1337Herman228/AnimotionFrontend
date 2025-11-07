import * as v from "valibot";
import { EditCardFormSchema } from "./contracts";

export type TEditCardFormSchema = v.InferOutput<typeof EditCardFormSchema>;
