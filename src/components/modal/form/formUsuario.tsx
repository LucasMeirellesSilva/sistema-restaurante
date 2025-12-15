"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

import { User, Check } from "lucide-react";

import { queryClient } from "@/lib/queryClient";
import {
  UsuarioFormType,
  UsuarioModelType,
  validateUsuarioForm,
} from "@/schemas/usuarioSchema";
import { UsuarioUpdateType } from "@/repository/usuario/updateUsuario";
import FormHeader from "@/components/ui/form/formHeader";
import NomeField from "@/components/ui/form/nomeField";
import TipoUsuarioField from "@/components/ui/form/tipoUsuarioField";
import SenhaField from "@/components/ui/form/senhaField";
import ErrorMessage from "@/components/ui/errorMessage";
import FormActions from "@/components/ui/form/formActions";

type FormUsuarioProps = {
  usuario?: UsuarioModelType;
  onClose: () => void;
};

function FormUsuario({ usuario, onClose }: FormUsuarioProps) {
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [tipo, setTipo] = useState(usuario?.tipoId ?? 1);
  const [senha, setSenha] = useState({
    senha: "",
    confirmarSenha: "",
    equal: true,
    minChars: false,
  });

  const createOrPatchUsuario = useMutation({
    mutationFn: async (data: UsuarioFormType | UsuarioUpdateType) => {
      const validatedData = validateUsuarioForm(data);

      const res = await fetch("/api/usuarios", {
        method: usuario ? "PATCH" : "POST",
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
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      onClose();
    },
  });

  function handleSubmit() {
    createOrPatchUsuario.mutate({
      ...(usuario && { id: usuario.id }),
      nome: nome,
      tipoId: tipo,
      senha: senha.senha,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <FormHeader icon={User}>
        {usuario ? "Editar Usuário" : "Novo Usuário"}
      </FormHeader>
      <form
        className="px-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NomeField nome={nome} setNome={setNome} />
        <div className="text-sm font-light">
          O nome de usuário será utilizado para acessar o sistema.
        </div>
        <TipoUsuarioField tipo={tipo} setTipo={setTipo} />
        <SenhaField senha={senha.senha} setSenha={setSenha} labelText="Senha" />
        <div
          className={cn(
            "flex items-center gap-1",
            senha.minChars && "text-emerald-600"
          )}
        >
          <Check size={16} strokeWidth={3} />
          <span className="text-sm">A senha deve possuir 6 caracteres</span>
        </div>
        <SenhaField
          senha={senha.confirmarSenha}
          setSenha={setSenha}
          labelText="Confirmar Senha"
        />
        <div
          className={cn(
            "flex items-center gap-1",
            senha.equal && "text-emerald-600"
          )}
        >
          <Check size={16} strokeWidth={3} />
          <span className="text-sm">As senhas devem ser iguais</span>
        </div>
      </form>
      {createOrPatchUsuario.error && (
        <ErrorMessage error={createOrPatchUsuario.error} />
      )}
      <FormActions
        existingRecord={usuario}
        handleSubmit={handleSubmit}
        onClose={onClose}
        disabled={!senha.equal}
      />
    </div>
  );
}

export default FormUsuario;
