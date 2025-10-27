import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import imprimirPedido from "./lib/imprimirPedido.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // ou localhost:3000
  },
});

app.use(cors());
app.use(express.json());

app.post("/novo-pedido", (req, res) => {
  const pedido = req.body;

  imprimirPedido(pedido);

  // Emite para todos os clientes conectados
  io.emit("pedido-novo");

  res.json({ ok: true });
});

// WebSocket básico
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Servidor local rodando em http://localhost:${PORT}`);
});