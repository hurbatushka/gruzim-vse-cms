import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import useAuth from "@/hooks/useAuth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userData: any = await useAuth();
    if (userData.userId && (userData.role === 3 || userData.role === 1)) {
      const statuses = await prisma.request_statuses.findMany(); 
      return new Response(JSON.stringify(statuses), { status: 200 });
    }
    return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Ошибка при получении статусов" }),
      { status: 500 }
    );
  }
}
