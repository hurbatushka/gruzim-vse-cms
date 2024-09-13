import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import useAuth, {User} from "@/hooks/useAuth";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(request: Request) {
  const { token } = await request.json();

  return NextResponse.json({ token });
}

export async function GET() {
  const userData: any = await useAuth();
  if (userData.userId && userData.role === 3 || userData.role === 1) {
    return NextResponse.json({ message: "Доступ разрешен", userData }, { status: 200 });
  }
  return NextResponse.json({ message: "Доступ запрещён" }, { status: 200 });
}
