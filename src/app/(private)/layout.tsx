"use client";
import {
  NotepadText,
  Store,
  PackagePlus,
  History,
  Users2,
  HandPlatter,
  Settings,
  LogOut,
  ShieldUser,
  CircleUser,
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/Sidebar";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { io } from "socket.io-client";

// Lib
import useUser from "@/lib/hooks/useUser";
import { forbiddenRoutes } from "@/lib/forbiddenRoutes";
import { queryClient } from "@/lib/queryClient";

type SidebarLink = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const links: SidebarLink[] = [
  {
    label: "Central de Pedidos",
    href: "/central-pedidos",
    icon: NotepadText,
  },
  {
    label: "Ponto de Venda",
    href: "/ponto-venda",
    icon: Store,
  },
  {
    label: "Catálogo",
    href: "/catalogo",
    icon: PackagePlus,
  },
  {
    label: "Histórico",
    href: "/historico",
    icon: History,
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: Users2,
  },
  {
    label: "Usuários",
    href: "/usuarios",
    icon: HandPlatter,
  },
  {
    label: "Configuração",
    href: "/configuracao",
    icon: Settings,
  },
];

const logoutLink = {
  label: "Sair",
  href: "/api/logout",
  icon: LogOut,
};

const socket = io({
  path: "/socket-io",
});

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { data: user, isPending: isUserPending } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/socket", { method: "POST", credentials: "include" });

    // Quando conectar
    socket.on("connect", () => {
      console.log("🟢 Conectado:", socket.id);
    });

    socket.on("invalidatePedidos", () => {
      console.log("ouviu")
      queryClient.invalidateQueries({ queryKey: ["pedidosPendentes"] });
    });

    return () => {
      socket.off("connect");
      socket.off("invalidatePedidos");
      socket.disconnect();
    };
  }, [queryClient]);

  return (
    <motion.div className="flex">
      <Sidebar open={open} setOpen={setOpen} >
        <SidebarBody className="h-screen justify-between gap-10 items-baseline font-medium overflow-hidden sticky top-0">
          <div>
            {!isUserPending &&
              user &&
              links.map((link, idx) => {
                if (
                  forbiddenRoutes[user.role].some(
                    (route) => route === link.href
                  )
                )
                  return;
                return (
                  <SidebarLink key={idx} link={link} pathname={pathname!} />
                );
              })}
          </div>
          <div>
            <SidebarLink
              key={"logout"}
              link={logoutLink}
              pathname={pathname!}
            />
            <div className="flex items-center justify-start gap-2 group/sidebar py-2">
              {user?.role === "Admin" ? (
                <ShieldUser width={28} height={28} strokeWidth={1.5} />
              ) : (
                <CircleUser width={28} height={28} strokeWidth={1.5} />
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="w-[100vw] flex-1 bg-neutral-50 px-6 lg:px-2 pt-2 md:rounded-tl-3xl border-l">
        {children}
      </main>
    </motion.div>
  );
}
