import { ReactNode } from "react";
import { Button } from "../ui/button";

type ConfirmacaoProps = {
  handleConfirmation: () => void;
  onClose: () => void;
  children: ReactNode;
};

function Confirmacao({ handleConfirmation, onClose, children }: ConfirmacaoProps) {
  return (
    <div className="flex flex-col gap-4 rounded-md px-6">
      <h2 className="font-medium">Esta ação não pode ser revertida.</h2>
      <p>{children}</p>
      <div className="flex gap-2 justify-end">
        <Button className="cursor-pointer" onClick={() => onClose()}>Cancelar</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer" onClick={() => handleConfirmation()}>Confirmar</Button>
      </div>
    </div>
  );
}

export default Confirmacao;
