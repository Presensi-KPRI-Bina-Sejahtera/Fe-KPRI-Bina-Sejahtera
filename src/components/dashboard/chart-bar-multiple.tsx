"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { ChartConfig } from "@/components/ui/chart"
import type { DashboardStats } from "@/services/dashboardService"
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

// 🟢 Default days fallback since API labels might be empty
const DEFAULT_DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

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

// 🟢 Update component to accept props
export function ChartBarMultiple({ chartData }: { chartData?: DashboardStats['grafik'] }) {
  
  // 🟢 Transform API data to Recharts format
  // If no data is passed yet, default to empty to prevent crashes
  const processedData = DEFAULT_DAYS.map((day, index) => ({
    day: day,
    // Safely access the index, default to 0 if missing
    pemasukan: chartData?.cashflows.pemasukan[index] ?? 0,
    pengeluaran: chartData?.cashflows.pengeluaran[index] ?? 0,
  }))

  return (
    <Card className="h-full shadow-lg border-3 border-slate-200 pb-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Pemasukan & Pengeluaran (Minggu Ini)
        </CardTitle>
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
          Lihat Detail
        </a>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[270px] w-full">
          {/* 🟢 Use processedData here instead of static mock data */}
          <BarChart accessibilityLayer data={processedData} barGap={4}>
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
              // Formats 1,000,000 to "1jt"
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
      <CardFooter className="flex justify-center gap-6 pb-4">
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