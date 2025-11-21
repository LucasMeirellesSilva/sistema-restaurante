import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function configuracoes() {
  return (
    <div className="flex flex-col gap-6 w-[75vw] 2xl:w-2/3 mx-auto pb-4">
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Configuração
      </h1>
      <div className="flex">
        <form className="flex-1 space-y-5">
          <div className="flex gap-2">
            <Label className="flex flex-col gap-2 w-64">
              Nome do Estabelecimento
              <Input placeholder="Restaurante" />
            </Label>
            <Label className="flex flex-col gap-2 w-34">
              Número de Mesas
              <Input placeholder="0" />
            </Label>
          </div>
          <div className="flex gap-2">
            <Label className="flex flex-col gap-2 w-64">
              Endereço da Impressora (TCP/IP)
              <Input placeholder="127.0.0.1" />
            </Label>
             <Label className="flex flex-col gap-2 w-34">
              Porta
              <Input placeholder="9100"/>
            </Label>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer align-center">
            Salvar Alterações
          </Button>
        </form>
        <div className="flex-1 flex items-center justify-center">
          <Image
            alt="Cuidado"
            src="/images/cuidado.svg"
            width={260}
            height={-1}
            className="select-none"
            draggable={false}
          />
          <Button className="bg-red-600 hover:bg-red-700 cursor-pointer w-fit">
            Redefinir Sistema
          </Button>
        </div>
      </div>
    </div>
  );
}
