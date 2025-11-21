import { Server as IOServer } from "socket.io";

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    return;
  }

  const io: IOServer = res.socket.server.io;

  io.emit("invalidatePedidos")

  res.end();
}
