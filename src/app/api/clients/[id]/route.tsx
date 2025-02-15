// api/clients/[id]/route.tsx

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import useAuth from "@/hooks/useAuth";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userData: any = await useAuth();

  if (userData.userId && (userData.role === 3 || userData.role === 1)) {
    const data = await request.json();
    const updatedRequest = await prisma.requests.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(updatedRequest, { status: 200 });
  }
  return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userData: any = await useAuth();

  if (userData.userId && (userData.role === 3 || userData.role === 1)) {
    await prisma.requests.delete({ where: { id: Number(params.id) } });

    return NextResponse.json({ message: "Заявка удалена" }, { status: 200 });
  }
  return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
}
