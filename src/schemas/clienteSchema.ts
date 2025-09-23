import { z, ZodError } from 'zod';
import { pedidoModelSchema } from './pedidoSchema';

export const clienteFormSchema = z.object({
    nome: z.string(),
    telefone: z.string().max(12).nullable()
})

export type ClienteFormType = z.infer<typeof clienteFormSchema>

export function validateClienteForm(cliente: unknown): ClienteFormType | ZodError {
    const result = clienteFormSchema.safeParse(cliente);

    if (!result.success) return result.error;

    return result.data;
}

export const clienteModelSchema = z.object({
    id: z.number(),
    nome: z.string(),
    telefone: z.string().max(12).nullable(),
    pedidos: z.array(pedidoModelSchema).optional()
});

export type ClienteModelType = z.infer<typeof clienteModelSchema>

export function validateClienteModel(cliente: unknown): ClienteModelType | ZodError {
    const result = clienteModelSchema.safeParse(cliente);

    if (!result.success) return result.error;

    return result.data;
}