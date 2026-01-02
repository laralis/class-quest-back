import z from "zod";

export const classCreateSchema = z.object({
  logoUrl: z.url().optional(),
  name: z.string().min(3, "Class name must have at least 3 characters"),
  description: z.string().optional(),
  units: z.number().min(1, "Class must have at least 1 unit"),
  accessCode: z.string().length(6, "Access code must be exactly 6 characters"),
  teacherId: z.number().int().positive(),
});

export const classUpdateSchema = z.object({
  logoUrl: z.url().optional(),
  name: z.string().min(3, "Class name must have at least 3 characters"),
  description: z.string().optional(),
  units: z.number().min(1, "Class must have at least 1 unit"),
});

export const classAddStudentSchema = z.object({
  classId: z.number().int().positive(),
  studentId: z.number().int().positive(),
});

export const classEnterSchema = z.object({
  accessCode: z.string().min(6, "Invalid code"),
  studentId: z.number().int().positive(),
});
