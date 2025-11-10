import { z } from 'zod';

import { itemModelSchema, itemFormSchema } from './itemSchema';

export const pedidoFormSchema = z.object({
    clienteId: z.number().optional().nullable(),
    mesaId: z.number().optional().nullable(),
    observacao: z.string().max(100).optional(),
    itens: z.array(itemFormSchema)
});

export type PedidoFormType = z.infer<typeof pedidoFormSchema>;

export function validatePedidoForm(pedido: unknown): PedidoFormType {
    const result = pedidoFormSchema.parse(pedido);

    return result;
};

export const pedidoModelSchema = z.object({
    id: z.number(),
    autor: z.string(),
    autorId: z.number(),
    cliente: z.string().nullable(),
    clienteId: z.number().nullable(),
    mesa: z.string().nullable(),
    observacao: z.string().nullable(),
    status: z.string(),
    itens: z.array(itemModelSchema),
    valorTotalFormatado: z.string(),
    valorTotal: z.number(),
    criadoEmHora: z.string(),
    criadoEmData: z.string()
});

export type PedidoModelType = z.infer<typeof pedidoModelSchema>;

export function validatePedidoModel(pedido: unknown): PedidoModelType {
    const result = pedidoModelSchema.parse(pedido);

    return result;
};