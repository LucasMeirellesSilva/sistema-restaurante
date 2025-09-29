import { z, ZodError } from 'zod';

import { itemModelSchema, itemFormSchema } from './itemSchema';

export const pedidoFormSchema = z.object({
    clienteId: z.number().optional(),
    mesaId: z.number().optional(),
    observacao: z.string().max(100).optional(),
    itens: z.array(itemFormSchema)
});

export type PedidoFormType = z.infer<typeof pedidoFormSchema>;

export function validatePedidoForm(pedido: unknown): PedidoFormType | ZodError {
    const result = pedidoFormSchema.safeParse(pedido);

    if (!result.success) return result.error;

    return result.data;
};

export const pedidoModelSchema = z.object({
    id: z.number(),
    autor: z.string(),
    cliente: z.string().nullable(),
    mesa: z.string().nullable(),
    observacao: z.string().nullable(),
    status: z.string(),
    itens: z.array(itemModelSchema),
    valorTotal: z.string(),
    criadoEm: z.string()
});

export type PedidoModelType = z.infer<typeof pedidoModelSchema>;

export function validatePedidoModel(pedido: unknown): PedidoModelType | ZodError {
    const result = pedidoModelSchema.safeParse(pedido);

    if (!result.success) return result.error;

    return result.data;
};