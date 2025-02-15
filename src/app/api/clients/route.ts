// api/clients/route.tsx

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import useAuth from "@/hooks/useAuth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const userData: any = await useAuth();
  if (userData.userId && (userData.role === 3 || userData.role === 1)) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
    const skip = (page - 1) * pageSize;

    const [requests, totalRequests] = await prisma.$transaction([
      prisma.requests.findMany({
        skip,
        take: pageSize,
      }),
      prisma.requests.count(),
    ]);

    return NextResponse.json({ requests, totalRequests }, { status: 200 });
  }
  return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
}

export async function POST(request: Request) {
  const userData: any = await useAuth();

  if (userData.userId && (userData.role === 3 || userData.role === 1)) {
    const data = await request.json();
    const newRequest = await prisma.requests.create({ data });

    return NextResponse.json(newRequest, { status: 201 });
  }
  return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
}
