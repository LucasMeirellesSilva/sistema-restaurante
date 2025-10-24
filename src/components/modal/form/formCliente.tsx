"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { User } from "lucide-react";

import InputMask from "react-input-mask";

type FormClienteProps = {
  onClose: () => void;
};

function FormCliente({ onClose }: FormClienteProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  return (
    <div className="flex flex-col gap-2 px-6">
      <div className="flex gap-2 border-b w-fit px-4">
        <h2 className="font-medium">Novo Cliente</h2>
        <User />
      </div>
      <form>
        <Label htmlFor="nome">
          Nome
          <Input
            id="nome"
            value={nome}
            maxLength={50}
            onChange={(e) => setNome(e.target.value)}
          />
        </Label>
        <Label htmlFor="telefone">
          Telefone
          <InputMask
            mask="(99) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          >
            {(props) => <Input {...props} placeholder="00.000.000/0000-00" />}
          </InputMask>
        </Label>
      </form>
      <div className="flex">
        <Button className="cursor-pointer" onClick={onClose}> Cancelar</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
          Adicionar
        </Button>
      </div>
    </div>
  );
}

export default FormCliente;
