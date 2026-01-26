"use client";

import React from 'react';
import { PortfolioSimulator } from '@/components/PortfolioSimulator';
import { Briefcase } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function PortfolioPage() {
    const { t } = useLanguage();

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
            <section className="border-l-2 border-blue-600 pl-4 py-2">
                <h1 className="text-2xl font-bold font-mono text-white tracking-tighter flex items-center gap-2">
                    <Briefcase className="text-blue-500" />
                    {t('portfolio_simulator')}
                </h1>
                <p className="text-sm text-gray-500 font-mono mt-1">
                    Simula el rendimiento de tu cartera con datos de mercado en tiempo real.
                </p>
            </section>

            <PortfolioSimulator />
        </div>
    );
}
