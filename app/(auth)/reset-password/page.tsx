import ResetPasswordForm from "@/components/ResetPasswordForm";
import Image from "next/image";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center border-2 border-black-1 rounded-lg p-8">
        <Image
          src="/dashyo-logo.png"
          alt="Dashyo logo"
          width={125}
          height={40}
        />
        <h2 className="text-2xl font-bold mb-4">Redefinir Senha</h2>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>


      </div>

    </section>
  );
}
