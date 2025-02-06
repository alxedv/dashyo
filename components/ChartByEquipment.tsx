"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

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
import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { filterAtom } from "@/store"
const chartData = [
  { browser: "recorrente", visitors: 275, fill: "var(--color-recorrente)" },
  { browser: "cliente novo", visitors: 200, fill: "hsl(var(--chart-2))" },
]

const chartConfig = {
  Recorrente: {
    label: "Recorrente",
    color: "hsl(var(--chart-1))",
  },
  "Cliente novo": {
    label: "Cliente novo",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartByEquipment({
  ChartTitle,
  equipments,
  className,
}) {
  const [chartData, setChartData] = useState([]);
  const filter = useAtomValue(filterAtom);

  useEffect(() => {
    if (equipments) {
      const filteredByArea = equipments.filter(({ country }) =>
        filter.area === "Nacional" ? country === "Brazil" || country === undefined : country !== "Brazil" && country !== undefined
      );

      const filteredEqps = filter.range !== ""
        ? filteredByArea.filter(({ saleChance }) => saleChance === filter.range)
        : filteredByArea;

      const filteredBySupervisor = filter.supervisor !== "Todos"
        ? filteredEqps.filter(({ supervisor }) => supervisor === filter.supervisor)
        : filteredEqps;

      const reccurents = filteredBySupervisor.filter((eqp) => eqp.saleType === "Recorrente");
      const newCustomers = filteredBySupervisor.filter((eqp) => eqp.saleType === "Cliente novo");

      const totalEquipments = filteredBySupervisor.filter((eqp) => eqp.saleType !== "").length;

      const data = [];

      const recPercentage = (reccurents.length / totalEquipments) * 100;
      if (recPercentage > 0) {
        data.push({
          browser: "Recorrente",
          visitors: Number(recPercentage.toFixed(2)),
          fill: chartConfig.Recorrente.color,
        });
      }

      const newCustomerPercentage = (newCustomers.length / totalEquipments) * 100;
      if (newCustomerPercentage > 0) {
        data.push({
          browser: "Cliente novo",
          visitors: Number(newCustomerPercentage.toFixed(2)),
          fill: chartConfig["Cliente novo"].color,
        });
      }

      setChartData(data);
    }
  }, [equipments, filter]);

  return (
    <Card className={`"flex flex-col ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{ChartTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent isPercent={true} indicator="line" nameKey="browser" className="bg-white w-[150px]" />}
            />
            <Pie data={chartData} dataKey="visitors" label={({ value }) => `${value}%`}>
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pb-0">
        <div className="flex  gap-4 w-fit justify-center flex-wrap">
          <div className="flex gap-2 items-center">
            <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-2))]"></div>
            <span>Cliente Novo</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-1))]"></div>
            <span>Recorrente</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
