"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/actions/user.actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "react-toastify";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userId || !secret) {
      toast.error("Link inválido. Solicite uma nova recuperação.");
      return;
    }

    try {
      await resetPassword(userId, secret, newPassword);
      toast.success("Senha redefinida com sucesso!");
      router.push("/sign-in");
    } catch (error: any) {
      toast.error(error.message || "Erro ao redefinir senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="new-password">Nova senha</label>
      <Input
        id="new-password"
        type="password"
        className="w-[300px]"
        placeholder="Digite sua nova senha"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <Button className="form-btn " type="submit" disabled={isLoading}>
        {isLoading ? "Alterando..." : "Redefinir senha"}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
