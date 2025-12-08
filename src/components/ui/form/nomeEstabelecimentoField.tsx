import { Dispatch, SetStateAction } from "react";
import { Input } from "../input";
import { Label } from "../label";

type NomeEstabelecimentoFieldProps = {
  nome: string;
  setNome: Dispatch<SetStateAction<string>>;
};

function NomeEstabelecimentoField({
  nome,
  setNome,
}: NomeEstabelecimentoFieldProps) {
  return (
    <Label className="flex flex-col gap-2">
      Nome do Estabelecimento
      <Input
        placeholder="Restaurante"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
    </Label>
  );
}

export default NomeEstabelecimentoField;
