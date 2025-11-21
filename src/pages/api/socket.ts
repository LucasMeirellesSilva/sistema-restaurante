import { Server as IOServer } from "socket.io";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    console.log("⚡ Inicializando Socket.IO");
    const ioServer = new IOServer(res.socket.server, {
      path: "/socket-io",
      cors: { origin: "*" },
    });
    res.socket.server.io = ioServer;

    ioServer.on("connection", (socket) => {
      console.log("🟢 Cliente conectado:", socket.id);
    });
  }

  res.end();
}