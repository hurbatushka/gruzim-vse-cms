import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Эндпоинт для автозаполнения адресов
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get('query');

  // Проверяем, если есть запрос
  if (!query || query.trim() === '') {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Ищем адреса, которые содержат строку запроса
    const addresses = await prisma.addresses.findMany({
      where: {
        address_line: {
          contains: query, // ищем совпадения в поле адрес
          mode: 'insensitive', // без учета регистра
        },
      },
      take: 10, // Ограничиваем результат 10 записями
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


