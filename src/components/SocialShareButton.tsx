"use client";

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Twitter, Check } from 'lucide-react';

interface SocialShareButtonProps {
    title: string;
    text: string;
    url?: string;
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({ title, text, url }) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank');
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setOpen(!open)}
                className="terminal-btn terminal-btn-secondary flex items-center gap-2 text-xs"
            >
                <Share2 size={14} /> SHARE
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-background-app border border-border-app rounded shadow-xl z-50 flex flex-col p-1 animate-in fade-in zoom-in-95 duration-200">
                    <button
                        onClick={handleTwitter}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-secondary-app text-xs font-mono text-foreground-app text-left rounded"
                    >
                        <Twitter size={14} className="text-blue-400" /> Twitter / X
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-secondary-app text-xs font-mono text-foreground-app text-left rounded"
                    >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <LinkIcon size={14} />}
                        {copied ? 'COPIADO!' : 'Copiar Link'}
                    </button>
                    {/* Add more providers here if needed */}
                </div>
            )}

            {/* Backdrop to close */}
            {open && (
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            )}
        </div>
    );
};
