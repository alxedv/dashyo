"use client";

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { updateAccountStatus } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation';
import { RiUserAddFill, RiUserForbidFill } from '@remixicon/react';
import { revalidatePath } from 'next/cache';


const ButtonDialog = ({ user, updateMethod }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className='w-[180px] border-2 py-2 rounded-2xl text-black hover:border-2 hover:border-gray-400'>
        <div className='flex items-center justify-center gap-2'>
          {user.emailVerification ? <RiUserForbidFill color='red' /> : <RiUserAddFill color='green' />}
          <span>{user.emailVerification ? 'Remover acesso' : 'Permitir acesso'}</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {
              user.emailVerification ? 'Remover acesso?' : 'Permitir acesso?'
            }
          </AlertDialogTitle>
          <AlertDialogDescription>
            {
              user.emailVerification ? <span>Tem certeza que deseja remover o acesso de <strong>{user.name}</strong> ? Você poderá reativar o acesso deste usuário posteriormente.</span>
                : <span>Tem certeza que deseja permitir o acesso de <strong>{user.name}</strong> ? Você poderá remover o acesso deste usuário posteriormente caso necessário.</span>
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
            await updateMethod(user.$id, !user.emailVerification);
          }}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ButtonDialog