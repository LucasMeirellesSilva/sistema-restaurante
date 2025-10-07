import { z } from 'zod';

export const produtoFormSchema = z.object({
    categoriaId: z.number(),
    nome: z.string(),
    valor: z.string(),
    descricao: z.string().max(100).nullable(),
    adicional: z.boolean()
});

export type ProdutoFormType = z.infer<typeof produtoFormSchema>;

export function validateProdutoForm(produto: unknown): ProdutoFormType {
    const result = produtoFormSchema.parse(produto);

    return result;
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

export function validateProdutoModel(produto: unknown): ProdutoModelType {
    const result = produtoModelSchema.parse(produto);

    return result;
};