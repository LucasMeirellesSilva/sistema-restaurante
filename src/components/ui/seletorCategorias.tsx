import { Dispatch, SetStateAction } from "react";
import { CategoriaModelType } from "@/schemas/categoriaSchema";

import { cn } from "@/lib/utils";

type SeletorCategoriasProps = {
  categoria: number | null;
  setCategoria: Dispatch<SetStateAction<number | null>>;
  categorias: CategoriaModelType[];
};

function SeletorCategorias({
  categoria,
  setCategoria,
  categorias,
}: SeletorCategoriasProps) {
  return (
    <div className="flex flex-wrap max-h-[15vh] md:max-h-[20vh] overflow-y-auto gap-1 space-y-1 border-b text-sm sm:text-base">
      {categorias.map((cat, index) => (
        <div className="flex justify-evenly" key={cat.id}>
          <div className="flex items-center gap-2 font-medium">
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
          {index + 1 !== categorias.length && (
            <div className="border-r my-2"></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SeletorCategorias;
