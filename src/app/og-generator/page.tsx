"use client";

import React from 'react';
import { TrendingUp, Activity, Zap } from 'lucide-react';

export default function OGGenerator() {
    return (
        <div className="fixed inset-0 z-[9999] bg-background-app text-foreground-app flex items-center justify-center font-mono-app">
            {/* 1200x630 Container */}
            <div className="relative w-[1200px] h-[630px] bg-[#0a0a0b] flex flex-col overflow-hidden">

                {/* Background Grid Effect */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Glow Effects */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-app/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

                {/* Header */}
                <header className="relative z-10 p-12 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary-app rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                            <Activity size={40} className="text-white" />
                        </div>
                        <h1 className="text-7xl font-bold tracking-tighter text-white">
                            GAME<span className="text-primary-app">PULSE</span>
                        </h1>
                    </div>
                    <div className="flex gap-6">
                        <div className="px-6 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-xl flex items-center gap-2">
                            LIVE MARKET
                        </div>
                    </div>
                </header>

                {/* Main Content: Charts & Stats */}
                <main className="relative z-10 flex-1 p-12 flex gap-12 items-center">
                    {/* Big Chart Representation */}
                    <div className="flex-1 h-full bg-secondary-app/30 rounded-2xl border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl text-muted-foreground-app mb-1">MARKET CAP</h2>
                                <p className="text-5xl font-bold text-white">$2.4T</p>
                            </div>
                            <span className="text-emerald-400 font-bold text-2xl flex items-center gap-2">
                                <TrendingUp size={32} /> +12.4%
                            </span>
                        </div>

                        {/* Fake Chart Lines */}
                        <div className="flex items-end justify-between h-48 gap-2 opacity-80">
                            {[40, 65, 55, 80, 70, 90, 85, 95, 100, 90, 110, 120].map((h, i) => (
                                <div key={i} className="w-full bg-gradient-to-t from-primary-app/50 to-primary-app rounded-t-md relative overflow-hidden" style={{ height: `${h}%` }}>
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/50" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Top Movers */}
                    <div className="w-[400px] flex flex-col gap-6">
                        <div className="bg-secondary-app/30 rounded-2xl border border-white/10 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded bg-white text-black font-bold flex items-center justify-center text-xl">NVDA</div>
                                <div>
                                    <p className="font-bold text-2xl text-white">NVIDIA</p>
                                    <p className="text-muted-foreground-app">Hardware</p>
                                </div>
                            </div>
                            <span className="text-emerald-400 font-bold text-3xl">+4.2%</span>
                        </div>

                        <div className="bg-secondary-app/30 rounded-2xl border border-white/10 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded bg-[#0072CE] text-white font-bold flex items-center justify-center text-xl">SONY</div>
                                <div>
                                    <p className="font-bold text-2xl text-white">SONY GRP</p>
                                    <p className="text-muted-foreground-app">Consoles</p>
                                </div>
                            </div>
                            <span className="text-emerald-400 font-bold text-3xl">+1.8%</span>
                        </div>

                        <div className="bg-secondary-app/30 rounded-2xl border border-white/10 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded bg-[#E60012] text-white font-bold flex items-center justify-center text-xl">NTDO</div>
                                <div>
                                    <p className="font-bold text-2xl text-white">NINTENDO</p>
                                    <p className="text-muted-foreground-app">GAMES</p>
                                </div>
                            </div>
                            <span className="text-rose-400 font-bold text-3xl">-0.5%</span>
                        </div>
                    </div>
                </main>

                {/* Footer Strip */}
                <footer className="relative z-10 bg-primary-app text-white p-4 overflow-hidden flex items-center font-bold text-xl tracking-widest whitespace-nowrap">
                    <div className="animate-marquee flex gap-12 w-full justify-center">
                        <span className="flex items-center gap-2"><Zap size={24} className="text-yellow-300" /> REAL-TIME QUOTES</span>
                        <span className="flex items-center gap-2">• PORTFOLIO SIMULATOR</span>
                        <span className="flex items-center gap-2">• GLOBAL RANKINGS</span>
                        <span className="flex items-center gap-2">• MARKET INTELLIGENCE</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
