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
    <div className="flex flex-wrap max-h-[15vh] md:max-h-[20vh] overflow-y-auto justify-evenly gap-1 space-y-1 border-b">
      {categorias.map((cat, index) => (
        <>
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
          </div>
          {index + 1 !== categorias.length && <div className="border-r my-2"></div> }
          </>
        ))}
    </div>
  );
}

export default SeletorCategorias;