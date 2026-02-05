"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import type {ChartConfig} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

const chartData = [
  { day: "Senin", hours: 10 },
  { day: "Selasa", hours: 9.2 },
  { day: "Rabu", hours: 9.8 },
  { day: "Kamis", hours: 9.5 },
  { day: "Jumat", hours: 8.5 },
  { day: "Sabtu", hours: 7 },
  { day: "Minggu", hours: 0 },
]

const chartConfig = {
  hours: {
    label: "Jam Kerja",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function ChartLineDots() {
  return (
    <Card className="h-full shadow-lg border-3 border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Rata-rata Jam Kerja Seminggu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 12,
              top: 12,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              stroke="#94a3b8"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 12]}
              stroke="#94a3b8"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="hours"
              type="monotone"
              stroke="var(--color-hours)"
              strokeWidth={4}
              dot={{
                fill: "var(--color-hours)",
                r: 7,
                strokeWidth: 3,
                stroke: "#ffffff"
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}