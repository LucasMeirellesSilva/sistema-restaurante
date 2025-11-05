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
    <div className="flex gap-2 items-center w-fit mx-auto">
      <button
        className={cn("flex gap-1 cursor-pointer", previous < 1 && "text-neutral-500")}
        disabled={page === 1}
        onClick={() => setPage(previous)}
      >
        <ChevronLeft strokeWidth={1}/>
        Anterior
      </button>
      {previous > 0 && (
        <button
          className="rounded-md py-2 px-3"
          onClick={() => setPage(previous)}
        >
          {previous}
        </button>
      )}
      <button className="border rounded-md py-2 px-3">{page}</button>
      {next < totalPages && (
        <button
          className="rounded-md py-2 px-3"
          onClick={() => setPage(next)}
        >
          {next}
        </button>
      )}
      <button
        className={cn("flex gap-1 cursor-pointer", page === totalPages && "text-neutral-500")}
        disabled={page === totalPages}
        onClick={() => setPage(next)}
      >
        Próximo
        <ChevronRight strokeWidth={1}/>
      </button>
    </div>
  );
}

export default Paginacao;
