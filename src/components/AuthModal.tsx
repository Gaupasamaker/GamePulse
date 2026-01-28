"use client";

import React, { useState } from 'react';
import { X, Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { signInWithGoogle, signInWithOtp } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [mode, setMode] = useState<'options' | 'email'>('options');

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        await signInWithGoogle();
        // Redirect happens automatically
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await signInWithOtp(email);
            setIsSent(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background-app border border-border-app rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground-app hover:text-foreground-app transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold font-mono tracking-tighter">
                            INITIALIZE_<span className="text-primary-app">SESSION</span>
                        </h2>
                        <p className="text-muted-foreground-app font-mono text-sm mt-2">
                            Access GamePulse Arena to compete globally.
                        </p>
                    </div>

                    {isSent ? (
                        <div className="text-center animate-in slide-in-from-right duration-300">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                                <CheckCircle size={32} className="text-emerald-500" />
                            </div>
                            <h3 className="tex-lg font-bold text-foreground-app mb-2">Magic Link Sent!</h3>
                            <p className="text-sm text-muted-foreground-app mb-6">
                                We've sent a secure login link to <span className="text-foreground-app font-mono">{email}</span>. Click it to sign in instantly.
                            </p>
                            <button
                                onClick={onClose}
                                className="terminal-btn terminal-btn-secondary w-full justify-center"
                            >
                                CLOSE
                            </button>
                        </div>
                    ) : mode === 'email' ? (
                        <form onSubmit={handleMagicLink} className="flex flex-col gap-4 animate-in slide-in-from-right duration-300">
                            <div>
                                <label className="text-[10px] uppercase font-mono text-muted-foreground-app font-bold ml-1">Email Address</label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground-app" size={16} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="player@example.com"
                                        className="terminal-input w-full pl-10"
                                        autoFocus
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="terminal-btn terminal-btn-primary w-full justify-center py-2.5 mt-2"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>SEND MAGIC LINK <ArrowRight size={16} /></>}
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode('options')}
                                className="text-xs text-muted-foreground-app hover:text-foreground-app text-center mt-2 hover:underline"
                            >
                                &larr; Back to options
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-3 animate-in fade-in duration-300">
                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-3 w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-100 transition-colors border border-transparent"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                Continue with Google
                            </button>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-border-app"></div>
                                <span className="flex-shrink-0 mx-4 text-[10px] text-muted-foreground-app font-mono uppercase">OR</span>
                                <div className="flex-grow border-t border-border-app"></div>
                            </div>

                            <button
                                onClick={() => setMode('email')}
                                className="flex items-center justify-center gap-3 w-full bg-secondary-app text-foreground-app font-bold py-3 rounded border border-border-app hover:bg-secondary-app/80 transition-colors font-mono"
                            >
                                <Mail size={18} />
                                Continue with Email
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-secondary-app/50 p-4 border-t border-border-app text-center">
                    <p className="text-[10px] text-muted-foreground-app">
                        By continuing, you accept our Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    );
};
