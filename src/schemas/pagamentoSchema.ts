import { z, ZodError } from 'zod';

import { formaPagamentoFormSchema, formaPagamentoModelSchema } from './formaPagamentoSchema';

export const pagamentoFormSchema = z.object({
    pedidoId: z.number(),
    formas: z.array(formaPagamentoFormSchema)
})

export type PagamentoFormType = z.infer<typeof pagamentoFormSchema>

export function validatePagamentoForm(pagamento: unknown): PagamentoFormType | ZodError {
    const result = pagamentoFormSchema.safeParse(pagamento);

    if (!result.success) return result.error;

    return result.data;
}

export const pagamentoModelSchema = z.object({
    id: z.number(),
    pedidoId: z.number(),
    formas: z.array(formaPagamentoModelSchema)
});

export type PagamentoModelType = z.infer<typeof pagamentoModelSchema>

export function validatePagamentoModel(pagamento: unknown): PagamentoModelType | ZodError {
    const result = pagamentoModelSchema.safeParse(pagamento);

    if (!result.success) return result.error;

    return result.data;
}