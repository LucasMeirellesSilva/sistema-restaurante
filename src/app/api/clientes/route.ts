import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getClientes from "@/repository/cliente/getClientes";
import getClientesPaginado from "@/repository/cliente/getClientesPaginado";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const { searchParams } = new URL(req.url);

  const temParams = Array.from(searchParams.keys()).length > 0;

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  if (temParams) {
    const { clientesFormatados, totalPages, total } = await getClientesPaginado(
      {
        limit,
        skip,
      }
    );

    const response = NextResponse.json({
      items: clientesFormatados,
      page,
      totalPages,
      total,
    });

    return response;
  } else {
    const clientes = await getClientes();

    return NextResponse.json(clientes);
  }
}

import { validateClienteForm } from "@/schemas/clienteSchema";
import createCliente from "@/repository/cliente/createCliente";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  if (!isValid) return res;

  try {
    const cliente = validateClienteForm(await req.json());

    const result = await createCliente(cliente);

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError)
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });

    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

import updateCliente, {
  ClienteUpdateType,
} from "@/repository/cliente/updateCliente";

export async function PATCH(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const cliente: ClienteUpdateType = await req.json();

  try {
    const result = await updateCliente(cliente);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

import deleteCliente from "@/repository/cliente/deleteClient";

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
