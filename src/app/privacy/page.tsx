"use client";

import React from 'react';
import { Shield, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/providers/LanguageProvider';

export default function PrivacyPage() {
    const { t } = useLanguage();

    return (
        <div className="max-w-3xl mx-auto p-8 font-mono text-sm leading-relaxed text-muted-foreground-app">
            <Link href="/" className="inline-flex items-center gap-2 text-primary-app hover:underline mb-8 no-underline">
                <ChevronLeft size={16} /> {t('return_dashboard')}
            </Link>

            <div className="flex items-center gap-3 mb-6">
                <Shield className="text-primary-app" size={32} />
                <h1 className="text-2xl font-bold text-foreground-app">Legal & Privacy</h1>
            </div>

            <div className="space-y-6 terminal-card p-8">
                <section>
                    <h2 className="text-lg font-bold text-foreground-app mb-2">1. Introduction</h2>
                    <p>
                        Welcome to GamePulse ("we," "our," or "us"). By accessing or using our platform, creating a profile, or participating in the GamePulse Arena, you agree to these terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground-app mb-2">2. No Financial Advice</h2>
                    <p className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r text-yellow-200/80">
                        <strong>IMPORTANT:</strong> GamePulse is a financial simulation and information tool designed for entertainment and educational purposes within the gaming industry context. Nothing on this platform constitutes financial, investment, or legal advice. All trading simulations utilize virtual currency with no real-world monetary value.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground-app mb-2">3. Data Collection</h2>
                    <p>
                        We collect minimal data necessary to provide our services:
                    </p>
                    <ul className="list-disc ml-4 mt-2 space-y-1">
                        <li><strong>Authentication:</strong> Email addresses and provider tokens (Google) via Supabase Auth.</li>
                        <li><strong>Profile:</strong> Usernames, avatars, and bios you voluntarily provide.</li>
                        <li><strong>Usage:</strong> Virtual portfolio positions and watchlist preferences.</li>
                    </ul>
                    <p className="mt-2">
                        We do not sell your personal data to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground-app mb-2">4. User Conduct</h2>
                    <p>
                        You agree not to use the platform for any illegal purpose or to harass other users in the leaderboard or challenges. We reserve the right to ban users who violate these community standards.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground-app mb-2">5. Updates</h2>
                    <p>
                        We may update these terms occasionally. Continued use of GamePulse implies acceptance of the new terms.
                    </p>
                </section>

                <div className="pt-8 border-t border-border-app text-xs text-center opacity-50">
                    Last Updated: January 2026
                </div>
            </div>
        </div>
    );
}
