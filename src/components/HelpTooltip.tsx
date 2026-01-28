"use client";

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
    text: string;
    size?: number;
    className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ text, size = 14, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={`relative inline-flex items-center ml-1 ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <HelpCircle
                size={size}
                className="text-muted-foreground-app hover:text-blue-400 cursor-help transition-colors"
            />

            {isVisible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-secondary-app text-foreground-app text-xs font-mono rounded border border-border-app shadow-xl z-50 text-center animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                    {text}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-border-app"></div>
                </div>
            )}
        </div>
    );
};
