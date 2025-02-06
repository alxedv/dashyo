"use client";

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { filterAtom } from '@/store';
import { useSetAtom } from 'jotai';
import Image from 'next/image';

const SelectAreaInput = () => {
  const setFilter = useSetAtom(filterAtom);

  const handleInput = (value) => {
    setFilter((prev) => ({ ...prev, area: value }))
  }
  return (
    <Select onValueChange={(value) => handleInput(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Nacional" />
      </SelectTrigger>
      <SelectContent className='bg-white w-full'>
        <SelectItem className='cursor-pointer flex items-center w-full' defaultChecked value='Nacional'>
          Nacional</SelectItem>
        <SelectItem className='cursor-pointer' value='Internacional'>Internacional</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default SelectAreaInput