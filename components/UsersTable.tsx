"use client";

import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { badgeVariants } from './ui/badge';
import { Button } from './ui/button';
import ButtonDialog from './ButtonDialog';
import { listUsers, updateAccountStatus } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';


const UsersTable = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const result = await listUsers();

    setUsers(result.users);
  }

  const updateUserStatus = async (userId: string, value: boolean) => {
    await updateAccountStatus(userId, value);
    return router.refresh();
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>status</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 && users.map((user) => (
          <TableRow key={user.name}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <span className={badgeVariants({ variant: user.emailVerification ? 'verified' : 'unverified' })}>
                {
                  user.emailVerification
                    ? 'Permitido'
                    : 'Não permitido'
                }
              </span>
            </TableCell>
            <TableCell className="text-right">
              <ButtonDialog updateMethod={updateUserStatus} user={user} />
            </TableCell>
          </TableRow>
        ))
        }
      </TableBody>
    </Table>
  )
}

export default UsersTable