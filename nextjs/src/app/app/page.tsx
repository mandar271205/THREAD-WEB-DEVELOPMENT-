"use client";

import { useEffect, useState } from "react";
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClientAuthenticated } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    FileText,
    ImageIcon,
    HardDrive,
    Crown,
    Eye,
    Download,
    ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const statCards = [
    {
        label: "Total Uploads",
        icon: ImageIcon,
        key: "total_uploads",
        sublabel: "All time fabric images",
        accent: "indigo",
        borderColor: "border-l-indigo-500",
        iconBg: "bg-indigo-500/10",
        iconColor: "text-indigo-400",
    },
    {
        label: "Reports Generated",
        icon: FileText,
        key: "total_reports",
        sublabel: "Successful analyses",
        accent: "indigo",
        borderColor: "border-l-indigo-500",
        iconBg: "bg-indigo-500/10",
        iconColor: "text-indigo-400",
    },
    {
        label: "Storage Used",
        icon: HardDrive,
        key: null,
        sublabel: "Across all uploads",
        accent: "amber",
        borderColor: "border-l-amber-500",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-400",
        staticValue: "—",
    },
    {
        label: "Current Plan",
        icon: Crown,
        key: "plan",
        sublabel: "Active subscription",
        accent: "purple",
        borderColor: "border-l-purple-500",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-400",
    },
];

function getGradeBadgeClass(grade: string) {
    if (grade === "A") return "bg-green-500/10 text-green-400 border-green-500/30";
    if (grade === "B") return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-red-500/10 text-red-400 border-red-500/30";
}

export default function Dashboard() {
    const { user } = useGlobal();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const supabase = await createSPASassClientAuthenticated();
                const client = supabase.getSupabaseClient();
                const session = await client.auth.getSession();
                const token = session.data.session?.access_token;

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

                const response = await fetch(`${apiUrl}/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [user]);

    if (loading) {
        return (
            <div className="space-y-8 max-w-6xl mx-auto pb-20 lg:pb-0">
                <Skeleton className="h-10 w-48 bg-[#1F2937]" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-xl bg-[#1F2937]" />
                    ))}
                </div>
                <Skeleton className="h-64 rounded-xl bg-[#1F2937]" />
            </div>
        );
    }

    const statValues: Record<string, string | number> = {
        total_uploads: stats?.total_uploads ?? 0,
        total_reports: stats?.total_reports ?? 0,
        plan: stats?.subscription?.plan ?? "Free",
    };

    return (
        <PageWrapper className="pb-20 lg:pb-0">
            <div className="space-y-8 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white">
                            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
                        </h1>
                        <p className="text-[#9CA3AF] mt-1 text-sm">
                            Here&apos;s an overview of your fabric analysis activity.
                        </p>
                    </div>
                    <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                            asChild
                        >
                            <Link href="/app/analyze">
                                New Analysis
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card, i) => {
                        const value = card.staticValue ?? statValues[card.key ?? ""] ?? "—";
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className={cn(
                                    "bg-[#111827] border border-[#374151] border-l-4 rounded-xl p-5 card-lift",
                                    card.borderColor
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-[#9CA3AF] font-medium">{card.label}</p>
                                        <p className="text-2xl lg:text-3xl font-bold text-white mt-1 font-mono-data capitalize truncate">
                                            {String(value)}
                                        </p>
                                        <p className="text-xs text-[#6B7280] mt-1">{card.sublabel}</p>
                                    </div>
                                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ml-2", card.iconBg)}>
                                        <card.icon className={cn("w-4 h-4", card.iconColor)} />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Recent Reports Table */}
                <div className="bg-[#111827] border border-[#374151] rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]">
                        <div>
                            <h2 className="font-semibold text-white">Recent Reports</h2>
                            <p className="text-xs text-[#9CA3AF] mt-0.5">Your 5 most recent analyses</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]" asChild>
                            <Link href="/app/history">
                                View All <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {stats?.recent_activity?.length > 0 ? (
                        <TooltipProvider>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[#1F2937] hover:bg-transparent">
                                        <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E]">Date</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E]">Weave</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E]">Density</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E]">Grade</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.recent_activity.map((report: any, i: number) => (
                                        <motion.tr
                                            key={report.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 + 0.2 }}
                                            className="border-b border-[#1F2937] hover:bg-[#1F2937] transition-colors"
                                        >
                                            <TableCell className="text-sm text-[#9CA3AF] font-medium py-4">
                                                {format(new Date(report.created_at), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-sm text-white py-4">
                                                {report.weave_type}
                                            </TableCell>
                                            <TableCell className="text-sm font-mono-data text-[#9CA3AF] py-4">
                                                {report.warp_density} × {report.weft_density}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("font-bold text-xs", getGradeBadgeClass(report.quality_grade))}
                                                >
                                                    Grade {report.quality_grade}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="w-8 h-8 text-[#6B7280] hover:text-white hover:bg-[#374151]" asChild>
                                                                <Link href={`/app/reports/${report.id}`}>
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                </Link>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-[#111827] border-[#374151] text-white">View report</TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </TooltipProvider>
                    ) : (
                        <div className="text-center py-14">
                            <div className="w-12 h-12 rounded-full bg-[#1F2937] flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-5 h-5 text-[#374151]" />
                            </div>
                            <p className="text-white font-medium">No reports yet</p>
                            <p className="text-[#9CA3AF] text-sm mt-1 mb-4">Upload your first fabric image to get started</p>
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white" asChild>
                                <Link href="/app/analyze">Start Analysis</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white" asChild>
                        <Link href="/app/analyze">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Upload New Image
                        </Link>
                    </Button>
                    <Button variant="outline" className="border-[#374151] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] hover:border-indigo-500/50" asChild>
                        <Link href="/app/history">
                            <FileText className="w-4 h-4 mr-2" />
                            View All Reports
                        </Link>
                    </Button>
                </div>
            </div>
        </PageWrapper>
    );
}