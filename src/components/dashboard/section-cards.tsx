import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function SectionCards() {
  const stats = [
    {
      label: 'Pemasukan Bulan Ini',
      value: 'Rp 2.5jt',
      footerText: '+12% dari bulan kemarin',
      footerTextColor: 'text-emerald-600',
      footerIcon: ArrowUpRight,
      icon: TrendingUp,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'Pengeluaran Bulan Ini',
      value: 'Rp 500rb',
      footerText: '-5% dari bulan kemarin',
      footerTextColor: 'text-rose-600',
      footerIcon: ArrowDownRight,
      icon: TrendingDown,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
    },
    {
      label: 'Total Setoran Bulan Ini',
      value: 'Rp 1.2jt',
      isSpecial: true,
      subValue: '4 Anggota',
      icon: Wallet,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
    {
      label: 'Rata-Rata Jam kerja Bulan ini',
      value: '9.2 Jam',
      footerText: '+12% dari bulan kemarin',
      footerTextColor: 'text-emerald-600',
      footerIcon: ArrowUpRight,
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-lg border-3 border-slate-200">
          <CardContent className="px-6 flex items-center justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-md font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl font-bold text-slate-900">
                    {stat.value}
                  </h3>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-medium">
                {stat.isSpecial ? (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{stat.subValue}</span>
                  </div>
                ) : (
                  <span
                    className={`flex items-center gap-1 ${stat.footerTextColor} text-md`}
                  >
                    {stat.footerIcon && (
                      <stat.footerIcon className="w-3.5 h-3.5" />
                    )}
                    {stat.footerText}
                  </span>
                )}
              </div>
            </div>
            <div
              className={`p-4 rounded-full ${stat.iconBg} ${stat.iconColor}`}
            >
              <stat.icon className="size-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
