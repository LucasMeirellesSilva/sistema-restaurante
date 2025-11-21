import { z } from 'zod';

export const formaPagamentoFormSchema = z.object({
    formaPagamentoId: z.number(),
    valor: z.number()
});

export type FormaPagamentoFormType = z.infer<typeof formaPagamentoFormSchema>

export const formaPagamentoModelSchema = z.object({
    valor: z.string(),
    formaPagamento: z.object({
        descricao: z.string()
    })
});

/* eslint-disable @typescript-eslint/no-unused-vars */
const formaPagamentoSchema = z.object({
    id: z.number(),
    descricao: z.string()
})

export type FormaPagamentoType = z.infer<typeof formaPagamentoSchema>