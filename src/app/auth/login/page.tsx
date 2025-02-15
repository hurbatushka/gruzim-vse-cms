"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const iUser: any = await useAuth();
        if (iUser && iUser.role) {
          router.push("/profile");
        }
      } catch (error) {
        console.error("Authentication failed", error);
        // Можно добавить логику для обработки ошибки
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (identifier === "" || password === "") {
      setError("Заполните все поля");
      return;
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/profile");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background-white">
      <div className="bg-background-light-grey p-8 rounded-2xl shadow-2xl w-full max-w-md border-spacing-1">
        <div className="text-center mb-6">
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-48 h-32 mx-auto mb-4 select-none"
          />
          <h1 className="text-3xl text-current font-bold">
            Войти в личный кабинет
          </h1>
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 ">
          <input
            type="text"
            placeholder="Имя пользователя, Email или Телефон"
            value={identifier}
            autoComplete="username"
            onChange={(e) => setIdentifier(e.target.value)}
            className="px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-[#dbc58]"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            autoComplete="password"
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-[#dbc58]"
          />
          <button
            type="submit"
            className="w-full px-4 py-3 text-2xl rounded-xl bg-current-black text-current-light hover:text-white transition-colors font-bold hover:bg-[#323232] bg-[#bfa156] focus:outline-none focus:ring-2 focus:ring-[#bfa156]"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
