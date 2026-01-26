"use client";

import React, { useState } from 'react';
import { Activity, Shield, Settings, Bell, Globe, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/providers/LanguageProvider';

export const Header: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="border-b border-border-app px-6 py-4 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 p-1.5 rounded-sm group-hover:bg-blue-500 transition-colors">
                        <Activity size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white font-mono">
                        GAME<span className="text-blue-500">PULSE</span>
                        <span className="text-[10px] ml-1 opacity-50 font-normal">v1.1.0_INTL</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    <Link href="/" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors font-mono">{t('dashboard')}</Link>
                    <Link href="/news" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors font-mono">{t('sector_news')}</Link>
                    <Link href="/alerts" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors font-mono">{t('alerts')}</Link>
                    <Link href="/portfolio" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors font-mono">{t('portfolio')}</Link>
                    <Link href="/compare" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors font-mono">{t('market_comparator')}</Link>
                    <Link href="/calendar" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors font-mono">{t('calendar')}</Link>
                    <Link href="/admin" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors font-mono flex items-center gap-2">
                        <Shield size={14} /> {t('admin')}
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                    className="hidden md:flex text-gray-400 hover:text-white transition-colors items-center gap-1 font-mono text-xs uppercase border border-border-app px-2 py-1 rounded"
                >
                    <Globe size={14} /> {language.toUpperCase()}
                </button>
                <button className="hidden md:block text-gray-400 hover:text-white transition-colors">
                    <Bell size={18} />
                </button>
                <div className="hidden md:block h-4 w-[1px] bg-border-app"></div>
                <div className="hidden md:block text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-sm border border-emerald-500/20">
                    {t('system_ok')}
                </div>

                {/* Mobile Menu Toggle */}
                <button onClick={toggleMenu} className="md:hidden text-gray-400 hover:text-white">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#0a0a0b] border-b border-border-app p-4 flex flex-col gap-2 md:hidden animate-in fade-in slide-in-from-top-4 shadow-xl">
                    <Link onClick={toggleMenu} href="/" className="px-4 py-3 bg-white/5 rounded text-sm text-white font-mono">{t('dashboard')}</Link>
                    <Link onClick={toggleMenu} href="/news" className="px-4 py-3 bg-white/5 rounded text-sm text-white font-mono">{t('sector_news')}</Link>
                    <Link onClick={toggleMenu} href="/portfolio" className="px-4 py-3 bg-white/5 rounded text-sm text-white font-mono">{t('portfolio')}</Link>
                    <Link onClick={toggleMenu} href="/calendar" className="px-4 py-3 bg-white/5 rounded text-sm text-white font-mono">{t('calendar')}</Link>
                    <Link onClick={toggleMenu} href="/alerts" className="px-4 py-3 bg-white/5 rounded text-sm text-white font-mono">{t('alerts')}</Link>
                    <Link onClick={toggleMenu} href="/compare" className="px-4 py-3 bg-white/5 rounded text-sm text-white font-mono">{t('market_comparator')}</Link>
                    <Link onClick={toggleMenu} href="/admin" className="px-4 py-3 bg-white/5 rounded text-sm text-white font-mono flex items-center gap-2"><Shield size={14} /> {t('admin')}</Link>

                    <div className="h-[1px] bg-border-app my-2"></div>

                    <button
                        onClick={() => { setLanguage(language === 'es' ? 'en' : 'es'); toggleMenu(); }}
                        className="px-4 py-3 bg-white/5 rounded text-sm text-gray-400 hover:text-white font-mono flex items-center gap-2"
                    >
                        <Globe size={14} /> {language === 'es' ? 'SWITCH TO ENGLISH' : 'CAMBIAR A ESPAÑOL'}
                    </button>
                </div>
            )}
        </header>
    );
};
