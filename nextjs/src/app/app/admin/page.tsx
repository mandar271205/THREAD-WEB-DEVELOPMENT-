"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobal } from '@/lib/context/GlobalContext';
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users as UsersIcon,
    Upload as UploadIcon,
    FileText as FileTextIcon,
    Server as ServerIcon,
    ShieldAlert,
    Ban,
    UserCheck,
    TrendingUp,
    PieChart as PieIcon,
    Search,
    Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// 30 Days upload data
const uploadsData = [
    { date: '06-01', uploads: 120 },
    { date: '06-05', uploads: 150 },
    { date: '06-10', uploads: 180 },
    { date: '06-15', uploads: 220 },
    { date: '06-20', uploads: 210 },
    { date: '06-25', uploads: 270 },
    { date: '06-28', uploads: 310 },
];

// Fabric type distribution
const fabricData = [
    { name: 'Plain Weave', value: 45 },
    { name: 'Twill Weave', value: 25 },
    { name: 'Satin Weave', value: 15 },
    { name: 'Rib Weave', value: 10 },
    { name: 'Jacquard', value: 5 },
];

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

interface UserRecord {
    id: string;
    name: string;
    email: string;
    plan: 'free' | 'student' | 'professional' | 'enterprise';
    uploads: number;
    joined: string;
    active: boolean;
}

