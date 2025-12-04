"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import FormHeader from "@/components/ui/form/formHeader";
import NomeField from "@/components/ui/form/nomeField";
import ValorField from "@/components/ui/form/valorField";
import CategoriaField from "@/components/ui/form/categoriaField";
import ErrorMessage from "@/components/ui/errorMessage";
import FormActions from "../../ui/form/formActions";
import { PackagePlus } from "lucide-react";

import { queryClient } from "@/lib/queryClient";

import {
  ProdutoModelType,
  ProdutoFormType,
  ProdutoUpdateType,
  validateProdutoForm
} from "@/schemas/produtoSchema";

type FormAdicionalProps = {
  adicional?: ProdutoModelType;
  onClose: () => void;
};

function FormAdicional({ adicional, onClose }: FormAdicionalProps) {
  const [nome, setNome] = useState(adicional?.nome ?? "");
  const [valor, setValor] = useState(adicional?.valor ?? 0);
  const [categoria, setCategoria] = useState<number | undefined>(adicional?.categoriaId);

  const createOrPatchAdicional = useMutation({
    mutationFn: async (data: ProdutoFormType | ProdutoUpdateType) => {
      const validatedData = validateProdutoForm(data);

      const res = await fetch("/api/adicionais", {
        method: adicional ? "PATCH" : "POST",
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
      queryClient.invalidateQueries({ queryKey: ["adicionais"] });
      onClose();
    },
  });

  function handleSubmit() {
    createOrPatchAdicional.mutate({
      ...(adicional && { id: adicional.id }),
      nome: nome,
      valor: valor,
      categoriaId: categoria!,
      descricao: null,
      adicional: true,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <FormHeader icon={PackagePlus}>
        {adicional ? "Editar Adicional" : "Novo Adicional"}
      </FormHeader>
      <form className="px-6">
        <NomeField nome={nome} setNome={setNome} />
        <ValorField valor={valor} setValor={setValor} />
        <CategoriaField categoria={categoria} setCategoria={setCategoria} />
      </form>
      {createOrPatchAdicional.error && (
        <ErrorMessage error={createOrPatchAdicional.error} />
      )}
      <FormActions
        existingRecord={adicional}
        handleSubmit={handleSubmit}
        onClose={onClose}
      />
    </div>
  );
}

export default FormAdicional;
