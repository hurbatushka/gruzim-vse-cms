'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const iUser = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Если пользователь авторизован, перенаправляем на /dashboard
    if (iUser) {
      router.push("/profile");
    }
  }, [iUser, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {iUser ? `${iUser.firstName}, выберите вкладку!` : "Загрузка..."}
    </main>
  );
}
