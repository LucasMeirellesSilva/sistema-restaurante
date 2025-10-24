import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getClientes from "@/repository/cliente/getClientesService";

export async function GET(req: NextRequest) {

  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;
   
  // Interação com o banco
  const clientes = await getClientes();

  return NextResponse.json(clientes);
}

import { validateClienteForm } from "@/schemas/clienteSchema"
import createCliente from "@/repository/cliente/createClienteService";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  if (!isValid) return res;

  try {
    const cliente = validateClienteForm(await req.json());

    const result = await createCliente(cliente);
  
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });

    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}

import updateCliente, { ClienteUpdateType } from "@/repository/cliente/updateClienteService";

export async function PATCH(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const cliente: ClienteUpdateType = await req.json();

  try {
    const result = await updateCliente(cliente)

    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}

import deleteCliente from "@/repository/cliente/deleteClientService";

export async function DELETE(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const { id }: { id: number } = await req.json();

  try {
    const result = await deleteCliente(id);

    return NextResponse.json(result.nome, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}