"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useAtom, useAtomValue } from "jotai"
import { customersAtom, filterAtom } from "@/store"
import { useEffect, useState } from "react"
import { abrevStates } from "@/constants"
import { Separator } from "./ui/separator"

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

const SalesChart = ({ className, chartTitle, equipments }) => {
  const [chartData, setChartData] = useState([]);
  const filter = useAtomValue(filterAtom);

  useEffect(() => {
    if (equipments?.length > 0) {
      const filteredByArea = equipments.filter(({ country }) =>
        filter.area === "Nacional"
          ? country === "Brazil" || country === undefined
          : country !== "Brazil" && country !== undefined
      );

      const filteredBySupervisor = filter.supervisor !== "Todos"
        ? filteredByArea.filter(({ supervisor }) => supervisor === filter.supervisor)
        : filteredByArea;

      const filteredEquipments = filter.range !== ""
        ? filteredBySupervisor.filter(({ saleChance }) => saleChance === filter.range)
        : filteredBySupervisor;

      const data = Object.values(
        filteredEquipments.reduce((acc, { uf, country, equipment, value }) => {
          const location = country !== "Brazil" && country !== undefined ? country : uf;

          if (!acc[location]) {
            acc[location] = { uf: abrevStates[location] || location, total: 0 };
          }
          acc[location].total += value;
          acc[location][equipment] = (acc[location][equipment] || 0) + value;
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
        <div className="w-[900px] flex flex-wrap gap-10 mt-2 ">
          {chartData.map((item) => (
            <div key={item.uf} className="flex flex-col text-xs">
              <span className="font-bold">{item.uf}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">
                  R$ {item.total.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
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
                dataKey="uf"
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

export default SalesChart;

