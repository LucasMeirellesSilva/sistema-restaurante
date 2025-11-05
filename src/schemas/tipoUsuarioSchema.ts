import { z } from 'zod';

export const tipoUsuarioModelSchema = z.object({
    id: z.number(),
    descricao: z.string()
});

export type TipoUsuarioModelType = z.infer<typeof tipoUsuarioModelSchema>

export const tiposUsuarioModelSchema = z.array(tipoUsuarioModelSchema);

export type TiposUsuarioModelType = z.infer<typeof tiposUsuarioModelSchema>


