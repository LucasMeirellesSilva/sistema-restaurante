import { Dispatch, SetStateAction } from "react";

import { Label } from "../label";
import SelectCategoria from "../selectCategoria";

type CategoriaFieldProps = {
  categoria: number | undefined;
  setCategoria: Dispatch<SetStateAction<number | undefined>>;
};

function CategoriaField({ categoria, setCategoria }: CategoriaFieldProps) {
  return (
    <Label>
      Categoria
      <SelectCategoria categoria={categoria} setCategoria={setCategoria} />
    </Label>
  );
}

export default CategoriaField;
