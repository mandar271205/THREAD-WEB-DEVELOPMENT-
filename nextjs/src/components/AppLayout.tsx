"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Upload,
    Clock,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Layers,
    Shield,
    Bell,
    CheckSquare,
    ShieldAlert,
    Menu,
} from 'lucide-react';
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function getInitials(email: string) {
    const parts = email.split('@')[0].split(/[._-]/);
    return parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
}

function SidebarContent({ pathname, onNavigate, isAdmin }: { pathname: string; onNavigate?: () => void; isAdmin: boolean }) {
    const handleLogout = async () => {
        try {
            const client = await createSPASassClient();
            await client.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/app' },
        { icon: Upload, label: 'Analyse Fabric', href: '/app/analyze' },
        { icon: Clock, label: 'History', href: '/app/history' },
        ...(isAdmin ? [
            { icon: ShieldAlert, label: 'Admin Dashboard', href: '/app/admin' },
            { icon: CheckSquare, label: 'Admin Tasks', href: '/app/table' }
        ] : []),
        { icon: User, label: 'Settings', href: '/app/user-settings' },
    ];

    return (
        <div className="flex flex-col h-full bg-[#0A0F1E]">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-[#374151]">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-indigo-500/10 p-1.5 rounded-lg">
                        <Layers className="text-indigo-400 w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg text-white">
                        Thread<span className="text-indigo-400">County</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 pl-[10px]"
                                    : "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-indigo-400" : "text-[#6B7280] group-hover:text-white")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            <div className="p-4 border-t border-[#374151]">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#111827] border border-[#374151]">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {user?.email ? getInitials(user.email) : '??'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-[#6B7280] hover:text-red-400 transition-colors p-1 flex-shrink-0"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [adminMode, setAdminMode] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useGlobal();

    // Check admin privilege on mount / local storage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedAdminMode = localStorage.getItem('admin_mode') === 'true';
            setAdminMode(savedAdminMode);
        }
    }, []);

    const isEmailAdmin = user?.email?.toLowerCase().includes('admin') || user?.email?.toLowerCase() === 'mandar271205@gmail.com';
    const isAdmin = isEmailAdmin || adminMode;

    const handleToggleAdminMode = () => {
        const nextMode = !adminMode;
        setAdminMode(nextMode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin_mode', nextMode ? 'true' : 'false');
        }
        // Redirect to dashboard if switching off admin panel and currently on an admin page
        if (!nextMode && (pathname.startsWith('/app/admin') || pathname.startsWith('/app/table'))) {
            router.push('/app');
        }
    };

    const handleLogout = async () => {
        try {
            const client = await createSPASassClient();
            await client.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const mobileNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/app' },
        { icon: Upload, label: 'Analyse Fabric', href: '/app/analyze' },
        { icon: Clock, label: 'History', href: '/app/history' },
        ...(isAdmin ? [{ icon: ShieldAlert, label: 'Admin', href: '/app/admin' }] : []),
        { icon: User, label: 'Settings', href: '/app/user-settings' },
    ];

    return (
        <div className="min-h-screen bg-[#0A0F1E] flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 border-r border-[#374151]">
                <SidebarContent pathname={pathname} isAdmin={isAdmin} />
            </aside>

            {/* Mobile Sidebar Sheet */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="p-0 w-64 border-r border-[#374151] bg-[#0A0F1E]">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} isAdmin={isAdmin} />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-20 h-16 bg-[#0A0F1E]/90 backdrop-blur-md border-b border-[#374151] flex items-center justify-between px-4 lg:px-6">
                    {/* Mobile menu trigger */}
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden text-[#9CA3AF] hover:text-white p-2 rounded-lg hover:bg-[#1F2937] transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Page title area (empty on desktop, logo on mobile) */}
                    <div className="lg:flex-1 flex items-center gap-2 ml-2 lg:ml-0">
                        <span className="lg:hidden font-bold text-white">
                            Thread<span className="text-indigo-400">County</span>
                        </span>
                    </div>

                    {/* Right side: bell + user */}
                    <div className="flex items-center gap-3">
                        {/* Notification bell */}
                        <button className="relative w-9 h-9 rounded-lg bg-[#111827] border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-indigo-500/50 transition-all">
                            <Bell className="w-4 h-4" />
                        </button>

                        {/* User Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1F2937] transition-colors">
                                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                                        {user?.email ? getInitials(user.email) : '??'}
                                    </div>
                                    <span className="text-sm text-[#9CA3AF] hidden sm:block max-w-[120px] truncate">
                                        {user?.email?.split('@')[0] || 'User'}
                                    </span>
                                    <ChevronDown className="w-3 h-3 text-[#6B7280]" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 bg-[#111827] border-[#374151] text-white"
                            >
                                <div className="px-3 py-2 border-b border-[#374151]">
                                    <p className="text-xs text-[#6B7280]">Signed in as</p>
                                    <p className="text-sm font-medium truncate">{user?.email}</p>
                                </div>
                                
                                {/* Admin Mode Toggle option */}
                                <DropdownMenuItem
                                    onClick={handleToggleAdminMode}
                                    className="cursor-pointer text-[#9CA3AF] hover:text-white focus:text-white focus:bg-[#1F2937] mt-1 flex justify-between items-center"
                                >
                                    <span className="flex items-center">
                                        <Shield className="w-4 h-4 mr-2" />
                                        Admin Mode
                                    </span>
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase",
                                        isAdmin ? "bg-green-500/20 text-green-400" : "bg-[#374151] text-[#9CA3AF]"
                                    )}>
                                        {isAdmin ? "ON" : "OFF"}
                                    </span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => router.push('/app/user-settings')}
                                    className="cursor-pointer text-[#9CA3AF] hover:text-white focus:text-white focus:bg-[#1F2937]"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#374151]" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    {children}
                </main>

                {/* Mobile bottom tab bar */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#0A0F1E]/95 backdrop-blur-md border-t border-[#374151] flex items-center justify-around px-2 py-2">
                    {mobileNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[56px]",
                                    isActive ? "text-indigo-400" : "text-[#6B7280]"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}