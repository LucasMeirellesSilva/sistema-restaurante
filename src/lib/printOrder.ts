import { PedidoModelType } from "@/schemas/pedidoSchema";
import ThermalPrinter, {
  PrinterTypes,
  CharacterSet,
} from "node-thermal-printer";

const printer = new ThermalPrinter.printer({
  type: PrinterTypes.EPSON,
  interface: "tcp://127.0.0.1:9100", // ou "tcp://192.168.0.100"
  characterSet: CharacterSet.WPC1252,
  removeSpecialCharacters: false,
  lineCharacter: "-",
});

function calcSpace(value1: number, value2: number) {
  const espacos = " ".repeat(Math.max(printer.getWidth() - value1 - value2, 0));

  return espacos;
}

type DecideAlignmentProps = {
  spaceBetween: string;
  string1: string;
  string2: string;
};

function decideAlignment({
  spaceBetween,
  string1,
  string2,
}: DecideAlignmentProps) {
  if (!spaceBetween || !string1 || !string2) {
    if (string1) printer.println(string1);
    if (string2) printer.println(string2);
  } else {
    printer.println(`${string1}${spaceBetween}${string2}`);
  }
}

export default async function printOrder(pedido: PedidoModelType) {
  const cliente = pedido.cliente ? `Cliente: ${pedido.cliente}` : "";
  const mesa = pedido.mesa ? `Mesa: ${pedido.mesa}` : "";
  const autor = pedido.autor ? `Autor: ${pedido.autor}` : "";
  const dataHora = `Criado em: ${pedido.criadoEmData} ${pedido.criadoEmHora}`;

  printer.alignCenter();
  printer.println("Impressão Pedido");
  printer.drawLine();
  printer.println(`Pedido #${pedido.id}`);

  let spaceBetween = calcSpace(cliente.length, dataHora.length);

  printer.newLine();

  decideAlignment({ spaceBetween, string1: cliente, string2: dataHora });

  spaceBetween = calcSpace(autor.length, mesa.length);

  decideAlignment({ spaceBetween, string1: mesa, string2: autor });

  printer.drawLine();
  pedido.itens.forEach((item) => {
    const itemPrint = `${item.quantidade}x ${
      item.produto || "Produto excluído"
    }`;

    printer.bold(true);
    spaceBetween = calcSpace(
      itemPrint.length,
      item.valorUnitarioFormatado.length
    );

    decideAlignment({
      spaceBetween,
      string1: itemPrint,
      string2: item.valorUnitarioFormatado,
    });

    printer.bold(false);
    item.adicionais.forEach((adicional) => {
      const adicionalPrint = `- ${adicional.quantidade}x ${
        adicional.produto || "Produto excluído"
      }`;

      spaceBetween = calcSpace(
        adicionalPrint.length,
        adicional.valorUnitarioFormatado.length
      );

      decideAlignment({
        spaceBetween,
        string1: adicionalPrint,
        string2: adicional.valorUnitarioFormatado,
      });
    });

    printer.bold(true);
    if (item.adicionais.length > 0) {
      const spaceLeft = calcSpace(item.valorTotalFormatado.length, 0);

      printer.println(`${spaceLeft}${item.valorTotalFormatado}`);
    }
  });

  printer.drawLine();

  const spaceLeft = calcSpace(
    "TOTAL: ".length,
    pedido.valorTotalFormatado.length
  );

  printer.println(`${spaceLeft}TOTAL: ${pedido.valorTotalFormatado}`);
  printer.cut();
  const result = await printer.execute();
  return result;
}