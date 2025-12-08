import { Dispatch, SetStateAction } from "react";
import { Input } from "../input";
import { Label } from "../label";

type NumeroMesasFieldProps = {
  numMesas: number;
  setNumMesas: Dispatch<SetStateAction<number>>;
};

function NumeroMesasField({ numMesas, setNumMesas }: NumeroMesasFieldProps) {
  function filterNumberInput(value: string) {
    // Remove tudo que não for dígito
    const onlyNumbers = value.replace(/\D/g, "");

    if (onlyNumbers === "") return 0;

    // Converte para número
    let num = Number(onlyNumbers);

    // Limita a 100
    if (num > 100) num = 100;

    return num;
  }

  return (
    <Label className="flex flex-col gap-2">
      Número de Mesas
      <Input
        placeholder="0"
        type="number"
        value={numMesas}
        min={0}
        onChange={(e) => setNumMesas(filterNumberInput(e.target.value))}
      />
    </Label>
  );
}

export default NumeroMesasField;
