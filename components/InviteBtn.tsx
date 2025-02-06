"use client"


import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { userLoggedAtom } from "@/store";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";

export function InviteBtn() {
  const userLogged = useAtomValue(userLoggedAtom);

  return (
    <Button
      variant="default"
      className="bg-[#00107a] text-white hover:bg-[#00107a]/80"
      onClick={() => {
        toast.info('Link copiado para a área de transferência!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigator.clipboard.writeText(`${window.location.origin}/sign-up/${userLogged?.companyName}`);
      }}
    >
      Convidar
    </Button>
  )
}
