"use client";
import { useState } from "react";
import {
  LogOut,
  ChartNoAxesCombined,
  User,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import AnimatedBurger from "@/components/ui/AnimatedBurger";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Массив с основными ссылками
  const links = [
    { name: "Статистика", path: "/statistics", icon: ChartNoAxesCombined },
    { name: "Профиль", path: "/profile", icon: User },
    { name: "Настройки", path: "/settings", icon: Settings },
  ];

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "GET",
    });

    window.location.href = "/auth/login";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="h-screen shadow-md fixed bg-gray-200">
      <div
        className={`${
          isOpen ? "w-64" : "w-32"
         } h-full p-5 pt-8 relative duration-300 ease-in-out shadow-xl`}
      >
        {/* Кнопка для открытия/закрытия*/}

        <AnimatedBurger isOpen={isOpen} toggleSidebar={toggleSidebar} />

        {/* Логотип */}
        {isOpen ? (
          <div className="flex items-center justify-center pt-10 select-none">
            <img
              src="/logo2.svg" // Путь к твоему логотипу
              alt="Logo"
              className={`${
                isOpen ? "w-24" : "w-12"
              } transition-all duration-300`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center pt-10 select-none">
            <img
              src="/logo_cube.svg" // Путь к твоему логотипу
              alt="Logo"
              className={`${
                isOpen ? "w-24" : "w-12"
              } transition-all duration-300`}
            />
          </div>
        )}

        {/* Основные ссылки */}
        <div className="flex flex-col items-center mt-10 flex-grow select-none">
          <ul className="space-y-4 w-full">
            {links.map((link, index) => (
              <li key={index} className="w-full group">
                <Link href={link.path}>
                  {isOpen ? (
                    <p className="flex px-4 py-3 justify-center text-center bg-background-white text-current-black hover:bg-current-light hover:text-[#bfa156] rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                      {link.name}
                    </p>
                  ) : (
                    <p className="flex px-4 py-3 justify-center text-center bg-background-white text-current-black hover:bg-current-light hover:text-[#bfa156] rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ">
                      {
                        <link.icon className="transition-transform group-hover:-translate-x-3" />
                      }
                      <ArrowRight className="absolute right-5 transition-transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Кнопка "Выход" */}
        <div className="absolute bottom-5 left-5 right-5 select-none">
          <div onClick={logout} className="cursor-pointer">
            <div className="flex w-full px-4 py-2 justify-center text-center bg-[#bfa156] text-current-light hover:bg-[#323232] hover:text-white rounded-lg shadow-md transition-all ease-in-out transform hover:scale-105 hover:shadow-lg">
              <div
                className={`flex items-center justify-center transition-all ease-in-out ${
                  isOpen ? "gap-5" : "gap-0"
                }`}
              >
                <LogOut className="transition-transform ease-in-out" />
                {/* Текст будет скрыт, когда он невидим */}
                <span
                  className={`transition-transform ease-in-out ${
                    isOpen ? "opacity-100" : "opacity-0 translate-x-4 hidden"
                  }`}
                >
                  Выход из аккаунта
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
