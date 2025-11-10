import ThermalPrinter, { PrinterTypes } from "node-thermal-printer";

const printer = new ThermalPrinter.printer({
  type: PrinterTypes.EPSON,
  interface: "tcp://127.0.0.1:9100", // ou "tcp://192.168.0.100"
  characterSet: "WPC1252",
  removeSpecialCharacters: false,
  lineCharacter: "-",
});

function calcularEspaco(value1, value2) {
  const espacos = " ".repeat(Math.max(printer.getWidth() - value1 - value2, 0));

  return espacos;
}

export default function imprimirPedido(pedido) {
  const cliente = pedido.cliente ? `Cliente: ${pedido.cliente}` : "";
  const mesa = pedido.mesa ? `Mesa: ${pedido.mesa}` : "";
  const autor = pedido.autor ? `Autor: ${pedido.autor}` : "";
  const dataHora = `Criado em: ${pedido.criadoEmData} ${pedido.criadoEmHora}`;

  printer.alignCenter();
  printer.println("Impressão Pedido");
  printer.drawLine();
  printer.println(`Pedido #${pedido.id}`);

  let spaceBetween = calcularEspaco(cliente.length, dataHora.length);

  printer.newLine();

  if (!spaceBetween | !cliente | !dataHora) {
    if (cliente) printer.println(cliente);
    if (dataHora) printer.println(dataHora);
  } else {
    printer.println(`${cliente}${spaceBetween}${dataHora}`);
  }

  spaceBetween = calcularEspaco(autor.length, mesa.length);

  if (!spaceBetween | !mesa | !autor) {
    if (mesa) printer.println(mesa);
    if (autor) printer.println(autor);
  } else {
    printer.println(`${mesa}${spaceBetween}${autor}`);
  }

  printer.drawLine();
  pedido.itens.forEach((item) => {
    const itemPrint = `${item.quantidade}x ${
      item.produto || "Produto excluído"
    }`;

    printer.bold(true);
    spaceBetween = calcularEspaco(
      itemPrint.length,
      item.valorUnitarioFormatado.length
    );

    printer.println(
      `${itemPrint}${spaceBetween}${item.valorUnitarioFormatado}`
    );

    printer.bold(false);
    item.adicionais.forEach((adicional) => {
      const adicionalPrint = `- ${adicional.quantidade}x ${
        adicional.produto || "Produto excluído"
      }`;

      spaceBetween = calcularEspaco(
        adicionalPrint.length,
        adicional.valorUnitarioFormatado.length
      );

      printer.println(
        `${adicionalPrint}${spaceBetween}${adicional.valorUnitarioFormatado}`
      );
    });

    printer.bold(true);
    if (item.adicionais.length > 0) {
      const spaceLeft = calcularEspaco(item.valorTotalFormatado.length, 0);

      printer.println(`${spaceLeft}${item.valorTotalFormatado}`);
    }
  });

  printer.drawLine();

  const spaceLeft = calcularEspaco(
    "TOTAL: ".length,
    pedido.valorTotalFormatado.length
  );

  printer.println(`${spaceLeft}TOTAL: ${pedido.valorTotalFormatado}`);
  printer.cut();
  printer.execute();
}
