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
      Tipo de Usuário
      <SelectTipoUsuario tipo={tipo} setTipo={setTipo} />
    </Label>
  );
}

export default TipoUsuarioField;