import ThermalPrinter, { PrinterTypes } from "node-thermal-printer";

const printer = new ThermalPrinter.printer({
  type: PrinterTypes.EPSON,
  interface: "dummy", // ou "tcp://192.168.0.100"
});

function calcularEspaco(value1, value2) {
  const espacos = " ".repeat(Math.max(32 - value1 - value2, 0));

  return espacos
}

export default function imprimirPedido(pedido) {
  console.log(pedido)
  printer.alignCenter();
  printer.println("Impressão Pedido");
  printer.drawLine();
  printer.println(`Pedido #${pedido.id}`);
  printer.println(`Mesa: ${pedido.mesa}`);
  printer.drawLine();
  pedido.itens.forEach((item) => {
    const espacos = calcularEspaco((item.produto?.length || "Produto excluído".length), item.valorUnitarioFormatado.length)
    
    printer.println(`${item.quantidade}x ${item.produto ?? "Produto excluído"}${espacos}${item.valorUnitarioFormatado}`);

    item.adicionais.forEach((adicional) => {
      const espacos = calcularEspaco((adicional.produto?.length || "Produto excluído".length), adicional.valorUnitarioFormatado.length)
      printer.println(`- ${adicional.quantidade}x ${adicional.produto ?? "Produto excluído"}${espacos}${adicional.valorUnitarioFormatado}`);});
    });
  printer.alignRight();
  printer.println(`TOTAL: ${pedido.valorTotalFormatado}`)
  printer.cut();
  printer.execute();
}
