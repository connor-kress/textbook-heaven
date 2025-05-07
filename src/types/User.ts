import { z } from "zod"

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;
