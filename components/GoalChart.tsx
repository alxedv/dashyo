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
import { useAtom, useAtomValue } from "jotai";
import { filterAtom, goalAtom } from "@/store";
import { useEffect, useState } from "react";
import { GoalEditInput } from "./GoalEditInput";
import goalIcon from "@/public/icons/goal.png";
import Image from "next/image";
import { RiFocus2Line, RiMapPin2Fill, RiMapPin2Line } from "@remixicon/react";

const chartConfig = {
  "Negócios fechados": {
    label: "Negócios fechados",
    color: "hsl(var(--chart-3))",
  },
  meta: {
    label: "Meta",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function GoalChart({
  className,
  chartTitle,
  equipments,
  userId,
  supervisor,
}) {
  const filter = useAtomValue(filterAtom);
  const filteredEqp = equipments.filter((eqp) => eqp.saleChance !== "");
  const [goal, setGoal] = useAtom(goalAtom);
  const [chartData, setChartData] = useState([
    { "Negócios fechados": 0, meta: 0 },
  ])
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    const parsedGoal = JSON.parse(supervisor.goal);
    console.log({
      parsedGoal
    });

    setGoal(parsedGoal);
  }, [supervisor])


  useEffect(() => {
    const goalValue = typeof goal?.goal === 'number' ? goal?.goal : Number(goal?.goal) || 0;

    const parsedCurrentValue = Number(goal?.current);

    const convRate = goalValue ? (parsedCurrentValue / goalValue) * 100 : 0;
    setConversionRate(convRate);

    const closedPercent = goalValue ? (parsedCurrentValue / goalValue) * 100 : 0;
    const remainingPercent = 100 - closedPercent;
    setChartData([
      { "Negócios fechados": closedPercent, meta: remainingPercent > 0 ? remainingPercent : 0 },
    ])
  },
    [goal])


  return (
    <Card className={className}>
      <CardHeader className="items-start text-center pb-0">
        <CardTitle className="flex items-center justify-center w-full">{`${chartTitle} ${goal?.year}`}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <ChartContainer config={chartConfig} className="aspect-square w-full h-[200px]">
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
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xm"
                        >
                          Progresso em relação à meta
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="meta"
              fill="var(--color-meta)"
              stackId="a"
              cornerRadius={10}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="Negócios fechados"
              stackId="a"
              cornerRadius={10}
              fill="hsl(var(--chart-3))"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
        <CardFooter className="flex flex-col gap-2 items-center justify-center text-sm">
          <div className=" w-50 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <RiFocus2Line />
              <span>Meta: <b>{Number(goal?.goal).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}</b></span>
            </div>
            <div className="flex items-center gap-2">
              <RiMapPin2Line scale={1} className="m-0" />
              <span>Atual: <b>{Number(goal?.current).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}</b></span>
            </div>
          </div>
          <GoalEditInput userId={userId} className="" />
        </CardFooter>
      </CardContent>
    </Card>
  );
}
