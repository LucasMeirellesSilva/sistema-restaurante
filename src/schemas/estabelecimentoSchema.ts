import { z } from 'zod';

export const estabelecimentoFormSchema = z.object({
    nome: z.string().min(5, "O nome do estabelecimento deve possuir ao menos 5 caracteres."),
    cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "O formato do cnpj está inválido."),
    numeroMesas: z.number(),
    perguntaSeguranca: z.string().min(10, "A pergunta deve possuir ao menos 10 caracteres."),
    respostaSeguranca: z.string().min(4, "A resposta deve possuir ao menos 4 caracteres.")
})

export type EstabelecimentoFormType = z.infer<typeof estabelecimentoFormSchema>

export type EstabelecimentoModelType = z.infer<typeof estabelecimentoFormSchema>

export function validateEstabelecimentoForm(item: unknown): EstabelecimentoFormType {
    const result = estabelecimentoFormSchema.parse(item);

    return result;
}