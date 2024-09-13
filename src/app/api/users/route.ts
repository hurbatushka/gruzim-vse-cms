import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const {
    username,
    email,
    phone_number,
    password,
    firstName,
    lastName
  } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      username,
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone_number,
    },
  });

  return NextResponse.json(user);
}

export async function GET() {
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
    }
  });
  return NextResponse.json(users);
}
