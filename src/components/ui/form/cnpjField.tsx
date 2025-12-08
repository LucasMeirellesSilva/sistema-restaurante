import { Dispatch, SetStateAction } from "react";
import { Input } from "../input";
import { Label } from "../label";

type CnpjFieldProps = {
  cnpj: string;
  setCnpj: Dispatch<SetStateAction<string>>;
};

function CnpjField({ cnpj, setCnpj }: CnpjFieldProps) {
  function filterCnpjInput(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.length > 14) {
    digits = digits.substring(0, 14);
  }

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return digits.replace(/(\d{2})(\d{1,3})/, "$1.$2");
  if (digits.length <= 8) return digits.replace(/(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
  if (digits.length <= 12)
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, "$1.$2.$3/$4");

  return digits.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
    "$1.$2.$3/$4-$5"
  );
}
  
  return (
    <Label className="flex flex-col gap-2">
      CNPJ
      <Input
        placeholder="00.000.000/0000-00"
        value={cnpj}
        maxLength={18}
        onChange={(e) => setCnpj(filterCnpjInput(e.target.value))}
      />
    </Label>
  );
}

export default CnpjField;