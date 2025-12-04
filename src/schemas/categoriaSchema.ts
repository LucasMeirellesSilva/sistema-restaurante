import { z } from "zod";
import { produtoModelSchema } from "./produtoSchema";

export const categoriaFormSchema = z.object({
  nome: z.string().max(40),
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
