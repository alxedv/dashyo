"use client";

import React, { useState, useEffect } from 'react';
import CustomInput from './CustomInput';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomDatePicker } from './CustomDatePicker';
import PhoneInputForm from './PhoneInputForm';
import { Textarea } from './ui/textarea';
import { getSupervisors } from '@/lib/actions/supervisor.action';
import { capitalizeWords, getNextVisitDates } from '@/lib/utils';
import { Input } from './ui/input';

const CustomerForm = ({ form, representatives, modalType }) => {
  const [supervisors, setSupervisors] = useState([]);
  const [completedVisits, setCompletedVisits] = useState([]);
  const visitDate = form.watch('visitDate');
  const recurrence = form.watch('recurrence');

  useEffect(() => {
    const fetchSupervisors = async () => {
      const data = await getSupervisors();
      setSupervisors(data);
    };

    fetchSupervisors();
  }, []);

  // Função para alternar o estado de uma visita (marcada/desmarcada)
  const handleCheckboxChange = (date) => {
    setCompletedVisits((prev) => {
      if (prev.includes(date)) {
        return prev.filter((d) => d !== date); // Desmarcar
      } else {
        return [...prev, date]; // Marcar
      }
    });
  };

  return (
    <section className='space-y-8'>
      <Form {...form}>
        <CustomInput
          control={form.control}
          name="name"
          label="Nome"
          placeholder="Digite o nome do cliente"
        />
        <div className="flex justify-between w-full">
          <CustomInput
            control={form.control}
            name="contact"
            label="Contato"
            placeholder="Digite o nome do contato"
          />
          <PhoneInputForm form={form} />
        </div>
        <div className="w-full">
          <FormField
            control={form.control}
            name="representative"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Representante responsável</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o representante" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {representatives?.map((rep, index) => (
                      <SelectItem key={`rep-${index}`} className="cursor-pointer hover:shadow-inner" value={rep.name}>
                        {rep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="form-message mt-2" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between w-full ">
          <CustomDatePicker form={form} />
          <div className="flex items-center gap-4">
            <span className="mt-8">A cada</span>
            <div className="w-[80px]">
              <CustomInput
                control={form.control}
                name="recurrence"
                label="Recorrência"
                placeholder="0"
                type="number"
              />
            </div>
            <span className="mt-8">dia(s)</span>
          </div>
        </div>

        {/* Próximas visitas com verificação de visitDate e recurrence */}
        {(visitDate && recurrence) && (
          <div>
            <span>Próximas visitas</span>
            <div className='flex flex-col w-full text-center gap-1 mt-2'>
              {
                getNextVisitDates(form.getValues()).map((item, index) => (
                  <div key={index} className="flex items-center">
                    {modalType === 'update' ? (
                      <>
                        {/* <input
                          type="checkbox"
                          checked={completedVisits.includes(item)}
                          onChange={() => handleCheckboxChange(item)}
                          className="mr-2"
                        /> */}
                        <span className='text-xs text-gray-600'>{item}</span>
                      </>
                    ) : (
                      <span className='text-xs text-gray-600'>{item}</span>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        )}

        <div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-form">Observações</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Adicione qualquer observação adicional neste campo"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </section>
  );
};

export default CustomerForm;

