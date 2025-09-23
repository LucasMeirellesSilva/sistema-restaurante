import { z, ZodError } from 'zod';

export const produtoFormSchema = z.object({
    categoriaId: z.number(),
    nome: z.string(),
    valor: z.string(),
    descricao: z.string().max(100).nullable(),
    adicional: z.boolean()
});

export type ProdutoFormType = z.infer<typeof produtoFormSchema>;

export function validateProdutoForm(produto: unknown): ProdutoFormType | ZodError {
    const result = produtoFormSchema.safeParse(produto);

    if (!result.success) return result.error;

    return result.data;
};

export const produtoModelSchema = z.object({
    id: z.number(),
    nome: z.string(),
    valor: z.string(),
    descricao: z.string().nullable(),
    categoria: z.string(),
    adicional: z.boolean(),
    disponivel: z.boolean()
});

export type ProdutoModelType = z.infer<typeof produtoModelSchema>;

export function validateProdutoModel(produto: unknown): ProdutoModelType | ZodError {
    const result = produtoModelSchema.safeParse(produto);

    if (!result.success) return result.error;

    return result.data;
};