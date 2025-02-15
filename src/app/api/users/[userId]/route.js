import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function DELETE(req = NextRequest, { params }) {
  try {
    const id = parseInt(params.userId);
    await prisma.users.delete({
      where: { id },
    });
    return new NextResponse(
      JSON.stringify({ message: "Пользователь удален" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    return new NextResponse(
      JSON.stringify({ message: "Не удалось удалить пользоателя" }),
      { status: 500 }
    );
  }
}

export async function GET(req = NextRequest, { params }) {
  const id = parseInt(params.userId);
  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      first_name: true,
      last_name: true,
      phone_number: true,
      created_at: true,
      updated_at: true,
      last_login: true,
      is_active: true,
      is_verified: true,
    },
    where: {
      id,
    },
  });
  return NextResponse.json(users);
}

export async function PUT(req = NextRequest, { params }) {
  const { userId, ...data } = await req.json();
  const id = parseInt(params.userId);
  try {
    await prisma.users.update({
      where: { id },
      data,
    });
    return new NextResponse(
      JSON.stringify({ message: "Пользователь обновлен" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    return new NextResponse(
      JSON.stringify({ message: "Не удалось обновить пользователя" }),
      { status: 500 }
    );
  }
}
