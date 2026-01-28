"use client";

import React, { useState } from 'react';
import { Activity, Shield, Settings, Bell, Globe, Menu, X, Trophy, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';
import { AuthButton } from './AuthButton';

export const Header: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="border-b border-border-app px-6 py-4 flex items-center justify-between bg-background-app/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary-app p-1.5 rounded-sm group-hover:brightness-110 transition-colors">
                        <Activity size={20} className="text-primary-foreground-app" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground-app font-mono">
                        GAME<span className="text-primary-app">PULSE</span>
                        <span className="text-[10px] ml-1 text-muted-foreground-app font-normal">v1.2.0_LGT</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    <Link href="/" className="px-3 py-1.5 text-sm text-muted-foreground-app hover:text-foreground-app transition-colors font-mono">{t('dashboard')}</Link>
                    <Link href="/news" className="px-3 py-1.5 text-sm text-muted-foreground-app hover:text-foreground-app transition-colors font-mono">{t('sector_news')}</Link>
                    <Link href="/alerts" className="px-3 py-1.5 text-sm text-muted-foreground-app hover:text-foreground-app transition-colors font-mono">{t('alerts')}</Link>
                    <Link href="/portfolio" className="px-3 py-1.5 text-sm text-muted-foreground-app hover:text-foreground-app transition-colors font-mono">{t('portfolio')}</Link>
                    <Link href="/leaderboard" className="px-3 py-1.5 text-sm text-muted-foreground-app hover:text-foreground-app transition-colors font-mono flex items-center gap-1">
                        <Trophy size={14} className="text-yellow-500" /> Leaderboard
                    </Link>
                    <Link href="/compare" className="px-3 py-1.5 text-sm text-muted-foreground-app hover:text-foreground-app transition-colors font-mono">{t('market_comparator')}</Link>
                    <Link href="/calendar" className="px-3 py-1.5 text-sm text-muted-foreground-app hover:text-foreground-app transition-colors font-mono">{t('calendar')}</Link>
                    {(user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) && (
                        <Link href="/admin" className="px-3 py-1.5 text-sm text-muted-foreground-app hover:text-foreground-app transition-colors font-mono flex items-center gap-1">
                            <Shield size={14} className="text-emerald-500" /> {t('admin')}
                        </Link>
                    )}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="hidden md:flex text-muted-foreground-app hover:text-foreground-app transition-colors"
                >
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="hidden md:block">
                    <AuthButton />
                </div>

                <div className="hidden md:block h-4 w-[1px] bg-border-app"></div>
                <div className="hidden md:block text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-sm border border-emerald-500/20">
                    {t('system_ok')}
                </div>

                {/* Mobile Menu Toggle */}
                <button onClick={toggleMenu} className="md:hidden text-muted-foreground-app hover:text-foreground-app">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-background-app border-b border-border-app p-4 flex flex-col gap-2 md:hidden animate-in fade-in slide-in-from-top-4 shadow-xl">
                    <Link onClick={toggleMenu} href="/" className="px-4 py-3 bg-secondary-app rounded text-sm text-foreground-app font-mono">{t('dashboard')}</Link>
                    <Link onClick={toggleMenu} href="/news" className="px-4 py-3 bg-secondary-app rounded text-sm text-foreground-app font-mono">{t('sector_news')}</Link>
                    <Link onClick={toggleMenu} href="/portfolio" className="px-4 py-3 bg-secondary-app rounded text-sm text-foreground-app font-mono">{t('portfolio')}</Link>
                    <Link onClick={toggleMenu} href="/calendar" className="px-4 py-3 bg-secondary-app rounded text-sm text-foreground-app font-mono">{t('calendar')}</Link>
                    <Link onClick={toggleMenu} href="/alerts" className="px-4 py-3 bg-secondary-app rounded text-sm text-foreground-app font-mono">{t('alerts')}</Link>
                    <Link onClick={toggleMenu} href="/compare" className="px-4 py-3 bg-secondary-app rounded text-sm text-foreground-app font-mono">{t('market_comparator')}</Link>
                    <Link onClick={toggleMenu} href="/admin" className="px-4 py-3 bg-secondary-app rounded text-sm text-foreground-app font-mono flex items-center gap-2"><Shield size={14} /> {t('admin')}</Link>

                    <div className="h-[1px] bg-border-app my-2"></div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); }}
                            className="flex-1 px-4 py-3 bg-secondary-app rounded text-sm text-muted-foreground-app hover:text-foreground-app font-mono flex items-center justify-center gap-2"
                        >
                            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />} {theme === 'dark' ? 'DARK' : 'LIGHT'}
                        </button>
                        <button
                            onClick={() => { setLanguage(language === 'es' ? 'en' : 'es'); toggleMenu(); }}
                            className="flex-1 px-4 py-3 bg-secondary-app rounded text-sm text-muted-foreground-app hover:text-foreground-app font-mono flex items-center justify-center gap-2"
                        >
                            <Globe size={14} /> {language === 'es' ? 'EN' : 'ES'}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};
