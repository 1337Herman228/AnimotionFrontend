import { CardPrioritySchema } from "@/entities/card/@x/board";
import { ColumnSchema } from "@/entities/column/@x/board";
import { MemberSchema } from "@/entities/user/@x/board";
import * as v from "valibot";

export const BoardProjectSchema = v.object({
    id: v.string(),
    name: v.string(),
    ownerId: v.string(),
    columns: v.array(ColumnSchema),
    members: v.array(MemberSchema),
    columnOrder: v.array(v.string()),
    priorities: v.array(CardPrioritySchema),
});
