import { z } from 'zod';

import { formaPagamentoFormSchema, formaPagamentoModelSchema } from './formaPagamentoSchema';

const pagamentoFormSchema = z.object({
    pedidoId: z.number(),
    formas: z.array(formaPagamentoFormSchema)
})

export type PagamentoFormType = z.infer<typeof pagamentoFormSchema>

export function validatePagamentoForm(pagamento: unknown): PagamentoFormType {
    const result = pagamentoFormSchema.parse(pagamento);

    return result;
}

const pagamentosFormSchema = z.array(pagamentoFormSchema)

export type PagamentosFormType = z.infer<typeof pagamentosFormSchema>

export function validatePagamentosForm(pagamentos: unknown): PagamentosFormType {
    const result = pagamentosFormSchema.parse(pagamentos)

    return result;
}

const pagamentoModelSchema = z.object({
    id: z.number(),
    pedidoId: z.number(),
    dataHora: z.string(),
    formas: z.array(formaPagamentoModelSchema)
});

export type PagamentoModelType = z.infer<typeof pagamentoModelSchema>

export function validatePagamentoModel(pagamento: unknown): PagamentoModelType {
    const result = pagamentoModelSchema.parse(pagamento);

    return result;
}