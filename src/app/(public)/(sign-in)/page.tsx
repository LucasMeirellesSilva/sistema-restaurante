'use client'

import React, { useState, useEffect } from "react";

// Next
import { useRouter } from 'next/navigation';
import Image from "next/image";

// React Query
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { LogIn } from "lucide-react";
import RotatingText from "@/components/ui/RotatingText";
import { AnimatePresence, motion } from "framer-motion";

const images = ["/images/gerenciar.svg", "/images/otimizar.svg","/images/prosperar.svg"]

export default function SignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [imageIdx, setImageIdx] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIdx((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  type LoginVariables = { username: string; password: string };

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: LoginVariables) => {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro no login");

      return { role: data.role };
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["userRole"], res.role);
      router.push("/central-pedidos");
    },
    onError: (error) => {
      if (error instanceof Error) {
        if (error.message === "Senha inválida") setError("password");
        else if (error.message === "Usuário não encontrado") setError("user");
        else setError("failedToFetch");
      }
    },
  });

  async function handleLogin(e: React.FormEvent, username: string, password: string) {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  }

  return (
    <div className="flex justify-center">
      <div className="flex h-screen w-2/3 justify-evenly items-center">
        <div className="flex-1 relative flex items-center justify-center border-r h-2/3">
          <AnimatePresence>
            <motion.div
            key={imageIdx}
            className="absolute top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            >
              <Image src={images[imageIdx]} alt="Imagem de ilustração do login" width={600} height={600} className="h-fit select-none" draggable="false" priority />
            </motion.div>
          </AnimatePresence>
        </div>

        <form className="flex-1 flex flex-col gap-4 items-center" onSubmit={(e) => handleLogin(e, username, password)}>
          <div className="flex gap-2 items-center">
            <h2 className="text-3xl font-bold">Comece a</h2>
            <RotatingText texts={["Gerenciar", "Otimizar", "Prosperar"]}
            mainClassName="px-2 sm:px-2 md:px-3 bg-[#EA580C] text-white text-3xl font-bold overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={4000}
          />
          </div>

          <div>
            <Label htmlFor="username" className="text-md"> Usuário </Label>
            <div className="relative">
              <Input type="text" id="username" className="indent-5 w-64" onChange={(e) => setUsername(e.target.value)}/>
              <User className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500"/>
            </div>
          </div>

          <Label htmlFor="password" className="text-md font-medium">
            Senha
            <Input type="password" id="password" placeholder="****" className="w-64" onChange={(e) => setPassword(e.target.value)}/>
          </Label>

          {error && error === "user" && <p className="text-red-600">Usuário não encontrado.</p>}
          {error && error === "password" && <p className="text-red-600">Senha inválida.</p>}
          {error && error === "failedToFetch" && <p className="text-red-600">Erro na conexão com o servidor, tente reiniciar a aplicação.</p>}

          <Button type="submit" className="bg-neutral-700 cursor-pointer">
            Entrar
            <LogIn />
          </Button>
        </form>
      </div>
    </div>
  );
}