import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["student", "teacher"]),
  registration: z.string().optional().nullable(),
});

export const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  password: z.string().min(8).optional(),
});

