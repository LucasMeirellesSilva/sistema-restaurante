import { z } from "zod";
import { pedidoModelSchema } from "./pedidoSchema";

export const clienteFormSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(2, "O nome do cliente deve possuir ao menos 2 caracteres."),
  telefone: z
    .string()
    .transform(v => v.trim())
    .refine(v => v === "" || /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(v), {
      message: "Formato de telefone inválido",
    }),
});

export type ClienteFormType = z.infer<typeof clienteFormSchema>;

export function validateClienteForm(cliente: unknown): ClienteFormType {
  const result = clienteFormSchema.parse(cliente);

  return result;
}

export const clienteModelSchema = z.object({
  id: z.number(),
  nome: z.string(),
  telefone: z.string().max(12).nullable(),
  pedidos: z.array(pedidoModelSchema).optional(),
});

export type ClienteModelType = z.infer<typeof clienteModelSchema>;

export function validateClienteModel(cliente: unknown): ClienteModelType {
  const result = clienteModelSchema.parse(cliente);
  
  return result;
}

export type ClienteUpdateType = Partial<ClienteModelType>;