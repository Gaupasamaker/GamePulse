"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/providers/LanguageProvider';
import { Activity, ShoppingCart, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface ActivityItem {
    id: string;
    description: string;
    type: 'buy' | 'sell' | 'achievement'; // Coincide con SQL schema
    created_at: string;
    metadata?: any;
    user_id: string;
    // Podríamos hacer join con profiles para tener avatar/username
    // Pero por simplicidad en SQL guardamos description pre-generada o podemos hacer join aqui
}

export const ActivityFeed: React.FC = () => {
    const { language, t } = useLanguage();
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            const { data, error } = await supabase
                .from('activities')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (!error && data) {
                setActivities(data);
            }
            setLoading(false);
        };

        fetchActivities();
        const interval = setInterval(fetchActivities, 10000); // Poll cada 10s
        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'buy': return <TrendingUp size={16} className="text-emerald-400" />;
            case 'sell': return <TrendingDown size={16} className="text-rose-400" />;
            case 'achievement': return <Award size={16} className="text-yellow-400" />;
            default: return <Activity size={16} className="text-blue-400" />;
        }
    };

    return (
        <div className="terminal-card p-4 h-full flex flex-col">
            <h3 className="text-sm font-mono font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Activity size={16} className="text-purple-400" />
                Live Market Feed
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {loading ? (
                    <div className="animate-pulse flex flex-col gap-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-12 bg-white/5 rounded border border-white/5" />
                        ))}
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 text-xs font-mono">
                        {t('no_activity')}
                    </div>
                ) : (
                    activities.map(activity => (
                        <div key={activity.id} className="p-3 bg-black/20 border border-white/5 rounded hover:bg-white/5 transition-colors group">
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors`}>
                                    {getIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-200 font-mono leading-tight">
                                        {activity.description}
                                    </p>
                                    <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                                        {formatDistanceToNow(new Date(activity.created_at), {
                                            addSuffix: true,
                                            locale: language === 'es' ? es : enUS
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
