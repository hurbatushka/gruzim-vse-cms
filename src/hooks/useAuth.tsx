"use server";
import { cookies } from "next/headers";
const jwt = require("jsonwebtoken");

export type User = {
  userId: number;
  role: number;
  lastName: string;
  firstName: string;
  email: string;
  iat: number;
  exp: number;
};

export default async function useAuth(): Promise<
  User | { message: string; status: number }
> {
  try {
    const cookieStore = cookies();
    const user = cookieStore.get("Authorization");

    if (!user?.value) {
      return {
        message: "Токен не найден, доступ запрещён",
        status: 401,
      };
    }

    const jwts = JSON.parse(user.value) as { token: string };

    return new Promise((resolve, reject) => {
      jwt.verify(
        jwts.token,
        process.env.SECRET_KEY as string,
        (err: any, decoded: User) => {
          if (err) {
            reject({
              message: "Ошибка верификации токена",
              status: 401,
            });
          } else {
            resolve(decoded as User);
          }
        }
      );
    });
  } catch (err) {
    return {
      message: "Ошибка авторизации, доступ запрещён",
      status: 401,
    };
  }
}
