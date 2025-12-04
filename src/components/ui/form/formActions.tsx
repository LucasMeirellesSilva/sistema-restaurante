import { Button } from "@/components/ui/button";

type FormActionsProps = {
  existingRecord?: unknown;
  handleSubmit: () => void;
  onClose: () => void;
  disabled?: boolean;
};

function FormActions({
  existingRecord,
  handleSubmit,
  onClose,
  disabled
}: FormActionsProps) {
  return (
    <div className="flex gap-2 justify-end">
      <Button className="cursor-pointer" onClick={onClose}>
        Cancelar
      </Button>
      <Button
        className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
        onClick={() => handleSubmit()}
        disabled={disabled}
      >
        {existingRecord ? "Editar" : "Adicionar"}
      </Button>
    </div>
  );
}

export default FormActions;