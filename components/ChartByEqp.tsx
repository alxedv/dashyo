"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { filterAtom } from "@/store";

const chartConfig = {
  Gaiola: {
    label: "Gaiola",
    color: "hsl(var(--chart-1))",
  },
  Máquinas: {
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

export function ChartByEqp({
  ChartTitle,
  equipments,
  className,
}) {
  const [chartData, setChartData] = useState([] as any);
  const filter = useAtomValue(filterAtom);

  useEffect(() => {
    if (equipments) {
      const filteredByArea = equipments.filter(({ country }) =>
        filter.area === "Nacional" ? country === "Brazil" || country === undefined : country !== "Brazil" && country !== undefined
      );

      const filteredEqp = filter.range !== ""
        ? filteredByArea.filter(({ saleChance }) => saleChance === filter.range)
        : filteredByArea;

      const filteredBySupervisor = filter.supervisor !== "Todos"
        ? filteredEqp.filter(({ supervisor }) => supervisor === filter.supervisor)
        : filteredEqp;

      const totalValue = filteredBySupervisor.reduce((acc: number, curr: any) => acc + curr.value, 0);

      const equipmentValues = filteredBySupervisor.reduce((acc: any, curr: any) => {
        acc[curr.equipment] = (acc[curr.equipment] || 0) + curr.value;
        return acc;
      }, {});

      const data = Object.keys(equipmentValues).map((key) => ({
        browser: key,
        visitors: Number(((equipmentValues[key] / totalValue) * 100).toFixed(2)), // Formata para 2 casas decimais
        fill: key === "Upgrade Máquina" ? "hsl(var(--chart-3))" : key === "Esteiras Transportadoras" ? "hsl(var(--chart-4))" : `var(--color-${key})`
      }));

      setChartData(data);
    }
  }, [equipments, filter]);

  return (
    <Card className={`flex flex-col pb-0 ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{ChartTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex gap-5">
        <div>
          <ChartContainer
            config={chartConfig}
            className="mx-0 aspect-square max-h-[230px] w-[280px]"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent isPercent={true} indicator="line" nameKey="browser" className="bg-white w-[220px]" />}
              />
              <Pie data={chartData} dataKey="visitors" label={({ value }) => `${value}%`} className="w-[200px] max-w-[500px]" >
                {/* <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="black"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              /> */}

              </Pie>
            </PieChart>

          </ChartContainer>
        </div>
        <div>
          <div className="flex flex-col gap-2 w-fit justify-center flex-wrap text-sm h-full items-start">
            <div className="flex gap-2 items-center">
              <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-1))]"></div>
              <span>Gaiola</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-2))]"></div>
              <span>Máquinas</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-3))]"></div>
              <span>Upgrade Máquina</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-4))]"></div>
              <span>Esteiras Transportadoras</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-5))]"></div>
              <span>Ninho</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[#0f7f12]"></div>
              <span>Climatização</span>
            </div>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm pb-0">
        <div className="flex  gap-4 w-fit justify-center flex-wrap">
          <div className="flex gap-2 items-center">
            <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-1))]"></div>
            <span>Gaiola</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-2))]"></div>
            <span>Máquinas</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-3))]"></div>
            <span>Upgrade Máquina</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-4))]"></div>
            <span>Esteiras Transportadoras</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[hsl(var(--chart-5))]"></div>
            <span>Ninho</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="aspect-square w-[6px] h-[6px] rounded-sm bg-[#0f7f12]"></div>
            <span>Climatização</span>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
