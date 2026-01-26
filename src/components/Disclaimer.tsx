"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export const Disclaimer: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-amber-500/10 border-y border-amber-500/20 px-4 py-2 flex items-center justify-center gap-3 text-amber-500 text-xs font-mono">
            <AlertTriangle size={14} />
            <span>
                <strong>AVISO:</strong> {t('disclaimer')}
            </span>
        </div>
    );
};
