'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GitBranch, Trophy, TrendingUp } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
};

const StatCard = ({ title, value, description, icon, gradient }: StatCardProps): React.ReactElement => (
  <Card className="relative overflow-hidden border-0 shadow-lg">
    <div className={`absolute inset-0 ${gradient} opacity-5`} />
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`rounded-lg ${gradient} p-2 text-white shadow-md`}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      <CardDescription className="mt-1">{description}</CardDescription>
    </CardContent>
  </Card>
);

const DashboardPage = (): React.ReactElement => {
  const stats: StatCardProps[] = [
    {
      title: 'Total Peserta',
      value: '45',
      description: 'Peserta terdaftar',
      icon: <Users className="h-5 w-5" />,
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
    },
    {
      title: 'Bagan 1',
      value: '15',
      description: 'Group aktif',
      icon: <GitBranch className="h-5 w-5" />,
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      title: 'Bagan 2',
      value: '8',
      description: 'Round tersedia',
      icon: <GitBranch className="h-5 w-5" />,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      title: 'Pemenang',
      value: '0',
      description: 'Belum ditentukan',
      icon: <Trophy className="h-5 w-5" />,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Selamat datang di The Blind App Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="group cursor-pointer border-dashed transition-all duration-200 hover:border-violet-500 hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-violet-100 p-3 transition-colors group-hover:bg-violet-500 dark:bg-violet-900">
                <Users className="h-6 w-6 text-violet-600 transition-colors group-hover:text-white dark:text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold">Kelola Peserta</h3>
                <p className="text-sm text-muted-foreground">Tambah, edit, atau hapus peserta</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer border-dashed transition-all duration-200 hover:border-blue-500 hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-blue-100 p-3 transition-colors group-hover:bg-blue-500 dark:bg-blue-900">
                <GitBranch className="h-6 w-6 text-blue-600 transition-colors group-hover:text-white dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Lihat Bagan 1</h3>
                <p className="text-sm text-muted-foreground">Visualisasi bracket round 1</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer border-dashed transition-all duration-200 hover:border-emerald-500 hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-emerald-100 p-3 transition-colors group-hover:bg-emerald-500 dark:bg-emerald-900">
                <TrendingUp className="h-6 w-6 text-emerald-600 transition-colors group-hover:text-white dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold">Lihat Bagan 2</h3>
                <p className="text-sm text-muted-foreground">Visualisasi bracket round 2</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

