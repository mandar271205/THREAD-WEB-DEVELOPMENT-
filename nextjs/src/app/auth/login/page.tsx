// src/app/auth/login/page.tsx
'use client';

import { createSPASassClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SSOButtons from '@/components/SSOButtons';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMFAPrompt, setShowMFAPrompt] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const client = await createSPASassClient();
            const { error: signInError } = await client.loginEmail(email, password);

            if (signInError) throw signInError;

            // Check if MFA is required
            const supabase = client.getSupabaseClient();
            const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

            if (mfaError) throw mfaError;

            if (mfaData.nextLevel === 'aal2' && mfaData.nextLevel !== mfaData.currentLevel) {
                setShowMFAPrompt(true);
            } else {
                router.push('/app');
                return;
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if(showMFAPrompt) {
            router.push('/auth/2fa');
        }
    }, [showMFAPrompt, router]);


    return (
        <div className="bg-[#111827] py-8 px-4 sm:px-10 border border-[#374151] rounded-2xl shadow-xl card-lift">
            {error && (
                <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/30 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[#9CA3AF]">
                        Email address
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-[#0A0F1E] border-[#374151] text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-[#4B5563]"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium text-[#9CA3AF]">
                            Password
                        </label>
                        <Link href="/auth/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                    
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-[#0A0F1E] border-[#374151] text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-[#4B5563] pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white transition-colors focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 py-5"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#374151]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-[#111827] px-2 text-[#9CA3AF]">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6">
                    {/* SSOButtons will probably also need styling eventually if they are light-themed, but we wrap them here */}
                    <div className="sso-dark-wrapper">
                        <SSOButtons onError={setError} />
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-sm">
                <span className="text-[#9CA3AF]">Don&#39;t have an account?</span>
                {' '}
                <Link href="/auth/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Sign up
                </Link>
            </div>
            
            <style jsx global>{`
                /* Target any potential light-mode hardcodes in SSOButtons */
                .sso-dark-wrapper button {
                    background-color: #0A0F1E !important;
                    color: white !important;
                    border-color: #374151 !important;
                }
                .sso-dark-wrapper button:hover {
                    background-color: #1F2937 !important;
                }
            `}</style>
        </div>
    );
}