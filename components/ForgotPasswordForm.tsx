"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/actions/user.actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "react-toastify";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      toast.success("Email de recuperação enviado!");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao solicitar recuperação de senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="email">Digite seu e-mail</label>
      <Input
        className="w-[300px]"
        id="email"
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button className="form-btn " type="submit" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
