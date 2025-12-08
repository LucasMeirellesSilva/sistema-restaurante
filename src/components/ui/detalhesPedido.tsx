import { SelectedType } from "@/app/(private)/ponto-venda/page";
import { PedidoModelType } from "@/schemas/pedidoSchema";
import formatCurrency from "@/lib/formatCurrency";

import { User, NotebookPen, CalendarClock } from "lucide-react";

type DetalhesPedidoProps = {
  selected: SelectedType;
};

function DetalhesPedido({ selected }: DetalhesPedidoProps) {
  if (!selected) return;

  return (
    <div className="flex flex-col">
      <h2 className="font-medium text-center mb-2">
        {selected.tipo === "mesa"
          ? "Mesa " + selected.mesa
          : "Pedido " + selected.pedido.id}
      </h2>
      {selected.tipo === "mesa" ? (
        selected.pedidos.map((p) => <Pedido pedido={p} key={p.id} />)
      ) : (
        <Pedido pedido={selected.pedido} />
      )}
      {selected.tipo === "mesa" && (
        <p className="text-center">
          Total da Mesa:{" "}
          <span className="font-medium">
            {formatCurrency(
              selected.pedidos.reduce((acc, p) => p.valorTotal + acc, 0)
            )}
          </span>
        </p>
      )}
    </div>
  );
}

export default DetalhesPedido;

type PedidoProps = {
  pedido: PedidoModelType;
};

function Pedido({ pedido }: PedidoProps) {
  return (
    <div className="flex flex-col gap-2 border-b">
      <div className="flex justify-between items-center bg-neutral-100 px-6 py-2">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 justify-between items-center text-end">
            <p># Pedido {pedido.id}</p>
          </div>
          <div className="flex gap-2 items-center text-end">
            <CalendarClock size={20} />
            {pedido.criadoEmHora}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 justify-between items-center text-end">
            <User size={20} />
            {pedido.cliente ?? "Não identificado"}
          </div>
          <div className="flex gap-2 justify-between items-center text-end">
            <NotebookPen size={20} />
            {pedido.autor}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-4">
        {pedido.itens.map((item) => (
          <div className="flex flex-col" key={item.id}>
            <div className="flex justify-between tracking-tight">
              <p>
                {item.quantidade}x {item.produto ?? "Produto removido"}
              </p>
              <p className="font-medium"> 
                {item.valorTotalFormatado}
              </p>
            </div>
            {item.adicionais.map((adicional) => (
              <div key={adicional.id}>
                <div className="flex justify-between pl-5 text-sm">
                  <li>
                    {adicional.quantidade}x{" "}
                    {adicional.produto ?? "Produto removido"}
                  </li>
                  <p>
                    {adicional.valorTotalFormatado}
                  </p>
                </div>
              </div>
            ))}
            {item.adicionais.length > 0 && (
              <div className="flex justify-end text-sm">
                <span className="border-t">
                  {item.valorTotalFormatado}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {pedido.observacao && <p className="px-4">Observação: {pedido.observacao}</p>}
      <p className="text-center pb-5">
        Total:{" "}
        <span className="font-medium tracking-tight">
          {pedido.valorTotalFormatado}
        </span>
      </p>
    </div>
  );
}
