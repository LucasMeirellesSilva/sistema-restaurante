"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";

import FormHeader from "@/components/ui/form/formHeader";
import NomeField from "@/components/ui/form/nomeField";
import ErrorMessage from "@/components/ui/errorMessage";
import FormActions from "@/components/ui/form/formActions";
import { PackagePlus } from "lucide-react";

import {
  CategoriaFormType,
  CategoriaUpdateType,
  CategoriaModelType,
  validateCategoriaForm,
} from "@/schemas/categoriaSchema";

type FormCategoriaProps = {
  categoria?: CategoriaModelType;
  onClose: () => void;
};

function FormCategoria({ categoria, onClose }: FormCategoriaProps) {
  const [nome, setNome] = useState(categoria?.nome ?? "");

  const createOrPatchCategoria = useMutation({
    mutationFn: async (data: CategoriaFormType | CategoriaUpdateType) => {
      const validatedData = validateCategoriaForm(data);

      const res = await fetch("/api/categorias", {
        method: categoria ? "PATCH" : "POST",
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
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      onClose();
    },
  });

  function handleSubmit() {
    createOrPatchCategoria.mutate({
      ...(categoria && { id: categoria?.id }),
      nome: nome,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <FormHeader icon={PackagePlus}>
        {categoria ? "Editar Categoria" : "Nova Categoria"}
      </FormHeader>
      <form
        className="px-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NomeField nome={nome} setNome={setNome} />
      </form>
      {createOrPatchCategoria.error && (
        <ErrorMessage error={createOrPatchCategoria.error} />
      )}
      <FormActions
        existingRecord={categoria}
        handleSubmit={handleSubmit}
        onClose={onClose}
      />
    </div>
  );
}

export default FormCategoria;
