import NavBar from "@/components/shared/NavBar";
import useAuth, {User} from "@/hooks/useAuth";

export default async function Layout({
  user,
  admin,
}: {
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const iUser: any = await useAuth();
  const role = iUser.role;
  return role === 1 ? (
    <>
      <NavBar>
      {admin}
      </NavBar>
    </>
  ) : role === 3 ? (
    user
  ) : (
    "Нечего показать!"
  );
}
