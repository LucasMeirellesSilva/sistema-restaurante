import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

type NomeFieldProps = {
  nome: string;
  setNome: Dispatch<SetStateAction<string>>;
};

function NomeField({ nome, setNome }: NomeFieldProps) {
  return (
    <Label htmlFor="nome">
      Nome
      <Input
        id="nome"
        value={nome}
        maxLength={50}
        onChange={(e) => setNome(e.target.value)}
        required
      />
    </Label>
  );
}

export default NomeField;