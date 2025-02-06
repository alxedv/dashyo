import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import PhoneInputForm from './PhoneInputForm'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { CustomDatePicker } from './CustomDatePicker'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { equipmentFormSchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import CustomInputEquipment from './CustomInputEquipment'
import CustomSelect from './CustomSelect'
import { Separator } from "@/components/ui/separator"
import CustomInput from './CustomInput'
import CustomCurrencyInput from './CustomCurrencyInput'

const EquipmentForm = ({
  handleChange,
  index,
  equipments,
  initialEqp = {} as any,
}) => {
  const equipmentFormSch = equipmentFormSchema();

  const form = useForm<z.infer<typeof equipmentFormSch>>({
    resolver: zodResolver(equipmentFormSch),
    defaultValues: {
      equipment: initialEqp.equipment,
      margin: initialEqp.margin,
      reason: initialEqp.reason,
      saleChance: initialEqp.saleChance,
      saleStatus: initialEqp.saleStatus,
      saleType: initialEqp.saleType,
      value: initialEqp.value,
    },
  })

  return (
    <section className="mt-5">
      <>
        <Form {...form}>
          <form className="space-y-8 w-full">
            <div className='flex items-center gap-4 w-full flex-wrap'>
              <CustomSelect
                inputValue={equipments[index].equipment}
                index={index}
                handleChange={handleChange}
                className="w-[30%]"
                name="equipment"
                form={form}
                label="Equipamento"
                placeholder="Selecione"
                items={['Gaiola', 'Máquinas', 'Upgrade Máquina', 'Esteiras Transportadoras', 'Ninho', 'Climatização']}
              />
              <CustomCurrencyInput
                form={form}
                inputValue={equipments[index].value}
                index={index}
                handleChange={handleChange}
                name="value"
                label="Valor em reais"
                placeholder="R$0,00"
                className="w-[30%]"
              />
              <CustomInputEquipment
                inputValue={equipments[index].margin}
                control={form.control}
                index={index}
                handleChange={handleChange}
                name="margin"
                label="Margem (%)"
                type='number'
                placeholder="0%"
                className="w-[30%]"
              />
              <CustomSelect
                inputValue={equipments[index].saleChance}
                index={index}
                handleChange={handleChange}
                className="w-[30%]"
                name="saleChance"
                form={form}
                label="Chance de venda"
                placeholder="Selecione"
                items={['Negócio perdido', '0-30%', '30-70%', '70-100%', 'Negócio fechado']}
              />
              <CustomSelect
                inputValue={equipments[index].reason}
                index={index}
                handleChange={handleChange}
                className="w-[30%]"
                name="reason"
                form={form}
                label="Motivo"
                placeholder="Selecione"
                items={['Preço', 'Condição de pagamento', 'Prazo', 'Qualidade', 'Portfólio']}
              />
              <CustomSelect
                inputValue={equipments[index].saleType}
                index={index}
                handleChange={handleChange}
                className="w-[30%]"
                name="saleType"
                form={form}
                label="Tipo de venda"
                placeholder="Selecione"
                items={['Recorrente', 'Cliente novo']}
              />
            </div>
          </form>
        </Form>
      </>
    </section>
  )
}

export default EquipmentForm