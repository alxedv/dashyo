"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { filterAtom } from "@/store";

const chartConfig = {
  margin: {
    label: "Margem",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function BarChartLabel({
  className,
  equipments,
}) {
  const [chartData, setChartData] = useState([] as any);
  const filter = useAtomValue(filterAtom);

  useEffect(() => {
    if (equipments) {
      const filteredEquipments = equipments.filter((eqp) => eqp.margin !== "");

      const filteredByArea = filteredEquipments.filter(({ country }) =>
        filter.area === "Nacional" ? country === "Brazil" || country === undefined : country !== "Brazil" && country !== undefined
      );

      const filteredBySupervisor = filter.supervisor !== "Todos"
        ? filteredByArea.filter(({ supervisor }) => supervisor === filter.supervisor)
        : filteredByArea;


      const equipmentMargins = filteredBySupervisor.reduce((acc: any, curr: any) => {
        const margin = parseFloat(curr.margin);
        if (!acc[curr.equipment]) {
          acc[curr.equipment] = { totalMargin: 0, count: 0 };
        }
        acc[curr.equipment].totalMargin += margin;
        acc[curr.equipment].count += 1;
        return acc;
      }, {});

      const data = Object.keys(equipmentMargins).map((key) => ({
        month: key,
        margin: parseFloat(
          (equipmentMargins[key].totalMargin / equipmentMargins[key].count).toFixed(2)
        ),
      }));

      setChartData(data);
    }
  }, [equipments, filter]);

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle>Margem Média por Equipamento</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-[24rem]">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent isPercent={true} accessKey="month" className="bg-white w-[150px]" />}
            />
            <Bar dataKey="margin" fill="var(--color-margin)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
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
