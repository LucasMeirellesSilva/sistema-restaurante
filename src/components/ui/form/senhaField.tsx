import { Dispatch, SetStateAction } from "react";
import { Input } from "../input";
import { Label } from "../label";

type SenhaState = {
  senha: string;
  confirmarSenha: string;
  equal: boolean;
  minChars: boolean;
};

type SenhaFieldProps = {
  labelText: "Senha" | "Confirmar Senha";
  senha: string;
  setSenha: Dispatch<SetStateAction<SenhaState>>;
};

function SenhaField({ labelText, senha, setSenha }: SenhaFieldProps) {
  function handleSenhaChange(value: string, type: "Senha" | "Confirmar Senha") {
    setSenha((prev) => {
      const updated = { ...prev, equal: true };

      if (type === "Senha") {
        updated.senha = value;
        updated.minChars = value.length >= 6;
      } else {
        updated.confirmarSenha = value;
      }

      updated.equal = updated.senha === updated.confirmarSenha;

      return updated;
    });
  }

  return (
    <Label htmlFor={labelText}>
      {labelText}
      <Input
        id={labelText}
        type="password"
        placeholder="******"
        value={senha}
        className="w-60"
        onChange={(e) => handleSenhaChange(e.target.value, labelText)}
      />
    </Label>
  );
}

export default SenhaField;
