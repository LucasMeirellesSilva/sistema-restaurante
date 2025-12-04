"use client";

import { useSidebar } from "./Sidebar";

import { Package, PackagePlus } from "lucide-react";

import { SidebarLink } from "./Sidebar";
import { motion } from "framer-motion";

type SidebarLink = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const links: SidebarLink[] = [
  {
    label: "Categorias",
    href: "/categorias",
    icon: PackagePlus
  },
  {
    label: "Produtos",
    href: "/produtos",
    icon: PackagePlus
  },
  {
    label: "Adicionais",
    href: "/adicionais",
    icon: PackagePlus
  },
];

type CatalogoSidebarProps = {
  pathname: string;
};

function CatalogoSidebar({ pathname }: CatalogoSidebarProps) {
  const { open, animate } = useSidebar();

  return (
    <div className="flex flex-col gap-2 pt-2 px-1 justify-center">
      <div className="flex gap-3 group/catalogo cursor-pointer">
        <Package strokeWidth={1.5} />
        <motion.span
          animate={{
            opacity: animate ? (open ? 1 : 0) : 1,
            width: animate ? (open ? "auto" : 0) : "auto",
          }}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            padding: 0,
            margin: 0,
          }}
          className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition"
        >
          Catálogo
        </motion.span>
      </div>
      <motion.div
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          width: animate ? (open ? "auto" : 0) : "auto",
          height: animate ? (open ? "auto" : 0) : "auto",
        }}
        className="flex flex-col transition w-fit mx-auto"
      >
        {links.map((link, idx) => (
          <SidebarLink key={idx} link={link} pathname={pathname} />
        ))}
      </motion.div>
    </div>
  );
}

export default CatalogoSidebar;
