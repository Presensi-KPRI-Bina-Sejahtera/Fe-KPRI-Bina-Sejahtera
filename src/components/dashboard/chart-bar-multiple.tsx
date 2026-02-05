"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type {ChartConfig} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

const chartData = [
  { day: "Senin", pemasukan: 2500000, pengeluaran: 500000 },
  { day: "Selasa", pemasukan: 3200000, pengeluaran: 800000 },
  { day: "Rabu", pemasukan: 1800000, pengeluaran: 300000 },
  { day: "Kamis", pemasukan: 2900000, pengeluaran: 600000 },
  { day: "Jumat", pemasukan: 4100000, pengeluaran: 1200000 },
  { day: "Sabtu", pemasukan: 3800000, pengeluaran: 900000 },
  { day: "Minggu", pemasukan: 5000000, pengeluaran: 1500000 },
]

const chartConfig = {
  pemasukan: {
    label: "Penghasilan",
    color: "#22c55e",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#ef4444",
  },
} satisfies ChartConfig

export function ChartBarMultiple() {
  return (
    <Card className="h-full shadow-lg border-3 border-slate-200 pb-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-2xl  font-bold text-slate-900">
          Pemasukan & Pengeluaran (Minggu Ini)
        </CardTitle>
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
          Lihat Detail
        </a>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[270px] w-full">
          <BarChart accessibilityLayer data={chartData} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              stroke="#94a3b8"
            />
             <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value / 1000000}jt`}
              stroke="#94a3b8"
            />
            <ChartTooltip
              cursor={{ fill: 'transparent' }}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar 
              dataKey="pemasukan" 
              fill="var(--color-pemasukan)" 
              radius={[4, 4, 0, 0]} 
              barSize={24}
            />
            <Bar 
              dataKey="pengeluaran" 
              fill="var(--color-pengeluaran)" 
              radius={[4, 4, 0, 0]} 
              barSize={24}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-red-500" />
          <span className="text-sm font-medium text-red-500">Pengeluaran</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500" />
          <span className="text-sm font-medium text-green-500">Penghasilan</span>
        </div>
      </CardFooter>
    </Card>
  )
}