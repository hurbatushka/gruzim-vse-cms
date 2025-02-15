import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Эндпоинт для автозаполнения адресов
export async function GET(req: NextRequest) {
  try {
    // Ищем адреса, которые содержат строку запроса
    const addresses = await prisma.addresses.findMany({
            select: {
        id: true,
        address_line: true,
      },
    });

    return NextResponse.json(addresses); // Возвращаем найденные адреса
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


