"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    validatePassword();
  }, [password]);

  const validatePassword = () => {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");
    setPasswordValid(strongRegex.test(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (
      username === "" ||
      email === "" ||
      phone_number === "" ||
      password === "" ||
      confirmPassword === "" ||
      firstName === "" ||
      lastName === ""
    ) {
      setError("Заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (!passwordValid) {
      setError(
        "Пароль должен содержать как минимум 8 символов, включая строчные и заглавные буквы, цифры"
      );
      return;
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        phone_number,
        password,
        firstName,
        lastName,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      // Регистрация успешна, перенаправляем на страницу входа
      router.push("/auth/login");
    } else {
      setError(data.error || "Ошибка при регистрации");
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
          <h1 className="text-3xl text-[#dbc58] font-bold">Регистрация</h1>
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-current-light"
          />
          <input
            type="text"
            placeholder="Фамилия"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-current-light"
          />
          <input
            type="text"
            placeholder="Имя пользователя для входа"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-current-light"
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-current-light"
          />
          <input
            type="text"
            placeholder="Телефон"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-current-light"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-current-light ${
              passwordValid ? "border-green-500" : "border-red-500"
            }`}
          />
          <input
            type="password"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-current-light ${
              password === confirmPassword && passwordValid
                ? "border-green-500"
                : "border-red-500"
            }`}
          />
          {!passwordValid && (
            <p className="text-red-500">
              Пароль должен содержать как минимум 8 символов, включая строчные и
              заглавные буквы, цифры и специальные символы
            </p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 text-2xl rounded-xl bg-[#dbc58] text-[#323232] hover:text-white transition-colors font-bold hover:bg-[#323232] bg-[#bfa156] focus:outline-none focus:ring-2 focus:ring-[#bfa156]"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}
