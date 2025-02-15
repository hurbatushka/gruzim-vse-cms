import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

export async function GET() {
  const cookieStore = cookies();
  cookieStore.delete("Authorization");
  return NextResponse.json({ message: "Ok" }, { status: 200 });
}
