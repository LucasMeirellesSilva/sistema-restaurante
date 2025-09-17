'use client'

import React, { useState, useEffect, useRef } from "react";

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

const tables = 10;

export default function SignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [imageIdx, setImageIdx] = useState(0);
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIdx((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (error === "user" && userRef.current) {
      userRef.current.focus();
      setUsername("");
    }
    if (error === "password" && passRef.current) {
      passRef.current.focus();
      setPassword("");
    }
  }, [error]);

  type LoginVariables = { username: string; password: string };

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: LoginVariables) => {
      const res = await fetch("/api/login", {
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
            exit={{ opacity: 0, x: 50 }}
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
              <Input type="text" id="username" className="indent-5 w-64" onChange={(e) => setUsername(e.target.value)} ref={userRef}/>
              <User className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500"/>
            </div>
          </div>

          <Label htmlFor="password" className="text-md font-medium">
            Senha
            <Input type="password" id="password" placeholder="****" className="w-64" onChange={(e) => setPassword(e.target.value)} ref={passRef}/>
          </Label>

          <motion.div
          key={error}
          initial={{ x: -40 }}
          animate={{ x: [0, -3, 3, -3, 3, 0] }}
          transition={{ duration: 0.6}}
          >
            {error && error === "user" && <p className="text-red-600 animate-shake-once">Usuário não encontrado.</p>}
            {error && error === "password" && <p className="text-red-600">Senha inválida.</p>}
            {error && error === "failedToFetch" && <p className="text-red-600">Erro na conexão com o servidor, tente reiniciar a aplicação.</p>}
          </motion.div>


          <Button type="submit" className="bg-neutral-700 cursor-pointer">
            {loginMutation.isPending ? <div className="w-6 h-6 border-4 border-[#EA580C] border-t-transparent rounded-full animate-spin"></div> : <div className="flex gap-2 items-center">Entrar <LogIn /></div> }
          </Button>
        </form>
      </div>
    </div>
  );
}