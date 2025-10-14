import { z } from 'zod';

export const estabelecimentoFormSchema = z.object({
    nome: z.string(),
    cnpj: z.string(),
    numeroMesas: z.number(),
    perguntaSeguranca: z.string(),
    respostaSeguranca: z.string()
})

export type EstabelecimentoFormType = z.infer<typeof estabelecimentoFormSchema>

export type EstabelecimentoModelType = z.infer<typeof estabelecimentoFormSchema>

export function validateEstabelecimentoForm(item: unknown): EstabelecimentoFormType {
    const result = estabelecimentoFormSchema.parse(item);

    return result;
}