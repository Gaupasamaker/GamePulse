"use client";

import { Watchlist } from "@/components/Watchlist";
import { TopMovers } from "@/components/TopMovers";
import { NewsFeed } from "@/components/NewsFeed";
import { MarketBriefing } from "@/components/MarketBriefing";
import { Search, Filter, TrendingUp } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

import { AlertsPanel } from "@/components/AlertsPanel";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Hero / Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-2 border-blue-600 pl-4 py-2">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground-app tracking-tighter">
            {t('market_overview')}
          </h1>
          <p className="text-sm text-muted-foreground-app font-mono mt-1">
            Real-time monitoring of the global gaming ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground-app" size={14} />
            <input
              type="text"
              placeholder={t('search_ticker')}
              className="terminal-input pl-9 w-48 focus:w-64 transition-all"
            />
          </div>
          <button className="terminal-btn terminal-btn-secondary">
            <Filter size={14} /> {t('filter')}
          </button>
        </div>
      </section>

      {/* Market Briefing */}
      <MarketBriefing />

      {/* Top Movers Section */}
      <TopMovers />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Watchlist (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Watchlist />
        </div>

        {/* Right Column: News Feed & Alerts */}
        <div className="flex flex-col gap-6">
          <AlertsPanel />
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}
