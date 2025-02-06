import { BarChartLabel } from '@/components/BarCharLabel'
import { BarChartMixed } from '@/components/BarChartMixed'
import ChartByCustomer from '@/components/ChartByCustomer'
import { ChartByEqp } from '@/components/ChartByEqp'
import { ChartByEquipment } from '@/components/ChartByEquipment'
import { GoalChart } from '@/components/GoalChart'
import { RadialChart } from '@/components/RadialChart'
import SalesChanceCard from '@/components/SalesChanceCard'
import SalesChart from '@/components/SalesChart'
import SelectSupervisor from '@/components/SelecSupervisor'
import SelectAreaInput from '@/components/SelectAreaInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getCustomers } from '@/lib/actions/customer.action'
import { getSupervisors } from '@/lib/actions/supervisor.action'
import { cookies } from 'next/headers'
import React from 'react'

const Dashboard = async () => {
  const _cookies = cookies();
  const userId = _cookies.get("appwrite-user-id")?.value;
  const customers = await getCustomers(userId);
  const supervisors = await getSupervisors();
  const equipments = customers.flatMap((customer) =>
    customer.equipments.map((equipment) => ({
      ...equipment,
      uf: customer.uf,
      city: customer.city,
      customer: customer.name,
      country: customer.country,
      supervisor: customer.supervisorId,
    }))
  );

  return (
    <section className='pt-4 flex flex-col gap-2 h-fit w-full mt-[75px] px-4 overflow-hidden'>
      <header className="flex flex-col gap-2">
        <div className='flex gap-2  justify-start flex-nowrap overflow-auto w-full '>
          <SalesChanceCard equipments={equipments} cardTitle="Negócio perdido" badgeType="lost" />
          <SalesChanceCard equipments={equipments} cardTitle="0-30%" badgeType="0-30" />
          <SalesChanceCard equipments={equipments} cardTitle="30-70%" badgeType="30-70" />
          <SalesChanceCard equipments={equipments} cardTitle="70-100%" badgeType="70-100" />
          <SalesChanceCard equipments={equipments} cardTitle="Negócio fechado" badgeType="deal" />
        </div>
        <div className="flex gap-2 w-[650px]">
          <SelectAreaInput />
          <SelectSupervisor supervisors={supervisors} />
        </div>
      </header>
      <section className="h-fit flex gap-2 w-full flex-wrap">
        <SalesChart equipments={equipments} chartTitle="Negócios por Região e Equipamento" className="w-[762px] mb-0" />
        <ChartByCustomer equipments={equipments} chartTitle="Negócios por Cliente e Equipamento" className="w-[767px] mb-0" />
        <GoalChart equipments={equipments} supervisor={supervisors.find((item) => item.supervisorId === userId)} userId={userId} chartTitle="Meta de Vendas" className="w-[300px]" />

      </section>
      <div className='flex gap-2 mt-0 w-full max-w-none flex-wrap'>
        <ChartByEqp equipments={equipments} ChartTitle="Distruibuição dos Negócios" className="w-[520px] h-[300px]" />
        <RadialChart equipments={equipments} chartTitle="Taxa de Conversão de Vendas" className="w-[300px] h-[300px]" />
        <BarChartLabel equipments={equipments} className="h-[300px]" />
        <BarChartMixed equipments={equipments} className="w-fit h-[300px]" />
        <ChartByEquipment equipments={equipments} ChartTitle="Tipo de Venda" className="w-[300px] h-[300px]" />
      </div>
    </section>
  )
}

export default Dashboard