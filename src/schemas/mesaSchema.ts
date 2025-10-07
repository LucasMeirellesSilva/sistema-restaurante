import { z } from 'zod';

export const mesaModelSchema = z.object({
    numero: z.string()
});

export type MesaModelType = z.infer<typeof mesaModelSchema>

export function validateMesaModel(mesa: unknown): MesaModelType {
    const result = mesaModelSchema.parse(mesa);

    return result;
}