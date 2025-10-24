import { z } from 'zod';
import { pedidoModelSchema } from './pedidoSchema';

export const clienteFormSchema = z.object({
    nome: z.string(),
    telefone: z.string().max(12).optional()
})

export type ClienteFormType = z.infer<typeof clienteFormSchema>

export function validateClienteForm(cliente: unknown): ClienteFormType {
    const result = clienteFormSchema.parse(cliente);

    return result;
}

export const clienteModelSchema = z.object({
    id: z.number(),
    nome: z.string(),
    telefone: z.string().max(12).nullable(),
    pedidos: z.array(pedidoModelSchema).optional()
});

export type ClienteModelType = z.infer<typeof clienteModelSchema>

export function validateClienteModel(cliente: unknown): ClienteModelType {
    const result = clienteModelSchema.parse(cliente);;

    return result;
}