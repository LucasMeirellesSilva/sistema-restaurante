import { z } from 'zod';

export const estabelecimentoFormSchema = z.object({
    nome: z.string().min(5, "O nome do estabelecimento deve possuir ao menos 5 caracteres."),
    cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "O formato do CNPJ está inválido."),
    numeroMesas: z.number().nonnegative("O número de mesas não pode ser negativo.").nonoptional("O campo é obrigatório"),
    perguntaSeguranca: z.string().min(10, "A pergunta deve possuir ao menos 10 caracteres."),
    respostaSeguranca: z.string().min(4, "A resposta deve possuir ao menos 4 caracteres.")
})

export type EstabelecimentoFormType = z.infer<typeof estabelecimentoFormSchema>

export function validateEstabelecimentoForm(item: unknown): EstabelecimentoFormType {
    const result = estabelecimentoFormSchema.parse(item);

    return result;
}

export const estabelecimentoUpdateSchema = estabelecimentoFormSchema.omit({
  cnpj: true,
  perguntaSeguranca: true,
  respostaSeguranca: true,
});

export type EstabelecimentoUpdateType = z.infer<typeof estabelecimentoUpdateSchema>

export function validateEstabelecimentoUpdate(item: unknown): EstabelecimentoUpdateType {
    const result = estabelecimentoUpdateSchema.parse(item);

    return result;
}

export const estabelecimentoModelSchema = z.object({
    nome: z.string(),
    numeroMesas: z.number(),
    perguntaSeguranca: z.string()
})

export type EstabelecimentoModelType = z.infer<typeof estabelecimentoModelSchema>