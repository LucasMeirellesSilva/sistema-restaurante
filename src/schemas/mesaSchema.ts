import { z, ZodError } from 'zod';

export const mesaModelSchema = z.object({
    numero: z.string()
});

export type MesaModelType = z.infer<typeof mesaModelSchema>

export function validateMesaModel(mesa: unknown): MesaModelType | ZodError {
    const result = mesaModelSchema.safeParse(mesa);

    if (!result.success) return result.error;

    return result.data;
}