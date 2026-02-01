import { z } from "zod";

export const alternativeCreateSchema = z.object({
  text: z.string().min(1, "O texto da alternativa não pode estar vazio"),
  correct: z.boolean().default(false).optional(),
  questionId: z
    .number()
    .int()
    .positive("O ID da questão deve ser um número positivo"),
});

export const alternativeUpdateSchema = z.object({
  text: z
    .string()
    .min(1, "O texto da alternativa não pode estar vazio")
    .optional(),
  correct: z.boolean().optional(),
  questionId: z
    .number()
    .int()
    .positive("O ID da questão deve ser um número positivo")
    .optional(),
});
