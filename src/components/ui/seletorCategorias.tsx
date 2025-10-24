import { Dispatch, SetStateAction } from "react";
import { CategoriaModelType } from "@/schemas/categoriaSchema";

import { cn } from "@/lib/utils";

type SeletorCategoriasProps = {
    categoria: number | null;
    setCategoria: Dispatch<SetStateAction<number | null>>;
    categorias: CategoriaModelType[]
}

function SeletorCategorias({ categoria, setCategoria, categorias }: SeletorCategoriasProps) {
  return (
    <div className="flex flex-wrap gap-1 space-y-1">
      {categorias.map((cat) => (
          <div
            className="relative flex items-center gap-2 font-medium"
            key={cat.id}
          >
            <div
              className={cn(
                "px-3 py-1.5 mx-2 cursor-pointer rounded-sm hover:bg-neutral-100 select-none",
                cat.id === categoria &&
                  "bg-orange-600 hover:bg-orange-600 text-white shadow-md"
              )}
              onClick={() => setCategoria(cat.id)}
            >
              {cat.nome}
            </div>
            <div className="absolute top-1/2 right-0 h-1/2 -translate-y-1/2 border-r"></div>
          </div>
        ))}
    </div>
  );
}

export default SeletorCategorias;