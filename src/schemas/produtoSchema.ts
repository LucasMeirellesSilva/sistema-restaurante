import { z } from 'zod';

export const produtoFormSchema = z.object({
    id: z.number().optional(),
    categoriaId: z.number("A categoria é obrigatória."),
    nome: z.string().max(40, "O nome deve possuir no máximo 40 caracteres.").min(3, "O nome deve possuir ao menos 3 caracteres."),
    valor: z.number().nonnegative("O valor não pode ser negativo"),
    descricao: z.string().max(255, "A descrição deve possuir no máximo 255 caracteres.").nullable(),
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
    valor: z.number(),
    valorFormatado: z.string(),
    descricao: z.string().nullable(),
    categoria: z.string(),
    categoriaId: z.number(),
    adicional: z.boolean(),
    disponivel: z.boolean()
});

export type ProdutoModelType = z.infer<typeof produtoModelSchema>;

export function validateProdutoModel(produto: unknown): ProdutoModelType {
    const result = produtoModelSchema.parse(produto);

    return result;
};

export type ProdutoUpdateType = Partial<ProdutoFormType> & { id: number };