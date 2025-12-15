"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";

import Image from "next/image";
import { Stepper, Step, StepperRef } from "../ui/Stepper";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import {
  EstabelecimentoFormType,
  validateEstabelecimentoForm,
} from "@/schemas/estabelecimentoSchema";
import { queryClient } from "@/lib/queryClient";
import { ZodError } from "zod";
import ErrorMessage from "../ui/errorMessage";
import NumeroMesasField from "../ui/form/numeroMesasField";
import CnpjField from "../ui/form/cnpjField";
import NomeEstabelecimentoField from "../ui/form/nomeEstabelecimentoField";

type PrimeiroAcessoProps = {
  setConfigDone: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
};

function PrimeiroAcesso({ setConfigDone, onClose }: PrimeiroAcessoProps) {
  const stepperRef = useRef<StepperRef>(null);

  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [numMesas, setNumMesas] = useState(0);
  const [perguntaSeguranca, setPerguntaSeguranca] = useState("");
  const [respostaSeguranca, setRespostaSeguranca] = useState("");

  const createEstabelecimento = useMutation({
    mutationFn: async (data: EstabelecimentoFormType) => {
      const validatedData = validateEstabelecimentoForm(data);

      const res = await fetch("/api/estabelecimento", {
        method: "POST",
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
      setConfigDone(true);
      onClose();
    },
    onError: (error) => {
      if (!(error instanceof ZodError)) return;

      const firstError = error.issues[0];

      if (!firstError) return;

      const errorMap: Record<string, number> = {
        "O campo é obrigatório": 2,
        "O nome do estabelecimento deve possuir ao menos 5 caracteres.": 2,
        "O formato do CNPJ está inválido.": 3,
        "O número de mesas deve ser positivo.": 4,
        "A pergunta deve possuir ao menos 10 caracteres.": 5,
        "A resposta deve possuir ao menos 4 caracteres.": 6,
      };

      const step = errorMap[firstError.message];
      if (step) stepperRef.current?.goToStep(step);
    },
  });

  function handleComplete() {
    createEstabelecimento.mutate({
      nome: nome,
      cnpj: cnpj,
      numeroMesas: numMesas,
      perguntaSeguranca: perguntaSeguranca,
      respostaSeguranca: respostaSeguranca,
    });
  }

  return (
    <div className="relative min-w-[50vw] lg:min-w-[30vw] mx-4 space-y-4">
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Configuração Inicial
      </h1>
      <Image
        src="/images/garcons.svg"
        alt=""
        width={500}
        height={128}
        className="absolute select-none hidden md:block left-1/2 -translate-x-1/2 top-4 z-[-1]"
        draggable={false}
        unoptimized
      />
      <Stepper
        ref={stepperRef}
        nextButtonText="Próximo"
        backButtonText="Voltar"
        nextButtonProps={{
          className:
            "bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-md text-white font-medium cursor-pointer",
        }}
        onFinalStepCompleted={() => handleComplete()}
        className="bg-white mt-64"
      >
        <Step>
          <h2 className="font-medium text-orange-600 mb-2">Bem vindo ao GAPE: Gestor Ágil de Pedidos!</h2>
          <p className="text-sm">Para começar, responda à algumas perguntas rápidas sobre o seu estabelecimento.</p>
        </Step>
        <Step>
          <NomeEstabelecimentoField nome={nome} setNome={setNome} />
        </Step>
        <Step>
          <CnpjField cnpj={cnpj} setCnpj={setCnpj} />
        </Step>
        <Step>
          <NumeroMesasField numMesas={numMesas} setNumMesas={setNumMesas} />
        </Step>
        <Step>
          <Label className="flex flex-col gap-2">
            Pergunta de Segurança
            <Input
              placeholder="Ex: Em que dia o estabelecimento foi inaugurado?"
              value={perguntaSeguranca}
              onChange={(e) => setPerguntaSeguranca(e.target.value)}
            />
            <p className="text-center text-neutral-400 font-normal">
              Será utilizada para recuperação de senha.
            </p>
          </Label>
        </Step>
        <Step>
          <Label className="flex flex-col gap-2">
            Resposta da Pergunta de Segurança
            <Input
              placeholder=""
              value={respostaSeguranca}
              onChange={(e) => setRespostaSeguranca(e.target.value)}
            />
          </Label>
        </Step>
      </Stepper>
      {createEstabelecimento.error && (
        <ErrorMessage error={createEstabelecimento.error} />
      )}
    </div>
  );
}

export default PrimeiroAcesso;
