import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .datetime()
  .optional()
  .nullable()
  .transform((value) => (value ? new Date(value) : null));

export const createTaskSchema = z.object({
  body: z.object({
    projectId: z.string().min(1),
    title: z.string().trim().min(2),
    description: z.string().trim().max(2000).optional(),
    priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
    dueDate: optionalDate,
    assignedToId: z.string().min(1).optional().nullable()
  })
});

export const updateTaskSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().trim().min(2).optional(),
    description: z.string().trim().max(2000).optional().nullable(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: optionalDate,
    assignedToId: z.string().min(1).optional().nullable()
  })
});

export const updateStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ status: z.nativeEnum(TaskStatus) })
});

export const taskIdSchema = z.object({
  params: z.object({ id: z.string().min(1) })
});
