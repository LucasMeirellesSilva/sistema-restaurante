import { z } from 'zod';

export const usuarioFormSchema = z.object({
    tipoId: z.number(),
    nome: z.string(),
    senha: z.string().min(6)
})

export type UsuarioFormType = z.infer<typeof usuarioFormSchema>

export function validateUsuarioForm(usuario: unknown): UsuarioFormType {
    const result = usuarioFormSchema.parse(usuario);

    return result;
}

export const usuarioModelSchema = z.object({
    id: z.number(),
    nome: z.string(),
    tipo: z.string()
});

export type UsuarioModelType = z.infer<typeof usuarioModelSchema>

export function validateUsuarioModel(usuario: unknown): UsuarioModelType {
    const result = usuarioModelSchema.parse(usuario);

    return result;
}