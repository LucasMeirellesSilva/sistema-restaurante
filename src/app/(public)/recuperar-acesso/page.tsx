"use client";

import { useState } from "react";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";
import Link from "next/link";
import useEstabelecimentoData from "@/lib/hooks/useEstabelecimentoData";
import { useMutation } from "@tanstack/react-query";
import { RecuperarAcesso } from "@/app/api/recuperar-acesso/route";
import { useRouter } from "next/navigation";

export default function recuperarAcesso() {
  const [resposta, setResposta] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { data: estabelecimento, isLoading: isEstabelecimentoLoading } = useEstabelecimentoData();
  const router = useRouter();

  const retrieveAcessMutation = useMutation({
    mutationFn: async ({ respostaSeguranca, senha }: RecuperarAcesso) => {
      const res = await fetch("/api/recuperar-acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respostaSeguranca, senha })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro ao alterar senha.");

      window.location.href = "/central-pedidos";

      return { user: data };
    },
    onSuccess: (res) => {
      router.push("/central-pedidos");
    },
    onError: (error) => {
      if (error instanceof Error) {
        if (error.message === "Resposta inválida.") setError("answer");
        else if (error.message === "Senha curta") setError("password");
        else setError("failedToFetch");
      }
    },
  });

  async function handleForm(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("passwordMismatch");
      return;
    }

    if (password.length < 6) {
      setError("passwordShort");
      return;
    }

    retrieveAcessMutation.mutate({respostaSeguranca: resposta, senha: password})
  }

  if (isEstabelecimentoLoading) return <></>

  return (
    <div className="flex w-fit h-screen mx-auto items-center justify-center gap-12">
      <Image
        src="/images/acesso.svg"
        alt=""
        width={400}
        height={128}
        className="select-none"
        draggable={false}
      />
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={(e) => handleForm(e)}
      >
        <h2 className="w-full text-xl font-medium text-orange-600">
          Pergunta de Segurança:
        </h2>
        <Label htmlFor="resposta" className="text-lg">
          {estabelecimento?.perguntaSeguranca}
          <Input
            type="text"
            id="resposta"
            placeholder="Sua resposta"
            onChange={(e) => setResposta(e.target.value)}
          />
          <motion.div
            key={error}
            initial={{ x: -40 }}
            animate={{ x: [0, -3, 3, -3, 3, 0] }}
            transition={{ duration: 0.6 }}
          >
            {error === "answer" && (
              <p className="text-red-600">
                Resposta incorreta.
              </p>
            )}
          </motion.div>
        </Label>

        <Label htmlFor="password" className="text-md">
          Nova senha
          <Input
            type="password"
            id="password"
            placeholder="****"
            className="w-64"
            onChange={(e) => setPassword(e.target.value)}
          />
          <motion.div
            key={error}
            initial={{ x: -40 }}
            animate={{ x: [0, -3, 3, -3, 3, 0] }}
            transition={{ duration: 0.6 }}
          >
            {error === "passwordShort" && (
              <p className="text-red-600">
                A senha deve ter pelo menos 6 caracteres.
              </p>
            )}
          </motion.div>
        </Label>

        <Label htmlFor="confirmPassword" className="text-md">
          Confirmar nova senha
          <Input
            type="password"
            id="confirmPassword"
            placeholder="****"
            className="w-64"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <motion.div
            key={error}
            initial={{ x: -40 }}
            animate={{ x: [0, -3, 3, -3, 3, 0] }}
            transition={{ duration: 0.6 }}
          >
            {error === "passwordMismatch" && (
              <p className="text-red-600">As senhas não são iguais.</p>
            )}
          </motion.div>
        </Label>

        <div className="flex gap-2 mx-auto">
          <Button type="button" className="w-32 bg-orange-600 hover:bg-orange-700 cursor-pointer">
            <Link href={"/"}>Voltar</Link>
          </Button>
          <Button className="w-32 cursor-pointer">Confirmar</Button>
        </div>
      </form>
    </div>
  );
}
