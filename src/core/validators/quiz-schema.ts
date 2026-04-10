import { z } from "zod";

export const quizSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  species: z.enum(["dog", "cat"], { required_error: "Selecciona una especie (dog/cat)" }),
  breed: z.string().optional(),
  isMixed: z.boolean().default(false),
  ageYears: z.number().min(0, "La edad no puede ser negativa"),
  weightKg: z.number().positive("El peso debe ser mayor a 0"),
  healthConditions: z.array(z.string()).default([]),
});

export type QuizFormData = z.infer<typeof quizSchema>;