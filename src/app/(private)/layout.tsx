"use client";
import {
  NotepadText,
  Store,
  PackagePlus,
  History,
  HandPlatter,
  Settings,
  LogOut,
  ShieldUser,
  CircleUser,
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/Sidebar";
import React, { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";

import { usePathname } from "next/navigation";

// Lib
import useUserRole from "@/lib/hooks/useUserRole";

import { cn } from "@/lib/utils";

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
    label: "Pessoas",
    href: "/pessoas",
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

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { data: userRole } = useUserRole();
  const pathname = usePathname();
  // const [size, setSize] = useState("mx-16")

  return (
    <motion.div layout className="flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="h-screen justify-between gap-10 items-baseline font-medium">
          {/* <button onClick={() => setSize(size === "mx-16" ? "mx-32" : "mx-16")}>Tamanho</button> */}
          <div>
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} pathname={pathname} />
            ))}
          </div>
          <div>
            <SidebarLink key={"logout"} link={logoutLink} pathname={pathname} />
            <div className="flex items-center justify-start gap-2 group/sidebar py-2">
              {userRole === "Admin" ? (
                <ShieldUser width={28} height={28} strokeWidth={1.5} />
              ) : (
                <CircleUser width={28} height={28} strokeWidth={1.5} />
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <motion.main
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="bg-neutral-50 px-12 sm:px-2 pt-2 rounded-tl-3xl border-l transition-all"
      >
        {children}
      </motion.main>
    </motion.div>
  );
}
