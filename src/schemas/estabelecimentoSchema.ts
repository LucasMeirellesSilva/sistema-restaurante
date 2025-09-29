import { z, ZodError } from 'zod';

export const estabelecimentoFormSchema = z.object({
    nome: z.string(),
    cnpj: z.string(),
    numeroMesas: z.number(),
    perguntaSeguranca: z.string(),
    respostaSeguranca: z.string()
})

export type EstabelecimentoFormType = z.infer<typeof estabelecimentoFormSchema>

export function validateItemForm(item: unknown): EstabelecimentoFormType | ZodError {
    const result = estabelecimentoFormSchema.safeParse(item);

    if (!result.success) return result.error;

    return result.data;
}