export default function AdminDashboardPage() {
    const { user, loading } = useGlobal();
    const router = useRouter();
    const [adminMode, setAdminMode] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setAdminMode(localStorage.getItem('admin_mode') === 'true');
        }
    }, []);

    const isEmailAdmin = user?.email?.toLowerCase().includes('admin') || user?.email?.toLowerCase() === 'mandar271205@gmail.com';
    const isAdmin = isEmailAdmin || adminMode;

    useEffect(() => {
        if (!loading && user && !isAdmin) {
            toast.error("Access denied. You do not have permission to view this page.");
            router.push('/app');
        }
    }, [user, loading, isAdmin, router]);

    // 2-3 Mock users as requested by the user
    const [users, setUsers] = useState<UserRecord[]>([
        {
            id: "1",
            name: "Mandar Patil",
            email: "mandar271205@gmail.com",
            plan: "professional",
            uploads: 42,
            joined: "2026-05-15",
            active: true
        },
        {
            id: "2",
            name: "Sarah Chen",
            email: "sarah.chen@loomtech.com",
            plan: "enterprise",
            uploads: 156,
            joined: "2026-04-10",
            active: true
        },
        {
            id: "3",
            name: "Rahul Mehta",
            email: "rahul.mehta@bharattex.in",
            plan: "free",
            uploads: 8,
            joined: "2026-06-01",
            active: false
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleStatus = (user: UserRecord) => {
        setSelectedUser(user);
        setIsAlertOpen(true);
    };

    const confirmToggleStatus = () => {
        if (!selectedUser) return;
        
        setUsers(prev => prev.map(u => {
            if (u.id === selectedUser.id) {
                const updatedStatus = !u.active;
                toast.success(`User ${u.name} has been ${updatedStatus ? 'activated' : 'deactivated'}.`);
                return { ...u, active: updatedStatus };
            }
            return u;
        }));
        setIsAlertOpen(false);
        setSelectedUser(null);
    };

    if (loading || !user || !isAdmin) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <PageWrapper>
            <div className="space-y-8 max-w-6xl mx-auto pb-10">
                {/* Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                        <ShieldAlert className="h-7 w-7 text-indigo-400" />
                        Admin Control Panel
                    </h1>
                    <p className="text-[#9CA3AF] text-sm mt-1">
                        Monitor platform metrics, user access, and system storage.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-[#111827] border-[#374151] border-l-4 border-l-purple-500 card-lift p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Total Users</p>
                                <p className="text-2xl font-bold text-white mt-1 font-mono-data">{users.length}</p>
                                <p className="text-[10px] text-[#6B7280] mt-0.5">Active accounts</p>
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <UsersIcon className="text-purple-400 w-5 h-5" />
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-[#111827] border-[#374151] border-l-4 border-l-indigo-500 card-lift p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Total Uploads</p>
                                <p className="text-2xl font-bold text-white mt-1 font-mono-data">1,248</p>
                                <p className="text-[10px] text-[#6B7280] mt-0.5">+18% this month</p>
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                <UploadIcon className="text-indigo-400 w-5 h-5" />
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-[#111827] border-[#374151] border-l-4 border-l-green-500 card-lift p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Reports Generated</p>
                                <p className="text-2xl font-bold text-white mt-1 font-mono-data">982</p>
                                <p className="text-[10px] text-[#6B7280] mt-0.5">99.4% success rate</p>
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <FileTextIcon className="text-green-400 w-5 h-5" />
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-[#111827] border-[#374151] border-l-4 border-l-amber-500 card-lift p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Platform Storage</p>
                                <p className="text-2xl font-bold text-white mt-1 font-mono-data">4.2 GB</p>
                                <p className="text-[10px] text-[#6B7280] mt-0.5">Of 50 GB limit</p>
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <ServerIcon className="text-amber-400 w-5 h-5" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="analytics" className="space-y-6">
                    <TabsList className="bg-[#111827] border border-[#374151] p-1 rounded-xl">
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-[#1F2937] data-[state=active]:text-white rounded-lg px-4 py-2 text-sm text-[#9CA3AF]">
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="users" className="data-[state=active]:bg-[#1F2937] data-[state=active]:text-white rounded-lg px-4 py-2 text-sm text-[#9CA3AF]">
                            Users List
                        </TabsTrigger>
                    </TabsList>

                    {/* Analytics Content */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Uploads line chart */}
                            <Card className="bg-[#111827] border-[#374151] md:col-span-2">
                                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#1F2937]">
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-indigo-400" />
                                            Upload Activity
                                        </CardTitle>
                                        <CardDescription className="text-xs text-[#9CA3AF]">Fabric uploads analyzed over the past month</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={uploadsData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                                                <XAxis dataKey="date" stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 11 }} />
                                                <YAxis stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 11 }} />
                                                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, color: 'white' }} />
                                                <Line type="monotone" dataKey="uploads" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1' }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Fabric type Pie Chart */}
                            <Card className="bg-[#111827] border-[#374151]">
                                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#1F2937]">
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                            <PieIcon className="h-5 w-5 text-purple-400" />
                                            Fabric Distribution
                                        </CardTitle>
                                        <CardDescription className="text-xs text-[#9CA3AF]">Most analyzed weave types</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 flex flex-col items-center justify-center">
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={fabricData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {fabricData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, color: 'white' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                                        {fabricData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                                <span className="text-[#9CA3AF]">{entry.name} ({entry.value}%)</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Users Content */}
                    <TabsContent value="users" className="space-y-4">
                        <Card className="bg-[#111827] border-[#374151]">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
                                <div>
                                    <CardTitle className="text-lg font-semibold text-white">Platform Users</CardTitle>
                                    <CardDescription className="text-xs text-[#9CA3AF]">Manage registered accounts and check usage</CardDescription>
                                </div>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-[#0A0F1E] border-[#374151] text-white pl-9 placeholder-[#4B5563] text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-[#0A0F1E]">
                                        <TableRow className="border-b border-[#1F2937] hover:bg-transparent">
                                            <TableHead className="text-[#9CA3AF] font-semibold">User Details</TableHead>
                                            <TableHead className="text-[#9CA3AF] font-semibold">Plan</TableHead>
                                            <TableHead className="text-[#9CA3AF] font-semibold text-center">Uploads</TableHead>
                                            <TableHead className="text-[#9CA3AF] font-semibold">Joined Date</TableHead>
                                            <TableHead className="text-[#9CA3AF] font-semibold">Status</TableHead>
                                            <TableHead className="text-[#9CA3AF] font-semibold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-10 text-[#6B7280]">
                                                    No users matching your search
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map(user => (
                                                <TableRow key={user.id} className="border-b border-[#1F2937] hover:bg-[#1F2937]/30 transition-colors">
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                                                                {user.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-white text-sm">{user.name}</p>
                                                                <p className="text-xs text-[#6B7280]">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={
                                                            user.plan === 'enterprise' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                            user.plan === 'professional' ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                                                            user.plan === 'student' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                            "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                                        }>
                                                            {user.plan}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center font-mono-data text-sm">{user.uploads}</TableCell>
                                                    <TableCell className="text-[#9CA3AF] text-sm font-mono-data">{user.joined}</TableCell>
                                                    <TableCell>
                                                        <Badge className={user.active ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                                                            {user.active ? 'Active' : 'Suspended'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleToggleStatus(user)}
                                                            className={user.active ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" : "text-green-400 hover:text-green-300 hover:bg-green-500/10"}
                                                        >
                                                            {user.active ? (
                                                                <>
                                                                    <Ban className="w-3.5 h-3.5 mr-1" />
                                                                    Deactivate
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserCheck className="w-3.5 h-3.5 mr-1" />
                                                                    Activate
                                                                </>
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Deactivation Alert Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-[#111827] border-[#374151] text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#9CA3AF] text-sm">
                            This will {selectedUser?.active ? 'deactivate' : 'activate'} {selectedUser?.name}&apos;s account. 
                            {selectedUser?.active && ' They will be immediately signed out and restricted from accessing the application.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#1F2937] hover:bg-[#374151] border-[#374151] text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmToggleStatus} 
                            className={selectedUser?.active ? "bg-red-600 hover:bg-red-500 text-white" : "bg-green-600 hover:bg-green-500 text-white"}
                        >
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageWrapper>
    );
}
