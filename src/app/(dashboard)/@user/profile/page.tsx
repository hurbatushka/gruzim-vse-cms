import useAuth from "@/hooks/useAuth";

export default function Home() {
  const iUser = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      ПОЛЬЗОВАТЕЛЬ
    </main>
  );
}
