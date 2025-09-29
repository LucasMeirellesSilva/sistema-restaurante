import { z, ZodError } from 'zod';

export const itemFormSchema = z.object({
    produtoId: z.number(),
    quantidade: z.number(),
    pertenceId: z.number().optional()
})

export type ItemFormType = z.infer<typeof itemFormSchema>

export function validateItemForm(item: unknown): ItemFormType | ZodError {
    const result = itemFormSchema.safeParse(item);

    if (!result.success) return result.error;

    return result.data;
}

export const itemModelSchema = z.object({
    id: z.number(),
    valorUnitario: z.string(),
    quantidade: z.number(),
    produto: z.string(),
    pertenceId: z.number().nullable()
});

export type ItemModelType = z.infer<typeof itemModelSchema>

export function validateItemModel(item: unknown): ItemModelType | ZodError {
    const result = itemModelSchema.safeParse(item);

    if (!result.success) return result.error;

    return result.data;
}