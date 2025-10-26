import * as v from "valibot";

export const ColumnDtoSchema = v.object({
    id: v.string(),
    title: v.string(),
    projectId: v.string(),
    cardOrder: v.array(v.string()),
});

export const AddColumnDtoSchema = v.object({
    title: v.string(),
    projectId: v.string(),
    cardOrder: v.array(v.string()),
});

// delete, update

export const MoveColumnDtoSchema = v.object({
    projectId: v.string(),
    columnOrder: v.array(v.string()),
});
