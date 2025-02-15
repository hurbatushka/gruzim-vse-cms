import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const query = new URL(req.url).searchParams.get("query") || "";

  try {
    // Найдем роль "client" в таблице roles
    const clientRole = await prisma.roles.findFirst({
      where: { role_name: "User" },
    });

    if (!clientRole) {
      return NextResponse.error();
    }

    // Получим пользователей с ролью "client"
    const clients = await prisma.users.findMany({
      where: {
        AND: [
          {
            OR: [
              { first_name: { contains: query, mode: "insensitive" } },
              { last_name: { contains: query, mode: "insensitive" } },
            ],
          },
          {
            user_roles: {
              some: {
                role_id: clientRole.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
      take: 10,
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching autocomplete data:", error);
    return NextResponse.error();
  }
}
