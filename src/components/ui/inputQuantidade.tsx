import { Dispatch, SetStateAction } from "react";

import { Plus, Minus } from "lucide-react";

type InputQuantidadeProps = {
  quantidade: number;
  setQuantidade: Dispatch<SetStateAction<number | null>>;
};

function InputQuantidade({ quantidade, setQuantidade }: InputQuantidadeProps) {
  if (!quantidade) return;

  return (
    <div className="flex w-fit h-fit py-0.5 justify-center items-center text-neutral-700 bg-white rounded-lg border">
      <div
        className="cursor-pointer px-2 py-1"
        onClick={() =>
          setQuantidade((prev) => {
            const atual = typeof prev === "number" ? prev : 0;
            const proximo = atual - 1;
            return proximo < 1 ? null : proximo;
          })
        }
      >
        <Minus size={20} />
      </div>
      <input
        type="number"
        className="w-9 text-center border-x border-neutral-200 outline-neutral-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={quantidade}
        onChange={(e) => {
          if (Number(e.target.value) < 1) return;
          setQuantidade(Number(e.target.value));
        }}
      />
      <div
        className="cursor-pointer px-2 py-1"
        onClick={() => {
          setQuantidade(quantidade + 1);
        }}
      >
        <Plus size={20} />
      </div>
    </div>
  );
}

export default InputQuantidade;
