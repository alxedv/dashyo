"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { filterAtom } from "@/store";

const chartConfig = {
  Preço: {
    label: "Preço",
    color: "hsl(var(--chart-1))",
  },
  Prazo: {
    label: "Prazo",
    color: "hsl(var(--chart-2))",
  },
  "Condição de pagamento": {
    label: "Condição de pagamento",
    color: "hsl(var(--chart-3))",
  },
  Qualidade: {
    label: "Qualidade",
    color: "hsl(var(--chart-4))",
  },
  Portfólio: {
    label: "Portfólio",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function BarChartMixed({ className, equipments }) {
  const [chartData, setChartData] = useState([] as any);
  const filter = useAtomValue(filterAtom);

  useEffect(() => {
    if (equipments) {

      const filteredEqp = equipments.filter(
        (eqp) => eqp.saleChance === "Negócio perdido"
      );

      const filteredByArea = filteredEqp.filter(({ country }) =>
        filter.area === "Nacional" ? country === "Brazil" || country === undefined : country !== "Brazil" && country !== undefined
      );

      const filteredBySupervisor =
        filter.supervisor !== "Todos"
          ? filteredByArea.filter(({ supervisor }) => supervisor === filter.supervisor)
          : filteredByArea;

      const totalValue = filteredBySupervisor.reduce(
        (acc: number, curr: any) => acc + curr.value,
        0
      );

      const reasonValues = filteredBySupervisor.reduce(
        (acc: any, curr: any) => {
          acc[curr.reason] = (acc[curr.reason] || 0) + curr.value;
          return acc;
        },
        {}
      );

      const data = Object.keys(reasonValues)
        .map((reason) => ({
          browser: reason,
          visitors: Number(((reasonValues[reason] / totalValue) * 100).toFixed(2)), // Converte para número
          fill: chartConfig[reason]?.color || "#000",
        }))
        .sort((a, b) => b.visitors - a.visitors); // Ordena corretamente como número

      setChartData(data);
    }
  }, [equipments, filter]);

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle>Negócios Perdidos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="w-[200px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 60,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={-2}
              axisLine={false}
              order={2}
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  isPercent={true}
                  hideLabel
                  indicator="line"
                  nameKey="browser"
                  className="bg-white w-[150px]"
                />
              }
            />
            <Bar dataKey="visitors" layout="vertical" radius={5}>
              <LabelList
                dataKey="visitors"
                position="right"
                offset={10}
                className="fill-[--color-label]"
                fontSize={12}
                formatter={(value) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
