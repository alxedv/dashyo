"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useAtomValue } from "jotai"
import { filterAtom } from "@/store"
import { useEffect, useState } from "react"

const chartConfig = {
  Gaiola: {
    label: "Gaiola",
    color: "hsl(var(--chart-1))",
  },
  "Máquinas": {
    label: "Máquinas",
    color: "hsl(var(--chart-2))",
  },
  "Upgrade Máquina": {
    label: "Upgrade Máquina",
    color: "hsl(var(--chart-3))",
  },
  "Esteiras Transportadoras": {
    label: "Esteiras Transportadoras",
    color: "hsl(var(--chart-4))",
  },
  Ninho: {
    label: "Ninho",
    color: "hsl(var(--chart-5))",
  },
  Climatização: {
    label: "Climatização",
    color: "#0f7f12",
  },
} satisfies ChartConfig;

const ChartByCustomer = ({ className, chartTitle, equipments }) => {
  const [chartData, setChartData] = useState([]);
  const filter = useAtomValue(filterAtom);

  useEffect(() => {
    if (equipments?.length > 0) {
      const filteredEmpty = equipments.filter((eqp) => eqp.equipment !== "");
      const filteredByArea = filteredEmpty.filter(({ country }) =>
        filter.area === "Nacional" ? country === "Brazil" || country === undefined : country !== "Brazil" && country !== undefined
      );

      const filteredBySupervisor = filter.supervisor !== "Todos"
        ? filteredByArea.filter(({ supervisor }) => supervisor === filter.supervisor)
        : filteredByArea;

      const filteredEquipments = filter.range !== ""
        ? filteredBySupervisor.filter(({ saleChance }) => saleChance === filter.range)
        : filteredBySupervisor;

      const data = Object.values(
        filteredEquipments.reduce((acc, { customer, equipment, value }) => {
          if (!acc[customer]) {
            acc[customer] = { customer, total: 0 };
          }
          acc[customer].total += value; // Adiciona o total por cliente
          acc[customer][equipment] = (acc[customer][equipment] || 0) + value; // Mantém a lógica original para equipamentos
          return acc;
        }, {} as Record<string, { total: number;[key: string]: number }>)
      );

      setChartData(data);
    }
  }, [equipments, filter]);

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader className="">
        <CardTitle>{chartTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {chartData?.length < 1 && (filter.range !== "" || filter.area !== "")
          ? <div className="flex items-center w-full justify-center">
            <span className="text-gray-500 font-bold">Não há dados com os filtros selecionados.</span>
          </div>
          : <ChartContainer config={chartConfig} className="w-[900px] h-[200px]">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="customer"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                wrapperClassName="w-[200px]"
                content={<ChartTooltipContent indicator="line" className="bg-white w-[200px]" />}
              />
              <Bar dataKey="Gaiola" fill="#07bc0c" barSize={30} radius={4} />
              <Bar dataKey="Máquinas" fill="hsl(173 58% 39%)" barSize={30} radius={4} />
              <Bar dataKey="Upgrade Máquina" fill="hsl(197 37% 24%)" barSize={30} radius={4} />
              <Bar dataKey="Esteiras Transportadoras" fill="hsl(43 74% 66%)" barSize={30} radius={4} />
              <Bar dataKey="Ninho" fill="hsl(27 87% 67%)" barSize={30} radius={4} />
              <Bar dataKey="Climatização" fill="#0f7f12" barSize={30} radius={4} />
            </BarChart>
          </ChartContainer>
        }
      </CardContent>
    </Card>
  );
};

export default ChartByCustomer;
