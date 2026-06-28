// src/app/auth/register/page.tsx
'use client';

import { createSPASassClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SSOButtons from "@/components/SSOButtons";
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!acceptedTerms) {
            setError('You must accept the Terms of Service and Privacy Policy');
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);

        try {
            const supabase = await createSPASassClient();
            const { error } = await supabase.registerEmail(email, password);

            if (error) throw error;

            router.push('/auth/verify-email');
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#111827] py-8 px-4 sm:px-10 border border-[#374151] rounded-2xl shadow-xl card-lift">
            {error && (
                <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/30 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    <label htmlFor="password" className="block text-sm font-medium text-[#9CA3AF]">
                        Password
                    </label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
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

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#9CA3AF]">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-[#0A0F1E] border-[#374151] text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-[#4B5563] pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white transition-colors focus:outline-none"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="pt-2 pb-2">
                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="h-4 w-4 rounded border-[#374151] bg-[#0A0F1E] text-indigo-600 focus:ring-indigo-500 focus:ring-offset-[#111827] cursor-pointer"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="text-[#9CA3AF] cursor-pointer">
                                I agree to the{' '}
                                <Link
                                    href="/legal/terms"
                                    className="font-medium text-indigo-400 hover:text-indigo-300"
                                    target="_blank"
                                >
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href="/legal/privacy"
                                    className="font-medium text-indigo-400 hover:text-indigo-300"
                                    target="_blank"
                                >
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
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
                                Creating account...
                            </>
                        ) : (
                            'Create account'
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
                    <div className="sso-dark-wrapper">
                        <SSOButtons onError={setError} />
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-sm">
                <span className="text-[#9CA3AF]">Already have an account?</span>
                {' '}
                <Link href="/auth/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Sign in
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