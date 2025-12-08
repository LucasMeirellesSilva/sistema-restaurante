"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { User } from "lucide-react";

import { queryClient } from "@/lib/queryClient";

import FormHeader from "@/components/ui/form/formHeader";
import NomeField from "@/components/ui/form/nomeField";
import TelefoneField from "@/components/ui/form/telefoneField";
import ErrorMessage from "@/components/ui/errorMessage";
import FormActions from "@/components/ui/form/formActions";

import {
  ClienteFormType,
  ClienteModelType,
  ClienteUpdateType,
  validateClienteForm,
} from "@/schemas/clienteSchema";

type FormClienteProps = {
  cliente?: ClienteModelType;
  onClose: () => void;
};

function FormCliente({ cliente, onClose }: FormClienteProps) {
  const [nome, setNome] = useState(cliente?.nome ?? "");
  const [telefone, setTelefone] = useState(cliente?.telefone ?? "");

  const createOrPatchCliente = useMutation({
    mutationFn: async (data: ClienteFormType | ClienteUpdateType) => {
      const validatedData = validateClienteForm(data);

      const res = await fetch("/api/clientes", {
        method: cliente ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
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

  function handleSubmit() {
    const formData = {
      ...(cliente && { clienteId: cliente.id }),
      nome: nome,
      ...(telefone && { telefone: telefone }),
    };

    createOrPatchCliente.mutate(formData);
  }

  return (
    <div className="flex flex-col gap-4">
      <FormHeader icon={User}>
        {cliente ? "Editar Cliente" : "Novo Cliente"}
      </FormHeader>
      <form
        className="px-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NomeField nome={nome} setNome={setNome} />
        <TelefoneField telefone={telefone} setTelefone={setTelefone} />
      </form>
      {createOrPatchCliente.error && (
        <ErrorMessage error={createOrPatchCliente.error} />
      )}
      <FormActions
        existingRecord={cliente}
        handleSubmit={handleSubmit}
        onClose={onClose}
      />
    </div>
  );
}

export default FormCliente;
