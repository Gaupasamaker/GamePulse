"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionary, Locale } from '@/lib/i18n';

interface LanguageContextType {
    language: Locale;
    setLanguage: (lang: Locale) => void;
    t: (key: keyof typeof dictionary['es']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Locale>('es');

    // Load saved preference
    useEffect(() => {
        const saved = localStorage.getItem('gamepulse_lang') as Locale;
        if (saved) setLanguage(saved);
    }, []);

    const handleSetLanguage = (lang: Locale) => {
        setLanguage(lang);
        localStorage.setItem('gamepulse_lang', lang);
    };

    const t = (key: keyof typeof dictionary['es']) => {
        return dictionary[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
