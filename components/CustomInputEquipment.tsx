"use client";

import React from 'react'
import { FormField, FormLabel, FormControl, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema, customerFormSchema, equipmentFormSchema } from '@/lib/utils'

const formSchema = equipmentFormSchema();

interface CustomInput {
  control: Control<z.infer<typeof formSchema>>,
  name: FieldPath<z.infer<typeof formSchema>>,
  label: string,
  placeholder: string,
  type?: string,
  className?: string,
  index: number;
  handleChange: any;
  inputValue: any;
}

const CustomInputEquipment = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  className = "",
  index,
  handleChange,
  inputValue,
}: CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`form-item ${className}`}>
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                onChange={({ target }) => handleChange(target.value, index, name)}
                placeholder={placeholder}
                className={`input-class`}
                type={type}
                min={0}
                value={inputValue}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  )
}

export default CustomInputEquipment