import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PedidoModelType } from "@/schemas/pedidoSchema";
import { InformacoesPedido } from "./detalhesPedido";

type DetalhesMesaProps = {
  mesa: string,
  pedidos?: PedidoModelType[];
};

function DetalhesMesa({ mesa, pedidos }: DetalhesMesaProps) {
  if (!pedidos) return;

  return (
    <div className="min-w-[50vw] lg:min-w-[30vw] mx-4">
      <h2 className="w-fit px-6 pb-3 border-b font-medium mx-auto">
        Mesa {mesa}
      </h2>
      <Tabs defaultValue={String(pedidos[0].id)} className="my-2">
        <TabsList>
          {pedidos.map((p) => (
            <TabsTrigger key={p.id} value={String(p.id)} className="cursor-pointer">
              Pedido {p.id}
            </TabsTrigger>
          ))}
        </TabsList>
        {pedidos.map((p) => (
          <TabsContent key={p.id} value={String(p.id)}>
            <InformacoesPedido pedido={p} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default DetalhesMesa;
