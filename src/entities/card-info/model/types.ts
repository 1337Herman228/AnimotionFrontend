import * as v from "valibot";
import { CardInfoFormSchema } from "./contracts";

export type TCardInfoFormSchema = v.InferOutput<typeof CardInfoFormSchema>;
