import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(request: Request) {
  const { identifier, password } = await request.json();
  const cookieStore = cookies();

  const user = await prisma.users.findFirst({
    where: {
      OR: [
        { username: identifier },
        { email: identifier },
        { phone_number: identifier },
      ],
      NOT: [{ is_active: false }],
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json(
      { error: "Введенные данные неверны" },
      { status: 401 }
    );
  }

  const employee = await prisma.user_roles.findFirst({
    where: {
      user_id: user.id,
      OR: [{ role_id: 1 }, { role_id: 3 }],
    },
  });

  console.log(employee);
  if (!employee) {
    return NextResponse.json(
      { error: "У вас недостаточно прав для входа в личный кабинет" },
      { status: 403 }
    );
  }

  // Генерируем JWT токен
  const token = jwt.sign(
    {
      userId: user.id,
      role: employee.role_id,
      lastName: user.last_name,
      firstName: user.first_name,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: '9999 years'}
  );

  cookieStore.set("Authorization", JSON.stringify({ token }), { expires: new Date(Date.now() + 9999 * 365 * 24 * 60 * 60 * 1000) });
 
  // Обновляем время последнего входа
  await prisma.users.update({ 
    where: { id: user.id },
    data: { last_login: new Date() }, 
  })

  // Возвращаем токен пользователю
  return NextResponse.json({ token });
}

export async function GET() {
  return NextResponse.json({ message: "Ok" }, { status: 200 });
}
