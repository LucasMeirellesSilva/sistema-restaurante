import { z } from 'zod';

export const itemAdicionalFormSchema = z.object({
    produtoId: z.number(),
    quantidade: z.number()
})

export type ItemAdicionalFormType = z.infer<typeof itemAdicionalFormSchema>

export const itemFormSchema = z.object({
    produtoId: z.number(),
    quantidade: z.number(),
    adicionais: z.array(itemAdicionalFormSchema).optional()
})

export type ItemFormType = z.infer<typeof itemFormSchema>

export function validateItemForm(item: unknown): ItemFormType {
    const result = itemFormSchema.parse(item);

    return result;
}

const adicionalModelSchema = z.object({
    id: z.number().optional(),
    valorUnitario: z.number(),
    valorUnitarioFormatado: z.string(),
    quantidade: z.number(),
    produto: z.string().optional(),
    produtoId: z.number().optional()
})

export type AdicionalModelType = z.infer<typeof adicionalModelSchema>

export const itemModelSchema = z.object({
    id: z.number().optional(),
    valorUnitarioFormatado: z.string(),
    valorUnitario: z.number(),
    quantidade: z.number(),
    produto: z.string().optional(),
    produtoId: z.number().optional(),
    adicionais: z.array(adicionalModelSchema)
});

export type ItemModelType = z.infer<typeof itemModelSchema>

export function validateItemModel(item: unknown): ItemModelType {
    const result = itemModelSchema.parse(item);

    return result;
}