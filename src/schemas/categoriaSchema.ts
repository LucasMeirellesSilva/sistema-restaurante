import { z } from "zod";
import { produtoModelSchema } from "./produtoSchema";

export const categoriaFormSchema = z.object({
  id: z.number().optional(),
  nome: z.string().max(30, "O nome deve possuir no máximo 30 caracteres.").min(3, "O nome deve possuir ao menos 3 caracteres."),
});

export type CategoriaFormType = z.infer<typeof categoriaFormSchema>;

export function validateCategoriaForm(categoria: unknown): CategoriaFormType {
  const result = categoriaFormSchema.parse(categoria);

  return result;
}

export const categoriaModelSchema = z.object({
  id: z.number(),
  nome: z.string(),
  produtos: z.array(produtoModelSchema).optional().nullable(),
});

export type CategoriaModelType = z.infer<typeof categoriaModelSchema>;

export function validateCategoriaModel(categoria: unknown): CategoriaModelType {
  const result = categoriaModelSchema.parse(categoria);

  return result;
}

export type CategoriaUpdateType = Partial<CategoriaFormType> & { id: number };
