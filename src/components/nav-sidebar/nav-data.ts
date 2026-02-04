import { Banknote, CalendarCheck, HandCoins, House, Store, Users } from "lucide-react";

export const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: House,
  },
  {
    title: 'Kehadiran',
    url: '/kehadiran',
    icon: CalendarCheck,
  },
  {
    title: 'Pemasukan dan Pengeluaran',
    url: '/keuangan',
    icon: Banknote,
  },
  {
    title: 'Setoran',
    url: '/setoran',
    icon: HandCoins,
  },
  {
    title: 'Toko',
    url: '/toko',
    icon: Store,
  },
  {
    title: 'User',
    url: '/users',
    icon: Users,
  },
]