import { Dispatch, SetStateAction } from "react";
import { Label } from "../label";
import SelectTipoUsuario from "../selectTipoUsuario";

type TipoUsuarioFieldProps = {
  tipo: number;
  setTipo: Dispatch<SetStateAction<number>>;
};

function TipoUsuarioField({ tipo, setTipo }: TipoUsuarioFieldProps) {
  return (
    <Label>
      Nível de Acesso
      <SelectTipoUsuario tipo={tipo} setTipo={setTipo} />
    </Label>
  );
}

export default TipoUsuarioField;