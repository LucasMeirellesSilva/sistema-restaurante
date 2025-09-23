import { z, ZodError } from 'zod';

export const pagamentoFormSchema = z.object({
    formaPagamentoId: z.number(),
    pedidoId: z.number(),
    valor: z.string()
})

export type PagamentoFormType = z.infer<typeof pagamentoFormSchema>

export function validatePagamentoForm(pagamento: unknown): PagamentoFormType | ZodError {
    const result = pagamentoFormSchema.safeParse(pagamento);

    if (!result.success) return result.error;

    return result.data;
}

export const pagamentoModelSchema = z.object({
    id: z.number(),
    valor: z.string(),
    formaPagamento: z.string()
});

export type PagamentoModelType = z.infer<typeof pagamentoModelSchema>

export function validatePagamentoModel(pagamento: unknown): PagamentoModelType | ZodError {
    const result = pagamentoModelSchema.safeParse(pagamento);

    if (!result.success) return result.error;

    return result.data;
}