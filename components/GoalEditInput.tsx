'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAtom } from "jotai";
import { goalAtom } from "@/store";
import { RiEdit2Fill } from "@remixicon/react";
import { updateSupervisor } from "@/lib/actions/supervisor.action";

export function GoalEditInput({ className, userId }) {
  const [goal, setGoal] = useAtom(goalAtom);
  const [localGoal, setLocalGoal] = useState(goal);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const handleUpdateClick = async () => {
    setGoal(localGoal);
    await updateSupervisor(userId, JSON.stringify(localGoal));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" size="sm" className={`border-[1px] rounded-md ${className}`}>
          <RiEdit2Fill size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Definição de Meta</h4>
            <p className="text-sm text-muted-foreground">
              Defina a meta financeira e o ano alvo.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="meta">Meta (R$)</Label>
              <Input
                id="meta"
                type="text"
                placeholder={goal.goal}
                className="col-span-2 h-8"
                value={new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(Number(localGoal.goal))}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setLocalGoal({ ...localGoal, goal: value });
                }}
              />

            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="meta">Atual (R$)</Label>
              <Input
                id="current"
                type="text"
                placeholder={goal.current}
                defaultValue={goal.current}
                className="col-span-2 h-8"
                value={new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(Number(localGoal.current) || 0)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setLocalGoal({ ...localGoal, current: value });
                }}
              />

            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="ano">Ano</Label>
              <Select
                defaultValue={localGoal.year}
                onValueChange={(value) => setLocalGoal({ ...localGoal, year: value })}
              >
                <SelectTrigger className="col-span-2 h-8">
                  <SelectValue placeholder={localGoal.year} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {years.map((year) => (
                    <SelectItem className="cursor-pointer" key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleUpdateClick} className="mt-4 border-[1px] hover:bg-gray-800 hover:text-white">
            Atualizar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
