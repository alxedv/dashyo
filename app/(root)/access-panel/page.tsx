import { InviteBtn } from '@/components/InviteBtn'
import { Button } from '@/components/ui/button'
import UsersTable from '@/components/UsersTable'
import { listUsers } from '@/lib/actions/user.actions'
import React from 'react'

const AccessPanel = async () => {
  return (
    <section className="w-full p-16">
      <InviteBtn />
      <UsersTable />
    </section>
  )
}

export default AccessPanel