import * as v from "valibot";

export const MemberSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
  image: v.optional(v.string()),
});
