"use client";

import React, { useState } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';
import { Key, User, CheckCircle, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { MFASetup } from '@/components/MFASetup';
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from "framer-motion";

export default function UserSettingsPage() {
    const { user } = useGlobal();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const supabase = await createSPASassClient();
            const client = supabase.getSupabaseClient();

            const { error } = await client.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setSuccess('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                console.error('Error updating password:', err);
                setError(err.message);
            } else {
                console.error('Error updating password:', err);
                setError('Failed to update password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper className="pb-20 lg:pb-0">
            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="space-y-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
                    <p className="text-[#9CA3AF] text-sm">
                        Manage your account, security preferences, and active sessions.
                    </p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                <div className="grid gap-6">
                    {/* User Details */}
                    <div className="bg-[#111827] border border-[#374151] rounded-2xl overflow-hidden card-lift">
                        <div className="p-6 border-b border-[#1F2937] flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Account Details</h2>
                                <p className="text-xs text-[#9CA3AF]">Your profile information</p>
                            </div>
                        </div>
                        <div className="p-6 grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Email Address</label>
                                <p className="mt-1.5 text-white font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Account ID</label>
                                <p className="mt-1.5 text-[#9CA3AF] font-mono-data text-sm break-all">{user?.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Change Password */}
                        <div className="bg-[#111827] border border-[#374151] rounded-2xl overflow-hidden card-lift h-fit">
                            <div className="p-6 border-b border-[#1F2937] flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                    <Key className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Security</h2>
                                    <p className="text-xs text-[#9CA3AF]">Update your password</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#9CA3AF]">New Password</label>
                                        <Input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="bg-[#0A0F1E] border-[#374151] text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div className="space-y-2 mb-6">
                                        <label className="text-sm font-medium text-[#9CA3AF]">Confirm Password</label>
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="bg-[#0A0F1E] border-[#374151] text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading || !newPassword || !confirmPassword}
                                        className="w-full bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/10 mt-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Password"
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* MFA Setup Wrap */}
                        <div className="bg-[#111827] border border-[#374151] rounded-2xl overflow-hidden card-lift h-fit relative">
                            {/* We just wrap the existing MFA component in our card style container, assuming it handles its own internal layout, but we give it a title bar so it matches. */}
                            <div className="p-6 border-b border-[#1F2937] flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <ShieldCheck className="h-5 w-5 text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Two-Factor Auth</h2>
                                    <p className="text-xs text-[#9CA3AF]">Secure your account with MFA</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="dark-mfa-wrapper">
                                    <MFASetup
                                        onStatusChange={() => {
                                            setSuccess('Two-factor authentication settings updated successfully');
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                /* Quick overrides for the MFASetup component to blend in */
                .dark-mfa-wrapper .text-gray-900, 
                .dark-mfa-wrapper .text-gray-700, 
                .dark-mfa-wrapper .text-gray-500 {
                    color: #D1D5DB !important;
                }
                .dark-mfa-wrapper .bg-white {
                    background-color: transparent !important;
                }
                .dark-mfa-wrapper .border-gray-200 {
                    border-color: #374151 !important;
                }
                .dark-mfa-wrapper input {
                    background-color: #0A0F1E !important;
                    border-color: #374151 !important;
                    color: white !important;
                }
                .dark-mfa-wrapper button.bg-primary-600 {
                    background-color: #10B981 !important;
                }
                .dark-mfa-wrapper button.bg-primary-600:hover {
                    background-color: #059669 !important;
                }
                .dark-mfa-wrapper button.bg-white {
                    background-color: #1F2937 !important;
                    color: white !important;
                    border-color: #374151 !important;
                }
                .dark-mfa-wrapper button.bg-white:hover {
                    background-color: #374151 !important;
                }
                .dark-mfa-wrapper .bg-gray-100 {
                    background-color: #1F2937 !important;
                }
            `}</style>
        </PageWrapper>
    );
}