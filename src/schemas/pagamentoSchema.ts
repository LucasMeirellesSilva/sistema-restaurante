import { z } from 'zod';

import { formaPagamentoFormSchema, formaPagamentoModelSchema } from './formaPagamentoSchema';

export const pagamentoFormSchema = z.object({
    pedidoId: z.number(),
    formas: z.array(formaPagamentoFormSchema)
})

export type PagamentoFormType = z.infer<typeof pagamentoFormSchema>

export function validatePagamentoForm(pagamento: unknown): PagamentoFormType {
    const result = pagamentoFormSchema.parse(pagamento);

    return result;
}

export const pagamentoModelSchema = z.object({
    id: z.number(),
    pedidoId: z.number(),
    formas: z.array(formaPagamentoModelSchema)
});

export type PagamentoModelType = z.infer<typeof pagamentoModelSchema>

export function validatePagamentoModel(pagamento: unknown): PagamentoModelType {
    const result = pagamentoModelSchema.parse(pagamento);

    return result;
}