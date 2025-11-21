"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Check } from "lucide-react";
import SelectTipoUsuario from "@/components/ui/selectTipoUsuario";

import { queryClient } from "@/lib/queryClient";
import { UsuarioFormType, UsuarioModelType } from "@/schemas/usuarioSchema";
import { UsuarioUpdateType } from "@/repository/usuario/updateUsuario";

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

  const mutation = useMutation({
    mutationFn: async (data: UsuarioFormType | UsuarioUpdateType) => {
      const res = await fetch("/api/usuarios", {
        method: usuario ? "PATCH" : "POST",
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
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      onClose();
    },
  });

  function handleSubmit() {
    if (!senha.equal) {
      return;
    }

    if (usuario) {
      mutation.mutate({
        ...(usuario && { usuarioId: usuario.id }),
        ...(nome && { nome: nome }),
        ...(tipo && { tipoId: tipo }),
        ...(senha && { senha: senha.senha }),
      });
    } else {
      mutation.mutate({
        nome: nome,
        tipoId: tipo,
        senha: senha.senha,
      });
    }
  }

  function handleSenhaChange(value: string, type: string = "senha") {
    setSenha((prev) => {
      const updated = { ...prev, equal: true };

      if (type === "senha") {
        updated.senha = value;
        updated.minChars = value.length >= 6;
      } else {
        updated.confirmarSenha = value;
      }

      updated.equal = updated.senha === updated.confirmarSenha;

      return updated;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b w-fit px-4 mx-auto">
        <h2 className="font-medium text-lg">
          {usuario ? "Editar Usuário" : "Novo Usuário"}
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
            className="w-60"
            onChange={(e) => setNome(e.target.value)}
          />
        </Label>
        <div className="text-sm font-light">
          O nome de usuário será utilizado para acessar o sistema.
        </div>
        <Label>
          Tipo de Usuário
          <SelectTipoUsuario tipo={tipo} setTipo={setTipo} />
        </Label>
        <Label htmlFor="senha">
          Senha
          <Input
            type="password"
            placeholder="******"
            value={senha.senha}
            className="w-60"
            onChange={(e) => handleSenhaChange(e.target.value)}
          />
        </Label>
        <Label htmlFor="senha">
          Confirmar Senha
          <Input
            type="password"
            placeholder="******"
            value={senha.confirmarSenha}
            className="w-60"
            onChange={(e) => handleSenhaChange(e.target.value, "confirmar")}
          />
        </Label>
        <div
          className={cn(
            "flex items-center gap-1",
            senha.minChars && "text-emerald-600"
          )}
        >
          <Check size={16} strokeWidth={3} />
          <span className="text-sm">A senha deve possuir 6 caracteres</span>
        </div>
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
      {mutation.error instanceof Error ? mutation.error.message : null}
      <div className="flex gap-2 justify-end">
        <Button className="cursor-pointer" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          onClick={() => handleSubmit()}
        >
          {usuario ? "Editar" : "Adicionar"}
        </Button>
      </div>
    </div>
  );
}

export default FormUsuario;
