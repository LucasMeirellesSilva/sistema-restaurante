"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

import { queryClient } from "@/lib/queryClient";

import { ClienteFormType, ClienteModelType } from "@/schemas/clienteSchema";

type UpdateClienteFormType = Partial<ClienteFormType>;

type FormClienteProps = {
  cliente?: ClienteModelType;
  onClose: () => void;
};

function FormCliente({ cliente, onClose }: FormClienteProps) {
  const [nome, setNome] = useState(cliente?.nome ?? "");
  const [telefone, setTelefone] = useState(cliente?.telefone ?? "");

  const mutation = useMutation({
    mutationFn: async (data: ClienteFormType | UpdateClienteFormType) => {
      const res = await fetch("/api/clientes", {
        method: cliente ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      onClose();
    },
  });

  function formatTelefone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 10)
      return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    if (digits.length > 6)
      return digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    if (digits.length > 2) return digits.replace(/^(\d{2})(\d*)$/, "($1) $2");
    return digits;
  }

  function handleSubmit() {
    mutation.mutate({
      ...(nome && { nome: nome }),
      ...(telefone && { telefone: telefone }),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b w-fit px-4 mx-auto">
        <h2 className="font-medium text-lg">
          {cliente ? "Editar Cliente" : "Novo Cliente"}{" "}
        </h2>
        <User className="text-neutral-500" />
      </div>
      <form className="px-6">
        <Label htmlFor="nome">
          Nome
          <Input
            id="nome"
            value={nome}
            maxLength={50}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Label>
        <Label htmlFor="telefone">
          Telefone
          <Input
            id="telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={(e) => setTelefone(formatTelefone(e.target.value))}
          />
        </Label>
      </form>
      {mutation.error instanceof Error ? mutation.error.message : null}
      <div className="flex gap-2 justify-end">
        <Button className="cursor-pointer" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          onClick={() => handleSubmit()}
        >
          {cliente ? "Editar" : "Adicionar"}
        </Button>
      </div>
    </div>
  );
}

export default FormCliente;
