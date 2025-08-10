import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password");
    if (password === process.env.ADMIN_PASSWORD) {
      cookies().set("isAdmin", "true", { path: "/" });
      redirect("/painel");
    }
  }

  return (
    <form action={login} className="flex flex-col gap-2 max-w-xs mx-auto p-4">
      <input
        type="password"
        name="password"
        placeholder="Senha"
        className="border p-2"
      />
      <Button type="submit">Entrar</Button>
    </form>
  );
}
