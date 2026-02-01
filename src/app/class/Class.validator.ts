import z from "zod";

export const classCreateSchema = z.object({
  name: z.string().min(3, "Class name must have at least 3 characters"),
  description: z.string().optional(),
  teacherId: z.number().int().positive(),
});

export const classUpdateSchema = z.object({
  name: z.string().min(3, "Class name must have at least 3 characters"),
  description: z.string().optional(),
});

export const classAddStudentSchema = z.object({
  classId: z.number().int().positive(),
  studentId: z.number().int().positive(),
});

export const classEnterSchema = z.object({
  accessCode: z.string().min(1, "Código de acesso é obrigatório"),
});

export const classAddStudentByEmailSchema = z.object({
  classId: z.number().int().positive(),
  email: z.string().email("Email inválido"),
});
