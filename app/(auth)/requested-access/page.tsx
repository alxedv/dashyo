import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const RequestedAccess = () => {
  return (
    <section className='flex flex-col items-center gap-4 justify-center h-[100vh]'>
      <header className="flex flex-col items-center gap-5 md:gap-8">
        <Link href="/" className="flex mb-12 cursor-pointer items-center gap-2">
          <Image
            src="/dashyo.logo.png"
            alt="Dashyo logo"
            width={250}
            height={80}
          />
        </Link>
      </header>
      <div className='flex flex-col items-center gap-2'>
        <span className='text-xl font-bold'>Seu acesso foi solicitado.</span>
        <span>Assim que seu usuário for permitido, basta realizar o login.</span>
        <Link href="/sign-in" className='border-2 rounded-md p-2 text-sm border-gray-600 mt-5 hover:bg-gray-600 hover:text-white'>Voltar para a tela de login</Link>
      </div>
    </section>
  )
}

export default RequestedAccess;