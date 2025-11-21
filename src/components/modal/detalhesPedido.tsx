import { PedidoModelType } from "@/schemas/pedidoSchema";
import usePagamentoPedido from "@/lib/hooks/usePagamentoPedido";
import { cn } from "@/lib/utils";

type DetalhesPedidoProps = {
  pedido: PedidoModelType;
};

const iconColor = "text-neutral-600";

function DetalhesPedido({ pedido }: DetalhesPedidoProps) {
  const { data: pagamento, isPending: isPagamentoPending } = usePagamentoPedido(
    pedido.id
  );

  return (
    <div className="min-w-[50vw] lg:min-w-[30vw] mx-4">
      <h2 className="w-fit px-6 pb-3 border-b font-medium mx-auto">
        Pedido {pedido.id}
      </h2>
      {!isPagamentoPending && pagamento ? (
        <DetalhesComPagamento pagamento={pagamento} pedido={pedido} />
      ) : (
        <InformacoesPedido pedido={pedido} />
      )}
    </div>
  );
}

export default DetalhesPedido;

import {
  User,
  NotebookPen,
  CalendarClock,
  ListChecks,
  createLucideIcon,
} from "lucide-react";
import { chairsTablePlatter } from "@lucide/lab";

const ChairsTablePlatter = createLucideIcon(
  "chairs-table-platter",
  chairsTablePlatter
);

type InformacoesPedidoProps = {
  pedido: PedidoModelType;
};

export function InformacoesPedido({ pedido }: InformacoesPedidoProps) {
  return (
    <div className="my-4 space-y-2">
      <div className="flex w-full justify-between gap-4">
        <div className="w-1/2 space-y-2">
          <div className="flex gap-1">
            <span className="flex items-center gap-1 font-medium">
              <User className={cn(iconColor)} />
              Cliente:
            </span>
            <p className="truncate">{pedido.cliente ?? "Não identificado"}</p>
          </div>
          <div className="flex gap-1">
            <span className="flex items-center gap-1 font-medium">
              <NotebookPen className={cn(iconColor)} />
              Autor:
            </span>
            <p className="truncate">{pedido.autor}</p>
          </div>
          <div className="flex gap-1">
            <span className="flex items-center gap-1 font-medium">
              <ChairsTablePlatter className={cn(iconColor)} />
              Mesa:
            </span>
            <p>{pedido.mesa ?? "Não identificado"}</p>
          </div>
        </div>
        <div className="w-1/2 space-y-2">
          <div className="flex items-start gap-1">
            <span className="flex items-center gap-1 font-medium whitespace-nowrap">
              <CalendarClock className={cn(iconColor)} />
              Criado em:
            </span>
            <p className="text-center">
              {pedido.criadoEmData} {pedido.criadoEmHora}
            </p>
          </div>
          <div className="flex gap-1">
            <span className="flex items-center gap-1 font-medium">
              <ListChecks className={cn(iconColor)} />
              Status:
            </span>
            <p
              className={cn(
                pedido.status === "Pendente" ? "text-orange-600" : ""
              )}
            >
              {pedido.status}
            </p>
          </div>
        </div>
      </div>
      <div>
        <p className="font-medium">Observação: </p>
        {pedido.observacao ?? "Nenhuma observação."}
      </div>
      <hr />
      <div className="space-y-2">
        <h3 className="font-medium">Itens do Pedido</h3>
        {pedido.itens.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between">
              <span>
                {item.quantidade}x {item.produto ?? "Produto excluído"}
              </span>
              <span className="font-medium">{item.valorUnitarioFormatado}</span>
            </div>
            {item.adicionais?.map((adicional) => (
              <div key={adicional.id} className="flex justify-between">
                <li className="ml-6 marker:text-xs">
                  {adicional.quantidade}x{" "}
                  {adicional.produto ?? "Produto excluído"}
                </li>
                <span>{adicional.valorUnitarioFormatado}</span>
              </div>
            ))}
            {item.adicionais.length > 0 && (
              <div className="flex justify-end">
                <span className="border-t font-medium">
                  {item.valorTotalFormatado}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <span>
          Total:{" "}
          <span className="font-medium">{pedido.valorTotalFormatado}</span>
        </span>
      </div>
    </div>
  );
}

import { PagamentoModelType } from "@/schemas/pagamentoSchema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type DetalhesComPagamentoProps = {
  pagamento: PagamentoModelType;
  pedido: PedidoModelType;
};

function DetalhesComPagamento({
  pagamento,
  pedido,
}: DetalhesComPagamentoProps) {
  return (
    <Tabs defaultValue="detalhes" className="my-2">
      <TabsList>
        <TabsTrigger value="detalhes" className="cursor-pointer">
          Detalhes
        </TabsTrigger>
        <TabsTrigger value="pagamento" className="cursor-pointer">
          Pagamento
        </TabsTrigger>
      </TabsList>
      <TabsContent value="detalhes">
        <InformacoesPedido pedido={pedido} />
      </TabsContent>
      <TabsContent value="pagamento">
        <h3 className="font-medium">Detalhes do Pagamento</h3>
        {pagamento.formas.map((forma, index) => (
          <div key={index} className="flex justify-between">
            <span>{forma.formaPagamento.descricao}</span>
            <span className="font-medium">{forma.valor}</span>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
}
