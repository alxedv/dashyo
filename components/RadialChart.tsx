"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAtomValue } from "jotai";
import { filterAtom } from "@/store";

const chartConfig = {
  "Negócio fechado": {
    label: "Negócio fechado",
    color: "hsl(var(--chart-1))",
  },
  outros: {
    label: "Outros",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RadialChart({
  className,
  chartTitle,
  equipments,
}) {
  const filter = useAtomValue(filterAtom);
  const filteredEqp = equipments.filter((eqp) => eqp.saleChance !== "");

  const filteredByArea = filteredEqp.filter(({ country }) =>
    filter.area === "Nacional" ? country === "Brazil" || country === undefined : country !== "Brazil" && country !== undefined
  );

  const filteredBySupervisor = filter.supervisor !== "Todos"
    ? filteredByArea.filter(({ supervisor }) => supervisor === filter.supervisor)
    : filteredByArea;

  // Soma dos valores dos equipamentos "Negócio fechado"
  const closedDealsValue = filteredBySupervisor
    .filter((eqp) => eqp.saleChance === "Negócio fechado")
    .reduce((sum, eqp) => sum + eqp.value, 0);

  const othersValue = filteredBySupervisor
    .filter((eqp) => eqp.saleChance !== "Negócio fechado")
    .reduce((sum, eqp) => sum + eqp.value, 0);

  const totalValue = closedDealsValue + othersValue;

  const closedPercent = (closedDealsValue / totalValue) * 100;
  const othersPercent = (othersValue / totalValue) * 100;

  const conversionRate = totalValue ? closedPercent : 0;

  const chartData = [
    { "Negócio fechado": closedPercent, outros: othersPercent },
  ];

  return (
    <Card className={className}>
      <CardHeader className="items-start text-center pb-0">
        <CardTitle>{chartTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-square w-full">
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent isPercent={true} className="bg-white w-[240px]" hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {conversionRate.toFixed(2)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Taxa de conversão
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="outros"
              fill="var(--color-outros)"
              stackId="a"
              cornerRadius={10}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="Negócio fechado"
              stackId="a"
              cornerRadius={10}
              fill="hsl(var(--chart-1))"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
