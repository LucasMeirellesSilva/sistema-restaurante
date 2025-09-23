import { z, ZodError } from 'zod';
import { produtoModelSchema } from './produtoSchema';

export const categoriaFormSchema = z.object({
    nome: z.string().max(40)
})

export type CategoriaFormType = z.infer<typeof categoriaFormSchema>

export function validateCategoriaForm(categoria: unknown): CategoriaFormType | ZodError {
    const result = categoriaFormSchema.safeParse(categoria);

    if (!result.success) return result.error;

    return result.data;
}

export const categoriaModelSchema = z.object({
    id: z.number(),
    nome: z.string(),
    produtos: z.array(produtoModelSchema).optional().nullable(),
});

export type CategoriaModelType = z.infer<typeof categoriaModelSchema>

export function validateCategoriaModel(categoria: unknown): CategoriaModelType | ZodError {
    const result = categoriaModelSchema.safeParse(categoria);

    if (!result.success) return result.error;

    return result.data;
}