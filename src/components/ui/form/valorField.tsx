import { Dispatch, SetStateAction } from "react";
import { Label } from "../label";
import { Input } from "../input";
import formatCurrency from "@/lib/formatCurrency";

type ValorFieldProps = {
  valor: number;
  setValor: Dispatch<SetStateAction<number>>;
};

function ValorField({ valor, setValor }: ValorFieldProps) {
  function handleSetValor(value: string) {
    // Remove tudo que não for número
    const numeric = value.replace(/\D/g, "");

    // Converte pra número em reais (dividindo por 100)
    const numberValue = Number(numeric) / 100;

    setValor(numberValue);
  }

  return (
    <Label htmlFor="valor">
      Valor
      <Input
        id="valor"
        value={formatCurrency(valor)}
        inputMode="numeric"
        onChange={(e) => handleSetValor(e.target.value)}
        required
      />
    </Label>
  );
}

export default ValorField;