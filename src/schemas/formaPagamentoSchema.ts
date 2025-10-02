import { z } from 'zod';

export const formaPagamentoFormSchema = z.object({
    formaPagamentoId: z.number(),
    valor: z.string()
});


export const formaPagamentoModelSchema = z.object({
    valor: z.string(),
    formaPagamento: z.object({
        descricao: z.string()
    })
});