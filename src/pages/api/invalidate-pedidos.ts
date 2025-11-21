import { Server as IOServer } from "socket.io";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    return;
  }

  const io: IOServer = res.socket.server.io;

  io.emit("invalidatePedidos")

  res.end();
}
