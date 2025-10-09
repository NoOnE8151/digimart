"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Example initial empty array, to be fetched from backend
const baseChartData = []; 

const chartConfig = {
  earnings: { label: "Earnings", color: "var(--chart-green)" },
};

export function ChartAreaInteractive({ backendData }) {
  const [timeRange, setTimeRange] = useState("90d");
  const [data, setData] = useState([]);

  // Map backend data for quick lookup
  const dataMap = useMemo(() => {
    const map = {};
    backendData?.forEach((item) => {
      map[item.date] = item.earnings;
    });
    return map;
  }, [backendData]);

  const referenceDate = useMemo(() => new Date(), []);

  // Generate chart data with all dates in range
  const filteredData = useMemo(() => {
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() - daysToSubtract + 1);

    const chartData = [];
    let current = new Date(startDate);

    while (current <= referenceDate) {
      const dateStr = current.toISOString().split("T")[0];
      chartData.push({
        date: dateStr,
        earnings: dataMap[dateStr] ?? 0, // use backend data if exists, else 0
      });
      current.setDate(current.getDate() + 1);
    }

    return chartData;
  }, [timeRange, referenceDate, dataMap]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>Showing your earnings dynamically</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
            <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
            <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-green)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-green)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                  indicator="dot"
                  formatter={(value) => `$${value}`}
                />
              }
            />
            <Area
              dataKey="earnings"
              type="natural"
              fill="url(#fillEarnings)"
              stroke="var(--chart-green)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
