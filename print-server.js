import express from "express";
import escpos from "escpos";

import escposUSB from "escpos-usb";
escpos.USB = escposUSB; // habilita suporte USB
const app = express();
app.use(express.json());

app.post("/print", async (req, res) => {
  const pedido = req.body.pedido;

  try {
    const device = new escpos.USB(); // detecta a impressora USB
    const printer = new escpos.Printer(device, { encoding: "850" });

    device.open(() => {
      printer
        .align("CT")
        .text("IMPRESSÃO TESTE")
        .text("-----------------------------")
        .align("LT")
        .text(`Pedido #${pedido.id}`)
        .text(`Mesa: ${pedido.mesa}`)
        .text("-----------------------------");

      pedido.itens.forEach((item) => {

        const espacos = " ".repeat(Math.max(42 - item.nome.length - item.valorUnitario.length, 0));
        printer.text(`${item.quantidade}x ${item.nome}${espacos}${item.valorUnitario}`);

        item.adicionais.forEach((adicional, i) => {
            printer.text(`- ${adicional.quantidade}x ${adicional.nome}${espacos}${adicional.valorUnitario}`);
        });
      });

      printer
        .text("-----------------------------")
        .align("RT")
        .text(`TOTAL: ${pedido.valortotal}`)
        .text("-----------------------------")
        .align("CT")
        .text(`${pedido.criadoEmData}`)
        .cut()
        .close();

      res.json({ ok: true });
    });
  } catch (error) {
    console.error("Erro ao imprimir:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(9999, () => console.log("🖨️ Servidor ESC/POS rodando na porta 9999"));
