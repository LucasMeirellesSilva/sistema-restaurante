"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";

import FormHeader from "@/components/ui/form/formHeader";
import NomeField from "@/components/ui/form/nomeField";
import ValorField from "@/components/ui/form/valorField";
import CategoriaField from "@/components/ui/form/categoriaField";
import ErrorMessage from "@/components/ui/errorMessage";
import FormActions from "@/components/ui/form/formActions";

import {
  ProdutoModelType,
  ProdutoFormType,
  ProdutoUpdateType,
  validateProdutoForm,
} from "@/schemas/produtoSchema";
import { PackagePlus } from "lucide-react";
import DescricaoField from "@/components/ui/form/descricaoField";

type FormProdutoProps = {
  produto?: ProdutoModelType;
  onClose: () => void;
};

function FormProduto({ produto, onClose }: FormProdutoProps) {
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [valor, setValor] = useState(produto?.valor ?? 0);
  const [categoria, setCategoria] = useState<number | undefined>(
    produto?.categoriaId
  );
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");

  const createOrPatchProduto = useMutation({
    mutationFn: async (data: ProdutoFormType | ProdutoUpdateType) => {
      const validatedData = validateProdutoForm(data);

      const res = await fetch("/api/produtos", {
        method: produto ? "PATCH" : "POST",
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
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      onClose();
    },
  });

  function handleSubmit() {
    createOrPatchProduto.mutate({
      ...(produto && { id: produto.id }),
      nome: nome,
      valor: valor,
      categoriaId: categoria!,
      descricao: "",
      adicional: false,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <FormHeader icon={PackagePlus}>
        {produto ? "Editar Produto" : "Novo Produto"}
      </FormHeader>
      <form
        className="px-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NomeField nome={nome} setNome={setNome} />
        <ValorField valor={valor} setValor={setValor} />
        <CategoriaField categoria={categoria} setCategoria={setCategoria} />
        <DescricaoField descricao={descricao} setDescricao={setDescricao} />
      </form>
      {createOrPatchProduto.error && (
        <ErrorMessage error={createOrPatchProduto.error} />
      )}
      <FormActions
        existingRecord={produto}
        handleSubmit={handleSubmit}
        onClose={onClose}
      />
    </div>
  );
}

export default FormProduto;
