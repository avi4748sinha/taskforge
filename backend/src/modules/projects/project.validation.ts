import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    description: z.string().trim().max(1000).optional()
  })
});

export const projectIdSchema = z.object({
  params: z.object({ id: z.string().min(1) })
});

export const memberSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ email: z.string().trim().email().toLowerCase() })
});
