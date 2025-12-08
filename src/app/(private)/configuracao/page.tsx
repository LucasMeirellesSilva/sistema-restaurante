"use client";

import { useEffect, useState } from "react";
import useEstabelecimento from "@/lib/hooks/useEstabelecimento";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NumeroMesasField from "@/components/ui/form/numeroMesasField";
import NomeEstabelecimentoField from "@/components/ui/form/nomeEstabelecimentoField";
import { useMutation } from "@tanstack/react-query";
import {
  EstabelecimentoUpdateType,
  validateEstabelecimentoUpdate,
} from "@/schemas/estabelecimentoSchema";
import { queryClient } from "@/lib/queryClient";
import ErrorMessage from "@/components/ui/errorMessage";

export default function Configuracoes() {
  const { data: estabelecimento, isPending: isEstabelecimentoPending } =
    useEstabelecimento();

  const [nomeEstabelecimento, setNomeEstabelecimento] = useState(
    estabelecimento?.nome ?? ""
  );
  const [numMesas, setNumMesas] = useState(estabelecimento?.numeroMesas ?? 0);

  useEffect(() => {
    if (!isEstabelecimentoPending && estabelecimento) {
      setNomeEstabelecimento(estabelecimento.nome);
      setNumMesas(estabelecimento.numeroMesas);
    }
  }, [isEstabelecimentoPending, estabelecimento]);

  const patchEstabelecimento = useMutation({
    mutationFn: async (data: EstabelecimentoUpdateType) => {
      const validatedData = validateEstabelecimentoUpdate(data);
      const res = await fetch("/api/estabelecimento", {
        method: "PATCH",
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
      queryClient.invalidateQueries({ queryKey: ["estabelecimento"] });
    },
  });

  function handleEstabelecimentoPatch() {
    patchEstabelecimento.mutate({
      nome: nomeEstabelecimento,
      numeroMesas: numMesas,
    });
  }

  if (!isEstabelecimentoPending && !estabelecimento) return null;

  return (
    <div className="flex flex-col gap-6 w-[75vw] 2xl:w-2/3 mx-auto pb-4">
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Configuração
      </h1>
      <div className="flex">
        <form
          className="flex-1 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleEstabelecimentoPatch();
          }}
        >
          <div className="flex gap-2">
            <NomeEstabelecimentoField
              nome={nomeEstabelecimento}
              setNome={setNomeEstabelecimento}
            />
            <NumeroMesasField numMesas={numMesas} setNumMesas={setNumMesas} />
          </div>
          <div className="flex gap-2">
            <Label className="flex flex-col gap-2 w-64">
              Endereço da Impressora (TCP/IP)
              <Input placeholder="127.0.0.1" />
            </Label>
            <Label className="flex flex-col gap-2 w-34">
              Porta
              <Input placeholder="9100" />
            </Label>
          </div>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer align-center"
            onClick={() => handleEstabelecimentoPatch()}
          >
            Salvar Alterações
          </Button>
          {patchEstabelecimento.error && (
            <ErrorMessage error={patchEstabelecimento.error} />
          )}
          {patchEstabelecimento.isSuccess && (
            <p className="text-emerald-600">Dados salvos com sucesso.</p>
          )}
        </form>
      </div>
    </div>
  );
}
