import React, { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CustomerForm from './CustomerForm'
import EquipmentForm from './EquipmentForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from './ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerFormSchema, equipmentFormSchema, nextVisitDate } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { RiDeleteBinFill } from '@remixicon/react'
import { v4 as uuidv4 } from 'uuid';
import { Separator } from './ui/separator'
import { useAtomValue, useSetAtom } from 'jotai'
import { customersAtom, locationSelectedAtom, markersAtom, representativesAtom, updateCustomerAtom } from '@/store'
import { createCustomer, deleteCustomer, updateCustomer } from '@/lib/actions/customer.action'
import MoonLoader from 'react-spinners/MoonLoader'
import { toast } from 'react-toastify'

const UpdateCustomerModal = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState('Cliente');
  const setCustomers = useSetAtom(customersAtom);
  const locationSelected = useAtomValue(locationSelectedAtom);
  const { customer } = useAtomValue(updateCustomerAtom);
  const updateCustomerData = useAtomValue(updateCustomerAtom);
  const [equipments, setEquipments] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const representatives = useAtomValue(representativesAtom);


  const formSchema = customerFormSchema();

  const customerForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer.name,
      contact: customer.contact,
      phone: customer.phone,
      recurrence: customer.recurrence,
      // supervisor: customer.supervisor,
      visitDate: customer.visitDate,
    },
  })

  useEffect(() => {
    customerForm.reset({
      ...customerForm.getValues(),
      ...customer,
    });
    setEquipments(customer.equipments);

  }, [customer]);

  const onSubmit = async () => {
    setIsCreating(true);
    const { visitDate, recurrence } = customerForm.getValues();
    try {
      const payload = {
        ...customerForm.getValues(),
        lat: customer.lat,
        lng: customer.lng,
        city: customer.city,
        uf: customer.uf,
        equipments: JSON.stringify(equipments),
        documentId: customer.id,
        nextVisitDate: nextVisitDate(visitDate, recurrence)
      };

      if (payload.documentId) {
        await updateCustomer({ ...payload, documentId: payload.documentId });

        setCustomers((prev) => {
          const index = prev.findIndex((customer) => customer.id === payload.documentId);
          if (index !== -1) {
            const updatedCustomers = [...prev];
            updatedCustomers[index] = { ...updatedCustomers[index], ...payload, id: payload.documentId, equipments };
            return updatedCustomers;
          }
          return prev;
        });
      };

      customerForm.reset();
      setActiveTab('Cliente');
      setOpen(false);

      toast.success('Cliente atualizado com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error(error);
    }
    setIsCreating(false);
  };



  const handleInputChange = (value, index, name) => {
    const newEquipments = [...equipments];
    newEquipments[index][name] = value;
    setEquipments(newEquipments);
  };

  const handleDeleteEquipment = (id) => {
    const newEquipments = equipments.filter((eqp) => eqp.equipmentId !== id);

    setEquipments(newEquipments);
  }

  const handleDeleteCustomer = async (documentId) => {
    setIsCreating(true);
    try {
      await deleteCustomer(documentId);

      setCustomers((prev) => prev.filter((customer) => customer.id !== documentId));

      toast.success('Cliente removido com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {

    }
    setIsCreating(false);
    setOpen(false);
  }

  function getNextVisitDates(m) {
    const { visitDate, recurrence } = m;
    const firstVisit = new Date(visitDate);

    if (isNaN(firstVisit.getTime()) || !Number.isInteger(recurrence) || recurrence <= 0) {
      return "Dados inválidos";
    }

    const nextVisits = [];

    // Função para formatar a data no formato "02 de janeiro de 2024"
    function formatDate(date) {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }

    // Gerar as próximas 5 datas
    for (let i = 1; i <= 5; i++) {
      const nextVisit = new Date(firstVisit);
      nextVisit.setDate(firstVisit.getDate() + i * recurrence);
      nextVisits.push(formatDate(nextVisit));
    }

    return nextVisits;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white max-w-[35%] max-h-[900px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Atualizar dados do cliente</DialogTitle>
          <DialogDescription>
            <Tabs value={activeTab} className="mt-2">
              <TabsList className="bg-gray-300" >
                <TabsTrigger onClick={() => setActiveTab('Equipamentos')} value="Cliente" className="hover:cursor-auto">Cliente</TabsTrigger>
                <TabsTrigger value="Equipamentos" className="hover:cursor-auto">Equipamentos</TabsTrigger>
                {/* <TabsTrigger value="Historico" className="hover:cursor-auto">Histórico</TabsTrigger> */}
              </TabsList>
              <TabsContent value="Cliente">
                <CustomerForm modalType="update" form={customerForm} representatives={representatives} />
              </TabsContent>
              <TabsContent value="Equipamentos">
                {
                  equipments?.map((eqp, index) => (
                    <div key={`equipment-${index}`} className='mt-4 border-2 border-gray-300 rounded-xl px-4 py-4 mb-2'>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-bold text-lg">{`Equipamento ${index + 1}`}</span>
                        {
                          index !== 0 &&
                          <Button
                            size='sm'
                            className="hover:border-2 hover:border-red-400 p-2 "
                            onClick={() => handleDeleteEquipment(eqp.equipmentId)}
                          >
                            <RiDeleteBinFill className=" hover:text-white" size="sm" color='red' />
                          </Button>
                        }

                      </div>
                      <EquipmentForm equipments={equipments} initialEqp={eqp} index={index} handleChange={handleInputChange} />
                    </div>

                  ))
                }
                <Button onClick={() => setEquipments([...equipments, {
                  equipmentId: uuidv4(),
                  equipment: "",
                  margin: "",
                  reason: "",
                  saleChance: "",
                  saleStatus: "",
                  saleType: "",
                  value: null,
                }])} className="border-gray-300 border-2 hover:bg-gray-500 hover:text-white transition-all text-gray-700 w-full">+ Adicionar novo equipamento</Button>
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>

        {
          activeTab === 'Cliente' ?
            <DialogFooter className="flex justify-between rounded-md">
              <div className='flex w-full'>
                <Button onClick={() => handleDeleteCustomer(customer.id)} className='border-2 border-red-600 text-red-700 flex gap-3 hover:shadow-inner hover:bg-transparent'>
                  {
                    isCreating
                      ? <MoonLoader color='red' size={16} />
                      : <>
                        <RiDeleteBinFill className=" hover:text-white" size="sm" color='red' />
                        <span>Excluir cliente</span>
                      </>
                  }

                </Button>
              </div>
              <Button
                className="border-green-500 border-2 hover:bg-green-500 hover:text-white transition-all text-green-600"
                type='button'
                onClick={customerForm.handleSubmit(() => setActiveTab('Equipamentos'))}
              >
                Atualizar equipamentos {'->'}
              </Button>
            </DialogFooter>
            : <DialogFooter className="flex items-end !justify-between rounded-md">
              <Button
                onClick={() => setActiveTab('Cliente')}
              >
                {'<-'}
              </Button>
              <Button
                className="border-green-500 border-2 hover:bg-green-500 hover:text-white transition-all text-green-600"
                type='button'
                onClick={onSubmit}
              >
                {
                  isCreating
                    ? <MoonLoader color='green' size={16} />
                    : 'Atualizar informações'
                }

              </Button>
            </DialogFooter>
        }
      </DialogContent>
    </Dialog>
  )
}

export default UpdateCustomerModal;
