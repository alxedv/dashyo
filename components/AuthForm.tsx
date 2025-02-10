"use client";

import { signIn, signUp } from '@/lib/actions/user.actions';
import { authFormSchema } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomInput from './CustomInput';
import { Button } from './ui/button';
import { Form } from './ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Input } from './ui/input';

const AuthForm = ({ type, param }: any) => {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const [isAdm, setIsAdm] = useState(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        // Se a resposta for uma string (mensagem de erro), exiba o toast e retorne
        if (typeof response === "string") {
          toast.error(response, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return;
        }

        // Se o login foi bem-sucedido
        if (response.emailVerification) {
          toast.success("Login realizado com sucesso!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          router.push("/map");
        }
      }

      if (type === "sign-up") {
        const newUser = await signUp({
          email: data.email,
          password: data.password,
          name: data.name,
          companyName: data.companyName,
          role: isAdm ? "admin" : "default",
        });

        setUser(newUser);

        toast.success("Cadastro realizado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        router.push("requested-access");
      }
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <section className="auth-form">
      <header className="flex flex-col items-center gap-5 md:gap-8">
        <Link href="/" className="flex mb-12 cursor-pointer items-center gap-2">
          <Image
            src="/dashyo.logo.png"
            alt="Dashyo logo"
            width={250}
            height={80}
          />
        </Link>
        {param && type === "sign-up" && <span className='text-center font-inter font-bold'>Voçê foi convidado por um dos seus gestores da empresa {param}.</span>}
      </header>
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {
              type === "sign-up" && (
                <div className='flex-col'>
                  <div className='flex items-center mb-4'>
                    <input id="adm-input" size={1} className='me-4' type="checkbox" onChange={() => setIsAdm(!isAdm)} />
                    <label htmlFor="adm-input">Sou um Gestor</label>
                  </div>
                  {
                    isAdm && param && <div className='mb-4'>
                      <span className='text-sm text-red-500 w-full'>Como já existem gestores cadastrados, será necessário aguardar a aprovação do acesso.</span>
                    </div>

                  }

                  <CustomInput
                    control={form.control}
                    name="name"
                    label="Nome"
                    placeholder="Digite seu nome"
                  />

                  {isAdm && !param && <div className='mt-6'>
                    <CustomInput
                      control={form.control}
                      name="companyName"
                      label="Empresa"
                      placeholder="Digite o nome da empresa"
                    />
                  </div>}

                </div>

              )
            }
            <CustomInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="Digite seu email"
            />
            <CustomInput
              control={form.control}
              name="password"
              label="Senha"
              placeholder="Digite sua senha"
            />
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="form-btn"
                disabled={isLoading}
              >
                {isLoading
                  ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Carregando...
                    </>
                  )
                  : type === 'sign-in'
                    ? 'Fazer login'
                    : 'Cadastrar'
                }
              </Button>
            </div>
            <div className='flex justify-center'>
              <Link
                href="/forgot-password"
                replace
                className="form-link"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </form>
        </Form>
        {isAccessDenied && <span className='text-center text-red-600'>Seu acesso ainda não foi autorizado. Aguarde ou entre em contato com a equipe responsável.</span>}
        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">
            {type === "sign-in"
              ? "Cadastrar novo usuário?"
              : "Já possui acesso?"
            }
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            replace
            className="form-link"
          >
            {type === "sign-in" ? 'Clique aqui' : 'Realizar login'}
          </Link>
        </footer>
      </>
    </section>
  )
}

export default AuthForm