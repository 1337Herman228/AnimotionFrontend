import * as v from "valibot";

export const CardInfoFormSchema = v.object({
    title: v.pipe(
        v.string(),
        v.minLength(2, "Title must be at least 2 characters.")
    ),
    description: v.string(),
    priority: v.pipe(
        v.nullable(
            v.object({
                id: v.string(),
                projectId: v.union([v.string(), v.null_()]),
                color: v.string(),
                value: v.string(),
                label: v.string(),
            })
        ),
        v.check((val) => val !== null, "Priority is required.")
    ),
    assignee: v.array(
        v.object({
            id: v.string(),
            name: v.string(),
            email: v.string(),
            image: v.optional(v.string()),
        })
    ),
    state: v.string(),
    projectName: v.string(),
    lastUpdated: v.nullish(v.string()),
});

export const CardInfoFormSchemaResolver = v.object({
    title: v.pipe(
        v.string(),
        v.minLength(2, "Title must be at least 2 characters.")
    ),
    description: v.string(),
    priority: v.object({
        id: v.string(),
        projectId: v.union([v.string(), v.null_()]),
        color: v.string(),
        value: v.string(),
        label: v.string(),
    }),
    assignee: v.array(
        v.object({
            id: v.string(),
            name: v.string(),
            email: v.string(),
            image: v.optional(v.string()),
        })
    ),
    state: v.string(),
    projectName: v.string(),
    lastUpdated: v.nullish(v.string()),
});
