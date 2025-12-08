import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction } from "react";
import { Textarea } from "../textarea";

type DescricaoFieldProps = {
  descricao: string;
  setDescricao: Dispatch<SetStateAction<string>>;
};

function DescricaoField({ descricao, setDescricao }: DescricaoFieldProps) {
  return (
    <Label htmlFor="descricao">
      Descrição
      <Textarea
        id="descricao"
        value={descricao}
        maxLength={50}
        onChange={(e) => setDescricao(e.target.value)}
        required
      />
    </Label>
  );
}

export default DescricaoField;
