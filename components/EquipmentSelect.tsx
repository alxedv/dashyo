import React, { useEffect, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { createEquipments, getEquipments } from '@/lib/actions/equipments.action';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { toast } from 'react-toastify';

const EquipmentSelect = ({ form, name, placeholder, label, className = "", handleChange, index, inputValue }) => {
  const [items, setItems] = useState([]);
  const [newEquipment, setNewEquipment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await getEquipments();
        console.log({ response });

        setItems(response.map(doc => doc.name));
      } catch (error) {
        console.error("Erro ao buscar equipamentos:", error);
      }
    };
    fetchEquipments();
  }, []);

  const addEquipment = async () => {
    if (!newEquipment.trim()) return;
    try {
      await createEquipments({ name: newEquipment });
      setItems([...items, newEquipment]);
      setNewEquipment("");
      setIsModalOpen(false);
      toast.success("Equipamento adicionado com sucesso!");
    } catch (error) {
      toast.success("Erro ao adicionar equipamento.");
      console.error("Erro ao adicionar equipamento:", error);
    }
  };

  return (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem className={className}>
        <FormLabel className="form-label">{label}</FormLabel>
        <Select
          value={inputValue}
          onValueChange={(value) => {
            if (value === "add-new") {
              setIsModalOpen(true);
            } else {
              handleChange(value, index, name);
            }
          }}
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-white">
            {items.map((item, index) => (
              <SelectItem key={`item-${index}`} className="cursor-pointer hover:shadow-inner" value={item}>
                {item}
              </SelectItem>
            ))}
            <SelectItem value="add-new" className="text-blue-500 cursor-pointer">+ Adicionar Novo</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage className="form-message mt-2" />
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className='bg-white'>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Equipamento</DialogTitle>
            </DialogHeader>
            <Input value={newEquipment} onChange={(e) => setNewEquipment(e.target.value)} placeholder="Nome do equipamento" />
            <DialogFooter>
              <Button onClick={addEquipment} className="bg-blue-500 text-white">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </FormItem>
    )} />
  );
};

export default EquipmentSelect;
