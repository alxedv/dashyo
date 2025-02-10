import React, { useState } from 'react'
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
import { RiDeleteBackFill, RiDeleteBinFill } from '@remixicon/react'
import { v4 as uuidv4 } from 'uuid';
import { Separator } from './ui/separator'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { customersAtom, locationSelectedAtom, markersAtom, representativesAtom } from '@/store'
import { createCustomer } from '@/lib/actions/customer.action'
import MoonLoader from 'react-spinners/MoonLoader'
import { toast } from 'react-toastify'
import { Switch } from "@/components/ui/switch"
import { Input } from './ui/input'
import { PhoneInput } from './PhoneInput'
import { Label } from './ui/label'
import { createRepresentative } from '@/lib/actions/representative.action'
import Cookies from 'js-cookie';


const CustomModal = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState('Cliente');
  const setCustomers = useSetAtom(customersAtom);
  const locationSelected = useAtomValue(locationSelectedAtom);
  const [equipments, setEquipments] = useState([{
    equipmentId: uuidv4(),
    equipment: "",
    margin: "",
    reason: "",
    saleChance: "",
    saleStatus: "",
    saleType: "",
    value: null,
  },])
  const [isCreating, setIsCreating] = useState(false);
  const [isCustomerOrRep, setIsCustomerOrRep] = useState('');
  const [representativeForm, setRepresentativeForm] = useState({
    name: '',
    phone: '',
  })
  const [representatives, setRepresentatives] = useAtom(representativesAtom);

  const formSchema = customerFormSchema();

  const customerForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      phone: "",
      recurrence: null,
      // supervisor: "",
      visitDate: null,
    },
  })

  const onSubmit = async () => {
    setIsCreating(true);
    const userId = Cookies.get('appwrite-user-id');
    const { visitDate, recurrence } = customerForm.getValues();
    try {
      const payload = {
        ...customerForm.getValues(),
        lat: locationSelected.lat,
        lng: locationSelected.lng,
        city: locationSelected.city,
        uf: locationSelected.uf,
        country: locationSelected.country,
        equipments: JSON.stringify(equipments),
        supervisorId: userId,
        nextVisitDate: nextVisitDate(visitDate, recurrence)
      }

      await createCustomer(payload);
      setCustomers((prev) => [...prev, {
        ...payload,
        equipments,
      }]);

      customerForm.reset();
      setActiveTab('Cliente');
      setOpen(false);

      toast.success('Cliente adicionado com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setEquipments([{
        equipmentId: uuidv4(),
        equipment: "",
        margin: "",
        reason: "",
        saleChance: "",
        saleStatus: "",
        saleType: "",
        value: null,
      }]);

    } catch (error) {
      console.error(error);
    }
    setIsCreating(false);

  }

  const handleInputChange = (value, index, name) => {
    const newEquipments = [...equipments];
    newEquipments[index][name] = value;
    setEquipments(newEquipments);
  };

  const handleDeleteEquipment = (id) => {
    const newEquipments = equipments.filter((eqp) => eqp.equipmentId !== id);

    setEquipments(newEquipments);
  }

  const handleRepInputChange = (value, name) => {
    setRepresentativeForm({
      ...representativeForm,
      [name]: value,
    })
  }

  const createNewRepresentative = async () => {
    setIsCreating(true);
    try {
      const payload = {
        lat: locationSelected.lat,
        lng: locationSelected.lng,
        city: locationSelected.city,
        uf: locationSelected.uf,
        country: locationSelected.country,
        ...representativeForm,
      }
      await createRepresentative(payload);
      setRepresentatives((prev) => [
        ...prev,
        {
          ...payload,
        }
      ])

      toast.success('Representante adicionado com sucesso!', {
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
    setOpen();
    setRepresentativeForm({
      name: '',
      phone: '',
    });
    setIsCustomerOrRep('');
  }

  return (
    <Dialog open={open} onOpenChange={() => {
      setOpen();
      setIsCustomerOrRep('');
      setRepresentativeForm({
        name: '',
        phone: '',
      })
    }} >
      {
        isCustomerOrRep === ''
          ? <DialogContent className="bg-white  overflow-y-auto">
            <DialogHeader>
              <DialogTitle>O que deseja adicionar?</DialogTitle>
            </DialogHeader>
            <div className='flex gap-4 mt-3 w-full justify-center'>
              <Button onClick={() => setIsCustomerOrRep('representative')} className='border-2 border-gray-500 w-[150px] hover:bg-gray-500 hover:text-white'>Representante</Button>
              <Button onClick={() => setIsCustomerOrRep('customer')} className='border-2 border-gray-500 w-[150px] hover:bg-gray-500 hover:text-white'>Cliente</Button>
            </div>

          </DialogContent>
          : isCustomerOrRep === 'customer'
            ? <DialogContent className="bg-white max-w-[35%] max-h-[900px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar novo cliente</DialogTitle>
                <DialogDescription>
                  <Tabs value={activeTab} className="mt-2">
                    <TabsList className="bg-gray-300" >
                      <TabsTrigger onClick={() => setActiveTab('Equipamentos')} value="Cliente" className="hover:cursor-auto">Cliente</TabsTrigger>
                      <TabsTrigger value="Equipamentos" className="hover:cursor-auto">Equipamentos</TabsTrigger>
                      <TabsTrigger value="Historico" className="hover:cursor-auto">Histórico</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Cliente">
                      <CustomerForm modalType="create" form={customerForm} representatives={representatives} />
                    </TabsContent>
                    <TabsContent value="Equipamentos">
                      {
                        equipments.map((eqp, index) => (
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
                            <EquipmentForm
                              equipments={equipments}
                              index={index}
                              handleChange={handleInputChange}
                            />
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
                  <DialogFooter className="flex items-end rounded-md">
                    <Button
                      className="border-green-500 border-2 hover:bg-green-500 hover:text-white transition-all text-green-600"
                      type='button'
                      onClick={customerForm.handleSubmit(() => setActiveTab('Equipamentos'))}
                    >
                      Adicionar equipamentos {'->'}
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
                          : 'Adicionar novo cliente'
                      }

                    </Button>
                  </DialogFooter>
              }
            </DialogContent>
            : <DialogContent className="bg-white  overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar representante</DialogTitle>
              </DialogHeader>
              <div>
                <div className='mb-4'>
                  <Label className='label-form' htmlFor='rep-name'>Nome do representante</Label>
                  <Input onChange={({ target }) => handleRepInputChange(target.value, 'name')} id='rep-name' placeholder="Representante" />
                </div>
                <div className='w-[250px]'>
                  <Label htmlFor='rep-phone'>Telefone para contato</Label>
                  <PhoneInput onChange={(e) => handleRepInputChange(e, 'phone')} placeholder='(12) 23456-7890' id='rep-phone' defaultCountry='BR' />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="border-2 text-green-700 border-green-600 hover:bg-green-600 hover:text-white"
                  disabled={representativeForm.name === '' || representativeForm.phone === ''}
                  onClick={createNewRepresentative}
                >
                  {
                    isCreating
                      ? <MoonLoader color='green' size={16} />
                      : 'Adicionar representante'
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
      }
    </Dialog>
  )
}

export default CustomModal
