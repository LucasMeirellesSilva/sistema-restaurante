// printer-service/server.js
import express from "express";
import { getPrinters } from "@nirbby/node-printer";

const app = express();

app.get("/printers", (req, res) => {
  res.json(getPrinters());
});

app.listen(3005, () => console.log("Printer service ON"));
