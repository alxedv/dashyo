import AuthForm from '@/components/AuthForm'
import { useParams } from 'next/navigation';
import React from 'react'

const SignUp = ({ params }) => {
  const { param } = params;
  console.log({ param });

  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm param={param} type="sign-up" />
    </section>
  )
}

export default SignUp