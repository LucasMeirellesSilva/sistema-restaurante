"use client";

import { Dispatch, SetStateAction } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginacaoProps = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
};

function Paginacao({ page, setPage, totalPages }: PaginacaoProps) {
    const previous = page - 1;
    const next = page + 1;

  return (
    <div className="flex gap-2 items-center w-fit mx-auto select-none">
      <button
        className={cn("flex gap-1 cursor-pointer", previous < 1 && "text-neutral-500 cursor-not-allowed")}
        onClick={() => {
          if (previous < 1) return
          setPage(previous)}
        }
      >
        <ChevronLeft strokeWidth={1}/>
        Anterior
      </button>
      {previous > 0 && (
        <button
          className="rounded-md py-2 px-3 cursor-pointer"
          onClick={() => setPage(previous)}
        >
          {previous}
        </button>
      )}
      <button className="border rounded-md py-2 px-3">{page}</button>
      {next <= totalPages && (
        <button
          className="rounded-md py-2 px-3 cursor-pointer"
          onClick={() => setPage(next)}
        >
          {next}
        </button>
      )}
      <button
        className={cn("flex gap-1 cursor-pointer", next > totalPages && "text-neutral-500 cursor-not-allowed")}
        onClick={() => {
          if (next > totalPages) return
          setPage(next)}
        }
      >
        Próximo
        <ChevronRight strokeWidth={1}/>
      </button>
    </div>
  );
}

export default Paginacao;
