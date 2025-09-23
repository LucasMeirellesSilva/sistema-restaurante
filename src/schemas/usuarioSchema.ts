import { z, ZodError } from 'zod';

export const usuarioFormSchema = z.object({
    tipoId: z.number(),
    nome: z.string(),
    senha: z.string()
})

export type UsuarioFormType = z.infer<typeof usuarioFormSchema>

export function validateUsuarioForm(usuario: unknown): UsuarioFormType | ZodError {
    const result = usuarioFormSchema.safeParse(usuario);

    if (!result.success) return result.error;

    return result.data;
}

export const usuarioModelSchema = z.object({
    id: z.number(),
    nome: z.string(),
    tipo: z.string()
});

export type UsuarioModelType = z.infer<typeof usuarioModelSchema>

export function validateUsuarioModel(usuario: unknown): UsuarioModelType | ZodError {
    const result = usuarioModelSchema.safeParse(usuario);

    if (!result.success) return result.error;

    return result.data;
}