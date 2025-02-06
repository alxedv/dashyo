"use client";

import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { filterAtom } from '@/store';
import { useSetAtom } from 'jotai';
import { getUserInfo } from '@/lib/actions/user.actions';
import Cookies from 'js-cookie';
import { capitalizeWords } from '@/lib/utils';

const SelectSupervisor = ({ supervisors }) => {
  const setFilter = useSetAtom(filterAtom);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const handleInput = (value) => {
    setFilter((prev) => ({ ...prev, supervisor: value }))
  }

  useEffect(() => {
    const getUser = async () => {
      const userId = Cookies.get('appwrite-user-id');
      const user = await getUserInfo({ userId });

      if (user) {
        setIsAdminUser(user.role === "admin");
      }
    }
    getUser();
  }, [supervisors])
  return (
    <>
      {
        isAdminUser && <Select onValueChange={(value) => handleInput(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos supervisores" />
          </SelectTrigger>
          <SelectContent className='bg-white w-full'>
            <SelectItem className='cursor-pointer flex items-center w-full' defaultChecked value='Todos'>
              Todos supervisores</SelectItem>
            {supervisors.map((item) => (
              <SelectItem key={item.supervisorId} className='cursor-pointer flex items-center w-full' defaultChecked value={item.supervisorId}>
                {capitalizeWords(item.name)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    </>

  )
}

export default SelectSupervisor;