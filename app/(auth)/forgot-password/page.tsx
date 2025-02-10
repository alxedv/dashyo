import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen border-2 border-black-1">
      <div className="flex flex-col items-center justify-center border-2 border-black-1 rounded-lg p-8">
        <Image
          src="/dashyo.logo.png"
          alt="Dashyo logo"
          width={125}
          height={40}
        />
        <h2 className="text-2xl font-bold mb-4">Recuperar Senha</h2>

        <ForgotPasswordForm />
      </div>

    </section>
  );
}
