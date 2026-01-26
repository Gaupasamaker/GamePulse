"use client";

import React from 'react';
import { EventsCalendar } from '@/components/EventsCalendar';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function CalendarPage() {
    const { t } = useLanguage();

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
            <section className="border-l-2 border-purple-500 pl-4 py-2">
                <h1 className="text-2xl font-bold font-mono text-white tracking-tighter flex items-center gap-2">
                    <Calendar className="text-purple-500" />
                    {t('calendar')}
                </h1>
                <p className="text-sm text-gray-500 font-mono mt-1">
                    Agenda de resultados financieros y lanzamientos clave del sector.
                </p>
            </section>

            <EventsCalendar />
        </div>
    );
}
