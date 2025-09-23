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

import { usePathname } from "next/navigation";

// Lib
import useUserRole from "@/lib/useUserRole";

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

  return (
    <div className="flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="h-screen justify-between gap-10 items-baseline font-medium">
          <div>
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} className={pathname === link.href ? "bg-neutral-300" : ""}/>
            ))}
          </div>
          <div>
            <SidebarLink key={"logout"} link={logoutLink} />
            <div className="flex items-center justify-start gap-2 group/sidebar py-2">
              {userRole === "Admin" ? (
                <ShieldUser width={24} height={24} strokeWidth={1.5} />
              ) : (
                <CircleUser width={24} height={24} strokeWidth={1.5} />
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 bg-neutral-50 px-12 pt-2 rounded-tl-3xl border-l-1">
        {children}
      </main>
    </div>
  );
}
