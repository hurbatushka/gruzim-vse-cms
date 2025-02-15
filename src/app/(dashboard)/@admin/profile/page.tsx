
// pages/profile.tsx

"use client";

import { useEffect, useState } from "react";
import useAuth, { User } from "@/hooks/useAuth";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const iUser: any = await useAuth();
      // Здесь должна быть логика для получения текущего userId
      const userId = 1; // Замените на реальный способ получения userId

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      setUser(data.userData);
       console.log(data.userData);
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div className="">
    <h1 className="text-3xl font-bold">Управление аккаунтом</h1>
    <p>Загрузка персональной информации</p>
  </div>;
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold">Управление аккаунтом</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default ProfilePage;
