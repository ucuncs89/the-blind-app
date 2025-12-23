import Link from 'next/link';
import { ArrowRight, Users, GitBranch, Trophy } from 'lucide-react';

const Home = (): React.ReactElement => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <main className="relative z-10 flex flex-col items-center gap-12 px-8 text-center">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              The Blind App
            </span>
          </h1>
          <p className="max-w-md text-lg text-slate-400">
            Platform manajemen turnamen bracket dengan visualisasi interaktif
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-violet-500/50 hover:bg-white/10">
            <div className="rounded-lg bg-violet-500/20 p-3">
              <Users className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="font-semibold text-white">Kelola Peserta</h3>
            <p className="text-sm text-slate-400">CRUD peserta dengan mudah</p>
          </div>

          <div className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-blue-500/50 hover:bg-white/10">
            <div className="rounded-lg bg-blue-500/20 p-3">
              <GitBranch className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white">Bagan Bracket</h3>
            <p className="text-sm text-slate-400">Visualisasi turnamen interaktif</p>
          </div>

          <div className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-amber-500/50 hover:bg-white/10">
            <div className="rounded-lg bg-amber-500/20 p-3">
              <Trophy className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-semibold text-white">Track Pemenang</h3>
            <p className="text-sm text-slate-400">Pantau progress turnamen</p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30"
        >
          Masuk ke Dashboard
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-8 text-sm text-slate-500">
        © 2024 The Blind App. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
