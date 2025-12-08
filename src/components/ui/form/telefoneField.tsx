import { Dispatch, SetStateAction } from "react";

import { Label } from "../label";
import { Input } from "../input";

import formatPhone from "@/lib/formatPhone";

type TelefoneFieldProps = {
  telefone: string;
  setTelefone: Dispatch<SetStateAction<string>>;
};

function TelefoneField({ telefone, setTelefone }: TelefoneFieldProps) {
  return (
    <Label htmlFor="telefone">
      Telefone
      <Input
        id="telefone"
        type="tel"
        placeholder="(00) 00000-0000"
        value={telefone}
        onChange={(e) => setTelefone(formatPhone(e.target.value))}
      />
    </Label>
  );
}

export default TelefoneField;