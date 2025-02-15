import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import useAuth, { User } from "@/hooks/useAuth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const hasUser: any = await useAuth();
  const { userId } = await request.json();
  if ((hasUser.userId && hasUser.role === 3) || hasUser.role === 1) {
    if (!userId) {
      return NextResponse.json(
        { message: "userId обязателен" },
        { status: 400 }
      );
    }

    // Получаем данные пользователя из базы данных
    const userData = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        companies: true,
        loyalty_points: true,
        news: true,
        push_notifications: true,
        request_comments: true,
        requests: true,
        user_roles: true,
        user_tokens: true,
        images: true,
        passports: true,
        users_companies: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({ userData }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Доступ запрещён" }, { status: 200 });
  }
}
